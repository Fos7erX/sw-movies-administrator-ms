import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from '@node-rs/argon2';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UsersService } from '../../users-module/services/users.sevice';

//Notas para documentación:
//Para la verificación de tokens se utilizará argon2id, debido a múltiples factores:
//1. Resulta mucho más seguro que otras librerías (Como por ejemplo bcrypt), ya que este está diseñado específicamente
//para resistir ataques de canal lateral y ataques de intercambio tiempo-memoria.
//2. Es más flexible en cuanto a la configuración, lo cual resulta en ataques más costosos.
// 3. Es la librería más recomendada por OWASP (Open source Foundation for Application Security) para este tipo de fines y para nuevas aplicaciones.

@Injectable()
export class AuthService {
  constructor(
    private usersService:UsersService,
    private jwtService: JwtService,
  ) {}

  //Endpoint de registro: Aquí se hasheará la contraseña con Argon2id.
  async registerUser(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) {
      throw new ConflictException(
        'Esta dirección de email ya se encuentra registrada.',
      );
    }

    const hashedPass = await hash(createUserDto.password, {
      //Todo: pasar valores de hash a env y leerlos desde ahí
      memoryCost: 19456, //19 MB //Nota: Setear estos valores por ENV
      timeCost: 2, //2 iteraciones
      parallelism: 1, //1 hilo
    });

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPass,
    });

    const { password, ...result } = newUser;
    return result;
  }

  //Endpoint de login: Aquí se generará el token JWT
  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales de usuario inválidas.');
    }

    const payload = { email: user.email, sub: user.id, role:user.role};
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
  
  //Acá valido las credenciales para el login (Con LocalStrategy)
  async validateUser(email: string, password: string): Promise<any> {
    
    const user = await this.usersService.findByEmail(email);

    if (user && user.password) {
      //Argon2id va a verificar automáticamente el hash almacenado contra la contraseña del usuario
      const isPasswordValid = await verify(user.password, password);

      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
  }

}

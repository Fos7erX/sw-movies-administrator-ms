import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//Nota de documentación:
//Este guard se va a encargar de verificar que el token JWT sea válido, y que esté firmado correctamente.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}
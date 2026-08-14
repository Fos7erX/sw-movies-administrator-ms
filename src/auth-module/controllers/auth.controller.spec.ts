import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { LoginUserRequestDto } from '../dtos/login-user-request.dto';

const mockAuthService = {
  registerUser: jest.fn(),
  login: jest.fn(),
};


  //Corrección #2: Testing de controllers con guards.
  // Nota de documentación: En este caso la corrección se aplicará inyectando el module de testing, aprovechando asi la DI de Nest y facilitar el testeo de guards (Roles Guard en este caso).

describe('AuthController (unit)', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get(AuthController);
    jest.clearAllMocks();
  });

  it('register delega a AuthService', async () => {
    (mockAuthService.registerUser as jest.Mock).mockResolvedValue({ id: 1 });
    const dto = { name: 'T', email: 'a@b.com', password: 'Aa1!aaaaa', role: 'user' } as CreateUserRequestDto;
    await controller.register(dto);
    expect(mockAuthService.registerUser).toHaveBeenCalledWith(dto);
  });

  it('login delega a AuthService', async () => {
    (mockAuthService.login as jest.Mock).mockResolvedValue({ access_token: 'tok' });
    const dto = { email: 'a@b.com', password: 'Aa1!aaaaa' } as LoginUserRequestDto;
    await controller.login(dto);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });
});
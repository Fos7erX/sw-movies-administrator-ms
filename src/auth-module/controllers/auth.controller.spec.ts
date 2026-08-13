import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';

const mockAuthService = {
  registerUser: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController(mockAuthService as any);
    jest.clearAllMocks();
  });

  it('should delegate register calls to AuthService', async () => {
    mockAuthService.registerUser.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const result = await authController.register({ email: 'test@example.com' } as any);

    expect(mockAuthService.registerUser).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should delegate login calls to AuthService', async () => {
    mockAuthService.login.mockResolvedValue({ access_token: 'token', user: { id: 1 } });

    const result = await authController.login({ email: 'test@example.com', password: 'Aa1!aaaaa' } as any);

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'Aa1!aaaaa' });
    expect(result).toEqual({ access_token: 'token', user: { id: 1 } });
  });
});

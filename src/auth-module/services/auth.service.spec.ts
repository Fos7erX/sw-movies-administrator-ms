import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../../users-module/services/users.sevice';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../database-module/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';

jest.mock('@node-rs/argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

import { hash, verify } from '@node-rs/argon2';

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(
      mockUsersService as unknown as UsersService,
      mockJwtService as unknown as JwtService,
    );

    jest.clearAllMocks();
  });

  it('should register a new user and return user data without password', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Aa1!aaaaa',
      role: UserRole.USER,
    } as CreateUserDto;

    (mockUsersService.findByEmail as jest.Mock).mockResolvedValue(null);
    (hash as jest.Mock).mockResolvedValue('hashed-password');
    (mockUsersService.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: createUserDto.name,
      email: createUserDto.email,
      password: 'hashed-password',
      role: UserRole.USER,
    });

    const result = await authService.registerUser(createUserDto);

    expect(mockUsersService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(hash).toHaveBeenCalledWith(createUserDto.password, expect.any(Object));
    expect(mockUsersService.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: 'hashed-password',
    });
    expect(result).toEqual({
      id: 1,
      name: createUserDto.name,
      email: createUserDto.email,
      role: UserRole.USER,
    });
    expect((result as any).password).toBeUndefined();
  });

  it('should throw ConflictException when email is already registered', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Aa1!aaaaa',
      role: UserRole.USER,
    } as CreateUserDto;

    (mockUsersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: createUserDto.email,
      password: 'existing-hash',
    });

    await expect(authService.registerUser(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should validate a user when credentials are correct', async () => {
    const email = 'test@example.com';
    const password = 'Aa1!aaaaa';

    (mockUsersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test User',
      email,
      password: 'hashed-password',
      role: UserRole.USER,
    });
    (verify as jest.Mock).mockResolvedValue(true);

    const result = await authService.validateUser(email, password);

    expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
    expect(verify).toHaveBeenCalledWith('hashed-password', password);

    expect(result).toEqual({
      id: 1,
      name: 'Test User',
      email,
      role: UserRole.USER,
    });
  });

  it('should return null when validateUser credentials are invalid', async () => {
    (mockUsersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password',
      role: UserRole.USER,
    });
    (verify as jest.Mock).mockResolvedValue(false);

    const result = await authService.validateUser('test@example.com', 'wrong-password');

    expect(result).toBeNull();
  });

  it('should login a validated user and return token payload', async () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Aa1!aaaaa',
    } as LoginUserDto;

    jest.spyOn(authService, 'validateUser' as any).mockResolvedValue({
      id: 1,
      email: loginDto.email,
      name: 'Test User',
      role: UserRole.USER,
    });
    (mockJwtService.sign as jest.Mock).mockReturnValue('jwt-token');

    const result = await authService.login(loginDto);

    expect(result).toEqual({
      access_token: 'jwt-token',
      user: {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
      },
    });
  });

  it('should throw UnauthorizedException when login validation fails', async () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Aa1!aaaaa',
    } as LoginUserDto;

    jest.spyOn(authService, 'validateUser' as any).mockResolvedValue(null);

    await expect(authService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

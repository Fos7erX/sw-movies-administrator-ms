import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../database-module/entities/user.entity';

  //Corrección #: Testing de restricción de acceso:

function mockExecutionContext(user: any): ExecutionContext {
  return ({
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown) as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  const reflector = { getAllAndOverride: jest.fn() } as unknown as Reflector;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RolesGuard(reflector as Reflector);
  });

  it('permite si no hay roles requeridos', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    expect(guard.canActivate(mockExecutionContext({ role: UserRole.USER }))).toBe(true);
  });

  it('permite si el usuario tiene rol requerido', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.USER]);
    expect(guard.canActivate(mockExecutionContext({ role: UserRole.USER }))).toBe(true);
  });

  it('lanza UnauthorizedException si el usuario no está autenticado', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.USER]);
    expect(() => guard.canActivate(mockExecutionContext(undefined))).toThrow(UnauthorizedException);
  });

  it('lanza ForbiddenException si rol no coincide', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.ADMIN]);
    expect(() => guard.canActivate(mockExecutionContext({ role: UserRole.USER }))).toThrow(ForbiddenException);
  });

});
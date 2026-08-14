import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesManagementModule } from '../src/movies-management-module/modules/movies-management.module';
import { JwtAuthGuard } from '../src/auth-module/guards/jwt-auth.guard';
import { UserRole } from '../src/database-module/entities/user.entity';


//Corrección #2: Testing de controllers con guards.

//Nota de documentación: Para suplir los tests por rol incorrecto (Lo que nos daria un 403, Forbidden), vamos a implementar tests e2e para simular el flujo de un user con rol incorrecto, asegurando asi la correcta integración de todos los componentes para realizar esta validación (Guard, Module, Service, Controller, etc).

describe('Movies Roles (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mariadb',
          host: 'localhost',
          port: 3306,
          username: 'test',
          password: 'test',
          database: 'movies_test',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        MoviesManagementModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ 
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 1, role: UserRole.USER }; // Fuerzo el usuario USER (Lo cual me dará 403 al intentar acceder a la ruta que requiere ADMIN)
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /movies-management/sync-movies-from-api -> 403 para USER (solo ADMIN)', async () => {
    await request(app.getHttpServer())
      .get('/movies-management/sync-movies-from-api')
      .expect(403);
  });
});
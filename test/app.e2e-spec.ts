import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';

import { AuthModule } from '../src/auth-module/module/auth.module';
import { UsersModule } from '../src/users-module/modules/users.module';
import { MoviesManagementModule } from '../src/movies-management-module/modules/movies-management.module';

import { User } from '../src/database-module/entities/user.entity';
import { Movie } from '../src/database-module/entities/movie.entity';


jest.setTimeout(20000);
describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'local.env',
        }),

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

        TypeOrmModule.forFeature([User, Movie]),

        AuthModule,
        UsersModule,
        MoviesManagementModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 404 for missing root endpoint', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });

  it('should register and login a user through auth endpoints', async () => {
    const registerPayload = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Aa1!aaaaa',
      role: 'user',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerPayload)
      .expect(201);

    expect(registerResponse.body).toMatchObject({
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });

    expect(registerResponse.body.password).toBeUndefined();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Aa1!aaaaa',
      })
      .expect(201);

    expect(loginResponse.body).toHaveProperty('access_token');

    expect(loginResponse.body.user).toMatchObject({
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should return local movies from the movies-management endpoint', async () => {
    const moviePayload = {
      title: 'A New Hope',
      description: 'A classic Star Wars movie',
      director: 'George Lucas',
      producer: 'Gary Kurtz',
      releaseDate: '1977-05-25',
    };

    await request(app.getHttpServer())
      .post('/movies-management/create-movie')
      .send(moviePayload)
      .expect(401);

    const getResponse = await request(app.getHttpServer())
      .get('/movies-management/get-all-movies')
      .expect(200);

    expect(getResponse.body).toHaveProperty('message');
    expect(getResponse.body).toHaveProperty('synchronized');
  });
});

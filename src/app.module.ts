import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth-module/module/auth.module';
import { UsersModule } from './users-module/modules/users.module';
import { DatabaseModule } from './database-module/modules/database.module';
import { DataSource } from 'typeorm';
import { MoviesManagementModule } from './movies-management-module/modules/movies-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule, //Añado el DB Module de esta forma (Sin inyectar toda la config en el appmodule, para mantener la limpieza de codigo)
    UsersModule,
    AuthModule,
    MoviesManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}

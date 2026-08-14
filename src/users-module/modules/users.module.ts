import { Module } from "@nestjs/common";
import { UsersService } from "../services/users.sevice";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../database-module/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule{}
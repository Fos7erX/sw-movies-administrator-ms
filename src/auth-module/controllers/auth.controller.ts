import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { CreateUserRequestDto } from '../dtos/request/create-user-request.dto';
import { LoginUserRequestDto } from '../dtos/request/login-user-request.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserSwagger } from '../decorators/create-user.decorator';
import { UserLoginSwagger } from '../decorators/user-login.decorator';

@ApiTags('Authentication Module')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @CreateUserSwagger()
  async register(@Body() createUserDto: CreateUserRequestDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @UserLoginSwagger()
  async login(@Body() loginUserDto: LoginUserRequestDto) {
    return this.authService.login(loginUserDto);
  }
}

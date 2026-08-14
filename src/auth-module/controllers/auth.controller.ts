import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { LoginUserRequestDto } from '../dtos/login-user-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserRequestDto) {
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginUserDto: LoginUserRequestDto) {
    return this.authService.login(loginUserDto);
  }
}

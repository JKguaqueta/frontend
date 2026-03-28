import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  loginGet(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  @Post('login')
  loginPost(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }
}

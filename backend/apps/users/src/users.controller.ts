import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

type JwtPayload = { sub: string; username: string };

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('me')
  getMe(@Headers('authorization') authorization?: string) {
    const user = this.getUserFromAuthorizationHeader(authorization);
    return this.usersService.getProfile(user.sub);
  }

  private getUserFromAuthorizationHeader(authorization?: string): JwtPayload {
    if (!authorization) throw new UnauthorizedException('Falta Authorization');

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Authorization inválida');

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
    if (!payload?.sub) throw new UnauthorizedException('Token inválido');

    return payload;
  }
}

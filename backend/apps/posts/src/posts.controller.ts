import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PostsService } from './posts.service';

type JwtPayload = { sub: string; username: string };

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  list(@Headers('authorization') authorization?: string) {
    const user = this.getUserFromAuthorizationHeader(authorization);
    return this.postsService.listOtherUsersPosts(user.sub);
  }

  @Post()
  create(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: { message: string },
  ) {
    const user = this.getUserFromAuthorizationHeader(authorization);
    return this.postsService.createPost(user.sub, body.message);
  }

  @Post(':id/like')
  like(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') postId: string,
  ) {
    const user = this.getUserFromAuthorizationHeader(authorization);
    return this.postsService.likePost(user.sub, postId);
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

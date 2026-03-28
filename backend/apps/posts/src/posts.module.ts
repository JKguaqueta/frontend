import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LikesGateway } from './like.gateway';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET ?? 'dev_secret' }),
  ],
  controllers: [PostsController],
  providers: [PostsService, LikesGateway],
})
export class PostsModule {}

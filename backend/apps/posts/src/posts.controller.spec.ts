import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let postsController: PostsController;
  const postsService = {
    listOtherUsersPosts: jest.fn(),
    createPost: jest.fn(),
    likePost: jest.fn(),
  };
  const jwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: PostsService, useValue: postsService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    postsController = app.get<PostsController>(PostsController);
    postsService.listOtherUsersPosts.mockReset();
    postsService.createPost.mockReset();
    postsService.likePost.mockReset();
    jwtService.verify.mockReset();
  });

  it('list delega en PostsService.listOtherUsersPosts', async () => {
    jwtService.verify.mockReturnValue({ sub: 'u1', username: 'user1' });
    postsService.listOtherUsersPosts.mockResolvedValue([{ id: 'p1' }]);
    await expect(postsController.list('Bearer token')).resolves.toEqual([{ id: 'p1' }]);
    expect(postsService.listOtherUsersPosts).toHaveBeenCalledWith('u1');
  });

  it('create delega en PostsService.createPost', async () => {
    jwtService.verify.mockReturnValue({ sub: 'u1', username: 'user1' });
    postsService.createPost.mockResolvedValue({ id: 'p1' });
    await expect(
      postsController.create('Bearer token', { message: 'hola' }),
    ).resolves.toEqual({ id: 'p1' });
    expect(postsService.createPost).toHaveBeenCalledWith('u1', 'hola');
  });

  it('like delega en PostsService.likePost', async () => {
    jwtService.verify.mockReturnValue({ sub: 'u1', username: 'user1' });
    postsService.likePost.mockResolvedValue({ postId: 'p1', likeCount: 1 });
    await expect(postsController.like('Bearer token', 'p1')).resolves.toEqual({
      postId: 'p1',
      likeCount: 1,
    });
    expect(postsService.likePost).toHaveBeenCalledWith('u1', 'p1');
  });

  it('falla sin Authorization', () => {
    expect(() => postsController.list(undefined)).toThrow(UnauthorizedException);
  });
});

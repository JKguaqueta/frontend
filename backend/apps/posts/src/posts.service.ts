import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { LikesGateway } from './like.gateway';

type PostRecord = {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  likeCount: number;
  likedBy: Set<string>;
};

@Injectable()
export class PostsService {
  private readonly posts: PostRecord[] = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      userId: '22222222-2222-2222-2222-222222222222',
      message: 'Hola desde el backend',
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedBy: new Set<string>(),
    },
  ];

  constructor(private readonly likesGateway: LikesGateway) {}

  listOtherUsersPosts(currentUserId: string) {
    return this.posts
      .filter((p) => p.userId !== currentUserId)
      .map((p) => ({
        id: p.id,
        userId: p.userId,
        message: p.message,
        createdAt: p.createdAt,
        likeCount: p.likeCount,
      }));
  }

  createPost(userId: string, message: string) {
    const post: PostRecord = {
      id: randomUUID(),
      userId,
      message,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedBy: new Set<string>(),
    };

    this.posts.unshift(post);
    return {
      id: post.id,
      userId: post.userId,
      message: post.message,
      createdAt: post.createdAt,
      likeCount: post.likeCount,
    };
  }

  likePost(userId: string, postId: string) {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new NotFoundException('Post no encontrado');

    if (!post.likedBy.has(userId)) {
      post.likedBy.add(userId);
      post.likeCount += 1;
      this.likesGateway.emitLikeUpdated({
        postId: post.id,
        likeCount: post.likeCount,
      });
    }

    return { postId: post.id, likeCount: post.likeCount };
  }
}

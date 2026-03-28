import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: Array<{ id: string; username: string }> = [
    { id: '11111111-1111-1111-1111-111111111111', username: 'alice' },
    { id: '22222222-2222-2222-2222-222222222222', username: 'bob' },
  ];

  getProfile(userId: string) {
    return this.users.find((u) => u.id === userId) ?? null;
  }
}

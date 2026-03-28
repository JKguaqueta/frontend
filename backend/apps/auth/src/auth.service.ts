import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly users: Array<{
    id: string;
    username: string;
    passwordHash: string;
  }> = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      username: 'alice',
      passwordHash: '',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      username: 'bob',
      passwordHash: '',
    },
  ];

  constructor(private readonly jwtService: JwtService) {
    for (const user of this.users) {
      if (!user.passwordHash)
        user.passwordHash = bcrypt.hashSync('password', 10);
    }
  }

  async login(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });
    return { accessToken };
  }
}

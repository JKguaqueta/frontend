import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  const usersService = {
    getProfile: jest.fn(),
  };
  const jwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService.getProfile.mockReset();
    jwtService.verify.mockReset();
  });

  it('getMe retorna perfil del usuario autenticado', () => {
    jwtService.verify.mockReturnValue({ sub: 'u1', username: 'user1' });
    usersService.getProfile.mockResolvedValue({
      id: 'u1',
      username: 'user1',
      firstName: 'Juan',
      lastName: 'C',
      birthDate: '2000-01-01',
      alias: 'jc',
    });

    return expect(
      usersController.getMe('Bearer token'),
    ).resolves.toMatchObject({ id: 'u1', username: 'user1' });
  });

  it('getMe falla sin Authorization', () => {
    expect(() => usersController.getMe(undefined)).toThrow(UnauthorizedException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  const authService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService.login.mockReset();
  });

  it('loginPost delega en AuthService.login', async () => {
    authService.login.mockResolvedValue({ accessToken: 'token' });
    await expect(
      authController.loginPost({ username: 'user1', password: 'password123' }),
    ).resolves.toEqual({ accessToken: 'token' });

    expect(authService.login).toHaveBeenCalledWith('user1', 'password123');
  });

  it('loginGet delega en AuthService.login', async () => {
    authService.login.mockResolvedValue({ accessToken: 'token' });
    await expect(
      authController.loginGet('user1', 'password123'),
    ).resolves.toEqual({ accessToken: 'token' });

    expect(authService.login).toHaveBeenCalledWith('user1', 'password123');
  });
});

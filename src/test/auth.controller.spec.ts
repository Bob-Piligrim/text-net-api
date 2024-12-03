import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the user from the request', async () => {
      const req = { user: { username: 'testUser', id: 1, role: 'user' } };
      const result = { access_token: 'token123' };
      mockAuthService.login.mockResolvedValue(result);

      const response = await controller.login(req);
      expect(response).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
    });
  });
});

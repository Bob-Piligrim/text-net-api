/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = {
        username: 'testUser',
        password: 'hashedPassword',
        id: 1,
        role: 'user',
      };
      mockUserService.findByUsername.mockResolvedValue(user);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (password: string, hashedPassword: string) => {
            return true;
          },
        );

      mockUserService.findByUsername.mockResolvedValue(user);

      const result = await service.validateUser('testUser', 'password123');
      expect(result).toEqual({
        id: 1,
        username: 'testUser',
        password: undefined,
        role: 'user',
      });
      expect(mockUserService.findByUsername).toHaveBeenCalledWith('testUser');
    });

    it('should return null if user is not found', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);
      const result = await service.validateUser('testUser', 'password123');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const user = {
        username: 'testUser',
        password: 'hashedPassword',
        id: 1,
        role: 'user',
      };
      mockUserService.findByUsername.mockResolvedValue(user);
      // Явно указываем типы и возвращаемое значение
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (password: string, hashedPassword: string) => {
            return false;
          },
        );

      const result = await service.validateUser('testUser', 'wrongPassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { username: 'testUser', id: 1, role: 'user' };
      mockJwtService.sign.mockReturnValue('token123');

      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'token123' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
        role: user.role,
      });
    });
  });
});

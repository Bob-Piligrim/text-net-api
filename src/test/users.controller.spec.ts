import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/users.dto';
import { UpdateBalanceDto } from '../users/dto/update.balance.dto';

describe('UsersController', () => {
  let controller: UsersController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UsersService;

  const mockUserService = {
    createUser: jest.fn(),
    findByUsername: jest.fn(),
    updateBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActive: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('registerUser', () => {
    it('should register a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const result = { id: 1, ...createUserDto };

      jest.spyOn(service, 'createUser').mockResolvedValue(result);

      const response = await controller.registerUser(createUserDto);
      expect(response).toEqual({
        message: 'User registered successfully',
        user: result,
      });
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getBalance', () => {
    it('should return user balance', async () => {
      const req = { user: { username: 'testuser' } };
      const user = {
        id: 1,
        username: 'testUser',
        password: 'testPassword',
        balance: 500,
      };

      jest.spyOn(service, 'findByUsername').mockResolvedValue(user);

      const response = await controller.getBalance(req);
      expect(response).toEqual({ balance: user.balance });
      expect(service.findByUsername).toHaveBeenCalledWith(req.user.username);
    });
  });

  describe('updateBalance', () => {
    it('should update user balance', async () => {
      const req = { user: { id: 1, role: 'admin' } };
      const updateBalanceDto: UpdateBalanceDto = { amount: 100 };

      await controller.updateBalance(req, updateBalanceDto);

      expect(service.updateBalance).toHaveBeenCalledWith(
        req.user.id,
        updateBalanceDto,
      );
    });

    it('should throw an error if user is not admin', async () => {
      const req = { user: { role: 'user' } };
      const updateBalanceDto: UpdateBalanceDto = { amount: 100 };

      await expect(
        controller.updateBalance(req, updateBalanceDto),
      ).rejects.toThrow('Unauthorized');
    });
  });
});

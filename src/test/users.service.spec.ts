import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { User } from '../users/entity/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBalanceDto } from '../users/dto/update.balance.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/users.dto';

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const dto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const bcryptHashSpy = jest.spyOn(
        bcrypt,
        'hash',
      ) as unknown as jest.SpyInstance<Promise<string>, [string, number?]>;
      bcryptHashSpy.mockResolvedValueOnce(hashedPassword);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue({ id: 1, ...dto, password: hashedPassword });

      const result = await service.createUser(dto);

      expect(userRepository.create).toHaveBeenCalledWith({
        username: dto.username,
        password: hashedPassword,
      });
      expect(result).toEqual({ id: 1, ...dto, password: hashedPassword });
    });
  });

  describe('updateBalance', () => {
    it('should update the user balance', async () => {
      const userId = 1;
      const updateBalanceDto: UpdateBalanceDto = { amount: 100 };
      const user = {
        username: 'testUser',
        password: 'testPassword',
        id: userId,
        balance: 200,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue({ ...user, balance: 300 });

      await service.updateBalance(userId, updateBalanceDto);

      expect(user.balance).toBe(200 + updateBalanceDto.amount);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        balance: 300,
      });
    });
  });
});

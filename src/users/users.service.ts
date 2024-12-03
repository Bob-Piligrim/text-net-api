import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UpdateBalanceDto } from './dto/update.balance.dto';
import { CreateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async checkBalance(userId: number, cost: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user.balance >= cost;
  }

  async updateBalance(
    userId: number,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.balance += updateBalanceDto.amount;
      await this.userRepository.save(user);
    }
  }
}

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/users.dto';
import { UpdateBalanceDto } from './dto/update.balance.dto';
import { User } from './entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {
    console.log('UsersController is working');
  }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    console.log('registerUser method is called');
    const user = await this.userService.createUser(createUserDto);
    return { message: 'User registered successfully', user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('username')
  async findUserByName(@Request() req): Promise<User> {
    const user = await this.userService.findByUsername(req.user.username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { ...user, password: undefined };
  }

  // Намудрил, лучше оставить вместо этих двух методов только один общий.
  // Баланс показывает 0, когда default 100 ???

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/balance')
  async getBalance(@Request() req): Promise<{ balance: number }> {
    const user = await this.userService.findByUsername(req.user.id);
    return { balance: user.balance };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/balance')
  async updateBalance(
    @Param('id') id: number,
    @Body() updateBalanceDto: UpdateBalanceDto,
    @Request() req,
  ): Promise<void> {
    if (req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    await this.userService.updateBalance(req.user.id, updateBalanceDto.amount);
  }
}

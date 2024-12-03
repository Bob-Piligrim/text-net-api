import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/users.dto';
import { UpdateBalanceDto } from './dto/update.balance.dto';

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
  @Get('balance')
  async getBalance(@Request() req): Promise<{ balance: number }> {
    const user = await this.userService.findByUsername(req.user.username);
    return { balance: user.balance };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('balance')
  async updateBalance(
    @Request() req,
    @Body() updateBalanceDto: UpdateBalanceDto,
  ): Promise<void> {
    if (req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    await this.userService.updateBalance(req.user.id, updateBalanceDto);
  }
}

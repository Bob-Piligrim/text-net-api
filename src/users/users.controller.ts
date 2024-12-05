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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {
    console.log('UsersController is working');
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    console.log('registerUser method is called');
    const user = await this.userService.createUser(createUserDto);
    return { message: 'User registered successfully', user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('username/:username')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 201, description: 'User found', type: User })
  @ApiBadRequestResponse({ description: 'User not found' })
  async findUserByName(@Param('username') username: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { ...user, password: undefined };
  }

  // Намудрил, лучше оставить вместо этих двух методов только один общий.
  // Баланс показывает 0, когда default 100 ???

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/balance')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get user balance' })
  @ApiResponse({
    status: 200,
    description: 'User balance found',
    schema: { example: { balance: 100 } },
  })
  @ApiBadRequestResponse({ description: 'User balance not found' })
  async getBalance(@Param('id') id: number): Promise<{ balance: number }> {
    const balance = await this.userService.getBalance(id);
    return { balance };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/balance')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update user balance' })
  @ApiResponse({
    status: 200,
    description: 'User balance updated successfully',
  })
  @ApiBadRequestResponse({ description: 'User balance not updated' })
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

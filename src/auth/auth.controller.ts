import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '../auth/local.guard';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './auth.login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    console.log('AuthController is working');
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and log them in' })
  @ApiResponse({
    status: 201,
    description: 'User succesfully logged in',
    type: LoginDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

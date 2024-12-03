import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '../auth/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    console.log('AuthController is working');
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

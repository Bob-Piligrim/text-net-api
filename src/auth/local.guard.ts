import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { username, password } = request.body;

    console.log('LocalGuard activated');
    console.log(`Attempting to authenticate user: ${username}`);

    const user = await this.authService.validateUser(username, password);
    if (user) {
      console.log(`User authenticated successfully: ${username}`);
      request.user = user;
      return true;
    }
    console.log(`Authentication failed for user: ${username}`);
    return false;
  }
}

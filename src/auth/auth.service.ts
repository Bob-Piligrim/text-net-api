import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './auth.login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {
    console.log('AuthService is working');
  }

  // Проверка
  // password даже в зашифрованном виде не показываем никому
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const result = { ...user, password: undefined };
      return result;
    }
    return null;
  }

  //Метод login выполняет следующие шаги:
  // Создает объект payload, который содержит важные данные о пользователе (имя пользователя, идентификатор и роль).
  // Создает и возвращает объект, содержащий токен доступа, который можно использовать для аутентификации в последующих запросах.
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

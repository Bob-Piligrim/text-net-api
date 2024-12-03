import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST', 'postgres'),
  port: +configService.get<number>('POSTGRES_PORT', 5432),
  username: configService.get<string>('POSTGRES_USERNAME', 'user'),
  password: configService.get<string>(
    'POSTGRES_PASSWORD',
    'verystrongpassword',
  ),
  database: configService.get<string>('POSTGRES_DATABASE', 'postgres'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
});

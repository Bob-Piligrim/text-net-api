import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeOrm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { StreamingModule } from './streaming/streaming.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ModelsModule,
    StreamingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('AppModule initialized');

    console.log('PG_HOST:', process.env.POSTGRES_HOST);
    console.log('PG_PORT:', process.env.POSTGRES_PORT);
    console.log('PG_USERNAME:', process.env.POSTGRES_USERNAME);
    console.log('PG_PASSWORD:', process.env.POSTGRES_PASSWORD);
    console.log('PG_DATABASE:', process.env.POSTGRES_DATABASE);
  }
}

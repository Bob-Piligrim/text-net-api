import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { OpenAiService } from '../streaming/openai.service';
import { OpenAiModel } from './abstractmodel/openai.model';
import { LocalModel } from './abstractmodel/local.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/entity/users.entity';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
  providers: [
    ModelsService,
    OpenAiService,
    OpenAiModel,
    LocalModel,
    UsersService,
  ],
  exports: [ModelsService],
  controllers: [ModelsController],
})
export class ModelsModule {
  constructor() {
    console.log('ModelsModule initialized');
  }
}

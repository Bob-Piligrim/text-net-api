import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { OpenAiService } from 'src/streaming/openai.service';

@Module({
  providers: [ModelsService, OpenAiService],
  exports: [ModelsService],
  controllers: [ModelsController],
})
export class ModelsModule {
  constructor() {
    console.log('ModelsModule initialized');
  }
}

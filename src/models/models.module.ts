import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { OpenAiService } from 'src/streaming/openai.service';
import { OpenAiModel } from './abstractmodel/openai.model';
import { LocalModel } from './abstractmodel/local.model';

@Module({
  providers: [ModelsService, OpenAiService, OpenAiModel, LocalModel],
  exports: [ModelsService],
  controllers: [ModelsController],
})
export class ModelsModule {
  constructor() {
    console.log('ModelsModule initialized');
  }
}

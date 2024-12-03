import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { OpenAiService } from './openai.service';
import { StreamingController } from './streaming.controller';

@Module({
  providers: [StreamingService, OpenAiService],
  exports: [StreamingService, OpenAiService],
  controllers: [StreamingController],
})
export class StreamingModule {
  constructor() {
    console.log('StreamingModule initialized');
  }
}

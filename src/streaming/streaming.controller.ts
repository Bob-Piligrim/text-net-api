import { Body, Controller } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { Observable } from 'rxjs';
import { Sse } from '@nestjs/common';
import { GenerateTextDto } from '../models/generateText.dto';

@Controller('stream')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {
    console.log('StreamingController is working');
  }

  @Sse(':modelType')
  streamResponses(
    @Body() generateTextDto: GenerateTextDto,
  ): Observable<Partial<MessageEvent>> {
    return this.streamingService.streamData(generateTextDto);
  }
}

import { Controller, Query } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { Observable } from 'rxjs';
import { Sse } from '@nestjs/common';

@Controller('stream')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {
    console.log('StreamingController is working');
  }

  @Sse(':modelType')
  streamResponses(
    @Query('input') input: string,
    @Query('modelType') modelType: string,
  ): Observable<Partial<MessageEvent>> {
    return this.streamingService.streamData(input, modelType);
  }
}

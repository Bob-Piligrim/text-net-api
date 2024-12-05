import { Controller, Param, Query } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { Observable } from 'rxjs';
import { Sse } from '@nestjs/common';
import { GenerateTextDto } from '../models/generateText.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('stream')
@Controller('stream')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {
    console.log('StreamingController is working');
  }

  @Sse(':modelType')
  @ApiOperation({ summary: 'Stream responses for specified model' })
  @ApiResponse({
    status: 200,
    description: 'Data streamed successfully',
  })
  streamResponses(
    @Param('modelType') modelType: string,
    @Query('input') input: string,
  ): Observable<Partial<MessageEvent>> {
    const generateTextDto: GenerateTextDto = { modelType, input: input };
    return this.streamingService.streamData(generateTextDto);
  }
}

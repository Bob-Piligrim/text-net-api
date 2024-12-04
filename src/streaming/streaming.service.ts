import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { Observable } from 'rxjs';
import { GenerateTextDto } from '../models/generateText.dto';

@Injectable()
export class StreamingService {
  constructor(private readonly openAiService: OpenAiService) {
    console.log('StreamingService is working');
  }

  streamData(
    generateTextDto: GenerateTextDto,
  ): Observable<Partial<MessageEvent>> {
    return new Observable((observer) => {
      this.openAiService
        .generateText(generateTextDto)
        .then((response) => {
          observer.next({ data: response });
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }
}

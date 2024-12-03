import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { Observable } from 'rxjs';

@Injectable()
export class StreamingService {
  constructor(private readonly openAiService: OpenAiService) {
    console.log('StreamingService is working');
  }

  streamData(
    input: string,
    modelType: string,
  ): Observable<Partial<MessageEvent>> {
    return new Observable((observer) => {
      this.openAiService
        .generateText(input, modelType)
        .then((response) => {
          observer.next({ data: response });
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }
}

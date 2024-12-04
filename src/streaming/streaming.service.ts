import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { Observable, Subscriber } from 'rxjs';
import { GenerateTextDto } from '../models/generateText.dto';

@Injectable()
export class StreamingService {
  constructor(private readonly openAiService: OpenAiService) {
    console.log('StreamingService is working');
  }

  streamData(
    generateTextDto: GenerateTextDto,
  ): Observable<Partial<MessageEvent>> {
    return new Observable((observer: Subscriber<Partial<MessageEvent>>) => {
      // Запускаем стриминг текста из OpenAI
      this.openAiService.streamText(generateTextDto).subscribe({
        next: (data: string) => {
          // Оборачиваем данные в объект MessageEvent
          observer.next({ data });
        },
        error: (err) => {
          // Обработка ошибок
          observer.error(err);
        },
        complete: () => {
          // Завершение стрима
          observer.complete();
        },
      });
    });
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GenerateTextDto } from '../models/generateText.dto';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class OpenAiService {
  constructor(private readonly configService: ConfigService) {
    console.log('OpenAiService is working');
    console.log(
      'OpenAIKey: ',
      this.configService.get<string>('OPENAI_API_KEY'),
    );
  }

  // Метод для генерации текста с использованием стриминга
  streamText(generateTextDto: GenerateTextDto): Observable<Partial<string>> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const { modelType, input: prompt } = generateTextDto;
    const model = this.getEngineForModel(modelType);

    return new Observable((observer: Subscriber<string>) => {
      axios
        .post(
          'https://bothub.chat/api/v2/openai/v1',
          /* `https://api.openai.com/v1/chat/completions` */
          {
            model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 100,
            stream: true, // stream onn
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            responseType: 'stream', // expecting stream
          },
        )
        .then((response) => {
          response.data.on('data', (chunk: Buffer) => {
            // Парсим полученный кусок данных
            const data = chunk.toString();
            // Необходимо обрабатывать каждую строку ответа
            const lines = data.split('\n');
            for (const line of lines) {
              if (line.trim() === '' || line.startsWith('data: [DONE]'))
                continue;
              // Получаем содержимое из JSON
              const json = JSON.parse(line.replace(/^data: /, ''));
              if (json.choices && json.choices.length > 0) {
                // Отправляем данные в стрим
                observer.next(json.choices[0].message.content);
              }
            }
          });

          // Завершаем поток, когда он завершится
          response.data.on('end', () => {
            observer.complete();
          });
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  private getEngineForModel(modelType: string): string {
    switch (modelType) {
      case 'gpt-3.5':
        return 'gpt-3.5-turbo';
      case 'gpt-4':
        return 'gpt-4';
      default:
        throw new Error('Invalid model type');
    }
  }
}

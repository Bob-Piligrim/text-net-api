import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GenerateTextDto } from '../models/generateText.dto';

@Injectable()
export class OpenAiService {
  constructor(private readonly configService: ConfigService) {
    console.log('OpenAiService is working');
    console.log(
      'OpenAIKey: ',
      this.configService.get<string>('OPENAI_API_KEY'),
    );
  }

  async generateText(generateTextDto: GenerateTextDto): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    const { modelType, input: prompt } = generateTextDto;

    const model = this.getEngineForModel(modelType);

    const response = await axios.post(
      `https://api.openai.com/v1/chat/completions`,
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choiсes[0]?.messages.content || '';
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

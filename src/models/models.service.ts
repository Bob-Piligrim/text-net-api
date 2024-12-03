import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../streaming/openai.service';

@Injectable()
export class ModelsService {
  private readonly models = {
    gpt4: 'gpt-4',
    gpt3_5: 'gpt-3.5-turbo',
    geminFlash: GeminiFlashModel, // локальная модель
  };

  constructor(private readonly openAiService: OpenAiService) {
    console.log('ModelsService is working');
  }

  async generateText(modelType: string, input: string): Promise<string> {
    // Используем OpenAiService для генерации текста для OpenAI моделей
    if (this.models[modelType]) {
      if (modelType === 'gpt4' || modelType === 'gpt3_5') {
        return await this.openAiService.generateText(input, modelType);
      }

      // Если модель локальная
      const model = new this.models[modelType]();
      return await model.generateText(input);
    } else {
      throw new Error('Unknown model type');
    }
  }

  getModel(modelType: string) {
    return this.models[modelType];
  }
}

// Пример классов моделей (если они нужны)
class GeminiFlashModel {
  async generateText(input: string): Promise<string> {
    // Локальная генерация текста
    return `Generated GeminiFlash text for input: ${input}`;
  }

  getTokenCost(): number {
    return 10;
  }
}

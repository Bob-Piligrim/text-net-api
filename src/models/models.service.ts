import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../streaming/openai.service';
import { OpenAiModel } from './abstractmodel/openai.model';
import { LocalModel } from './abstractmodel/local.model';

@Injectable()
export class ModelsService {
  private readonly models = {
    gpt4: () => new OpenAiModel(this.openAiService, 'gpt-4'),
    gpt3_5: () => new OpenAiModel(this.openAiService, 'gpt-3.5-turbo'),
    localModel: LocalModel,
  };

  constructor(private readonly openAiService: OpenAiService) {
    console.log('ModelsService is working');
  }

  async generateText(modelType: string, input: string): Promise<string> {
    const modelFactory = this.models[modelType];
    if (modelFactory) {
      const model = modelFactory();
      return await model.generateText(input);
    } else {
      throw new Error('Unknown model type');
    }
  }

  getModel(modelType: string) {
    return this.models[modelType];
  }
}

import { OpenAiService } from 'src/streaming/openai.service';
import { AbstractModel } from './abstract.model';
import { GenerateTextDto } from '../generateText.dto';

export class OpenAiModel extends AbstractModel {
  private readonly modelType: string;
  private readonly openAiService: OpenAiService;

  constructor(openAiService: OpenAiService, modelType: string) {
    super();
    this.openAiService = openAiService;
    this.modelType = modelType;
    console.log('OpenAIModel is working');
  }

  async generateText(input: string): Promise<string> {
    const generateTextDto: GenerateTextDto = {
      input,
      modelType: this.modelType,
    };
    return await this.openAiService.generateText(generateTextDto);
  }
}

import { OpenAiService } from 'src/streaming/openai.service';
import { AbstractModel } from './abstract.model';
import { GenerateTextDto } from '../generateText.dto';
import { firstValueFrom, Observable } from 'rxjs';

export class OpenAiModel extends AbstractModel {
  private readonly modelType: string;
  private readonly openAiService: OpenAiService;

  constructor(openAiService: OpenAiService, modelType: string) {
    super();
    this.openAiService = openAiService;
    this.modelType = modelType;
    console.log('OpenAIModel is working');
  }

  generateText(input: string): Promise<Partial<string>> {
    const generateTextDto: GenerateTextDto = {
      input,
      modelType: this.modelType,
    };
    //  observable$ (согласно экосистемы RxJS,)
    const observable$: Observable<string> =
      this.openAiService.streamText(generateTextDto);
    return firstValueFrom(observable$);
  }
}

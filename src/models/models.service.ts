import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../streaming/openai.service';
import { OpenAiModel } from './abstractmodel/openai.model';
import { LocalModel } from './abstractmodel/local.model';
import { Token } from './token.models';
import { UsersService } from '../users/users.service';
import { GenerateTextDto } from './generateText.dto';

@Injectable()
export class ModelsService {
  private readonly token: Token[] = [
    { modelType: 'gpt4', costPer100Tokens: 20 }, // 20 cred
    { modelType: 'geminiFlesh', costPer100Tokens: 20 }, // 20 cred
    { modelType: 'localModel', costPer100Tokens: 10 }, // 10 cred
  ];

  private readonly models = {
    gpt4: () => new OpenAiModel(this.openAiService, 'gpt4'),
    geminiFlesh: () => new OpenAiModel(this.openAiService, 'geminiFlesh'),
    localModel: LocalModel,
  };

  constructor(
    private readonly openAiService: OpenAiService,
    private readonly userService: UsersService,
  ) {
    console.log('ModelsService is working');
  }

  async generateText(
    userId: number,
    generateTextDto: GenerateTextDto,
  ): Promise<string> {
    const { modelType, input } = generateTextDto;
    console.log(
      'Attempting to generate text with modelType:',
      modelType,
      'and input:',
      input,
    );
    const modelFactory = this.models[modelType];
    if (modelFactory) {
      const model = modelFactory();

      // Расчет токенов
      const tokenUsed = 100;
      const tokenCost = this.getTokenCost(modelType);
      const totalCost = (tokenUsed / 100) * tokenCost.costPer100Tokens;

      // Взяли баланс
      const userBalance = await this.userService.getBalance(userId);
      if (userBalance < totalCost) {
        throw new Error('Insufficient balance');
      }

      // Генерация текста
      const generateText = await model.generateText(input);

      // Изменили, обновили баланс
      await this.userService.updateBalance(userId, totalCost);

      return generateText;
    } else {
      throw new Error('Unknown model type');
    }
  }
  private getTokenCost(modelType: string): Token {
    console.log('Checking token cost for modelType:', modelType);
    const cost = this.token.find((tc) => tc.modelType === modelType);
    if (!cost) {
      throw new Error('Invalid model type');
    }
    return cost;
  }

  getModel(modelType: string) {
    return this.models[modelType];
  }
}

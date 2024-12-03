import { Controller, Get, Query } from '@nestjs/common';
import { ModelsService } from './models.service';

@Controller()
export class ModelsController {
  constructor(private readonly modelservice: ModelsService) {
    console.log('ModelsController is working');
  }

  @Get('info')
  getModelsInfo() {
    const models = [
      {
        name: 'GPT-4',
        description: 'A large-scale transformer model.',
        cost: 20,
      },
      {
        name: 'GeminiFlash',
        description: 'A fast, efficient model.',
        cost: 10,
      },
    ];
    return models;
  }

  @Get('generate')
  async generateText(
    @Query('model') modelType: string,
    @Query('input') input: string,
  ) {
    const model = this.modelservice.getModel(modelType);
    if (!model) {
      throw new Error('Model is not found');
    }
    const response = await model.generateText(input);
    return { data: response };
  }
}

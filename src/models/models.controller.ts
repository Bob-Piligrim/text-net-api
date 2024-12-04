import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ModelsService } from './models.service';
import { AuthGuard } from '@nestjs/passport';
import { GenerateTextDto } from './generateText.dto';

@Controller('models')
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
        name: 'gpt-3.5-turbo',
        description: 'A fast, efficient model.',
        cost: 10,
      },
    ];
    return models;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':userId/generate')
  async generateText(
    @Param('userId') userId: number,
    @Body() generateTextDto: GenerateTextDto,
  ): Promise<any> {
    return this.modelservice.generateText(userId, generateTextDto);
  }
}

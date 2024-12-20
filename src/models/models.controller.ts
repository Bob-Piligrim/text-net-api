import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ModelsService } from './models.service';
/* import { AuthGuard } from '@nestjs/passport'; */
import { GenerateTextDto } from './generateText.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('models')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelservice: ModelsService) {
    console.log('ModelsController is working');
  }

  @Get('info')
  @ApiOperation({ summary: 'Get information about available models' })
  @ApiResponse({
    status: 200,
    description: 'Information about model retrieved succesfully',
  })
  getModelsInfo() {
    const models = [
      {
        name: 'GPT-4',
        description: 'A large-scale transformer model.',
        cost: 20,
      },
      {
        name: 'Gemini-flash',
        description: 'A fast, efficient model.',
        cost: 10,
      },
    ];
    return models;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':userId/generate')
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Generate text using model for user' })
  @ApiResponse({ status: 200, description: 'Text generated succesfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  generateText(
    @Param('userId') userId: number,
    @Body() generateTextDto: GenerateTextDto,
  ): Promise<any> {
    return this.modelservice.generateText(userId, generateTextDto);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTextDto {
  @ApiProperty({ description: 'Name of the model' })
  @IsNotEmpty()
  @IsString()
  modelType: string; // Тип модели, например: 'gpt-4'

  @ApiProperty({ description: 'Users text' })
  @IsNotEmpty()
  @IsString()
  input: string; // Входной текст для генерации
}

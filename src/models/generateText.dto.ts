import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTextDto {
  @IsNotEmpty()
  @IsString()
  modelType: string; // Тип модели, например: 'gpt-4'

  @IsNotEmpty()
  @IsString()
  input: string; // Входной текст для генерации
}

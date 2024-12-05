import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Balance of the user',
    required: false,
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({
    description: 'Role of the user',
    required: false,
    default: 'client',
  })
  @IsOptional()
  @IsString()
  role?: string;
}

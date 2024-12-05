import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBalanceDto {
  @ApiProperty({ description: 'Users balance exchange for Amount ' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBalanceDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

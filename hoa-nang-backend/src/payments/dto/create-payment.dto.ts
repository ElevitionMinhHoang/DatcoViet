import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  method: string;
}

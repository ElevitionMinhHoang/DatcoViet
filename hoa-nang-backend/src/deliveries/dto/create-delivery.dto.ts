import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateDeliveryDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsInt()
  @IsNotEmpty()
  shipperId: number;
}

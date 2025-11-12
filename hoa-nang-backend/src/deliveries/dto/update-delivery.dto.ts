import { IsEnum, IsNotEmpty } from 'class-validator';
import { DeliveryStatus } from '@prisma/client';

export class UpdateDeliveryDto {
  @IsEnum(DeliveryStatus)
  @IsNotEmpty()
  status: DeliveryStatus;
}

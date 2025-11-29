import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, IsArray } from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsOptional()
  images?: string[];
}

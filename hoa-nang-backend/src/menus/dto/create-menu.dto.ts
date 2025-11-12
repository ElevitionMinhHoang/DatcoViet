import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

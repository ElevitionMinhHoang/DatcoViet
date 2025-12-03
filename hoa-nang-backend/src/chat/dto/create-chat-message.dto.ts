import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
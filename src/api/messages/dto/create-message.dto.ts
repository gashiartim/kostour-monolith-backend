import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

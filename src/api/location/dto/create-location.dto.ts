import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  whatCanYouDo: string;

  @ApiProperty()
  @IsArray()
  categories: string[];

  @ApiPropertyOptional()
  thumbnail: any;
}

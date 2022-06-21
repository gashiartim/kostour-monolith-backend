import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

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
  @IsString()
  @IsOptional()
  fullAddress: string;

  @ApiProperty()
  @IsArray()
  categories: string[];

  @ApiPropertyOptional()
  thumbnail: any;
}

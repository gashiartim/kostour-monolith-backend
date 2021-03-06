import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreateRestaurantDto {
  @ApiProperty()
  @IsString()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsString()
  open_hours: string;

  @ApiProperty()
  @IsString()
  location_id: string;

  @ApiPropertyOptional()
  thumbnail: any;

  @ApiProperty()
  @IsArray()
  categories: string[];
}

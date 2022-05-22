import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  parent_id: string;

  @ApiPropertyOptional()
  thumbnail: any;

  @ApiPropertyOptional()
  @IsBoolean()
  top_category: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  display_on_home_page: boolean;
}

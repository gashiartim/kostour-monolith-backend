import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  parent_id: string;

  @ApiPropertyOptional()
  thumbnail: any;

  @ApiPropertyOptional()
  @IsBoolean()
  top_category: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  display_on_home_page;

  level?: number;
}

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CategoryFilters {
  @ApiPropertyOptional()
  @IsOptional()
  top_categories: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  sub_categories: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  top_level_categories: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  display_on_home_page: boolean;
}

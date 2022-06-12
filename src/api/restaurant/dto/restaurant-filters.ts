import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class RestaurantFiltersDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  category_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  location_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  location_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  name: string;
}

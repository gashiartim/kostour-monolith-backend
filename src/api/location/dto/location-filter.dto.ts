import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationDto } from "../../../common/dtos/pagination.dto";

export class LocationFiltersDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  category_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  created_by: string;
}

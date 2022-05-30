import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({
    default: 1,
    minimum: 0,
  })
  page: number;

  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
  })
  limit: number;
}

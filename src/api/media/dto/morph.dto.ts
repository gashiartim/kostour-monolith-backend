import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Media } from '../entities/media.entity';

export class MorphDto {
  @ApiProperty()
  @Expose()
  entity: string;

  @ApiProperty()
  @Expose()
  entity_id: string;

  @ApiProperty()
  @Expose()
  related_field: string;

  media?: Media;
}

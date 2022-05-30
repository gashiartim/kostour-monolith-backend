import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Thumbnail } from "../../../common/dtos/thumbnail.dto";

export class CreatedRestaurantDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  open_hours: string;

  @ApiProperty()
  location_id: string;

  @ApiPropertyOptional()
  thumbnail?: Thumbnail;
}

import { ApiProperty } from "@nestjs/swagger";

class Media {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  ext: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  encoding: string;
}

export class Thumbnail {
  @ApiProperty()
  id: string;

  @ApiProperty()
  media_id: string;

  @ApiProperty()
  entity: string;

  @ApiProperty()
  entity_id: string;

  @ApiProperty()
  related_field: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  media: Media;
}

import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

@ApiExtraModels()
export class MediaDto {
  @IsNotEmpty()
  @ApiProperty()
  url: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  width: number;

  @IsNotEmpty()
  @ApiProperty()
  height: number;

  @IsNotEmpty()
  @ApiProperty()
  size: number;
}

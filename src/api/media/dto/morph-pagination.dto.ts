import { IntersectionType } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { Media } from "../entities/media.entity";
import { MorphDto } from "./morph.dto";

export class MorphPaginationDto extends IntersectionType(
  MorphDto,
  PaginationDto
) {}

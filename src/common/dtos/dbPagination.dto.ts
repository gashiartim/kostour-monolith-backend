import { Expose } from 'class-transformer';

export class DbPaginationDto {
  @Expose()
  skip: number;
  @Expose()
  take: number;
}

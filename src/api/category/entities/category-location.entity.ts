import { Entity, PrimaryColumn } from "typeorm";

@Entity("category_locations")
export class CategoryLocation {
  @PrimaryColumn("uuid")
  location_id: string;

  @PrimaryColumn("uuid")
  category_id: string;
}

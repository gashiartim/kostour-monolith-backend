import { Location } from "../../../api/location/entities/location.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "text",
    nullable: false,
  })
  name: string;

  @Column({
    type: "text",
    nullable: false,
  })
  slug: string;

  @Column({ type: "uuid", nullable: true })
  parent_id: string;

  @Column({ type: "int", nullable: false, default: 0 })
  level: number;

  @Column({ type: "boolean", nullable: false, default: false })
  top_category: boolean;

  @ManyToMany((type) => Location, (location) => location.categories)
  @JoinTable({
    name: "category_locations",
    joinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "location_id",
      referencedColumnName: "id",
    },
  })
  locations: Location[];

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  public updated_at: Date;
}

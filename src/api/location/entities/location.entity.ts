import { Category } from "../../../api/category/entities/category.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Restaurant } from "../../../api/restaurant/entities/restaurant.entity";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, type: "text" })
  name: string;

  @Column({ nullable: false, type: "text" })
  description: string;

  @Column({ nullable: false, type: "text" })
  whatCanYouDo: string;

  @Column({ nullable: false, type: "integer", default: 0 })
  numberOfVisits: string;

  @ManyToMany((type) => Restaurant)
  @JoinTable()
  restaurants: Restaurant[];

  @ManyToMany((type) => Category)
  @JoinTable()
  categories: Category[];

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

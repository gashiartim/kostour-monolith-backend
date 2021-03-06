import { Category } from "../../../api/category/entities/category.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Restaurant } from "../../../api/restaurant/entities/restaurant.entity";
import { User } from "../../../api/user/entities/user.entity";

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

  @Column({ nullable: true, type: "text" })
  fullAddress: string;

  @Column({ nullable: false, type: "integer", default: 0 })
  numberOfVisits: string;

  @ManyToMany((type) => Restaurant)
  @JoinTable({
    name: "restaurant_locations",
    joinColumn: {
      name: "location_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "restaurant_id",
      referencedColumnName: "id",
    },
  })
  restaurants: Restaurant[];

  @ManyToMany((type) => Category, (category) => category.locations)
  categories: Category[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  created_by: User;

  @Column({ nullable: true })
  user_id: string;

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

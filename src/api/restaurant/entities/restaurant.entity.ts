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
import { Location } from "../../../api/location/entities/location.entity";
import { User } from "../../../api/user/entities/user.entity";

@Entity("restaurants")
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, type: "text" })
  name: string;

  @Column({ nullable: false, type: "text" })
  description: string;

  @Column({ nullable: false, type: "text" })
  open_hours: string;

  @ManyToOne(() => Location, { onDelete: "CASCADE" })
  @JoinColumn({ name: "location_id" })
  location: Location;

  @Column({ nullable: true })
  location_id: string;

  @ManyToMany((type) => Category)
  @JoinTable()
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

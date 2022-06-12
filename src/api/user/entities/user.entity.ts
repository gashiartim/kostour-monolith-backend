import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { HashService } from "../../../services/hash/HashService";
import { Exclude } from "class-transformer";
import { Role } from "../../role/entities/role.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "text",
    nullable: false,
  })
  first_name: string;

  @Column({
    type: "text",
    nullable: false,
  })
  last_name: string;

  @Column({
    type: "text",
    unique: true,
  })
  email: string;

  @Column("text", { select: false })
  @Exclude()
  password: string;

  @Column({
    type: "text",
    nullable: true,
  })
  phone: string;

  @Column({
    type: "date",
    nullable: true,
  })
  birthday: Date;

  @Column({
    type: "text",
    nullable: true,
  })
  role_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.password)
      this.password = await new HashService().make(this.password);
  }
  @ManyToOne((type) => Role, (role) => role.users, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "role_id" })
  role: Role;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("medias")
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { nullable: true })
  name: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column({ type: "text", unique: true })
  url: string;

  @Column("text", { nullable: true })
  mimetype: string;

  @Column({ nullable: true })
  ext: string;

  @Column({ type: "decimal" })
  size: number;

  @Column({ nullable: true })
  encoding: string;
}

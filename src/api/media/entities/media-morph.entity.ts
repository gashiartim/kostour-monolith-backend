import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Media } from "./media.entity";

export enum entityTypes {
  products = "products",
  businesses = "businesses",
  categories = "categories",
  content = "content",
}

@Entity("media_morph")
export class MediaMorph {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Media, { onDelete: "CASCADE" })
  @JoinColumn({ name: "media_id" })
  media: Media;

  @Column()
  media_id: string;

  @Column({ type: "text" })
  entity: string;

  @Column("uuid")
  entity_id: string;

  @Column("text", { nullable: true })
  related_field: string;

  @Column({ nullable: true })
  order: number;
}

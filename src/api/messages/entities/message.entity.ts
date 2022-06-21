import { Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ unique: true, required: true, type: String })
  slug: string;

  @Prop({ required: true, type: String })
  answer: string;

  @Prop({ type: Date })
  @Field(() => Date, { description: "Created At" })
  created_at: Date;
}

export const MessageDocument = SchemaFactory.createForClass(Message);

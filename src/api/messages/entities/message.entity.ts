import { Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ unique: false, required: true, type: String })
  question: string;

  @Prop({ required: true, type: String })
  answer: string;
}

export const MessageDocument = SchemaFactory.createForClass(Message);

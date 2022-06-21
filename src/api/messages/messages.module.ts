import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageDocument } from "./entities/message.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: MessageDocument, name: Message.name },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}

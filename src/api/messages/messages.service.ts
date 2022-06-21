import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { Message, MessageDocument } from "./entities/message.entity";

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = await this.messageModel.create(createMessageDto);

    return newMessage;
  }

  async findAll() {
    return await this.messageModel.find();
  }

  async findOne(id: string) {
    return await this.getMessageOrFail(id);
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.getMessageOrFail(id);

    await this.messageModel.findByIdAndUpdate(id, updateMessageDto);

    Object.assign(message, updateMessageDto);

    return message;
  }

  async remove(id: string) {
    await this.messageModel.findByIdAndDelete(id);

    return {
      success: true,
    };
  }

  async getMessageOrFail(id: string) {
    const messageExists = await this.messageModel.findById(id);

    if (!messageExists) {
      throw new HttpException("Message does not exist!", HttpStatus.NOT_FOUND);
    }

    return messageExists;
  }
}

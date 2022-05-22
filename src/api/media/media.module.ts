import { Module } from "@nestjs/common";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Media } from "./entities/media.entity";
import { MediaMorph } from "./entities/media-morph.entity";
import {
  multerConfig,
  multerOptions,
} from "../../common/middlewares/multer.middleware";
import { MulterModule } from "@nestjs/platform-express";
import { Business } from "../business/entities/business.entity";

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      ...multerConfig,
      ...multerOptions,
    }),
    TypeOrmModule.forFeature([Media, MediaMorph, Business]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}

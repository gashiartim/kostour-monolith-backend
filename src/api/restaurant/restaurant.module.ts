import { Module } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { RestaurantController } from "./restaurant.controller";
import { MediaService } from "../media/media.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Media } from "../media/entities/media.entity";
import { MediaMorph } from "../media/entities/media-morph.entity";
import {
  multerConfig,
  multerOptions,
} from "src/common/middlewares/multer.middleware";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Media, MediaMorph]),
    MulterModule.register({ ...multerConfig, ...multerOptions }),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, MediaService],
})
export class RestaurantModule {}
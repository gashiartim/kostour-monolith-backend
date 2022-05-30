import { Module } from "@nestjs/common";
import { LocationsService } from "./location.service";
import { LocationController } from "./location.controller";
import { CategoryService } from "../category/category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "./entities/location.entity";
import { Media } from "../media/entities/media.entity";
import { MediaService } from "../media/media.service";
import { Category } from "../category/entities/category.entity";
import { MediaMorph } from "../media/entities/media-morph.entity";
import { MulterModule } from "@nestjs/platform-express";
import {
  multerConfig,
  multerOptions,
} from "src/common/middlewares/multer.middleware";

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Media, Category, MediaMorph]),
    MulterModule.register({ ...multerConfig, ...multerOptions }),
  ],
  controllers: [LocationController],
  providers: [LocationsService, CategoryService, MediaService],
})
export class LocationsModule {}

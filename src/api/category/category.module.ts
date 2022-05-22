import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { Category } from "./entities/category.entity";
import { Media } from "../media/entities/media.entity";
import { MediaMorph } from "../media/entities/media-morph.entity";
import {
  multerConfig,
  multerOptions,
} from "../../common/middlewares/multer.middleware";
import { MediaService } from "../media/media.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Media, MediaMorph]),
    MulterModule.register({ ...multerConfig, ...multerOptions }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, MediaService],
})
export class CategoryModule {}

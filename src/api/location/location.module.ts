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

@Module({
  imports: [TypeOrmModule.forFeature([Location, Media, Category, MediaMorph])],
  controllers: [LocationController],
  providers: [LocationsService, CategoryService, MediaService],
})
export class LocationsModule {}

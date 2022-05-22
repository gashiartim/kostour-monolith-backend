import { Module } from "@nestjs/common";
import { LocationsService } from "./location.service";
import { LocationController } from "./location.controller";
import { CategoryService } from "../category/category.service";

@Module({
  controllers: [LocationController],
  providers: [LocationsService, CategoryService],
})
export class LocationsModule {}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  UploadedFiles,
} from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { Restaurant } from "./entities/restaurant.entity";
import { CreatedRestaurantDto } from "./dto/created-restaurant.dto";
import { PaginationOptions } from "src/common/decorators/pagination.decorator";
import { RestaurantFiltersDto } from "./dto/restaurant-filters";
import { PaginationInterceptor } from "src/common/interceptors/pagination.interceptor";

@ApiTags("Resturants")
@Controller("api/restaurants")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiCreatedResponse({
    status: 201,
    type: CreatedRestaurantDto,
  })
  @UseGuards(new AuthGuard())
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ])
  )
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File;
      images?: Express.Multer.File[];
    }
  ): Promise<Restaurant> {
    return this.restaurantService.create(createRestaurantDto, files);
  }

  @Get()
  @ApiResponse({
    description: "Array of restaurants",
    status: 200,
    type: CreatedRestaurantDto,
    isArray: true,
  })
  @UseInterceptors(PaginationInterceptor)
  findAll(
    @Query() options: RestaurantFiltersDto,
    @PaginationOptions() pagination
  ) {
    return this.restaurantService.findAll(pagination, options);
  }

  @Get(":id")
  @ApiResponse({
    description: "Restaurant object",
    status: 200,
    type: CreatedRestaurantDto,
  })
  findOne(@Param("id") id: string) {
    return this.restaurantService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(new AuthGuard())
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("thumbnail"))
  update(
    @Param("id") id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.restaurantService.update(id, updateRestaurantDto, file);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res() res) {
    const result = await this.restaurantService.remove(id);

    if (result.success) {
      return res.json({
        message: "Restaurant was deleted successfully!",
      });
    }
  }
}

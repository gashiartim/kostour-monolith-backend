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
  UploadedFiles,
} from "@nestjs/common";
import { LocationsService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { LoggedUser } from "../../common/decorators/user.decorator";
import { PaginationInterceptor } from "src/common/interceptors/pagination.interceptor";
import { PaginationOptions } from "src/common/decorators/pagination.decorator";

@ApiTags("Locations")
@Controller("api/locations")
export class LocationController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ])
  )
  create(
    @Body() createLocationDto: CreateLocationDto,
    @LoggedUser() user: any,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File;
      images?: Express.Multer.File[];
    }
  ) {
    return this.locationsService.create(createLocationDto, user, files);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll(@PaginationOptions() pagination) {
    return this.locationsService.findAll(pagination);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(new AuthGuard())
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("thumbnail"))
  update(
    @Param("id") id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return this.locationsService.update(id, updateLocationDto, file);
  }

  @Delete(":id")
  @UseGuards(new AuthGuard())
  async remove(@Param("id") id: string, @Res() res) {
    const result = await this.locationsService.remove(id);

    if (result.success) {
      return res.json({
        message: "Location was deleted successfully!",
      });
    }
  }
}

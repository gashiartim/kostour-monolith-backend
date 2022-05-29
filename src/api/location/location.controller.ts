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
} from "@nestjs/common";
import { LocationsService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { LoggedUser } from "../../common/decorators/user.decorator";

@ApiTags("Locations")
@Controller("locations")
export class LocationController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  // @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor("thumbnail"))
  create(
    @Body() createLocationDto: CreateLocationDto,
    @LoggedUser() user: any,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return this.locationsService.create(createLocationDto, user, file);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.locationsService.remove(+id);
  }
}

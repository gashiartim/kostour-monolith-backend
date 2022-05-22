import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { MediaDto } from "./dto/media.dto";
import { MediaService } from "./media.service";

@Controller("api/media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() createMediaDto: MediaDto) {}

  @Get()
  findAll() {}

  @Get(":id")
  findOne(@Param("id") id: string) {}

  @Delete(":id")
  remove(@Param("id") id: string) {}
}

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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { LoggedUser } from "../../common/decorators/user.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CategoryService } from "./category.service";
import { CategoryFilters } from "./dto/category-filters.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("Categories")
@Controller("api/categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor("thumbnail"))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @LoggedUser() user: any,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return this.categoryService.create(createCategoryDto, user, file);
  }

  @Get()
  findAll(@Query() options: CategoryFilters) {
    return this.categoryService.findAll(options);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("thumbnail"))
  @ApiConsumes("multipart/form-data")
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @LoggedUser() user: any,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return this.categoryService.update(id, updateCategoryDto, user.id, file);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res() res) {
    const result = await this.categoryService.remove(id);

    if (result.success) {
      return res.json({
        message: "Category was deleted successfully!",
      });
    }
  }
}

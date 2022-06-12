import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/user.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { LoggedUser } from "../../common/decorators/user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ValidationPipe } from "../../common/pipes/validation.pipe";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@UseGuards(new AuthGuard())
@UsePipes(new ValidationPipe())
@ApiBearerAuth()
@ApiTags("Users")
@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles("admin")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get("me")
  async getProfile(@LoggedUser() currentUser) {
    return await this.userService.profile(currentUser);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}

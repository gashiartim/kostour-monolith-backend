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
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/permission.dto';
import { UpdatePermissionDto } from './dto/permission.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(new AuthGuard())
@UsePipes(new ValidationPipe())
@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('api/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() data: CreatePermissionDto) {
    return await this.permissionService.create(data);
  }

  @Get()
  async findAll() {
    return await this.permissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.permissionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdatePermissionDto) {
    return this.permissionService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.permissionService.remove(id);
  }
}

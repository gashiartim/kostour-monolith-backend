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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/role.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { RolePermissionDto } from '../permission/dto/permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { Repository } from 'typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(new AuthGuard())
@UsePipes(new ValidationPipe())
@ApiBearerAuth()
@ApiTags('Roles')
@Controller('api/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  @Post()
  async create(@Body() data: CreateRoleDto) {
    return await this.roleService.create(data);
  }

  @Roles('admin')
  @Get()
  async findAll() {
    return await this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.roleService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.roleService.remove(id);
  }

  @Post(':id/add_permission')
  async addPermission(
    @Body() data: RolePermissionDto,
    @Param('id') id: number,
  ) {
    const permission = await this.permissionRepository.findOne(
      data.permission_id,
    );
    const role = await this.roleService.addPermission(id, permission);

    return { role, permission };
  }

  @Delete(':id/remove_permission')
  async removePermission(
    @Body() data: RolePermissionDto,
    @Param('id') id: number,
  ) {
    const permission = await this.permissionRepository.findOne(
      data.permission_id,
    );
    const role = await this.roleService.removePermission(id, permission);
    return { message: 'Permission deleted successfully!', role, permission };
  }
}

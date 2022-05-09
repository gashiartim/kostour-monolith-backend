import slugify from 'slugify';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/role.dto';
import { Role } from './entities/role.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(data: CreateRoleDto): Promise<any> {
    const slufigiedName = slugify(data.name);

    const roleExists = await this.getRoleBySlug(data.name);
    if (roleExists) {
      throw new HttpException('Already exists!', HttpStatus.BAD_REQUEST);
    }

    const role = await this.roleRepository.create({
      name: data.name,
      slug: slufigiedName,
    });

    await this.roleRepository.save(role);

    return role;
  }

  async findAll() {
    return await this.roleRepository.findAndCount();
  }

  async findOne(id: number) {
    return await this.roleRepository.findOne(id);
  }

  async update(id: number, data: UpdateRoleDto) {
    const role = await this.getRequestedRoleOrFail(id);
    if (data.slug != 'admin' && role.isAdmin()) {
      throw new HttpException(
        "can't update the admin role slug",
        HttpStatus.CONFLICT,
      );
    }

    await this.roleRepository.update(id, {
      name: data.name,
      slug: slugify(data.name),
    });

    return await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async remove(id: number) {
    await this.getRequestedRoleOrFail(id);
    await this.roleRepository.delete(id);
    return { message: 'Role was deleted successfullty!' };
  }

  async getRoleBySlug(name: string) {
    return await this.roleRepository.findOne({ slug: slugify(name) });
  }

  async getRequestedRoleOrFail(id: number, options?: any) {
    const role = await this.roleRepository.findOneOrFail(id, options);
    if (!role) {
      throw new HttpException('Role does not exists!', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async addPermission(id: number, permission: Permission): Promise<Role> {
    const role = await this.getRequestedRoleOrFail(id, {
      relations: ['permissions'],
    });

    if (!role.permissions) {
      role.permissions = [];
    }

    const permissionExists =
      role.permissions.filter((per) => per.id == permission.id).length > 0;

    if (permissionExists) {
      return role;
    }

    role.permissions.push(permission);

    await this.roleRepository.save(role);

    return role;
  }

  async removePermission(id: number, permission: Permission): Promise<Role> {
    const role = await this.getRequestedRoleOrFail(id, {
      relations: ['permissions'],
    });

    role.permissions = role.permissions.filter(
      (per) => per.id != permission.id,
    );

    await this.roleRepository.save(role);
    return role;
  }
}

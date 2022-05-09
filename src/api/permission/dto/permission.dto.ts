import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUnique } from '../../../common/decorators/validation.decorator';

export class RolePermissionDto {
  @IsNotEmpty()
  @ApiProperty()
  permission_id;
}

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsUnique(
    'Permission',
    'permissions',
    {},
    {
      message: 'permission with this slug already exists',
    },
  )
  slug: string;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty()
  @IsUnique(
    'Permission',
    'permissions',
    {},
    {
      message: 'permission with this slug already exists',
    },
  )
  slug: string;
}

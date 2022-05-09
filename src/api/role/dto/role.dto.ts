import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from '../../../common/decorators/validation.decorator';

export class CreateRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUnique(
    'Role',
    'roles',
    {},
    {
      message: 'role with this slug already exists',
    },
  )
  slug: string;
}

export class UpdateRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsUnique(
    'Role',
    'roles',
    {},
    {
      message: 'role with this slug already exists',
    },
  )
  slug: string;
}

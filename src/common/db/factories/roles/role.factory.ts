import Faker from 'faker';
import slugify from 'slugify';
import { define } from 'typeorm-seeding';
import { Role } from '../../../../api/role/entities/role.entity';

define(Role, (faker: typeof Faker) => {
  const roleName = faker.name.firstName();

  const role = new Role();
  role.name = roleName;
  role.slug = slugify(roleName.toLocaleLowerCase());
  return role;
});

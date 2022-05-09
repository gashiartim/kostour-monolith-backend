import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from '../../../../api/role/entities/role.entity';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Role)().createMany(5);
    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([{ name: 'admin', slug: 'admin' }])
      .execute();
  }
}

import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Category } from "../../../../api/category/entities/category.entity";

export default class CreateLocations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values([
        {
          name: "Hiking",
          slug: "hiking",
        },
        {
          name: "Sport",
          slug: "sport",
        },
      ])
      .execute();
  }
}

import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Location } from "../../../../api/location/entities/location.entity";
import { Category } from "../../../../api/category/entities/category.entity";

export default class CreateLocations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const categories = await connection
      .createQueryBuilder()
      .select("category")
      .from(Category, "category")
      .getMany();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values([
        {
          name: "Rugove",
          categories: [...categories],
          description: "Rugove desc",
          whatCanYouDo: "what can you do in rugova",
        },
        {
          name: "Prizren",
          categories: [...categories],
          description: "Prizren desc",
          whatCanYouDo: "what can you do in prizren",
        },
      ])
      .execute();
  }
}

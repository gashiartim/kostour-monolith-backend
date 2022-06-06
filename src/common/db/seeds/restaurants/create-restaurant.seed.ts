import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Location } from "../../../../api/location/entities/location.entity";
import { Category } from "../../../../api/category/entities/category.entity";
import { Restaurant } from "../../../../api/restaurant/entities/restaurant.entity";

export default class CreateRestaurants implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const categories = await connection
      .createQueryBuilder()
      .select("category")
      .from(Category, "category")
      .getMany();

    const location = await connection
      .createQueryBuilder()
      .select("location")
      .from(Location, "location")
      .getOne();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Restaurant)
      .values([
        {
          name: "Loriano",
          description: "Loriano desc",
          location_id: location.id,
          open_hours: "08:00-19:00",
        },
        {
          name: "Steakhouse",
          description: "Steakhouse description",
          location_id: location.id,
          open_hours: "08:00-20:00",
        },
      ])
      .execute();
  }
}

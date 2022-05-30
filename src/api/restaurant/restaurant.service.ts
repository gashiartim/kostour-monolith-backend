import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { applyPaginationToBuilder } from "src/common/PaginationHelpers";
import { Repository } from "typeorm";
import { MediaMorph } from "../media/entities/media-morph.entity";
import { MediaService } from "../media/media.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { RestaurantFiltersDto } from "./dto/restaurant-filters";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private readonly mediaService: MediaService
  ) {}

  async create(
    createRestaurantDto: CreateRestaurantDto,
    files?: {
      thumbnail?: Express.Multer.File;
      images?: Express.Multer.File[];
    }
  ) {
    await this.checkIfRestaurantAlreadyExists(createRestaurantDto.name);

    const { thumbnail, ...restaurant } = createRestaurantDto;

    const newRestaurant = await this.restaurantRepo.create({
      ...restaurant,
    });

    await this.restaurantRepo.save(newRestaurant);

    if (files && files.thumbnail) {
      await this.mediaService.uploadFilesAndAttachEntity(
        files.thumbnail,
        {
          entity: "restaurant",
          entity_id: newRestaurant.id,
          related_field: "thumbnail",
        },
        newRestaurant.id
      );
    }

    if (files && files.images) {
      await this.mediaService.uploadFilesAndAttachEntity(
        files.images,
        {
          entity: "restaurant",
          entity_id: newRestaurant.id,
          related_field: "images",
        },
        newRestaurant.id
      );
    }

    return await this.restaurantRepo
      .createQueryBuilder("restaurant")
      .leftJoinAndMapOne(
        "restaurant.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = restaurant.id AND thumbnail.entity = (:entity)",
        {
          entity: "restaurant",
        }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .leftJoinAndMapMany(
        "restaurant.images",
        MediaMorph,
        "images",
        "images.entity_id = restaurant.id AND images.entity = (:entity) AND images.related_field = (:related_field)",
        { entity: "restaurant", related_field: "images" }
      )
      .leftJoinAndSelect("images.media", "images_media")
      .where({ id: newRestaurant.id })
      .getOne();
  }

  async findAll(pagination: any, options: RestaurantFiltersDto) {
    const queryBuilder = await this.restaurantRepo
      .createQueryBuilder("restaurant")
      .leftJoinAndSelect("restaurant.location", "location")
      .leftJoinAndMapOne(
        "restaurant.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = restaurant.id AND thumbnail.entity = (:entity)",
        {
          entity: "restaurant",
        }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .leftJoinAndMapMany(
        "restaurant.images",
        MediaMorph,
        "images",
        "images.entity_id = restaurant.id AND images.entity = (:entity) AND images.related_field = (:related_field)",
        { entity: "restaurant", related_field: "images" }
      )
      .leftJoinAndSelect("images.media", "images_media");

    applyPaginationToBuilder(queryBuilder, pagination.limit, pagination.page);

    return await queryBuilder.getManyAndCount();
  }

  async findOne(id: string) {
    return await this.getRestaurantOrFail(id);
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    file?: Express.Multer.File
  ) {
    const restaurant = await this.getRestaurantOrFail(id);

    await this.restaurantRepo.save(
      Object.assign(restaurant, { ...updateRestaurantDto })
    );

    if (file) {
      await this.mediaService.deleteEntityPhoto(id);

      await this.mediaService.uploadFileAndAttachEntity(
        file,
        {
          entity: "location",
          entity_id: restaurant.id,
          related_field: "thumbnail",
        },
        restaurant.id
      );
    }

    return await this.getRestaurantOrFail(id);
  }

  async remove(id: string) {
    await this.getRestaurantOrFail(id);

    await this.restaurantRepo
      .createQueryBuilder()
      .delete()
      .where({ id })
      .execute();

    await this.mediaService.deleteEntityPhoto(id);

    return {
      success: true,
    };
  }

  async checkIfRestaurantAlreadyExists(name: string) {
    const restaurantExists = await this.restaurantRepo.findOne({ name });

    if (restaurantExists) {
      throw new HttpException("Restaurant already exists", HttpStatus.FOUND);
    }

    return false;
  }

  async getRestaurantOrFail(id: string) {
    const restaurantExists = await this.restaurantRepo
      .createQueryBuilder("restaurant")
      .leftJoinAndSelect("restaurant.location", "location")
      .leftJoinAndMapOne(
        "restaurant.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = restaurant.id AND thumbnail.entity = (:entity)",
        { entity: "restaurant" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ id })
      .getOne();

    if (!restaurantExists) {
      throw new HttpException(
        "Restaurant does not exist!",
        HttpStatus.NOT_FOUND
      );
    }

    return restaurantExists;
  }
}

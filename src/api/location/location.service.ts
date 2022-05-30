import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatus } from "../../common/enums/http-status.enum";
import { Repository } from "typeorm";
import { CategoryService } from "../category/category.service";
import { MediaMorph } from "../media/entities/media-morph.entity";
import { MediaService } from "../media/media.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { Location } from "./entities/location.entity";
import { applyPaginationToBuilder } from "src/common/PaginationHelpers";
import { Category } from "../category/entities/category.entity";

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
    private readonly mediaService: MediaService,
    private readonly categoryService: CategoryService
  ) {}

  async create(
    createLocationDto: CreateLocationDto,
    user: any,
    files?: {
      thumbnail?: Express.Multer.File;
      images?: Express.Multer.File[];
    }
  ) {
    await this.checkIfLocationAlreadyExists(createLocationDto.name);

    const {
      name,
      categories: categoryIds,
      description,
      whatCanYouDo,
    } = createLocationDto;

    const categories = await this.categoryService.getCategories(
      categoryIds || []
    );

    const newLocation = this.locationRepo.create({
      name,
      description,
      whatCanYouDo,
      categories,
    });

    await this.locationRepo.save(newLocation);

    if (
      createLocationDto.categories &&
      categories.length !== createLocationDto.categories.length
    ) {
      throw new HttpException(
        "There are non-existing categories.",
        HttpStatus.NOT_FOUND
      );
    }

    if (files && files.thumbnail) {
      await this.mediaService.uploadFilesAndAttachEntity(
        files.thumbnail,
        {
          entity: "location",
          entity_id: newLocation.id,
          related_field: "thumbnail",
        },
        newLocation.id
      );
    }

    if (files && files.images) {
      await this.mediaService.uploadFilesAndAttachEntity(
        files.images,
        {
          entity: "location",
          entity_id: newLocation.id,
          related_field: "images",
        },
        newLocation.id
      );
    }

    return await this.locationRepo
      .createQueryBuilder("location")
      .leftJoinAndSelect("location.categories", "category")
      .leftJoinAndMapOne(
        "category.thumbnail",
        MediaMorph,
        "category_thumbnail",
        "category_thumbnail.entity_id = category.id AND category_thumbnail.entity = (:entity)",
        {
          entity: "category",
        }
      )
      .leftJoinAndSelect("category_thumbnail.media", "category_thumbnail_media")
      .leftJoinAndMapOne(
        "location.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = location.id AND thumbnail.entity = (:entity)",
        { entity: "location" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .leftJoinAndMapMany(
        "location.images",
        MediaMorph,
        "images",
        "images.entity_id = location.id AND images.entity = (:entity)",
        { entity: "location" }
      )
      .leftJoinAndSelect("images.media", "images_media")
      .where({ id: newLocation.id })
      .getOne();
  }

  async findAll(pagination: any) {
    const queryBuilder = await this.locationRepo
      .createQueryBuilder("location")
      .leftJoinAndSelect("location.categories", "category")
      .leftJoinAndMapOne(
        "location.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = location.id AND thumbnail.entity = (:entity)",
        {
          entity: "location",
        }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .leftJoinAndMapMany(
        "location.images",
        MediaMorph,
        "image",
        "image.entity_id = location.id AND image.entity = (:entity)",
        {
          entity: "location",
        }
      )
      .leftJoinAndSelect("image.media", "image_media");

    applyPaginationToBuilder(queryBuilder, pagination.limit, pagination.page);

    return queryBuilder.getManyAndCount();
  }

  async findOne(id: string) {
    const locationExists = await this.getLocationOrFail(id);

    await this.locationRepo.save(
      Object.assign(
        {},
        { ...locationExists, numberOfVisits: locationExists.numberOfVisits + 1 }
      )
    );

    return locationExists;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
    file?: Express.Multer.File
  ) {
    const location = await this.getLocationOrFail(id);

    const { categories: categoryIds } = updateLocationDto;

    const categories = await this.categoryService.getCategories(
      categoryIds || []
    );

    if (
      updateLocationDto.categories &&
      categories.length !== updateLocationDto.categories.length
    ) {
      throw new HttpException(
        "There are non-existing categories.",
        HttpStatus.NOT_FOUND
      );
    }

    await this.locationRepo.save(
      Object.assign(location, { ...updateLocationDto })
    );

    if (file) {
      await this.mediaService.deleteEntityPhoto(id);

      await this.mediaService.uploadFileAndAttachEntity(
        file,
        {
          entity: "location",
          entity_id: location.id,
          related_field: "thumbnail",
        },
        location.id
      );
    }

    return await this.locationRepo
      .createQueryBuilder("location")
      .leftJoinAndMapOne(
        "location.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = location.id AND thumbnail.entity = (:entity)",
        { entity: "location" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ id })
      .getOne();
  }

  async remove(id: string) {
    await this.getLocationOrFail(id);

    await this.locationRepo
      .createQueryBuilder()
      .delete()
      .where({ id })
      .execute();

    await this.mediaService.deleteEntityPhoto(id);

    return {
      success: true,
    };
  }

  async checkIfLocationAlreadyExists(name: string) {
    const locationExists = await this.locationRepo.findOne({ name });

    if (locationExists) {
      throw new HttpException(
        "Location already exists",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  async getLocationOrFail(id: string) {
    const locationExists = await this.locationRepo
      .createQueryBuilder("location")
      .leftJoinAndSelect("location.categories", "category")
      .leftJoinAndMapOne(
        "category.thumbnail",
        MediaMorph,
        "category_thumbnail",
        "category_thumbnail.entity_id = category.id AND category_thumbnail.entity = (:entity)",
        { entity: "category" }
      )
      .leftJoinAndSelect("category_thumbnail.media", "category_media")
      .leftJoinAndMapOne(
        "location.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = location.id AND thumbnail.entity = (:entity)",
        { entity: "location" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ id })
      .getOne();

    if (!locationExists) {
      throw new HttpException("Location does not exist!", HttpStatus.NOT_FOUND);
    }

    return locationExists;
  }
}

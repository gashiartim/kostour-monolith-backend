import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatus } from "src/common/enums/http-status.enum";
import { Repository } from "typeorm";
import { CategoryService } from "../category/category.service";
import { MediaMorph } from "../media/entities/media-morph.entity";
import { MediaService } from "../media/media.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { Location } from "./entities/location.entity";

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
    file?: Express.Multer.File
  ) {
    await this.checkIfLocationAlreadyExists(createLocationDto.name);

    const {
      name,
      categories: categoryIds,
      description,
      thumbnail,
      whatCanYouDo,
    } = createLocationDto;

    const categories = await this.categoryService.getCategories(
      categoryIds || []
    );

    const newLocation = await this.locationRepo.create({
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

    if (file) {
      await this.mediaService.uploadFileAndAttachEntity(
        file,
        {
          entity: "location",
          entity_id: newLocation.id,
          related_field: "thumbnail",
        },
        user.id
      );
    }

    return await this.locationRepo
      .createQueryBuilder("location")
      .leftJoinAndMapOne(
        "location.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = p.id AND thumbnail.entity = (:entity)",
        { entity: "location" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ id: newLocation.id })
      .getOne();
  }

  async findAll() {
    return await this.locationRepo.find();
  }

  async findOne(id: string) {
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
      .leftJoinAndMapOne(
        "location.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = p.id AND thumbnail.entity = (:entity)",
        { entity: "location" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ id })
      .getOne();

    await this.locationRepo.save(
      Object.assign(
        {},
        { ...locationExists, numberOfVisits: locationExists.numberOfVisits + 1 }
      )
    );

    if (!locationExists)
      throw new HttpException(
        "Product with this id doesn't exist!",
        HttpStatus.NOT_FOUND
      );

    return locationExists;
  }

  update(id: string, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
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
}

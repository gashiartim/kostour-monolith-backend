import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { In, Repository } from "typeorm";
import { MediaMorph } from "../media/entities/media-morph.entity";
import { Media } from "../media/entities/media.entity";
import { MediaService } from "../media/media.service";
import { CategoryFilters } from "./dto/category-filters.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly mediaService: MediaService
  ) {}
  async create(createCategoryDto: CreateCategoryDto, user: any, file?: any) {
    await this.checkIfCategoryAlreadyExists(createCategoryDto.name);

    if (createCategoryDto.parent_id) {
      const maxSubCat = process.env.SUB_CATEGORY_DEPTH;

      const parentCategory = await this.categoryRepository.findOne(
        createCategoryDto.parent_id
      );

      if (!parentCategory) {
        throw new HttpException(
          "Parent category does not exist!",
          HttpStatus.NOT_FOUND
        );
      }

      let level = parentCategory.level + 1;

      if (level > Number(maxSubCat)) {
        throw new HttpException(
          `Cannot create more than ${maxSubCat} levels of sub-categories`,
          HttpStatus.NOT_ACCEPTABLE
        );
      }

      createCategoryDto.level = level;
    }

    const newCategory = await this.categoryRepository.create({
      ...createCategoryDto,
      slug: slugify(createCategoryDto.name.toLowerCase()),
    });

    const category = await this.categoryRepository.save(newCategory);

    if (file) {
      await this.mediaService.uploadFileAndAttachEntity(
        file,
        {
          entity: "category",
          entity_id: category.id,
          related_field: "thumbnail",
          media: file,
        },
        category.id
      );
    }

    return await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndMapMany(
        "category.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = category.id AND thumbnail.entity = (:entity)",
        { entity: "category" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .leftJoinAndSelect("category.links", "links")
      .where({ id: category.id })
      .getOne();
  }

  async findAll(options: CategoryFilters) {
    const categories = this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndMapMany(
        "category.sub_categories",
        Category,
        "sub_categories",
        "sub_categories.parent_id = category.id"
      )
      .leftJoinAndMapMany(
        "sub_categories.sub_sub_categories",
        Category,
        "sub_sub_categories",
        "sub_sub_categories.parent_id = sub_categories.id"
      )
      .leftJoinAndSelect("category.links", "links")
      .leftJoinAndMapOne(
        "category.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = category.id AND thumbnail.entity = (:entity)",
        { entity: "category" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ parent_id: null })
      .orderBy("category.created_at", "ASC");

    if (options.top_categories) {
      categories.where("category.top_category = :top_category", {
        top_category: options.top_categories,
      });
    }

    if (options.sub_categories) {
      categories.where("category.parent_id IS NOT NULL");
    }

    if (options.top_level_categories) {
      categories.where("category.level < 2");
    }

    if (options.display_on_home_page) {
      categories.where(
        "category.display_on_home_page = :display_on_home_page",
        {
          display_on_home_page: options.display_on_home_page,
        }
      );
    }

    return await categories.getMany();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndMapOne(
        "category.parent_category",
        Category,
        "pc",
        "pc.id = category.parent_id"
      )
      .leftJoinAndSelect("category.links", "links")
      .leftJoinAndMapOne(
        "pc.thumbnail",
        MediaMorph,
        "pc_thumbnail",
        "pc_thumbnail.entity_id = pc.id AND pc_thumbnail.entity = (:pc_entity)",
        { pc_entity: "category" }
      )
      .leftJoinAndSelect("pc_thumbnail.media", "parent_category_media")
      .leftJoinAndMapMany(
        "category.sub_categories",
        Category,
        "sc",
        "sc.parent_id = (:parent_id)",
        { parent_id: id }
      )
      .leftJoinAndMapMany(
        "sc.sub_sub_categories",
        Category,
        "sub_sub_categories",
        "sub_sub_categories.parent_id = sc.id"
      )
      .leftJoinAndMapOne(
        "sc.thumbnail",
        MediaMorph,
        "sub_category_thumbnail",
        "sub_category_thumbnail.entity_id = sc.id AND sub_category_thumbnail.entity =(:entity)",
        { entity: "category" }
      )
      .leftJoinAndSelect("sub_category_thumbnail.media", "sub_category_media")
      .leftJoinAndMapOne(
        "category.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = category.id AND thumbnail.entity =(:entity)",
        { entity: "category" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ id })
      .getOne();

    if (!category) {
      throw new HttpException("Category doesn't exist!", HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async update(
    id: string,
    data: UpdateCategoryDto,
    userId: string,
    file?: Express.Multer.File
  ) {
    const category = await this.findOne(id);
    if (data.parent_id) {
      if (category.id == data.parent_id) {
        throw new HttpException(
          "Category can't be its own subcategory!",
          HttpStatus.NOT_FOUND
        );
      }
      const parentCategoryExists = await this.findOne(data.parent_id);
      if (!parentCategoryExists) {
        throw new HttpException(
          "Parent category doesn't exist!",
          HttpStatus.NOT_FOUND
        );
      }
    }

    await this.categoryRepository.save(
      Object.assign(category, { ...data, slug: slugify(data.name) })
    );
    if (file) {
      await this.mediaService.deleteEntityPhoto(id);

      await this.mediaService.uploadFileAndAttachEntity(
        file,
        {
          entity: "category",
          entity_id: category.id,
          related_field: "thumbnail",
        },
        category.id
      );
    }

    return await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndMapOne(
        "category.thumbnail",
        MediaMorph,
        "thumbnail",
        "thumbnail.entity_id = category.id AND thumbnail.entity = (:entity)",
        { entity: "category" }
      )
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ id })
      .getOne();
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    const sub_categories = await this.categoryRepository.find({
      parent_id: id,
    });

    const subCatIds = sub_categories.map((subCategory) => subCategory.id);

    if (!category) {
      throw new HttpException("Category doesn't exist!", HttpStatus.NOT_FOUND);
    }

    if (subCatIds && subCatIds.length) {
      await this.categoryRepository
        .createQueryBuilder()
        .delete()
        .where("parent_id In (:...parent_categories)", {
          parent_categories: [...subCatIds],
        })
        .execute();
    }

    await this.categoryRepository
      .createQueryBuilder()
      .delete()
      .where({ id })
      .orWhere({ parent_id: id })
      .execute();

    await this.mediaService.deleteEntityPhoto(id);

    return {
      success: true,
    };
  }

  async checkIfCategoryAlreadyExists(name: string) {
    const category = await this.categoryRepository.findOne({
      where: { name },
    });

    if (category) {
      throw new HttpException(
        "Category already exists!",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    return category;
  }

  async getCategories(categories: string[]) {
    return await this.categoryRepository.find({
      where: {
        id: In(categories),
      },
    });
  }
}

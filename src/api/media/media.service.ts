import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MediaDto } from "./dto/media.dto";
import { FileI } from "./interfaces/file.interface";
import { extname } from "path";
import * as sharp from "sharp";
import { Media } from "./entities/media.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MorphDto } from "./dto/morph.dto";
import { MediaMorph } from "./entities/media-morph.entity";
const fs = require("fs");

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(MediaMorph)
    private mediaMorphRepository: Repository<MediaMorph>
  ) {}

  async deleteMany(mediaIds: string[]) {
    mediaIds.map(async (media_id) => {
      const count = await this.mediaMorphRepository.count({
        where: {
          media: media_id,
        },
      });

      if (count > 0) {
        throw new HttpException(
          `This file is being used by other entites`,
          HttpStatus.NOT_ACCEPTABLE
        );
      }
    });

    return await this.mediaRepository.delete(mediaIds);
  }

  async findOneById(entityId: string) {
    const mediaMorphExists = await this.mediaMorphRepository.findOne({
      entity_id: entityId,
    });

    if (!mediaMorphExists) {
      return null;
    }

    return await this.mediaMorphRepository
      .createQueryBuilder("thumbnail")
      .leftJoinAndSelect("thumbnail.media", "media")
      .where({ entity_id: entityId })
      .getOne();
  }

  async deleteOneById(id: string) {
    const media = await this.mediaRepository.findOne(id);

    if (!media) return null;

    await this.mediaRepository.remove(media);

    return { success: "Media was deleted successfully!", media };
  }

  async uploadFileAndAttachEntity(
    media,
    morphData: MorphDto,
    creator_id: string
  ) {
    await this.formatFile(media);
    media.creator = creator_id;
    const fileMedia = await this.saveMedia(media);
    return await this.attachMediaToEntity(morphData, fileMedia);
  }

  async uploadFilesAndAttachEntity(media, morphData: MorphDto, userId: string) {
    await this.formatFiles(media);
    const results = [];
    for (const file of media) {
      file.creator = userId;
      const media = await this.saveMedia(file);
      await this.attachMediaToEntity(morphData, media);
      results.push(media);
    }
    return results;
  }

  private async formatFiles(files: FileI[]) {
    for (const file of files) {
      file.ext = extname(file.filename);
      file.url = file.path;
      file.size = +this.bytesToKbytes(file.size);
      file.name = file.originalname;
      try {
        const { info } = await sharp(file.path).toBuffer({
          resolveWithObject: true,
        });
        file.width = info.width;
        file.height = info.height;
      } catch (e) {
        throw new HttpException(`Error reading file`, HttpStatus.BAD_REQUEST);
      }
    }
  }

  private async formatFile(file: FileI) {
    file.ext = extname(file.filename);
    file.url = file.path;
    file.size = +this.bytesToKbytes(file.size);
    file.name = file.originalname;
    try {
      const { info } = await sharp(file.path).toBuffer({
        resolveWithObject: true,
      });
      file.width = info.width;
      file.height = info.height;
    } catch (e) {
      throw new HttpException(`Error reading file`, HttpStatus.BAD_REQUEST);
    }
  }

  private async attachMediaToEntity(morphData: MorphDto, media: Media) {
    return await this.mediaMorphRepository.save({
      ...morphData,
      media: media,
    });
  }

  private async saveMedia(media): Promise<Media> {
    const results = await this.mediaRepository
      .createQueryBuilder()
      .insert()
      .values(media)
      .execute();
    const newRecord = new Media();
    newRecord.id = results.raw[0].id;
    return newRecord;
  }
  private bytesToKbytes = (bytes) => Math.round((bytes / 1000) * 100) / 100;

  deleteFileFromUploadsFolder(fileName: string) {
    const path = "./public/uploads/";

    fs.unlink(`${fileName}`, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  async deleteEntityPhoto(entityId: string) {
    const oldImage = await this.findOneById(entityId);

    if (oldImage) {
      this.deleteFileFromUploadsFolder(oldImage.media.url);
      this.deleteOneById(oldImage.media_id);
    }
  }
}

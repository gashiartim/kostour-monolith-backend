import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthServiceGeneral } from "../../services/auth/AuthService";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./auth/dto/register-user.dto";
import { CreateUserDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthServiceGeneral
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkIfEmailExists(createUserDto.email);

    const user = await this.userRepository.create(createUserDto);

    await this.userRepository.save(user);
    return await this.userRepository.findOne(user.id);
  }

  async findAll() {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .getMany();

    return {
      data: users,
      total: users.length,
    };
  }

  async profile(data: RegisterUserDto): Promise<User> {
    return await this.findUserByEmail(data.email);
  }

  async findOne(id: string) {
    return await this.getRequestedUserOrFail(id);
  }

  //TODO: Email update and also validation
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.getRequestedUserOrFail(id);

    await this.userRepository.update(id, updateUserDto);

    return await this.userRepository.findOne(id);
  }

  async remove(id: string) {
    await this.getRequestedUserOrFail(id);
    await this.userRepository.delete(id);
    return { message: "User was deleted successfully!" };
  }

  async getRequestedUserOrFail(id: string) {
    // const user = await this.userRepository.findOne(id);
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where({ id })
      .getOne();

    if (!user) {
      throw new HttpException("User does not exists!", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async checkIfEmailExists(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      throw new HttpException("User already exists!", HttpStatus.FOUND);
    }
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}

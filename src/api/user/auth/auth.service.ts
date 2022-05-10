import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { LoginUserDto, RegisterUserDto } from "./dto/register-user.dto";
import { AuthServiceGeneral } from "../../../services/auth/AuthService";
import { HashService } from "../../../services/hash/HashService";
import { RoleService } from "../../../api/role/role.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthServiceGeneral,
    private readonly hashService: HashService,
    private readonly roleService: RoleService
  ) {}

  public async register(data: RegisterUserDto) {
    await this.checkIfEmailExists(data.email);
    const adminRole = await this.roleService.getRoleBySlug("admin");

    if (!adminRole) {
      throw new HttpException("Role does not exists!", HttpStatus.NOT_FOUND);
    }

    let user = await this.userRepository.create({
      first_name: data.first_name,
      last_name: data.last_name,
      birthday: data.birthday,
      email: data.email,
      password: data.password,
      role_id: adminRole.id,
    });
    await this.userRepository.save(user);

    user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where({ id: user.id })
      .getOne();

    const { password, ...userWithoutPassword } = user;

    return this.authService.sign(
      {
        userId: user.id,
      },
      { user: { ...userWithoutPassword, id: user.id, email: user.email } }
    );
  }

  public async login(data: LoginUserDto) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where({ email: data.email })
      .getOne();

    if (!user) {
      throw new HttpException("User does not exists!", HttpStatus.NOT_FOUND);
    }

    if (!(await this.hashService.compare(data.password, user.password))) {
      throw new HttpException(
        "Password does not match!",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    console.log("user", user);

    return this.authService.sign(
      { userId: user.id, email: user.email },
      {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      }
    );
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  public async checkIfEmailExists(email: string) {
    const user = await this.getUserByEmail(email);

    if (user) {
      throw new HttpException("Email already exists!", HttpStatus.FOUND);
    }

    return user;
  }
}

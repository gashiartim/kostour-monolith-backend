import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { LoginUserDto, RegisterUserDto } from "./dto/register-user.dto";
import { AuthServiceGeneral } from "../../../services/auth/AuthService";
import { HashService } from "../../../services/hash/HashService";
import { RoleService } from "../../../api/role/role.service";
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./dto/password-dto";
import { UserService } from "../user.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthServiceGeneral,
    private readonly hashService: HashService,
    private readonly userService: UserService,
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
      .select()
      .addSelect("user.password")
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

  public async forgotPassword(data: ForgotPasswordDto) {
    const userExists = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: data.email })
      .getOne();

    if (!userExists || !userExists.password) {
      throw new HttpException("User does not exist!", HttpStatus.BAD_REQUEST);
    }

    const access_token = await this.authService.signForForgotPassword(
      {
        id: userExists.id,
        email: userExists.email,
      },
      {
        user: {
          id: userExists.id,
          email: userExists.email,
        },
      }
    );

    return {
      user: userExists,
      access_token,
    };
  }

  public async setPassword(token: string, data: ResetPasswordDto, res: any) {
    let userId: any;

    try {
      const decodedToken = await this.authService.verifyToken(token);

      if (typeof decodedToken != "object") {
        throw new BadRequestException();
      }

      userId = decodedToken.id;
    } catch (error) {
      if (error?.name === "TokenExpiredError") {
        throw new BadRequestException("Set password token expired");
      }
      throw new BadRequestException("Bad Set password token");
    }

    const hashedPw = await new HashService().make(data.new_password);

    await this.userRepository.update(
      { id: userId },
      {
        password: hashedPw,
      }
    );

    return res.json({
      message: "Password updated successfully!",
    });
  }

  public async resetPassword(data: ResetPasswordDto, token: string) {
    let userId: string;

    try {
      const decodedToken = await this.authService.verifyToken(token);

      if (typeof decodedToken != "object") {
        throw new BadRequestException();
      }

      userId = decodedToken.userId;
    } catch (error) {
      if (error?.name === "TokenExpiredError") {
        throw new BadRequestException("Reset password token expired");
      }
      throw new BadRequestException("Bad reset password token");
    }

    return {
      message: "Password updated successfully!",
      user: await this.userService.update(userId, {
        password: data.new_password,
      } as any),
    };
  }
  public async changePassword(user: any, data: ChangePasswordDto) {
    const userExists = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id =:id", { id: user.id })
      .getOne();

    if (
      !(await this.hashService.compare(data.old_password, userExists.password))
    ) {
      throw new HttpException("Incorrect old password!", HttpStatus.CONFLICT);
    }

    return {
      message: "Password changed successfully!",
      user: await this.userService.update(
        userExists.id as any,
        {
          password: data.new_password,
        } as any
      ),
    };
  }
}

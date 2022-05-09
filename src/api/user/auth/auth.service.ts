import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginUserDto, RegisterUserDto } from './dto/register-user.dto';
import { AuthServiceGeneral } from '../../../services/auth/AuthService';
import { HashService } from '../../../services/hash/HashService';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthServiceGeneral,
    private readonly hashService: HashService,
  ) {}

  public async register(data: RegisterUserDto) {
    let user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    user = await this.userRepository.findOne(user.id);

    return this.authService.sign(
      {
        userId: user.id,
        email: user.email,
      },
      { user: { id: user.id, email: user.email } },
    );
  }

  public async login(data: LoginUserDto) {
    const user = await this.userRepository.findOne({ email: data.email });

    if (!user) {
      throw new Error('User does not exists!');
    }

    if (!(await this.hashService.compare(data.password, user.password))) {
      throw new HttpException(
        'Password does not match!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.authService.sign(
      { userId: user.id, email: user.email },
      { user: { id: user.id, email: user.email } },
    );
  }
}

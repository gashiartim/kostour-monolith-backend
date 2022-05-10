import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "./dto/register-user.dto";
import { ValidationPipe } from "../../../common/pipes/validation.pipe";

@Controller("api/auth")
@ApiTags("Authentication")
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("/register")
  async register(@Body() auth: RegisterUserDto): Promise<any> {
    return await this.authService.register(auth);
  }

  @Post("/login")
  async login(@Body() auth: LoginUserDto): Promise<any> {
    return await this.authService.login(auth);
  }
}

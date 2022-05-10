import { Body, Controller, Param, Post, Res, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginUserDto, RegisterUserDto } from "./dto/register-user.dto";
import { ValidationPipe } from "../../../common/pipes/validation.pipe";
import { ForgotPasswordDto, ResetPasswordDto } from "./dto/password-dto";
import { EventEmitter } from "stream";
import { InjectEventEmitter } from "nest-emitter";

@Controller("api/auth")
@ApiTags("Authentication")
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectEventEmitter() private readonly emitter: EventEmitter
  ) {}

  @Post("/register")
  async register(@Body() auth: RegisterUserDto, @Res() res: any): Promise<any> {
    const user = await this.authService.register(auth);

    this.emitter.emit("registerMail", user);

    return res.json({
      success: "You have successfully registered!",
      user: user.user,
      ...user,
    });
  }

  @Post("/login")
  async login(@Body() auth: LoginUserDto): Promise<any> {
    return await this.authService.login(auth);
  }

  @Post("/forgot-password")
  async forgotPassword(@Body() data: ForgotPasswordDto, @Res() res) {
    const userToken = await this.authService.forgotPassword(data);

    this.emitter.emit("forgotPasswordMail", userToken);

    return res.json({
      message: "Please check your email and set your new password!",
    });
  }

  @Post("/set-new-password/:token")
  async setNewPassword(
    @Param("token") token: string,
    @Body() data: ResetPasswordDto,
    @Res() res
  ) {
    return await this.authService.setPassword(token, data, res);
  }
}

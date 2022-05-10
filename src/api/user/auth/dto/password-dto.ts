import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { SameAs } from "../../../../common/decorators/validation.decorator";

export class ForgotPasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  new_password: string;

  @IsNotEmpty()
  @ApiProperty()
  @SameAs("new_password", { message: "Passwords don't match!" })
  confirm_password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  old_password: string;

  @IsNotEmpty()
  new_password: string;

  @IsNotEmpty()
  @SameAs("new_password", { message: "Password confirmation doesn't match!" })
  confirm_password: string;
}

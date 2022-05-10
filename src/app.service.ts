import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectEventEmitter } from "nest-emitter";
import { EventEmitter } from "./app.events";
import { MailService } from "./services/mail/mail.service";
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: EventEmitter,
    private readonly mailService: MailService
  ) {}

  onModuleInit() {
    this.emitter.on(
      "forgotPasswordMail",
      async (userToken) => await this.onForgotPasswordMail(userToken)
    );
    this.emitter.on(
      "registerMail",
      async (user) => await this.onRegisterMail(user)
    );
  }
  private async onForgotPasswordMail(userToken: any) {
    this.mailService.forgotPassword(userToken);
  }
  private async onRegisterMail(user: any) {
    this.mailService.register(user.user);
  }
}

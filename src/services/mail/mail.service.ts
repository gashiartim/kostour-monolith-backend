import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

// import { UserContactForm } from "../../api/user/dto/user.dto";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  readonly fromEmail: string = "kostour@gmail.com";
  readonly SITE_URL: string = "http://localhost:3001";
  readonly APP_URL: string = process.env.APP_URL;

  public register(user: any): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: this.getFromEmail(),
        subject: this.getSubject("Welcome!"),
        template: this.getEmailTemplatePath("register"),
        context: {
          user,
          confirm_link: `${process.env.APP_URL}/confirm/${user.token}`,
          link: this.SITE_URL,
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public deleteUserByCultureAdmin(user: any) {
    this.mailerService
      .sendMail({
        to: user.email,
        from: this.getFromEmail(),
        subject: this.getSubject("Your account was deleted by our admins!"),
        template: this.getEmailTemplatePath("deleteUser"),
        context: {
          first_name: user.first_name,
          user_name: `${user.first_name} ${user.last_name}`,
        },
      })
      .then((data) => console.log(data))
      .catch((error) => {
        throw error;
      });
  }

  public async forgotPassword(userToken: any) {
    return await this.mailerService
      .sendMail({
        to: userToken.user.email,
        from: this.getFromEmail(),
        subject: this.getSubject(`Reset your account's password`),
        template: this.getEmailTemplatePath("forgotPassword"),
        context: {
          user: userToken.user,
          link: `${this.APP_URL}/set-new-password?token=${userToken.access_token.access_token}`,
        },
      })
      .then((data) => console.log(data))
      .catch((error) => {
        throw error;
      });
  }

  public getEmailTemplatePath(template_name) {
    return `templates/${template_name}`;
  }
  public getSubject(subject) {
    return subject;
  }
  private getFromEmail() {
    return this.fromEmail;
  }
}

import { TokenPayload } from "./interfaces/TokenPayload";
import { Injectable } from "@nestjs/common";
import { JWTProvider } from "./Providers/JWTProvider";

@Injectable()
export class AuthServiceGeneral {
  private provider: any;

  public constructor() {
    this.setProvider("jwt");
  }

  public setProvider(provider: string): this {
    switch (provider) {
      case "jwt":
        this.provider = new JWTProvider();

      default:
        break;
    }

    return this;
  }

  public sign(payload: any, dataReturn: any): any {
    return this.provider.sign(payload, dataReturn);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public signForForgotPassword(
    payload: object,
    dataToReturn: object
  ): TokenPayload {
    return this.provider.signTokenForEmail(payload, dataToReturn);
  }

  public verifyToken(token: string) {
    return this.provider.verifyToken(token);
  }
}

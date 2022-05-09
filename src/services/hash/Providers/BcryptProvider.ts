import * as bcrypt from 'bcryptjs';

export class BcryptProvider {
  private bcrypt = bcrypt;
  private defaultRounds = 10;

  public async make(
    data: any,
    saltOrRounds: string | number = this.defaultRounds,
  ) {
    return await this.bcrypt.hash(data, saltOrRounds);
  }

  public async compare(data: any, encrypted: string) {
    return await this.bcrypt.compare(data, encrypted);
  }
}

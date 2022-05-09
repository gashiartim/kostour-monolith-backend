import { Injectable } from '@nestjs/common';
import { BcryptProvider } from './Providers/BcryptProvider';

@Injectable()
export class HashService {
  private provider: any;

  public constructor() {
    this.setDriver('bcrypt');
  }

  public setDriver(provider: string) {
    switch (provider) {
      case 'bcrypt':
        this.provider = new BcryptProvider();
        break;

      default:
        break;
    }

    return this;
  }

  public async make(data: any, saltOrRounds: string | number = 10) {
    return await this.provider.make(data, saltOrRounds);
  }

  public async compare(data: any, encrypted: string) {
    return await this.provider.compare(data, encrypted);
  }
}

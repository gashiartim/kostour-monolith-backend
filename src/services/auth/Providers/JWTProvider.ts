import * as jwt from 'jsonwebtoken';

export class JWTProvider {
  // eslint-disable-next-line @typescript-eslint/ban-types
  public sign(payload: object, dataReturn: object): object {
    return {
      ...dataReturn,
      access_token: jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h',
      }),
      expires_in: '24h',
    };
  }

  public verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

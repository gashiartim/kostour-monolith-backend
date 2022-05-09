import { getUserFromRequest } from '../Helpers';
import * as contextService from 'request-context';

export default async function (req, res, next) {
  const user = await getUserFromRequest(req);

  if (user) {
    contextService.set('request:user', user);
  }

  next();
}

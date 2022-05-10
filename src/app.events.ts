import Events from "events";

import { StrictEventEmitter } from "nest-emitter";
interface AppEvents {
  registerMail: (user: any) => void;
  registerUserByCultureAdmin: (user: any) => void;
  deletedUserByCultureAdmin: (user: any) => void;
  forgotPasswordMail: (userToken: any) => void;
  confirmMail: (business: any) => void;
}

export type EventEmitter = StrictEventEmitter<Events.EventEmitter, AppEvents>;

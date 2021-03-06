import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./api/user/user.module";
import { RoleModule } from "./api/role/role.module";
import { PermissionModule } from "./api/permission/permission.module";
import SetUserToContextMiddleware from "./common/middlewares/setUserToContext.middleware";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { NestEmitterModule } from "nest-emitter";
import { EventEmitter } from "stream";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from "./services/mail/mail.service";
import { MulterModule } from "@nestjs/platform-express";
import {
  multerConfig,
  multerOptions,
} from "./common/middlewares/multer.middleware";
import { HashService } from "./services/hash/HashService";
import { CategoryModule } from "./api/category/category.module";
import { LocationsModule } from "./api/location/location.module";
import { RestaurantModule } from "./api/restaurant/restaurant.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MongooseModule } from "@nestjs/mongoose";
import { MessagesModule } from "./api/messages/messages.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    MongooseModule.forRoot(
      "mongodb+srv://kostourismdb:kostourismdb@cluster0.7hax6.mongodb.net/kostourism"
    ),
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../"),
    }),
    UserModule,
    RoleModule,
    UserModule,
    CategoryModule,
    PermissionModule,
    LocationsModule,
    RestaurantModule,
    MessagesModule,
    NestEmitterModule.forRoot(new EventEmitter()),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_AUTH_USER,
          pass: process.env.MAIL_AUTH_PASSWORD,
        },
      },
      defaults: {
        from: '"nestmodules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + "/../templates",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MulterModule.register({
      ...multerConfig,
      ...multerOptions,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MailService, HashService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SetUserToContextMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });

    //Test middleware showing how to exclude routes when you use a middleware
    //This middleware has no function
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "/api/users/me", method: RequestMethod.GET })
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}

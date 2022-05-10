import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ErrorFilter } from "./utils/ErrorFilter";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as contextService from "request-context";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ErrorFilter());
  app.use(contextService.middleware("request"));
  const options = new DocumentBuilder()
    .setTitle("Kutia example")
    .setDescription("The Kutia API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup("docs", app, document);

  app.enableCors();
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Accept, Content-Length"
    );
    res.header("Access-Control-Expose-Headers", "Content-Length");
    contextService.set("request", req);
    next();
  });

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    console.log(
      `🚀 Server started at http://localhost:${port}\n🚨️ Environment: ${process.env.NODE_ENV}`
    );
  });
}

bootstrap();

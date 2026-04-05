import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  const swaggerConfig = new DocumentBuilder()
    .setTitle("NexusAI API")
    .setDescription("NestJS + MongoDB backend generated from requirements.md")
    .setVersion("1.0.0")
    .addTag("auth")
    .addTag("discovery")
    .addTag("catalog")
    .addTag("agents")
    .addTag("analytics")
    .addTag("content")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document, {
    jsonDocumentUrl: "docs/swagger.json"
  });

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();

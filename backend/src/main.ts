import "./load-env";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("NexusAI API")
    .setDescription("NestJS + MongoDB backend for NexusAI. Use /api-docs to explore all endpoints.")
    .setVersion("1.0.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access-token"
    )
    .addTag("auth", "Authentication — sign-up, sign-in, guest session, profile")
    .addTag("discovery", "Onboarding, guided chat sessions, prompt drafts")
    .addTag("catalog", "AI model catalog, providers, comparisons, reviews")
    .addTag("agents", "Agent builder — CRUD, templates, wizard steps")
    .addTag("analytics", "Dashboard metrics and usage data")
    .addTag("content", "Research feed, localization, digest subscriptions")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api-docs", app, document, {
    jsonDocumentUrl: "api-docs/swagger.json",
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha"
    }
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`\n🚀 NexusAI backend running at: http://localhost:${port}`);
  console.log(`📚 Swagger UI:               http://localhost:${port}/api-docs\n`);
}

void bootstrap();

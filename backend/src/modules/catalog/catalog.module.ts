import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";
import { AiModel, AiModelSchema, ModelReview, ModelReviewSchema, Provider, ProviderSchema } from "./schemas/catalog.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
      { name: AiModel.name, schema: AiModelSchema },
      { name: ModelReview.name, schema: ModelReviewSchema }
    ])
  ],
  controllers: [CatalogController],
  providers: [CatalogService]
})
export class CatalogModule {}

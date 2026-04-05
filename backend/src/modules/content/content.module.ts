import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { DigestSubscription, DigestSubscriptionSchema, LocalizationPreference, LocalizationPreferenceSchema, ResearchItem, ResearchItemSchema } from "./schemas/content.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResearchItem.name, schema: ResearchItemSchema },
      { name: DigestSubscription.name, schema: DigestSubscriptionSchema },
      { name: LocalizationPreference.name, schema: LocalizationPreferenceSchema }
    ])
  ],
  controllers: [ContentController],
  providers: [ContentService]
})
export class ContentModule {}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DiscoveryController } from "./discovery.controller";
import { DiscoveryService } from "./discovery.service";
import {
  ChatSession,
  ChatSessionSchema,
  OnboardingProfile,
  OnboardingProfileSchema,
  PromptDraft,
  PromptDraftSchema
} from "./schemas/discovery.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnboardingProfile.name, schema: OnboardingProfileSchema },
      { name: ChatSession.name, schema: ChatSessionSchema },
      { name: PromptDraft.name, schema: PromptDraftSchema }
    ])
  ],
  controllers: [DiscoveryController],
  providers: [DiscoveryService]
})
export class DiscoveryModule {}

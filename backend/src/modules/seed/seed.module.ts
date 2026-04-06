import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Agent, AgentSchema, AgentTemplate, AgentTemplateSchema } from "../agents/schemas/agents.schema";
import { AiModel, AiModelSchema, Provider, ProviderSchema } from "../catalog/schemas/catalog.schema";
import { ResearchItem, ResearchItemSchema } from "../content/schemas/content.schema";
import { SeedService } from "./seed.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema },
      { name: AiModel.name, schema: AiModelSchema },
      { name: AgentTemplate.name, schema: AgentTemplateSchema },
      { name: Agent.name, schema: AgentSchema },
      { name: ResearchItem.name, schema: ResearchItemSchema }
    ])
  ],
  providers: [SeedService]
})
export class SeedModule {}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AgentsController } from "./agents.controller";
import { AgentsService } from "./agents.service";
import { Agent, AgentSchema, AgentTemplate, AgentTemplateSchema } from "./schemas/agents.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgentTemplate.name, schema: AgentTemplateSchema },
      { name: Agent.name, schema: AgentSchema }
    ])
  ],
  controllers: [AgentsController],
  providers: [AgentsService]
})
export class AgentsModule {}

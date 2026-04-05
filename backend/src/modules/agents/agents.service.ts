import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateAgentDto, UpdateAgentDto } from "./dto/agents.dto";
import { Agent, AgentDocument, AgentTemplate, AgentTemplateDocument } from "./schemas/agents.schema";

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(AgentTemplate.name)
    private readonly templateModel: Model<AgentTemplateDocument>,
    @InjectModel(Agent.name)
    private readonly agentModel: Model<AgentDocument>
  ) {}

  getTemplates() {
    return this.templateModel.find().sort({ name: 1 }).lean();
  }

  createAgent(payload: CreateAgentDto) {
    return this.agentModel.create({
      ...payload,
      status: "configured"
    });
  }

  async getAgent(id: string) {
    const agent = await this.agentModel.findById(id).lean();
    if (!agent) throw new NotFoundException("Agent not found");
    return agent;
  }

  async updateAgent(id: string, payload: UpdateAgentDto) {
    const agent = await this.agentModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!agent) throw new NotFoundException("Agent not found");
    return agent;
  }
}

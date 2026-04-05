import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AgentsService } from "./agents.service";
import { CreateAgentDto, UpdateAgentDto } from "./dto/agents.dto";

@ApiTags("agents")
@Controller("agents")
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get("templates")
  @ApiOperation({ summary: "List predefined agent templates" })
  @ApiOkResponse({ description: "Agent templates returned" })
  getTemplates() {
    return this.agentsService.getTemplates();
  }

  @Post()
  @ApiOperation({ summary: "Create a new agent from template or scratch" })
  @ApiCreatedResponse({ description: "Agent created" })
  createAgent(@Body() payload: CreateAgentDto) {
    return this.agentsService.createAgent(payload);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get agent details" })
  @ApiOkResponse({ description: "Agent returned" })
  getAgent(@Param("id") id: string) {
    return this.agentsService.getAgent(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update agent tools, instructions, or config" })
  @ApiOkResponse({ description: "Agent updated" })
  updateAgent(@Param("id") id: string, @Body() payload: UpdateAgentDto) {
    return this.agentsService.updateAgent(id, payload);
  }
}

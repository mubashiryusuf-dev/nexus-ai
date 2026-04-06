import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";

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

  @Get("tools")
  @ApiOperation({ summary: "Get full tool catalog with overview, steps, and config fields" })
  @ApiOkResponse({ description: "Tool catalog returned" })
  getToolCatalog() {
    return this.agentsService.getToolCatalog();
  }

  @Get()
  @ApiOperation({ summary: "List all agents" })
  @ApiOkResponse({ description: "Agents list returned" })
  listAgents() {
    return this.agentsService.listAgents();
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
  @ApiNotFoundResponse({ description: "Agent not found" })
  getAgent(@Param("id") id: string) {
    return this.agentsService.getAgent(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update agent tools, instructions, or config" })
  @ApiOkResponse({ description: "Agent updated" })
  @ApiNotFoundResponse({ description: "Agent not found" })
  updateAgent(@Param("id") id: string, @Body() payload: UpdateAgentDto) {
    return this.agentsService.updateAgent(id, payload);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete an agent" })
  @ApiNoContentResponse({ description: "Agent deleted" })
  @ApiNotFoundResponse({ description: "Agent not found" })
  deleteAgent(@Param("id") id: string) {
    return this.agentsService.deleteAgent(id);
  }
}

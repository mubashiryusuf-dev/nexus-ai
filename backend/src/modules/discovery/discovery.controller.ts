import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";

import { DiscoveryService } from "./discovery.service";
import {
  AppendChatMessageDto,
  CreateChatSessionDto,
  CreateOnboardingProfileDto,
  CreatePromptDraftDto,
  UpdatePromptDraftDto
} from "./dto/discovery.dto";

@ApiTags("discovery")
@Controller("discovery")
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Post("onboarding")
  @ApiOperation({ summary: "Save onboarding answers and build discovery profile" })
  @ApiCreatedResponse({ description: "Onboarding profile created" })
  createOnboarding(@Body() payload: CreateOnboardingProfileDto) {
    return this.discoveryService.createOnboardingProfile(payload);
  }

  @Get("onboarding/:id")
  @ApiOperation({ summary: "Get onboarding profile" })
  @ApiOkResponse({ description: "Onboarding profile returned" })
  getOnboarding(@Param("id") id: string) {
    return this.discoveryService.getOnboardingProfile(id);
  }

  @Post("chat/sessions")
  @ApiOperation({ summary: "Create a guided chat session" })
  @ApiCreatedResponse({ description: "Chat session created" })
  createChatSession(@Body() payload: CreateChatSessionDto) {
    return this.discoveryService.createChatSession(payload);
  }

  @Post("chat/sessions/:id/messages")
  @ApiOperation({ summary: "Append a message to the chat hub session" })
  @ApiCreatedResponse({ description: "Message added" })
  appendMessage(@Param("id") id: string, @Body() payload: AppendChatMessageDto) {
    return this.discoveryService.appendMessage(id, payload);
  }

  @Post("prompts")
  @ApiOperation({ summary: "Create prompt review draft" })
  @ApiCreatedResponse({ description: "Prompt draft created" })
  createPrompt(@Body() payload: CreatePromptDraftDto) {
    return this.discoveryService.createPromptDraft(payload);
  }

  @Patch("prompts/:id")
  @ApiOperation({ summary: "Edit an existing prompt draft" })
  @ApiOkResponse({ description: "Prompt draft updated" })
  updatePrompt(@Param("id") id: string, @Body() payload: UpdatePromptDraftDto) {
    return this.discoveryService.updatePromptDraft(id, payload);
  }

  @Post("prompts/:id/regenerate")
  @ApiOperation({ summary: "Regenerate a prompt draft" })
  @ApiCreatedResponse({ description: "Prompt draft regenerated" })
  regeneratePrompt(@Param("id") id: string) {
    return this.discoveryService.regeneratePromptDraft(id);
  }

  @Delete("prompts/:id")
  @ApiOperation({ summary: "Delete a prompt draft" })
  @ApiOkResponse({ description: "Prompt draft deleted" })
  deletePrompt(@Param("id") id: string) {
    return this.discoveryService.deletePromptDraft(id);
  }
}

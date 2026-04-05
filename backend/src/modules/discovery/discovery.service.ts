import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import {
  AppendChatMessageDto,
  CreateChatSessionDto,
  CreateOnboardingProfileDto,
  CreatePromptDraftDto,
  UpdatePromptDraftDto
} from "./dto/discovery.dto";
import {
  ChatSession,
  ChatSessionDocument,
  OnboardingProfile,
  OnboardingProfileDocument,
  PromptDraft,
  PromptDraftDocument
} from "./schemas/discovery.schema";

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectModel(OnboardingProfile.name)
    private readonly onboardingModel: Model<OnboardingProfileDocument>,
    @InjectModel(ChatSession.name)
    private readonly chatSessionModel: Model<ChatSessionDocument>,
    @InjectModel(PromptDraft.name)
    private readonly promptDraftModel: Model<PromptDraftDocument>
  ) {}

  createOnboardingProfile(payload: CreateOnboardingProfileDto) {
    return this.onboardingModel.create({
      ...payload,
      recommendedUseCases: payload.answers.slice(0, 3).map((item) => item.answer)
    });
  }

  getOnboardingProfile(id: string) {
    return this.onboardingModel.findById(id).lean();
  }

  createChatSession(payload: CreateChatSessionDto) {
    return this.chatSessionModel.create({
      ...payload,
      messages: [
        {
          role: "assistant",
          content: "Welcome to NexusAI Chat Hub. Tell me about your goal and budget."
        }
      ]
    });
  }

  async appendMessage(id: string, payload: AppendChatMessageDto) {
    const session = await this.chatSessionModel.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: {
            ...payload,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!session) {
      throw new NotFoundException("Chat session not found");
    }

    return session;
  }

  createPromptDraft(payload: CreatePromptDraftDto) {
    return this.promptDraftModel.create({
      ...payload,
      chatSessionId: new Types.ObjectId(payload.chatSessionId),
      status: "draft"
    });
  }

  updatePromptDraft(id: string, payload: UpdatePromptDraftDto) {
    return this.promptDraftModel.findByIdAndUpdate(id, payload, { new: true });
  }

  regeneratePromptDraft(id: string) {
    return this.promptDraftModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "ready",
          body: "Regenerated prompt with stronger guidance, pricing, and task-fit context."
        }
      },
      { new: true }
    );
  }

  deletePromptDraft(id: string) {
    return this.promptDraftModel.findByIdAndDelete(id);
  }
}

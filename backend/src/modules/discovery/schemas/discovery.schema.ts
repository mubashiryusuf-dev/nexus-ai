import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type OnboardingProfileDocument = HydratedDocument<OnboardingProfile>;
export type ChatSessionDocument = HydratedDocument<ChatSession>;
export type PromptDraftDocument = HydratedDocument<PromptDraft>;

@Schema({ _id: false })
export class OnboardingAnswer {
  @Prop({ required: true })
  questionKey!: string;

  @Prop({ required: true })
  answer!: string;
}

const OnboardingAnswerSchema = SchemaFactory.createForClass(OnboardingAnswer);

@Schema({ timestamps: true, collection: "onboarding_profiles" })
export class OnboardingProfile {
  @Prop({ required: true })
  userRef!: string;

  @Prop({ type: [OnboardingAnswerSchema], default: [] })
  answers!: OnboardingAnswer[];

  @Prop({ type: [String], default: [] })
  recommendedUseCases!: string[];
}

@Schema({ timestamps: true, collection: "chat_sessions" })
export class ChatSession {
  @Prop({ required: true })
  userRef!: string;

  @Prop({ required: true })
  skillLevel!: string;

  @Prop({
    type: [{ role: String, content: String, createdAt: { type: Date, default: Date.now } }],
    default: []
  })
  messages!: Array<{ role: string; content: string; createdAt: Date }>;
}

@Schema({ timestamps: true, collection: "prompt_drafts" })
export class PromptDraft {
  @Prop({ type: Types.ObjectId, ref: ChatSession.name, required: true })
  chatSessionId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  body!: string;

  @Prop({ default: "draft", enum: ["draft", "ready", "queued"] })
  status!: "draft" | "ready" | "queued";
}

export const OnboardingProfileSchema = SchemaFactory.createForClass(OnboardingProfile);
export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
export const PromptDraftSchema = SchemaFactory.createForClass(PromptDraft);

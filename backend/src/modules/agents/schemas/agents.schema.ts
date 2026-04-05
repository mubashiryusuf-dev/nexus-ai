import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AgentTemplateDocument = HydratedDocument<AgentTemplate>;
export type AgentDocument = HydratedDocument<Agent>;

@Schema({ timestamps: true, collection: "agent_templates" })
export class AgentTemplate {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  category!: string;

  @Prop({ type: [String], default: [] })
  suggestedTools!: string[];

  @Prop({ required: true })
  description!: string;
}

@Schema({ timestamps: true, collection: "agents" })
export class Agent {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  template!: string;

  @Prop({ required: true })
  instructions!: string;

  @Prop({ type: [String], default: [] })
  tools!: string[];

  @Prop({ default: "draft", enum: ["draft", "configured", "deployed"] })
  status!: string;
}

export const AgentTemplateSchema = SchemaFactory.createForClass(AgentTemplate);
export const AgentSchema = SchemaFactory.createForClass(Agent);

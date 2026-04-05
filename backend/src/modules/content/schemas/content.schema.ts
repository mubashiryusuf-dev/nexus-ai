import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ResearchItemDocument = HydratedDocument<ResearchItem>;
export type DigestSubscriptionDocument = HydratedDocument<DigestSubscription>;
export type LocalizationPreferenceDocument = HydratedDocument<LocalizationPreference>;

@Schema({ timestamps: true, collection: "research_items" })
export class ResearchItem {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  organization!: string;

  @Prop({ required: true })
  topic!: string;

  @Prop({ required: true })
  excerpt!: string;
}

@Schema({ timestamps: true, collection: "digest_subscriptions" })
export class DigestSubscription {
  @Prop({ required: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ default: "weekly" })
  frequency!: string;
}

@Schema({ timestamps: true, collection: "localization_preferences" })
export class LocalizationPreference {
  @Prop({ required: true })
  userRef!: string;

  @Prop({ required: true })
  languageCode!: string;
}

export const ResearchItemSchema = SchemaFactory.createForClass(ResearchItem);
export const DigestSubscriptionSchema = SchemaFactory.createForClass(DigestSubscription);
export const LocalizationPreferenceSchema = SchemaFactory.createForClass(LocalizationPreference);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProviderDocument = HydratedDocument<Provider>;
export type AiModelDocument = HydratedDocument<AiModel>;
export type ModelReviewDocument = HydratedDocument<ModelReview>;

@Schema({ timestamps: true, collection: "providers" })
export class Provider {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  description!: string;
}

@Schema({ timestamps: true, collection: "ai_models" })
export class AiModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  provider!: string;

  @Prop({ type: [String], default: [] })
  categories!: string[];

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ required: true })
  pricingModel!: string;

  @Prop({ required: true })
  priceLabel!: string;

  @Prop({ required: true })
  license!: string;

  @Prop({ default: 0 })
  rating!: number;

  @Prop({ default: 0 })
  reviewCount!: number;

  @Prop({ required: true })
  contextWindow!: string;

  @Prop({ required: true })
  bestFitUseCase!: string;

  @Prop({ required: true })
  promptGuide!: string;
}

@Schema({ timestamps: true, collection: "model_reviews" })
export class ModelReview {
  @Prop({ required: true })
  modelSlug!: string;

  @Prop({ required: true })
  userRef!: string;

  @Prop({ required: true })
  rating!: number;

  @Prop({ required: true })
  comment!: string;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
export const AiModelSchema = SchemaFactory.createForClass(AiModel);
export const ModelReviewSchema = SchemaFactory.createForClass(ModelReview);

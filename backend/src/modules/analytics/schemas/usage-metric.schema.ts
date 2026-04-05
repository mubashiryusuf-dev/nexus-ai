import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UsageMetricDocument = HydratedDocument<UsageMetric>;

@Schema({ timestamps: true, collection: "usage_metrics" })
export class UsageMetric {
  @Prop({ required: true })
  modelSlug!: string;

  @Prop({ required: true })
  requests!: number;

  @Prop({ required: true })
  averageLatencyMs!: number;

  @Prop({ required: true })
  dailyCost!: number;

  @Prop({ required: true })
  satisfactionScore!: number;
}

export const UsageMetricSchema = SchemaFactory.createForClass(UsageMetric);

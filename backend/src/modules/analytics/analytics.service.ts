import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UsageQueryDto } from "./dto/analytics.dto";
import { UsageMetric, UsageMetricDocument } from "./schemas/usage-metric.schema";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(UsageMetric.name)
    private readonly usageMetricModel: Model<UsageMetricDocument>
  ) {}

  getOverview() {
    return {
      activeModelPanel: "GPT-5",
      requests: 12482,
      latencyMs: 842,
      dailyCost: 182.45,
      satisfaction: 4.7
    };
  }

  getUsage(query: UsageQueryDto) {
    const filters: Record<string, unknown> = {};
    if (query.modelSlug) filters.modelSlug = query.modelSlug;
    return this.usageMetricModel.find(filters).lean();
  }
}

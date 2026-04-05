import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { UsageMetric, UsageMetricSchema } from "./schemas/usage-metric.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsageMetric.name, schema: UsageMetricSchema }
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}

import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AnalyticsService } from "./analytics.service";
import { UsageQueryDto } from "./dto/analytics.dto";

@ApiTags("analytics")
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("overview")
  @ApiOperation({ summary: "Get dashboard KPI overview" })
  @ApiOkResponse({ description: "Overview returned" })
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get("usage")
  @ApiOperation({ summary: "Get usage records and latency/cost metrics" })
  @ApiOkResponse({ description: "Usage metrics returned" })
  getUsage(@Query() query: UsageQueryDto) {
    return this.analyticsService.getUsage(query);
  }
}

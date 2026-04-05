import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ContentService } from "./content.service";
import { CreateDigestSubscriptionDto, ResearchFeedQueryDto, UpdateLocalizationDto } from "./dto/content.dto";

@ApiTags("content")
@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get("research-feed")
  @ApiOperation({ summary: "Get research and model release feed" })
  @ApiOkResponse({ description: "Research feed returned" })
  getResearchFeed(@Query() query: ResearchFeedQueryDto) {
    return this.contentService.getResearchFeed(query);
  }

  @Post("digest-subscriptions")
  @ApiOperation({ summary: "Subscribe to weekly digest" })
  @ApiCreatedResponse({ description: "Digest subscription created" })
  createDigestSubscription(@Body() payload: CreateDigestSubscriptionDto) {
    return this.contentService.createDigestSubscription(payload);
  }

  @Get("languages")
  @ApiOperation({ summary: "Get supported localization languages" })
  @ApiOkResponse({ description: "Languages returned" })
  getLanguages() {
    return this.contentService.getSupportedLanguages();
  }

  @Put("localization/:userId")
  @ApiOperation({ summary: "Update user language preference" })
  @ApiOkResponse({ description: "Localization updated" })
  updateLocalization(
    @Param("userId") userId: string,
    @Body() payload: UpdateLocalizationDto
  ) {
    return this.contentService.updateLocalization(userId, payload);
  }
}

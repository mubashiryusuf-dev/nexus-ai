import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CatalogService } from "./catalog.service";
import { CatalogQueryDto, CompareModelsDto, CreateModelReviewDto } from "./dto/catalog.dto";

@ApiTags("catalog")
@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("providers")
  @ApiOperation({ summary: "Browse AI providers/labs" })
  @ApiOkResponse({ description: "Providers returned" })
  getProviders() {
    return this.catalogService.getProviders();
  }

  @Get("models")
  @ApiOperation({ summary: "Search and filter AI models" })
  @ApiOkResponse({ description: "Filtered models returned" })
  getModels(@Query() query: CatalogQueryDto) {
    return this.catalogService.getModels(query);
  }

  @Get("models/:slug")
  @ApiOperation({ summary: "Get detailed model information" })
  @ApiOkResponse({ description: "Model detail returned" })
  getModel(@Param("slug") slug: string) {
    return this.catalogService.getModelDetail(slug);
  }

  @Get("models/:slug/guides")
  @ApiOperation({ summary: "Get model prompt and usage guidance" })
  @ApiOkResponse({ description: "Model guidance returned" })
  getModelGuide(@Param("slug") slug: string) {
    return this.catalogService.getModelGuide(slug);
  }

  @Get("comparisons/flagship")
  @ApiOperation({ summary: "Get curated flagship model comparison" })
  @ApiOkResponse({ description: "Flagship comparison returned" })
  getFlagshipComparison() {
    return this.catalogService.getFlagshipComparison();
  }

  @Post("comparisons")
  @ApiOperation({ summary: "Compare selected models side-by-side" })
  @ApiCreatedResponse({ description: "Comparison returned" })
  compareModels(@Body() payload: CompareModelsDto) {
    return this.catalogService.compareSpecificModels(payload);
  }

  @Post("models/:slug/reviews")
  @ApiOperation({ summary: "Create a model review" })
  @ApiCreatedResponse({ description: "Review created" })
  createReview(@Param("slug") slug: string, @Body() payload: CreateModelReviewDto) {
    return this.catalogService.createReview(slug, payload);
  }
}

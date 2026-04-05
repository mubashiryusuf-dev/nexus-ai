import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { AiModel, AiModelDocument, ModelReview, ModelReviewDocument, Provider, ProviderDocument } from "./schemas/catalog.schema";
import { CatalogQueryDto, CompareModelsDto, CreateModelReviewDto } from "./dto/catalog.dto";

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(Provider.name) private readonly providerModel: Model<ProviderDocument>,
    @InjectModel(AiModel.name) private readonly aiModelModel: Model<AiModelDocument>,
    @InjectModel(ModelReview.name) private readonly reviewModel: Model<ModelReviewDocument>
  ) {}

  async getProviders() {
    return this.providerModel.find().sort({ name: 1 }).lean();
  }

  async getModels(query: CatalogQueryDto) {
    const filters: Record<string, unknown> = {};

    if (query.category) filters.categories = query.category;
    if (query.provider) filters.provider = query.provider;
    if (query.pricingModel) filters.pricingModel = query.pricingModel;
    if (query.license) filters.license = query.license;
    if (query.minRating) filters.rating = { $gte: query.minRating };

    return this.aiModelModel.find(filters).sort({ rating: -1 }).lean();
  }

  async getModelDetail(slug: string) {
    return this.aiModelModel.findOne({ slug }).lean();
  }

  getModelGuide(slug: string) {
    return {
      slug,
      sections: ["overview", "pricing", "prompt-guide", "agent-creation", "reviews"]
    };
  }

  async getFlagshipComparison() {
    return this.aiModelModel
      .find({ slug: { $in: ["gpt-5", "claude-3-7", "gemini-2-5"] } })
      .select("name provider rating contextWindow pricingModel bestFitUseCase")
      .lean();
  }

  async compareSpecificModels(payload: CompareModelsDto) {
    return this.aiModelModel.find({ slug: { $in: payload.modelSlugs } }).lean();
  }

  async createReview(slug: string, payload: CreateModelReviewDto) {
    return this.reviewModel.create({
      modelSlug: slug,
      ...payload
    });
  }
}

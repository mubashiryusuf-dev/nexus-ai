import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateDigestSubscriptionDto, ResearchFeedQueryDto, UpdateLocalizationDto } from "./dto/content.dto";
import { DigestSubscription, DigestSubscriptionDocument, LocalizationPreference, LocalizationPreferenceDocument, ResearchItem, ResearchItemDocument } from "./schemas/content.schema";

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(ResearchItem.name)
    private readonly researchItemModel: Model<ResearchItemDocument>,
    @InjectModel(DigestSubscription.name)
    private readonly digestSubscriptionModel: Model<DigestSubscriptionDocument>,
    @InjectModel(LocalizationPreference.name)
    private readonly localizationPreferenceModel: Model<LocalizationPreferenceDocument>
  ) {}

  getResearchFeed(query: ResearchFeedQueryDto) {
    const filters: Record<string, unknown> = {};
    if (query.topic) filters.topic = query.topic;
    return this.researchItemModel.find(filters).sort({ createdAt: -1 }).lean();
  }

  createDigestSubscription(payload: CreateDigestSubscriptionDto) {
    return this.digestSubscriptionModel.create({
      ...payload,
      frequency: payload.frequency ?? "weekly"
    });
  }

  getSupportedLanguages() {
    return [
      "en", "ar", "fr", "de", "es", "pt", "zh", "ja",
      "ko", "hi", "ur", "tr", "ru", "it", "nl"
    ];
  }

  updateLocalization(userId: string, payload: UpdateLocalizationDto) {
    return this.localizationPreferenceModel.findOneAndUpdate(
      { userRef: userId },
      { userRef: userId, languageCode: payload.languageCode },
      { upsert: true, new: true }
    );
  }
}

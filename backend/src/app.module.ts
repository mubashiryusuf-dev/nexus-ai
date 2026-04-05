import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AgentsModule } from "./modules/agents/agents.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { ContentModule } from "./modules/content/content.module";
import { DiscoveryModule } from "./modules/discovery/discovery.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/nexus-ai"
    ),
    AuthModule,
    DiscoveryModule,
    CatalogModule,
    AgentsModule,
    AnalyticsModule,
    ContentModule
  ]
})
export class AppModule {}

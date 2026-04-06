import "./load-env";

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Socket } from "net";

import { AgentsModule } from "./modules/agents/agents.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { ChatModule } from "./modules/chat/chat.module";
import { ContentModule } from "./modules/content/content.module";
import { DiscoveryModule } from "./modules/discovery/discovery.module";
import { SeedModule } from "./modules/seed/seed.module";

let mongod: MongoMemoryServer | null = null;

const inMemoryMongoCandidates = [
  {
    label: "MongoDB 6.0 ephemeralForTest",
    binary: { version: "6.0.18" },
    instance: { dbName: "nexus-ai", storageEngine: "ephemeralForTest" as const }
  },
  {
    label: "MongoDB 7.0 wiredTiger",
    binary: { version: "7.0.14" },
    instance: { dbName: "nexus-ai", storageEngine: "wiredTiger" as const }
  }
] as const;

function getLocalMongoTarget(uri: string): { host: string; port: number } | null {
  if (uri.startsWith("mongodb+srv://")) {
    return null;
  }

  const match = uri.match(/^mongodb:\/\/(?:[^@/]+@)?([^/:?,]+)(?::(\d+))?/i);

  if (!match) {
    return null;
  }

  const host = match[1];
  const port = Number(match[2] ?? "27017");

  if (!["127.0.0.1", "localhost", "::1"].includes(host) || Number.isNaN(port)) {
    return null;
  }

  return { host, port };
}

async function isTcpPortReachable(host: string, port: number): Promise<boolean> {
  return await new Promise((resolve) => {
    const socket = new Socket();

    const finalize = (result: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(1000);
    socket.once("connect", () => finalize(true));
    socket.once("timeout", () => finalize(false));
    socket.once("error", () => finalize(false));
    socket.connect(port, host);
  });
}

async function getMongoOptions() {
  if (process.env.MONGODB_URI) {
    const localMongoTarget = getLocalMongoTarget(process.env.MONGODB_URI);

    if (
      !localMongoTarget ||
      (await isTcpPortReachable(localMongoTarget.host, localMongoTarget.port))
    ) {
      return { uri: process.env.MONGODB_URI };
    }

    console.warn(
      `MongoDB is not reachable at ${localMongoTarget.host}:${localMongoTarget.port}; falling back to an in-memory MongoDB instance.`
    );
  }
  // Otherwise spin up an in-memory MongoDB — no installation required
  const startupErrors: string[] = [];

  for (const candidate of inMemoryMongoCandidates) {
    try {
      mongod = await MongoMemoryServer.create({
        binary: candidate.binary,
        instance: candidate.instance
      });
      const uri = mongod.getUri();
      console.log(`\n  In-memory MongoDB running at: ${uri}\n`);
      return { uri };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      startupErrors.push(`${candidate.label}: ${message}`);
    }
  }

  throw new Error(
    [
      "Failed to start MongoDB.",
      "Set MONGODB_URI in backend/.env to a running MongoDB instance, or let mongodb-memory-server download a compatible binary.",
      ...startupErrors
    ].join("\n")
  );
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: getMongoOptions
    }),
    AuthModule,
    DiscoveryModule,
    CatalogModule,
    AgentsModule,
    AnalyticsModule,
    ContentModule,
    ChatModule,
    SeedModule
  ]
})
export class AppModule {}

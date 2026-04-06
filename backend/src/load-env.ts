import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile(): void {
  const envPath = resolve(__dirname, "..", ".env");
  const defaultMongoBinaryCacheDir = resolve(
    __dirname,
    "..",
    "node_modules",
    ".cache",
    "mongodb-binaries"
  );

  if (!existsSync(envPath)) {
    if (process.env.MONGOMS_DOWNLOAD_DIR === undefined) {
      process.env.MONGOMS_DOWNLOAD_DIR = defaultMongoBinaryCacheDir;
    }
    return;
  }

  const fileContents = readFileSync(envPath, "utf8");

  for (const rawLine of fileContents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }

  if (process.env.MONGOMS_DOWNLOAD_DIR === undefined) {
    process.env.MONGOMS_DOWNLOAD_DIR = defaultMongoBinaryCacheDir;
  }
}

loadEnvFile();

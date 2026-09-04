import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = existsSync(join(backendRoot, ".env"))
  ? join(backendRoot, ".env")
  : join(backendRoot, ".env.example");

loadDotenv({ path: envPath });

export const HOST = "127.0.0.1";
export const PORT = Number.parseInt(process.env.PORT ?? "3001", 10);
export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "https://127.0.0.1:3000";

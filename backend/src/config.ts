import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";

import { parseCorsOrigins } from "./cors-origin.js";

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = existsSync(join(backendRoot, ".env"))
  ? join(backendRoot, ".env")
  : join(backendRoot, ".env.example");

loadDotenv({ path: envPath });

export const HOST = process.env.HOST?.trim() || "127.0.0.1";
export const PORT = Number.parseInt(process.env.PORT ?? "3001", 10);
export const CORS_ORIGINS = parseCorsOrigins(process.env.CORS_ORIGIN);

export function isOtpMock(): boolean {
  const value = process.env.OTP_MOCK?.trim().toLowerCase();
  if (value === "false" || value === "0") {
    return false;
  }
  return true;
}

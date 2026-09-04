import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { config } from "dotenv";

const backendRoot = dirname(fileURLToPath(import.meta.url));
const envPath = existsSync(join(backendRoot, ".env"))
  ? join(backendRoot, ".env")
  : join(backendRoot, ".env.example");

config({ path: envPath });

const prismaCli = join(backendRoot, "node_modules/prisma/build/index.js");
const result = spawnSync(process.execPath, [prismaCli, "generate"], {
  cwd: backendRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status === null ? 1 : result.status);

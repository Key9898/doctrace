import type { IncomingMessage, ServerResponse } from "node:http";

import { CORS_ORIGIN } from "./config.js";

const MAX_JSON_BYTES = 8 * 1024;
const MAX_RAW_BYTES = 20 * 1024 * 1024;

export function applyCors(response: ServerResponse): void {
  response.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
}

export function sendJson(
  response: ServerResponse,
  status: number,
  body: Record<string, unknown>,
): void {
  applyCors(response);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

export async function readJsonBody(
  request: IncomingMessage,
): Promise<{ ok: true; value: unknown } | { ok: false }> {
  const chunks: Buffer[] = [];
  let size = 0;

  try {
    for await (const chunk of request) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > MAX_JSON_BYTES) {
        return { ok: false };
      }
      chunks.push(buffer);
    }
  } catch {
    return { ok: false };
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return { ok: false };
  }

  try {
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch {
    return { ok: false };
  }
}

export async function readRawBody(
  request: IncomingMessage,
): Promise<{ ok: true; bytes: Buffer } | { ok: false }> {
  const chunks: Buffer[] = [];
  let size = 0;

  try {
    for await (const chunk of request) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > MAX_RAW_BYTES) {
        return { ok: false };
      }
      chunks.push(buffer);
    }
  } catch {
    return { ok: false };
  }

  return { ok: true, bytes: Buffer.concat(chunks) };
}

export function readBearerToken(request: IncomingMessage): string | null {
  const header = request.headers.authorization;
  if (typeof header !== "string") {
    return null;
  }
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }
  return token;
}

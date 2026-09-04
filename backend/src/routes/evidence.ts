import { createHash } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

import { readBearerToken, readRawBody, sendJson } from "../http.js";

const SHA256_HEX = /^[a-f0-9]{64}$/;

function evidenceKey(contentSha256: string): string {
  return `evidence/${contentSha256}`;
}

function parseEvidencePath(pathname: string): string | null {
  const prefix = "/evidence/";
  if (!pathname.startsWith(prefix)) {
    return null;
  }
  const contentSha256 = pathname.slice(prefix.length);
  if (!SHA256_HEX.test(contentSha256)) {
    return null;
  }
  return contentSha256;
}

export async function handleEvidence(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
): Promise<void> {
  if (request.method !== "PUT") {
    sendJson(response, 404, { ok: false, error: "not_found" });
    return;
  }

  const contentSha256 = parseEvidencePath(pathname);
  if (!contentSha256) {
    sendJson(response, 400, { ok: false, error: "invalid_hash" });
    return;
  }

  const token = readBearerToken(request);
  if (!token) {
    sendJson(response, 401, { ok: false, error: "unauthorized" });
    return;
  }

  try {
    const { findValidSession } = await import("../services/session.js");
    const session = await findValidSession(token);
    if (!session) {
      sendJson(response, 401, { ok: false, error: "unauthorized" });
      return;
    }
  } catch {
    sendJson(response, 500, { ok: false, error: "internal" });
    return;
  }

  const { isR2Configured, putEvidenceObject } =
    await import("../services/r2.js");
  if (!isR2Configured()) {
    sendJson(response, 503, { ok: false, error: "r2_unconfigured" });
    return;
  }

  const body = await readRawBody(request);
  if (!body.ok) {
    sendJson(response, 400, { ok: false, error: "invalid_body" });
    return;
  }

  const digest = createHash("sha256").update(body.bytes).digest("hex");
  if (digest !== contentSha256) {
    sendJson(response, 400, { ok: false, error: "hash_mismatch" });
    return;
  }

  const mimeHeader = request.headers["content-type"];
  const mimeType =
    typeof mimeHeader === "string" && mimeHeader.trim()
      ? mimeHeader.split(";")[0].trim()
      : "application/octet-stream";
  const key = evidenceKey(contentSha256);

  try {
    await putEvidenceObject(key, body.bytes, mimeType);
    sendJson(response, 200, { ok: true, key });
  } catch {
    sendJson(response, 502, { ok: false, error: "r2_failed" });
  }
}

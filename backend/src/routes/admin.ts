import type { IncomingMessage, ServerResponse } from "node:http";

import { readBearerToken, sendJson } from "../http.js";

const ADMIN_PATHS = new Set(["/admin/roster", "/admin/deploy"]);

export async function handleAdmin(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
): Promise<void> {
  if (!ADMIN_PATHS.has(pathname) || request.method !== "GET") {
    sendJson(request, response, 404, { ok: false, error: "not_found" });
    return;
  }

  const token = readBearerToken(request);
  if (!token) {
    sendJson(request, response, 401, { ok: false, error: "unauthorized" });
    return;
  }

  try {
    const { findValidSession } = await import("../services/session.js");
    const session = await findValidSession(token);
    if (!session) {
      sendJson(request, response, 401, { ok: false, error: "unauthorized" });
      return;
    }
  } catch {
    sendJson(request, response, 500, { ok: false, error: "internal" });
    return;
  }

  sendJson(request, response, 503, {
    ok: false,
    error: "admin_not_live",
  });
}

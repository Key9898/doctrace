import type { IncomingMessage, ServerResponse } from "node:http";

import { readBearerToken, sendJson } from "../http.js";

export async function handleTemplates(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
): Promise<void> {
  if (pathname !== "/templates") {
    sendJson(request, response, 404, { ok: false, error: "not_found" });
    return;
  }

  if (request.method !== "PUT" && request.method !== "GET") {
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
    error: "templates_not_live",
  });
}

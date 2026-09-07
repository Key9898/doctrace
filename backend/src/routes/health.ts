import type { IncomingMessage, ServerResponse } from "node:http";

import { sendJson } from "../http.js";

export function sendHealth(
  request: IncomingMessage,
  response: ServerResponse,
): void {
  sendJson(request, response, 200, { ok: true });
}

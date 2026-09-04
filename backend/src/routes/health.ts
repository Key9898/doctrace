import type { ServerResponse } from "node:http";

import { sendJson } from "../http.js";

export function sendHealth(response: ServerResponse): void {
  sendJson(response, 200, { ok: true });
}

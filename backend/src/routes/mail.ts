import type { IncomingMessage, ServerResponse } from "node:http";

import { readBearerToken, sendJson } from "../http.js";

const ACCOUNT_NOTICE_PATH = "/mail/account-notice";

export async function handleMail(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
): Promise<void> {
  if (request.method !== "POST" || pathname !== ACCOUNT_NOTICE_PATH) {
    sendJson(request, response, 404, { ok: false, error: "not_found" });
    return;
  }

  const token = readBearerToken(request);
  if (!token) {
    sendJson(request, response, 401, { ok: false, error: "unauthorized" });
    return;
  }

  let toEmail: string;
  try {
    const { findValidSession } = await import("../services/session.js");
    const session = await findValidSession(token);
    if (!session) {
      sendJson(request, response, 401, { ok: false, error: "unauthorized" });
      return;
    }
    toEmail = session.user.email;
  } catch {
    sendJson(request, response, 500, { ok: false, error: "internal" });
    return;
  }

  const { isBrevoConfigured, sendAccountNotice } =
    await import("../services/brevo.js");
  if (!isBrevoConfigured()) {
    sendJson(request, response, 503, {
      ok: false,
      error: "brevo_unconfigured",
    });
    return;
  }

  try {
    await sendAccountNotice(toEmail);
    sendJson(request, response, 200, { ok: true });
  } catch {
    sendJson(request, response, 502, { ok: false, error: "brevo_failed" });
  }
}

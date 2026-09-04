import type { IncomingMessage, ServerResponse } from "node:http";

import { readBearerToken, sendJson } from "../http.js";

const ACCOUNT_NOTICE_PATH = "/mail/account-notice";

export async function handleMail(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
): Promise<void> {
  if (request.method !== "POST" || pathname !== ACCOUNT_NOTICE_PATH) {
    sendJson(response, 404, { ok: false, error: "not_found" });
    return;
  }

  const token = readBearerToken(request);
  if (!token) {
    sendJson(response, 401, { ok: false, error: "unauthorized" });
    return;
  }

  let toEmail: string;
  try {
    const { findValidSession } = await import("../services/session.js");
    const session = await findValidSession(token);
    if (!session) {
      sendJson(response, 401, { ok: false, error: "unauthorized" });
      return;
    }
    toEmail = session.user.email;
  } catch {
    sendJson(response, 500, { ok: false, error: "internal" });
    return;
  }

  const { isBrevoConfigured, sendAccountNotice } =
    await import("../services/brevo.js");
  if (!isBrevoConfigured()) {
    sendJson(response, 503, { ok: false, error: "brevo_unconfigured" });
    return;
  }

  try {
    await sendAccountNotice(toEmail);
    sendJson(response, 200, { ok: true });
  } catch {
    sendJson(response, 502, { ok: false, error: "brevo_failed" });
  }
}

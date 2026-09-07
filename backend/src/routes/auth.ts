import type { IncomingMessage, ServerResponse } from "node:http";

import { Prisma } from "@prisma/client";

import { prisma } from "../db.js";
import { readBearerToken, readJsonBody, sendJson } from "../http.js";
import {
  createOtpChallenge,
  hashesMatch,
  OTP_MAX_ATTEMPTS,
  parseEmail,
  parseIntent,
  parseOtpCode,
  resolveOtpCode,
} from "../services/otp.js";
import { hashToken } from "../services/session.js";
import {
  createSession,
  deleteSession,
  findValidSession,
} from "../services/session.js";

function publicUser(user: { id: string; email: string }) {
  return { id: user.id, email: user.email };
}

async function handleOtpRequest(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const body = await readJsonBody(request);
  if (!body.ok || typeof body.value !== "object" || body.value === null) {
    sendJson(request, response, 400, { ok: false, error: "invalid_json" });
    return;
  }

  const email = parseEmail(
    "email" in body.value ? body.value.email : undefined,
  );
  const intent = parseIntent(
    "intent" in body.value ? body.value.intent : undefined,
  );
  if (!email || !intent) {
    sendJson(request, response, 400, { ok: false, error: "invalid_fields" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (intent === "login" && !existingUser) {
      sendJson(request, response, 404, { ok: false, error: "user_not_found" });
      return;
    }
    if (intent === "signup" && existingUser) {
      sendJson(request, response, 409, { ok: false, error: "email_taken" });
      return;
    }

    const resolved = resolveOtpCode();
    if (!resolved.ok) {
      sendJson(request, response, 503, { ok: false, error: resolved.error });
      return;
    }

    const created = await createOtpChallenge(email, intent, resolved.code);
    if (!created.ok) {
      sendJson(request, response, 429, { ok: false, error: created.error });
      return;
    }

    sendJson(request, response, 200, {
      ok: true,
      expiresAt: created.expiresAt.toISOString(),
      debugCode: resolved.debugCode,
    });
  } catch {
    sendJson(request, response, 500, { ok: false, error: "internal" });
  }
}

async function handleOtpVerify(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const body = await readJsonBody(request);
  if (!body.ok || typeof body.value !== "object" || body.value === null) {
    sendJson(request, response, 400, { ok: false, error: "invalid_json" });
    return;
  }

  const email = parseEmail(
    "email" in body.value ? body.value.email : undefined,
  );
  const code = parseOtpCode("code" in body.value ? body.value.code : undefined);
  if (!email || !code) {
    sendJson(request, response, 400, { ok: false, error: "invalid_fields" });
    return;
  }

  try {
    const challenge = await prisma.otpChallenge.findUnique({
      where: { email },
    });
    if (!challenge) {
      sendJson(request, response, 401, { ok: false, error: "unauthorized" });
      return;
    }
    if (challenge.expiresAt.getTime() <= Date.now()) {
      await prisma.otpChallenge.delete({ where: { email } });
      sendJson(request, response, 401, { ok: false, error: "otp_expired" });
      return;
    }
    if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.otpChallenge.delete({ where: { email } });
      sendJson(request, response, 429, { ok: false, error: "otp_locked" });
      return;
    }

    const matches = hashesMatch(challenge.codeHash, hashToken(code));
    if (!matches) {
      const nextAttempts = challenge.attempts + 1;
      if (nextAttempts >= OTP_MAX_ATTEMPTS) {
        await prisma.otpChallenge.delete({ where: { email } });
        sendJson(request, response, 429, { ok: false, error: "otp_locked" });
        return;
      }
      await prisma.otpChallenge.update({
        where: { email },
        data: { attempts: nextAttempts },
      });
      sendJson(request, response, 401, { ok: false, error: "unauthorized" });
      return;
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (challenge.intent === "signup") {
      if (user) {
        await prisma.otpChallenge.delete({ where: { email } });
        sendJson(request, response, 409, { ok: false, error: "email_taken" });
        return;
      }
      user = await prisma.user.create({
        data: { email },
      });
    } else if (!user) {
      await prisma.otpChallenge.delete({ where: { email } });
      sendJson(request, response, 404, { ok: false, error: "user_not_found" });
      return;
    }

    await prisma.otpChallenge.delete({ where: { email } });
    const token = await createSession(user.id);
    sendJson(request, response, 200, {
      token,
      user: publicUser(user),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      sendJson(request, response, 409, { ok: false, error: "email_taken" });
      return;
    }
    sendJson(request, response, 500, { ok: false, error: "internal" });
  }
}

async function handleMe(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const token = readBearerToken(request);
  if (!token) {
    sendJson(request, response, 401, { ok: false, error: "unauthorized" });
    return;
  }

  try {
    const session = await findValidSession(token);
    if (!session) {
      sendJson(request, response, 401, { ok: false, error: "unauthorized" });
      return;
    }
    sendJson(request, response, 200, { user: publicUser(session.user) });
  } catch {
    sendJson(request, response, 500, { ok: false, error: "internal" });
  }
}

async function handleLogout(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const token = readBearerToken(request);
  if (!token) {
    sendJson(request, response, 401, { ok: false, error: "unauthorized" });
    return;
  }

  try {
    await deleteSession(token);
    sendJson(request, response, 200, { ok: true });
  } catch {
    sendJson(request, response, 500, { ok: false, error: "internal" });
  }
}

function handleRetiredPasswordAuth(
  request: IncomingMessage,
  response: ServerResponse,
): void {
  sendJson(request, response, 410, {
    ok: false,
    error: "password_auth_retired",
  });
}

export async function handleAuth(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
): Promise<void> {
  if (request.method === "POST" && pathname === "/auth/otp/request") {
    await handleOtpRequest(request, response);
    return;
  }
  if (request.method === "POST" && pathname === "/auth/otp/verify") {
    await handleOtpVerify(request, response);
    return;
  }
  if (request.method === "POST" && pathname === "/auth/register") {
    handleRetiredPasswordAuth(request, response);
    return;
  }
  if (request.method === "POST" && pathname === "/auth/login") {
    handleRetiredPasswordAuth(request, response);
    return;
  }
  if (request.method === "GET" && pathname === "/auth/me") {
    await handleMe(request, response);
    return;
  }
  if (request.method === "POST" && pathname === "/auth/logout") {
    await handleLogout(request, response);
    return;
  }

  sendJson(request, response, 404, { ok: false, error: "not_found" });
}

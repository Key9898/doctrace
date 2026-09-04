import type { IncomingMessage, ServerResponse } from "node:http";

import { Prisma } from "@prisma/client";

import { prisma } from "../db.js";
import { readBearerToken, readJsonBody, sendJson } from "../http.js";
import {
  hashPassword,
  MIN_PASSWORD_LENGTH,
  verifyPassword,
} from "../services/password.js";
import {
  createSession,
  deleteSession,
  findValidSession,
} from "../services/session.js";

function publicUser(user: { id: string; email: string }) {
  return { id: user.id, email: user.email };
}

function readEmailPassword(value: unknown): {
  email: string;
  password: string;
} | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const emailRaw = "email" in value ? value.email : undefined;
  const passwordRaw = "password" in value ? value.password : undefined;
  if (typeof emailRaw !== "string" || typeof passwordRaw !== "string") {
    return null;
  }
  const email = emailRaw.trim().toLowerCase();
  const password = passwordRaw;
  if (!email.includes("@") || !email.includes(".")) {
    return null;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return null;
  }
  return { email, password };
}

async function handleRegister(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const body = await readJsonBody(request);
  if (!body.ok) {
    sendJson(response, 400, { ok: false, error: "invalid_json" });
    return;
  }
  const credentials = readEmailPassword(body.value);
  if (!credentials) {
    sendJson(response, 400, { ok: false, error: "invalid_fields" });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: credentials.email,
        passwordHash: await hashPassword(credentials.password),
      },
    });
    const token = await createSession(user.id);
    sendJson(response, 201, {
      token,
      user: publicUser(user),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      sendJson(response, 409, { ok: false, error: "email_taken" });
      return;
    }
    sendJson(response, 500, { ok: false, error: "internal" });
  }
}

async function handleLogin(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const body = await readJsonBody(request);
  if (!body.ok) {
    sendJson(response, 400, { ok: false, error: "invalid_json" });
    return;
  }
  const credentials = readEmailPassword(body.value);
  if (!credentials) {
    sendJson(response, 400, { ok: false, error: "invalid_fields" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });
    if (!user) {
      sendJson(response, 401, { ok: false, error: "unauthorized" });
      return;
    }
    const matches = await verifyPassword(
      credentials.password,
      user.passwordHash,
    );
    if (!matches) {
      sendJson(response, 401, { ok: false, error: "unauthorized" });
      return;
    }
    const token = await createSession(user.id);
    sendJson(response, 200, {
      token,
      user: publicUser(user),
    });
  } catch {
    sendJson(response, 500, { ok: false, error: "internal" });
  }
}

async function handleMe(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const token = readBearerToken(request);
  if (!token) {
    sendJson(response, 401, { ok: false, error: "unauthorized" });
    return;
  }

  try {
    const session = await findValidSession(token);
    if (!session) {
      sendJson(response, 401, { ok: false, error: "unauthorized" });
      return;
    }
    sendJson(response, 200, { user: publicUser(session.user) });
  } catch {
    sendJson(response, 500, { ok: false, error: "internal" });
  }
}

async function handleLogout(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const token = readBearerToken(request);
  if (!token) {
    sendJson(response, 401, { ok: false, error: "unauthorized" });
    return;
  }

  try {
    await deleteSession(token);
    sendJson(response, 200, { ok: true });
  } catch {
    sendJson(response, 500, { ok: false, error: "internal" });
  }
}

export async function handleAuth(
  request: IncomingMessage,
  response: ServerResponse,
  pathname: string,
): Promise<void> {
  if (request.method === "POST" && pathname === "/auth/register") {
    await handleRegister(request, response);
    return;
  }
  if (request.method === "POST" && pathname === "/auth/login") {
    await handleLogin(request, response);
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

  sendJson(response, 404, { ok: false, error: "not_found" });
}

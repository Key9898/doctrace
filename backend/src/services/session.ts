import { createHash, randomBytes } from "node:crypto";

import { prisma } from "../db.js";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("base64url");
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + SESSION_MS),
    },
  });
  return token;
}

export async function findValidSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }
  return session;
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { tokenHash: hashToken(token) },
  });
}

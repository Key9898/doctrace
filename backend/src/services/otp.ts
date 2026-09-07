import { timingSafeEqual } from "node:crypto";

import { prisma } from "../db.js";
import { isOtpMock } from "../config.js";
import { hashToken } from "./session.js";

export const MOCK_OTP_CODE = "123456";
export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_COOLDOWN_MS = 30 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

export type OtpIntent = "login" | "signup";

export function parseEmail(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const email = value.trim().toLowerCase();
  if (!email.includes("@") || !email.includes(".")) {
    return null;
  }
  return email;
}

export function parseIntent(value: unknown): OtpIntent | null {
  return value === "login" || value === "signup" ? value : null;
}

export function parseOtpCode(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const code = value.trim();
  if (!/^\d{6}$/.test(code)) {
    return null;
  }
  return code;
}

export function hashesMatch(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export function resolveOtpCode():
  | { ok: true; code: string; debugCode: string }
  | { ok: false; error: "otp_mail_not_live" } {
  if (!isOtpMock()) {
    return { ok: false, error: "otp_mail_not_live" };
  }
  return { ok: true, code: MOCK_OTP_CODE, debugCode: MOCK_OTP_CODE };
}

export async function createOtpChallenge(
  email: string,
  intent: OtpIntent,
  code: string,
): Promise<
  { ok: true; expiresAt: Date } | { ok: false; error: "otp_cooldown" }
> {
  const existing = await prisma.otpChallenge.findUnique({ where: { email } });
  if (existing && Date.now() - existing.createdAt.getTime() < OTP_COOLDOWN_MS) {
    return { ok: false, error: "otp_cooldown" };
  }

  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  await prisma.otpChallenge.upsert({
    where: { email },
    create: {
      email,
      intent,
      codeHash: hashToken(code),
      attempts: 0,
      expiresAt,
    },
    update: {
      intent,
      codeHash: hashToken(code),
      attempts: 0,
      expiresAt,
      createdAt: new Date(),
    },
  });
  return { ok: true, expiresAt };
}

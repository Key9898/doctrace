import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 32;
export const MIN_PASSWORD_LENGTH = 8;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt.toString("base64url")}.${derived.toString("base64url")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltPart, hashPart] = stored.split(".");
  if (!saltPart || !hashPart) {
    return false;
  }

  const salt = Buffer.from(saltPart, "base64url");
  const expected = Buffer.from(hashPart, "base64url");
  const derived = (await scryptAsync(
    password,
    salt,
    expected.length,
  )) as Buffer;
  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}

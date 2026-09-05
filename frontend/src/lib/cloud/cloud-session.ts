import type { CloudAuthUser } from "@/lib/cloud/cloud-auth";

export const CLOUD_SESSION_STORAGE_KEY = "doctrace.cloud.session";

export type CloudSession = {
  token: string;
  user: CloudAuthUser;
};

function isUser(value: unknown): value is CloudAuthUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "id" in value &&
    "email" in value &&
    typeof value.id === "string" &&
    typeof value.email === "string"
  );
}

function parseSession(raw: string | null): CloudSession | null {
  if (!raw) {
    return null;
  }
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) {
      return null;
    }
    if (!("token" in value) || !("user" in value)) {
      return null;
    }
    if (typeof value.token !== "string" || !isUser(value.user)) {
      return null;
    }
    return { token: value.token, user: value.user };
  } catch {
    return null;
  }
}

export function readCloudSession(): CloudSession | null {
  try {
    const raw = window.localStorage.getItem(CLOUD_SESSION_STORAGE_KEY);
    const session = parseSession(raw);
    if (raw && !session) {
      window.localStorage.removeItem(CLOUD_SESSION_STORAGE_KEY);
    }
    return session;
  } catch {
    return null;
  }
}

export function writeCloudSession(session: CloudSession): boolean {
  try {
    window.localStorage.setItem(
      CLOUD_SESSION_STORAGE_KEY,
      JSON.stringify({ token: session.token, user: session.user }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearCloudSession(): boolean {
  try {
    window.localStorage.removeItem(CLOUD_SESSION_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

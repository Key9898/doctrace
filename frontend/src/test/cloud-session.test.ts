import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CLOUD_SESSION_STORAGE_KEY,
  clearCloudSession,
  readCloudSession,
  writeCloudSession,
} from "@/lib/cloud/cloud-session";

const session = {
  token: "sess_1",
  user: { id: "user_1", email: "auditor@example.com" },
};

describe("cloud-session localStorage helper", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.removeItem(CLOUD_SESSION_STORAGE_KEY);
  });

  it("round-trips token and user and never stores a password", () => {
    expect(readCloudSession()).toBeNull();
    expect(writeCloudSession(session)).toBe(true);
    expect(readCloudSession()).toEqual(session);
    expect(window.localStorage.getItem(CLOUD_SESSION_STORAGE_KEY)).not.toMatch(
      /password/i,
    );
    expect(clearCloudSession()).toBe(true);
    expect(readCloudSession()).toBeNull();
  });

  it("clears invalid JSON and returns null when storage throws", () => {
    window.localStorage.setItem(CLOUD_SESSION_STORAGE_KEY, "{not-json");
    expect(readCloudSession()).toBeNull();
    expect(window.localStorage.getItem(CLOUD_SESSION_STORAGE_KEY)).toBeNull();

    window.localStorage.setItem(
      CLOUD_SESSION_STORAGE_KEY,
      JSON.stringify({ token: 1, user: session.user }),
    );
    expect(readCloudSession()).toBeNull();
    expect(window.localStorage.getItem(CLOUD_SESSION_STORAGE_KEY)).toBeNull();

    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    });

    expect(readCloudSession()).toBeNull();
    expect(writeCloudSession(session)).toBe(false);
    expect(clearCloudSession()).toBe(false);
  });
});

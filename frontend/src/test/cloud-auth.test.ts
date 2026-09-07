import { describe, expect, it, vi } from "vitest";

import {
  fetchCloudMe,
  logoutCloudUser,
  requestCloudOtp,
  verifyCloudOtp,
} from "@/lib/cloud/cloud-auth";

function jsonResponse(status: number, body: unknown): Response {
  return {
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

const user = { id: "user_1", email: "auditor@example.com" };
const loginRequest = { email: "auditor@example.com", intent: "login" as const };
const signupRequest = {
  email: "auditor@example.com",
  intent: "signup" as const,
};
const verifyPayload = { email: "auditor@example.com", code: "123456" };

describe("cloud-auth", () => {
  it("does not fetch when the URL is empty, whitespace, or undefined", async () => {
    const fetchImpl = vi.fn();

    await expect(
      requestCloudOtp(loginRequest, { url: "", fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      requestCloudOtp(signupRequest, { url: "   ", fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      verifyCloudOtp(verifyPayload, { url: "", fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      fetchCloudMe("token", { url: undefined, fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      logoutCloudUser("token", { url: "", fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("POSTs /auth/otp/request on a trimmed API URL and returns ok", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { ok: true, debugCode: "123456" }));

    await expect(
      requestCloudOtp(loginRequest, {
        url: "  http://127.0.0.1:3001  ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "ok" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe("http://127.0.0.1:3001/auth/otp/request");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(JSON.stringify(loginRequest));
  });

  it("POSTs /auth/otp/verify and returns ok on 200", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { token: "sess_1", user }));

    await expect(
      verifyCloudOtp(verifyPayload, {
        url: "http://127.0.0.1:3001/",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "ok", token: "sess_1", user });
    expect(fetchImpl.mock.calls[0][0]).toBe(
      "http://127.0.0.1:3001/auth/otp/verify",
    );
    expect(fetchImpl.mock.calls[0][1]?.body).toBe(
      JSON.stringify(verifyPayload),
    );
  });

  it("returns failed with the API error when request is rejected", async () => {
    await expect(
      requestCloudOtp(loginRequest, {
        url: "http://127.0.0.1:3001",
        fetchImpl: vi.fn().mockRejectedValue(new Error("network")),
      }),
    ).resolves.toEqual({ status: "failed" });

    await expect(
      requestCloudOtp(loginRequest, {
        url: "http://127.0.0.1:3001",
        fetchImpl: vi
          .fn()
          .mockResolvedValue(
            jsonResponse(404, { ok: false, error: "user_not_found" }),
          ),
      }),
    ).resolves.toEqual({ status: "failed", error: "user_not_found" });

    await expect(
      verifyCloudOtp(verifyPayload, {
        url: "http://127.0.0.1:3001",
        fetchImpl: vi
          .fn()
          .mockResolvedValue(
            jsonResponse(401, { ok: false, error: "unauthorized" }),
          ),
      }),
    ).resolves.toEqual({ status: "failed", error: "unauthorized" });

    const hangingFetch = vi.fn(
      (_input: string, init?: { signal?: AbortSignal }) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
    );
    await expect(
      requestCloudOtp(loginRequest, {
        url: "http://127.0.0.1:3001",
        fetchImpl: hangingFetch,
        timeoutMs: 20,
      }),
    ).resolves.toEqual({ status: "failed" });
  });

  it("GETs /auth/me and POSTs /auth/logout with a Bearer token", async () => {
    const meFetch = vi.fn().mockResolvedValue(jsonResponse(200, { user }));
    await expect(
      fetchCloudMe("sess_1", {
        url: "http://127.0.0.1:3001",
        fetchImpl: meFetch,
      }),
    ).resolves.toEqual({ status: "ok", user });
    expect(meFetch.mock.calls[0][0]).toBe("http://127.0.0.1:3001/auth/me");
    expect(meFetch.mock.calls[0][1]?.headers?.Authorization).toBe(
      "Bearer sess_1",
    );

    const logoutFetch = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { ok: true }));
    await expect(
      logoutCloudUser("sess_1", {
        url: "http://127.0.0.1:3001",
        fetchImpl: logoutFetch,
      }),
    ).resolves.toEqual({ status: "ok" });
    expect(logoutFetch.mock.calls[0][0]).toBe(
      "http://127.0.0.1:3001/auth/logout",
    );
    expect(logoutFetch.mock.calls[0][1]?.method).toBe("POST");
  });
});

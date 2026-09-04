import { describe, expect, it, vi } from "vitest";

import {
  fetchCloudMe,
  loginCloudUser,
  logoutCloudUser,
  registerCloudUser,
} from "@/lib/cloud/cloud-auth";

function jsonResponse(status: number, body: unknown): Response {
  return {
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

const credentials = { email: "auditor@example.com", password: "password1" };
const user = { id: "user_1", email: "auditor@example.com" };

describe("cloud-auth", () => {
  it("does not fetch when the URL is empty, whitespace, or undefined", async () => {
    const fetchImpl = vi.fn();

    await expect(
      loginCloudUser(credentials, { url: "", fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      registerCloudUser(credentials, { url: "   ", fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      fetchCloudMe("token", { url: undefined, fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      logoutCloudUser("token", { url: "", fetchImpl }),
    ).resolves.toEqual({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("POSTs /auth/login on a trimmed API URL and returns ok", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { token: "sess_1", user }));

    await expect(
      loginCloudUser(credentials, {
        url: "  http://127.0.0.1:3001  ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "ok", token: "sess_1", user });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe("http://127.0.0.1:3001/auth/login");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(JSON.stringify(credentials));
  });

  it("POSTs /auth/register and returns ok on 201", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(201, { token: "sess_1", user }));

    await expect(
      registerCloudUser(credentials, {
        url: "http://127.0.0.1:3001/",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "ok", token: "sess_1", user });
    expect(fetchImpl.mock.calls[0][0]).toBe(
      "http://127.0.0.1:3001/auth/register",
    );
  });

  it("returns failed when fetch throws, times out, or is unauthorized", async () => {
    await expect(
      loginCloudUser(credentials, {
        url: "http://127.0.0.1:3001",
        fetchImpl: vi.fn().mockRejectedValue(new Error("network")),
      }),
    ).resolves.toEqual({ status: "failed" });

    await expect(
      loginCloudUser(credentials, {
        url: "http://127.0.0.1:3001",
        fetchImpl: vi
          .fn()
          .mockResolvedValue(
            jsonResponse(401, { ok: false, error: "unauthorized" }),
          ),
      }),
    ).resolves.toEqual({ status: "failed" });

    const hangingFetch = vi.fn(
      (_input: string, init?: { signal?: AbortSignal }) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
    );
    await expect(
      loginCloudUser(credentials, {
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

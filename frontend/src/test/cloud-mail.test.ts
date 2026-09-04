import { describe, expect, it, vi } from "vitest";

import { requestCloudAccountNotice } from "@/lib/cloud/cloud-mail";

function jsonResponse(status: number, body: unknown): Response {
  return {
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("cloud-mail", () => {
  it("does not fetch when the URL is empty, whitespace, or undefined", async () => {
    const fetchImpl = vi.fn();

    await expect(
      requestCloudAccountNotice({
        token: "sess_1",
        url: "",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      requestCloudAccountNotice({
        token: "sess_1",
        url: "   ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      requestCloudAccountNotice({
        token: "sess_1",
        url: undefined,
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not fetch when the token is empty even if the URL is set", async () => {
    const fetchImpl = vi.fn();

    await expect(
      requestCloudAccountNotice({
        token: "",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      requestCloudAccountNotice({
        token: "   ",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("POSTs /mail/account-notice on a trimmed API URL and returns ok", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { ok: true }));

    await expect(
      requestCloudAccountNotice({
        token: "sess_1",
        url: "  http://127.0.0.1:3001  ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "ok" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe("http://127.0.0.1:3001/mail/account-notice");
    expect(init?.method).toBe("POST");
    expect(init?.headers?.Authorization).toBe("Bearer sess_1");
    expect(init).not.toHaveProperty("body");
  });

  it("returns failed on 401, 503, throw, or timeout", async () => {
    await expect(
      requestCloudAccountNotice({
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl: vi
          .fn()
          .mockResolvedValue(
            jsonResponse(401, { ok: false, error: "unauthorized" }),
          ),
      }),
    ).resolves.toEqual({ status: "failed" });

    await expect(
      requestCloudAccountNotice({
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl: vi
          .fn()
          .mockResolvedValue(
            jsonResponse(503, { ok: false, error: "brevo_unconfigured" }),
          ),
      }),
    ).resolves.toEqual({ status: "failed" });

    await expect(
      requestCloudAccountNotice({
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl: vi.fn().mockRejectedValue(new Error("network")),
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
      requestCloudAccountNotice({
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl: hangingFetch,
        timeoutMs: 20,
      }),
    ).resolves.toEqual({ status: "failed" });
  });
});

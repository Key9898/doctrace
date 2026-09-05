import { describe, expect, it, vi } from "vitest";

import {
  backupCloudEvidence,
  restoreCloudEvidence,
} from "@/lib/cloud/cloud-evidence";

const sha256 = "a".repeat(64);
const bytes = new Uint8Array([1, 2, 3]);
const key = `evidence/${sha256}`;

function jsonResponse(status: number, body: unknown): Response {
  return {
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("cloud-evidence", () => {
  it("does not fetch when the URL is empty, whitespace, or undefined", async () => {
    const fetchImpl = vi.fn();

    await expect(
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
        token: "sess_1",
        url: "",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
        token: "sess_1",
        url: "   ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
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
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
        token: "",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
        token: "   ",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("PUTs /evidence/{sha} on a trimmed API URL and returns ok", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { ok: true, key }));

    await expect(
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
        token: "sess_1",
        url: "  http://127.0.0.1:3001  ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "ok", key });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe(`http://127.0.0.1:3001/evidence/${sha256}`);
    expect(init?.method).toBe("PUT");
    expect(init?.headers?.Authorization).toBe("Bearer sess_1");
    expect(init?.headers?.["Content-Type"]).toBe("application/pdf");
    expect(init?.body).toBe(bytes);
  });

  it("returns failed on 401, 503, throw, or timeout", async () => {
    await expect(
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
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
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl: vi
          .fn()
          .mockResolvedValue(
            jsonResponse(503, { ok: false, error: "r2_unconfigured" }),
          ),
      }),
    ).resolves.toEqual({ status: "failed" });

    await expect(
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
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
      backupCloudEvidence({
        contentSha256: sha256,
        bytes,
        mimeType: "application/pdf",
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl: hangingFetch,
        timeoutMs: 20,
      }),
    ).resolves.toEqual({ status: "failed" });
  });
});

describe("restoreCloudEvidence", () => {
  it("does not fetch when the URL, token, or hash is empty", async () => {
    const fetchImpl = vi.fn();

    await expect(
      restoreCloudEvidence({
        contentSha256: sha256,
        token: "sess_1",
        url: "",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      restoreCloudEvidence({
        contentSha256: sha256,
        token: "",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      restoreCloudEvidence({
        contentSha256: "   ",
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("GETs /evidence/{sha} and returns failed on 503", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(503, { ok: false, error: "restore_not_live" }),
      );

    await expect(
      restoreCloudEvidence({
        contentSha256: sha256,
        token: "sess_1",
        url: "  http://127.0.0.1:3001  ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "failed" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe(`http://127.0.0.1:3001/evidence/${sha256}`);
    expect(init?.method).toBe("GET");
    expect(init?.headers?.Authorization).toBe("Bearer sess_1");
    expect(init?.body).toBeUndefined();
  });
});

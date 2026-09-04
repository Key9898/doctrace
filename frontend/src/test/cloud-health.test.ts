import { describe, expect, it, vi } from "vitest";

import { probeCloudHealth } from "@/lib/cloud/cloud-health";

function jsonResponse(status: number, body: unknown): Response {
  return {
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("probeCloudHealth", () => {
  it("does not fetch when the URL is empty, whitespace, or undefined", async () => {
    const fetchImpl = vi.fn();

    await expect(probeCloudHealth({ url: "", fetchImpl })).resolves.toBe(
      "skipped",
    );
    await expect(probeCloudHealth({ url: "   ", fetchImpl })).resolves.toBe(
      "skipped",
    );
    await expect(probeCloudHealth({ url: undefined, fetchImpl })).resolves.toBe(
      "skipped",
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("GETs /health on a trimmed API URL and returns ok", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { ok: true }));

    await expect(
      probeCloudHealth({
        url: "  http://127.0.0.1:3001  ",
        fetchImpl,
      }),
    ).resolves.toBe("ok");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe("http://127.0.0.1:3001/health");
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("strips a trailing slash before appending /health", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { ok: true }));

    await probeCloudHealth({
      url: "http://127.0.0.1:3001/",
      fetchImpl,
    });
    expect(fetchImpl.mock.calls[0][0]).toBe("http://127.0.0.1:3001/health");
  });

  it("returns failed when fetch throws", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("network"));

    await expect(
      probeCloudHealth({
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toBe("failed");
  });

  it("returns failed on non-200 or invalid JSON body", async () => {
    await expect(
      probeCloudHealth({
        url: "http://127.0.0.1:3001",
        fetchImpl: vi.fn().mockResolvedValue(jsonResponse(404, { ok: true })),
      }),
    ).resolves.toBe("failed");
    await expect(
      probeCloudHealth({
        url: "http://127.0.0.1:3001",
        fetchImpl: vi.fn().mockResolvedValue(jsonResponse(200, { ok: false })),
      }),
    ).resolves.toBe("failed");
    await expect(
      probeCloudHealth({
        url: "http://127.0.0.1:3001",
        fetchImpl: vi.fn().mockResolvedValue(jsonResponse(200, null)),
      }),
    ).resolves.toBe("failed");
  });

  it("returns failed when the request times out", async () => {
    const fetchImpl = vi.fn(
      (_input: string, init?: { signal?: AbortSignal }) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
    );

    await expect(
      probeCloudHealth({
        url: "http://127.0.0.1:3001",
        fetchImpl,
        timeoutMs: 20,
      }),
    ).resolves.toBe("failed");
  });
});

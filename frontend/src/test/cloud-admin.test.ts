import { describe, expect, it, vi } from "vitest";

import { fetchAdminDeploy, fetchAdminRoster } from "@/lib/cloud/cloud-admin";

function jsonResponse(status: number, body: unknown): Response {
  return {
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("cloud-admin", () => {
  it("does not fetch when the URL is empty, whitespace, or undefined", async () => {
    const fetchImpl = vi.fn();

    await expect(
      fetchAdminRoster({
        token: "sess_1",
        url: "",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      fetchAdminDeploy({
        token: "sess_1",
        url: "   ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      fetchAdminRoster({
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
      fetchAdminRoster({
        token: "",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      fetchAdminDeploy({
        token: "   ",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("GETs /admin/roster and maps 503 admin_not_live", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(503, { ok: false, error: "admin_not_live" }),
      );

    await expect(
      fetchAdminRoster({
        token: "sess_1",
        url: "  http://127.0.0.1:3001  ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "not_live" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe("http://127.0.0.1:3001/admin/roster");
    expect(init?.method).toBe("GET");
    expect(init?.headers?.Authorization).toBe("Bearer sess_1");
    expect(init?.body).toBeUndefined();
  });

  it("GETs /admin/deploy and maps 503 admin_not_live", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(503, { ok: false, error: "admin_not_live" }),
      );

    await expect(
      fetchAdminDeploy({
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "not_live" });
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe("http://127.0.0.1:3001/admin/deploy");
    expect(init?.method).toBe("GET");
    expect(init?.body).toBeUndefined();
  });
});

import { describe, expect, it, vi } from "vitest";

import {
  pullCloudTemplates,
  pushCloudTemplates,
} from "@/lib/cloud/cloud-templates";
import type { MatchTemplate } from "@/types/domain";

const templates: MatchTemplate[] = [
  {
    id: "tpl_1",
    name: "AP",
    createdAt: "2026-09-07T00:00:00.000Z",
    updatedAt: "2026-09-07T00:00:00.000Z",
    config: {
      amountTolerance: 0.01,
      dateToleranceDays: 3,
      requireInvoiceNumber: true,
      fuzzyReferenceMatch: false,
      outputFields: [],
      outputColumnMap: {},
      scoreWeights: { invoiceNumber: 60, amount: 25, date: 15 },
    },
  },
];

function jsonResponse(status: number, body: unknown): Response {
  return {
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("cloud-templates", () => {
  it("does not fetch when the URL is empty, whitespace, or undefined", async () => {
    const fetchImpl = vi.fn();

    await expect(
      pushCloudTemplates({
        templates,
        token: "sess_1",
        url: "",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      pullCloudTemplates({
        token: "sess_1",
        url: "   ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      pushCloudTemplates({
        templates,
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
      pushCloudTemplates({
        templates,
        token: "",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    await expect(
      pullCloudTemplates({
        token: "   ",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("PUTs /templates and maps 503 templates_not_live", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(503, { ok: false, error: "templates_not_live" }),
      );

    await expect(
      pushCloudTemplates({
        templates,
        token: "sess_1",
        url: "  http://127.0.0.1:3001  ",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "not_live" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe("http://127.0.0.1:3001/templates");
    expect(init?.method).toBe("PUT");
    expect(init?.headers?.Authorization).toBe("Bearer sess_1");
    expect(JSON.parse(init?.body ?? "{}")).toEqual({
      version: 1,
      templates,
    });
  });

  it("GETs /templates and maps 503 templates_not_live without a library payload", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(503, { ok: false, error: "templates_not_live" }),
      );

    await expect(
      pullCloudTemplates({
        token: "sess_1",
        url: "http://127.0.0.1:3001",
        fetchImpl,
      }),
    ).resolves.toEqual({ status: "not_live" });
    const [requestUrl, init] = fetchImpl.mock.calls[0];
    expect(requestUrl).toBe("http://127.0.0.1:3001/templates");
    expect(init?.method).toBe("GET");
    expect(init?.body).toBeUndefined();
  });
});

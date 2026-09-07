import { getCloudApiUrl, isCloudEnabled } from "@/lib/cloud/cloud-config";
import type { MatchTemplate } from "@/types/domain";

export type CloudTemplatesStatus = "skipped" | "ok" | "failed" | "not_live";

export type CloudTemplatesResult = {
  status: CloudTemplatesStatus;
};

const DEFAULT_TIMEOUT_MS = 10_000;

type FetchLike = (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  },
) => Promise<Response>;

function resolveBaseUrl(url?: string): string | null {
  const resolved = url ?? import.meta.env.VITE_API_URL;
  if (!isCloudEnabled(resolved)) {
    return null;
  }
  return getCloudApiUrl(resolved);
}

function isTemplatesNotLive(status: number, body: unknown): boolean {
  if (status !== 503 || typeof body !== "object" || body === null) {
    return false;
  }
  return "error" in body && body.error === "templates_not_live";
}

export type PushCloudTemplatesInput = {
  templates: MatchTemplate[];
  token: string;
  url?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
};

export async function pushCloudTemplates(
  input: PushCloudTemplatesInput,
): Promise<CloudTemplatesResult> {
  const baseUrl = resolveBaseUrl(input.url);
  if (!baseUrl || !input.token.trim()) {
    return { status: "skipped" };
  }

  const controller = new AbortController();
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const fetchImpl: FetchLike =
      input.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
    const response = await fetchImpl(
      `${baseUrl.replace(/\/$/, "")}/templates`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${input.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ version: 1, templates: input.templates }),
        signal: controller.signal,
      },
    );
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    if (isTemplatesNotLive(response.status, body)) {
      return { status: "not_live" };
    }
    if (
      response.status !== 200 ||
      typeof body !== "object" ||
      body === null ||
      !("ok" in body) ||
      body.ok !== true
    ) {
      return { status: "failed" };
    }
    return { status: "ok" };
  } catch {
    return { status: "failed" };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export type PullCloudTemplatesInput = {
  token: string;
  url?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
};

export async function pullCloudTemplates(
  input: PullCloudTemplatesInput,
): Promise<CloudTemplatesResult> {
  const baseUrl = resolveBaseUrl(input.url);
  if (!baseUrl || !input.token.trim()) {
    return { status: "skipped" };
  }

  const controller = new AbortController();
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const fetchImpl: FetchLike =
      input.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
    const response = await fetchImpl(
      `${baseUrl.replace(/\/$/, "")}/templates`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.token}`,
        },
        signal: controller.signal,
      },
    );
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    if (isTemplatesNotLive(response.status, body)) {
      return { status: "not_live" };
    }
    if (
      response.status !== 200 ||
      typeof body !== "object" ||
      body === null ||
      !("ok" in body) ||
      body.ok !== true
    ) {
      return { status: "failed" };
    }
    return { status: "ok" };
  } catch {
    return { status: "failed" };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

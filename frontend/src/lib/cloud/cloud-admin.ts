import { getCloudApiUrl, isCloudEnabled } from "@/lib/cloud/cloud-config";

export type CloudAdminStatus = "skipped" | "ok" | "failed" | "not_live";

export type CloudAdminResult = {
  status: CloudAdminStatus;
};

export type CloudAdminKind = "roster" | "deploy";

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

function isAdminNotLive(status: number, body: unknown): boolean {
  if (status !== 503 || typeof body !== "object" || body === null) {
    return false;
  }
  return "error" in body && body.error === "admin_not_live";
}

export type FetchCloudAdminInput = {
  token: string;
  url?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
};

async function fetchCloudAdmin(
  kind: CloudAdminKind,
  input: FetchCloudAdminInput,
): Promise<CloudAdminResult> {
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
      `${baseUrl.replace(/\/$/, "")}/admin/${kind}`,
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
    if (isAdminNotLive(response.status, body)) {
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

export async function fetchAdminRoster(
  input: FetchCloudAdminInput,
): Promise<CloudAdminResult> {
  return fetchCloudAdmin("roster", input);
}

export async function fetchAdminDeploy(
  input: FetchCloudAdminInput,
): Promise<CloudAdminResult> {
  return fetchCloudAdmin("deploy", input);
}

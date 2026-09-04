import { getCloudApiUrl, isCloudEnabled } from "@/lib/cloud/cloud-config";

export type CloudMailStatus = "skipped" | "ok" | "failed";

export type CloudMailResult = {
  status: CloudMailStatus;
};

const DEFAULT_TIMEOUT_MS = 10_000;

type FetchLike = (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  },
) => Promise<Response>;

export type RequestCloudAccountNoticeInput = {
  token: string;
  url?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
};

function resolveBaseUrl(url?: string): string | null {
  const resolved = url ?? import.meta.env.VITE_API_URL;
  if (!isCloudEnabled(resolved)) {
    return null;
  }
  return getCloudApiUrl(resolved);
}

export async function requestCloudAccountNotice(
  input: RequestCloudAccountNoticeInput,
): Promise<CloudMailResult> {
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
      `${baseUrl.replace(/\/$/, "")}/mail/account-notice`,
      {
        method: "POST",
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

import { getCloudApiUrl, isCloudEnabled } from "@/lib/cloud/cloud-config";

export type CloudHealthResult = "skipped" | "ok" | "failed";

const DEFAULT_TIMEOUT_MS = 2000;

type FetchLike = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<Response>;

export async function probeCloudHealth(options?: {
  url?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  signal?: AbortSignal;
}): Promise<CloudHealthResult> {
  const url = options?.url ?? import.meta.env.VITE_API_URL;
  if (!isCloudEnabled(url)) {
    return "skipped";
  }

  const baseUrl = getCloudApiUrl(url);
  if (!baseUrl) {
    return "skipped";
  }

  const controller = new AbortController();
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => {
    controller.abort();
  };
  const externalSignal = options?.signal;
  if (externalSignal) {
    if (externalSignal.aborted) {
      globalThis.clearTimeout(timeoutId);
      return "failed";
    }
    externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  try {
    const fetchImpl = options?.fetchImpl ?? globalThis.fetch;
    const response = await fetchImpl(`${baseUrl.replace(/\/$/, "")}/health`, {
      signal: controller.signal,
    });
    if (response.status !== 200) {
      return "failed";
    }

    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "ok" in body &&
      (body as { ok: unknown }).ok === true
    ) {
      return "ok";
    }

    return "failed";
  } catch {
    return "failed";
  } finally {
    globalThis.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}

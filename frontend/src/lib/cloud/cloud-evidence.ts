import { getCloudApiUrl, isCloudEnabled } from "@/lib/cloud/cloud-config";

export type CloudEvidenceStatus = "skipped" | "ok" | "failed";

export type CloudEvidenceResult = {
  status: CloudEvidenceStatus;
  key?: string;
};

const DEFAULT_BACKUP_TIMEOUT_MS = 60_000;
const DEFAULT_RESTORE_TIMEOUT_MS = 10_000;

type FetchLike = (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: ArrayBuffer | Uint8Array;
    signal?: AbortSignal;
  },
) => Promise<Response>;

export type BackupCloudEvidenceInput = {
  contentSha256: string;
  bytes: ArrayBuffer | Uint8Array;
  mimeType: string;
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

export async function backupCloudEvidence(
  input: BackupCloudEvidenceInput,
): Promise<CloudEvidenceResult> {
  const baseUrl = resolveBaseUrl(input.url);
  if (!baseUrl || !input.token.trim()) {
    return { status: "skipped" };
  }

  const controller = new AbortController();
  const timeoutMs = input.timeoutMs ?? DEFAULT_BACKUP_TIMEOUT_MS;
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const fetchImpl: FetchLike =
      input.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
    const response = await fetchImpl(
      `${baseUrl.replace(/\/$/, "")}/evidence/${input.contentSha256}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${input.token}`,
          "Content-Type": input.mimeType || "application/octet-stream",
        },
        body: input.bytes,
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
      body.ok !== true ||
      !("key" in body) ||
      typeof body.key !== "string"
    ) {
      return { status: "failed" };
    }
    return { status: "ok", key: body.key };
  } catch {
    return { status: "failed" };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export type RestoreCloudEvidenceInput = {
  contentSha256: string;
  token: string;
  url?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
};

export async function restoreCloudEvidence(
  input: RestoreCloudEvidenceInput,
): Promise<CloudEvidenceResult> {
  const baseUrl = resolveBaseUrl(input.url);
  if (!baseUrl || !input.token.trim() || !input.contentSha256.trim()) {
    return { status: "skipped" };
  }

  const controller = new AbortController();
  const timeoutMs = input.timeoutMs ?? DEFAULT_RESTORE_TIMEOUT_MS;
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const fetchImpl: FetchLike =
      input.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
    const response = await fetchImpl(
      `${baseUrl.replace(/\/$/, "")}/evidence/${input.contentSha256}`,
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
    if (
      response.status !== 200 ||
      typeof body !== "object" ||
      body === null ||
      !("ok" in body) ||
      body.ok !== true
    ) {
      return { status: "failed" };
    }
    const key =
      "key" in body && typeof body.key === "string" ? body.key : undefined;
    return { status: "ok", key };
  } catch {
    return { status: "failed" };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

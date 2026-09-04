import { getCloudApiUrl, isCloudEnabled } from "@/lib/cloud/cloud-config";

export type CloudAuthStatus = "skipped" | "ok" | "failed";

export type CloudAuthUser = {
  id: string;
  email: string;
};

export type CloudAuthResult = {
  status: CloudAuthStatus;
  token?: string;
  user?: CloudAuthUser;
};

const DEFAULT_TIMEOUT_MS = 2000;

type FetchLike = (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  },
) => Promise<Response>;

type CloudAuthOptions = {
  url?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  signal?: AbortSignal;
};

function resolveBaseUrl(url?: string): string | null {
  const resolved = url ?? import.meta.env.VITE_API_URL;
  if (!isCloudEnabled(resolved)) {
    return null;
  }
  return getCloudApiUrl(resolved);
}

function isUser(value: unknown): value is CloudAuthUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "id" in value &&
    "email" in value &&
    typeof value.id === "string" &&
    typeof value.email === "string"
  );
}

async function requestJson(
  path: string,
  init: {
    method: string;
    body?: unknown;
    token?: string;
  },
  options?: CloudAuthOptions,
): Promise<{ status: number; body: unknown } | { failed: true }> {
  const baseUrl = resolveBaseUrl(options?.url);
  if (!baseUrl) {
    return { failed: true };
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
      return { failed: true };
    }
    externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  try {
    const headers: Record<string, string> = {};
    if (init.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (init.token) {
      headers.Authorization = `Bearer ${init.token}`;
    }
    const fetchImpl = options?.fetchImpl ?? globalThis.fetch;
    const response = await fetchImpl(`${baseUrl.replace(/\/$/, "")}${path}`, {
      method: init.method,
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: controller.signal,
    });
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    return { status: response.status, body };
  } catch {
    return { failed: true };
  } finally {
    globalThis.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}

function skipped(): CloudAuthResult {
  return { status: "skipped" };
}

function failed(): CloudAuthResult {
  return { status: "failed" };
}

function tokenUserResult(
  expectedStatus: number,
  payload: { status: number; body: unknown } | { failed: true },
): CloudAuthResult {
  if ("failed" in payload) {
    return failed();
  }
  if (payload.status !== expectedStatus || typeof payload.body !== "object") {
    return failed();
  }
  const body = payload.body;
  if (body === null || !("token" in body) || !("user" in body)) {
    return failed();
  }
  if (typeof body.token !== "string" || !isUser(body.user)) {
    return failed();
  }
  return { status: "ok", token: body.token, user: body.user };
}

export async function registerCloudUser(
  credentials: { email: string; password: string },
  options?: CloudAuthOptions,
): Promise<CloudAuthResult> {
  if (!resolveBaseUrl(options?.url)) {
    return skipped();
  }
  const payload = await requestJson(
    "/auth/register",
    { method: "POST", body: credentials },
    options,
  );
  return tokenUserResult(201, payload);
}

export async function loginCloudUser(
  credentials: { email: string; password: string },
  options?: CloudAuthOptions,
): Promise<CloudAuthResult> {
  if (!resolveBaseUrl(options?.url)) {
    return skipped();
  }
  const payload = await requestJson(
    "/auth/login",
    { method: "POST", body: credentials },
    options,
  );
  return tokenUserResult(200, payload);
}

export async function fetchCloudMe(
  token: string,
  options?: CloudAuthOptions,
): Promise<CloudAuthResult> {
  if (!resolveBaseUrl(options?.url)) {
    return skipped();
  }
  const payload = await requestJson(
    "/auth/me",
    { method: "GET", token },
    options,
  );
  if ("failed" in payload) {
    return failed();
  }
  if (payload.status !== 200 || typeof payload.body !== "object") {
    return failed();
  }
  const body = payload.body;
  if (body === null || !("user" in body) || !isUser(body.user)) {
    return failed();
  }
  return { status: "ok", user: body.user };
}

export async function logoutCloudUser(
  token: string,
  options?: CloudAuthOptions,
): Promise<CloudAuthResult> {
  if (!resolveBaseUrl(options?.url)) {
    return skipped();
  }
  const payload = await requestJson(
    "/auth/logout",
    { method: "POST", token },
    options,
  );
  if ("failed" in payload) {
    return failed();
  }
  if (payload.status !== 200) {
    return failed();
  }
  return { status: "ok" };
}

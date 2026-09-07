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

export type CloudOtpIntent = "login" | "signup";

export type CloudOtpRequestResult = CloudAuthResult & {
  error?: string;
};

function skipped(): CloudAuthResult {
  return { status: "skipped" };
}

function failed(error?: string): CloudOtpRequestResult {
  return error ? { status: "failed", error } : { status: "failed" };
}

function readError(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }
  if (!("error" in body) || typeof body.error !== "string") {
    return undefined;
  }
  return body.error;
}

function tokenUserResult(
  expectedStatus: number,
  payload: { status: number; body: unknown } | { failed: true },
): CloudOtpRequestResult {
  if ("failed" in payload) {
    return failed();
  }
  if (payload.status !== expectedStatus || typeof payload.body !== "object") {
    return failed(readError(payload.body));
  }
  const body = payload.body;
  if (body === null || !("token" in body) || !("user" in body)) {
    return failed(readError(body));
  }
  if (typeof body.token !== "string" || !isUser(body.user)) {
    return failed();
  }
  return { status: "ok", token: body.token, user: body.user };
}

export async function requestCloudOtp(
  payload: { email: string; intent: CloudOtpIntent },
  options?: CloudAuthOptions,
): Promise<CloudOtpRequestResult> {
  if (!resolveBaseUrl(options?.url)) {
    return skipped();
  }
  const response = await requestJson(
    "/auth/otp/request",
    { method: "POST", body: payload },
    options,
  );
  if ("failed" in response) {
    return failed();
  }
  if (response.status === 200) {
    return { status: "ok" };
  }
  return failed(readError(response.body));
}

export async function verifyCloudOtp(
  payload: { email: string; code: string },
  options?: CloudAuthOptions,
): Promise<CloudOtpRequestResult> {
  if (!resolveBaseUrl(options?.url)) {
    return skipped();
  }
  const response = await requestJson(
    "/auth/otp/verify",
    { method: "POST", body: payload },
    options,
  );
  return tokenUserResult(200, response);
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

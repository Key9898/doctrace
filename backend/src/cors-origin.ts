const DEFAULT_ORIGIN = "https://127.0.0.1:3000";

export function parseCorsOrigins(value: string | undefined): string[] {
  const parts = (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part !== "*");
  return parts.length > 0 ? parts : [DEFAULT_ORIGIN];
}

export function resolveCorsOrigin(
  requestOrigin: string | null | undefined,
  allowlist: string[],
): string | null {
  if (!requestOrigin || requestOrigin === "*") {
    return null;
  }
  return allowlist.includes(requestOrigin) ? requestOrigin : null;
}

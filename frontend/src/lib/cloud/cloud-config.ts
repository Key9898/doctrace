export function isCloudEnabled(
  url: string | undefined = import.meta.env.VITE_API_URL,
): boolean {
  return Boolean(url?.trim());
}

export function getCloudApiUrl(
  url: string | undefined = import.meta.env.VITE_API_URL,
): string | null {
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

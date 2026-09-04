function clampNonNegative(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

export function resolveAmountTolerance(
  glAmount: number | undefined,
  absolute: number | undefined,
  percent: number | undefined,
): number {
  const abs = clampNonNegative(absolute);
  const pct = clampNonNegative(percent);
  const relative =
    typeof glAmount === "number" && Number.isFinite(glAmount)
      ? Math.abs(glAmount) * (pct / 100)
      : 0;

  return Math.max(abs, relative);
}

export function isAmountWithinTolerance(
  delta: number,
  glAmount: number | undefined,
  absolute: number | undefined,
  percent: number | undefined,
): boolean {
  if (!Number.isFinite(delta)) {
    return false;
  }

  return delta <= resolveAmountTolerance(glAmount, absolute, percent);
}

import type { ExcelPrimitive, MatchStatus } from "@/types/domain";
import { getActiveLocaleConfig } from "@/i18n/locales";
import { translate } from "@/i18n/translations";

const EMPTY_VALUE = "--";

export function formatNumber(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return EMPTY_VALUE;
  }

  const { numberLocale } = getActiveLocaleConfig();

  return new Intl.NumberFormat(numberLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrency(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return EMPTY_VALUE;
  }

  const { currency, numberLocale } = getActiveLocaleConfig();

  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value?: string | null) {
  if (!value) {
    return EMPTY_VALUE;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const { dateLocale } = getActiveLocaleConfig();

  return new Intl.DateTimeFormat(dateLocale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function formatRelativeCount(
  count: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function formatCellValue(value: ExcelPrimitive) {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  if (typeof value === "number") {
    return formatNumber(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

export function statusLabel(status: MatchStatus) {
  const { id } = getActiveLocaleConfig();

  switch (status) {
    case "matched":
      return translate(id, "status.matched");
    case "partial":
      return translate(id, "status.partial");
    case "exception":
      return translate(id, "status.exception");
  }
}

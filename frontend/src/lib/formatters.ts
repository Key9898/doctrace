import type { ExcelPrimitive, MatchStatus } from "@/types/domain";
import { getActiveLocaleConfig } from "@/lib/i18n/locales";
import { getReportingConfig } from "@/lib/i18n/reporting";
import { translate } from "@/lib/i18n/translations";

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

export function formatCurrency(
  value?: number | null,
  currencyOverride?: string,
) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return EMPTY_VALUE;
  }

  const { numberLocale } = getActiveLocaleConfig();
  const currency = currencyOverride ?? getReportingConfig().currency;

  try {
    return new Intl.NumberFormat(numberLocale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${formatNumber(value)} ${currency}`;
  }
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

function isKnownExplanationSuffix(suffix: string): boolean {
  if (suffix === "invoice number required" || suffix === "no field match") {
    return true;
  }

  return suffix.includes("amount ±") || suffix.includes("date ±");
}

function peelKnownSuffix(text: string): {
  body: string;
  suffix: string | null;
} {
  const match = /^(.*) \(([^)]+)\)$/.exec(text);
  if (!match || !isKnownExplanationSuffix(match[2])) {
    return { body: text, suffix: null };
  }

  return { body: match[1], suffix: match[2] };
}

function mapExplanationSuffix(suffix: string): string {
  if (suffix === "invoice number required") {
    return "ပြေစာနံပါတ် လိုအပ်သည်";
  }

  if (suffix === "no field match") {
    return "ကွက်လပ် တိုက်ဆိုင်မှု မရှိပါ";
  }

  return suffix
    .split(", ")
    .map((bit) => {
      const amount = /^amount ±(.+)$/.exec(bit);
      if (amount) {
        return `ပမာဏ ±${amount[1]}`;
      }

      const date = /^date ±(.+)$/.exec(bit);
      if (date) {
        return `ရက်စွဲ ±${date[1]}`;
      }

      return bit;
    })
    .join("၊ ");
}

function withMappedSuffix(mapped: string, suffix: string | null): string {
  return suffix ? `${mapped} (${mapExplanationSuffix(suffix)})` : mapped;
}

export function formatExplanation(explanation: string, locale: string): string {
  if (locale !== "my-MM" || !explanation) {
    return explanation;
  }

  const parts = explanation.split("; ");
  if (parts.length !== 2) {
    return explanation;
  }

  let part1 = parts[0];
  let part2 = parts[1];

  const invoicePeeled = peelKnownSuffix(part1);
  if (invoicePeeled.body === "No strong invoice match") {
    part1 = withMappedSuffix("ကိုက်ညီသည့် ပြေစာ မရှိပါ", invoicePeeled.suffix);
  } else if (invoicePeeled.body.startsWith("Invoice matched by ")) {
    const fieldsStr = invoicePeeled.body.substring(
      "Invoice matched by ".length,
    );
    const fields = fieldsStr.split(", ").map((f) => {
      const field = f.trim();
      if (field === "invoice number") return "ပြေစာနံပါတ်";
      if (field === "invoice number (fuzzy)")
        return "ပြေစာနံပါတ် (အနီးစပ်ဆုံး)";
      if (field === "amount") return "ပမာဏ";
      if (field === "date") return "ရက်စွဲ";
      return field;
    });
    part1 = withMappedSuffix(
      `ပြေစာပါ ${fields.join("၊ ")} ဖြင့် တိုက်ဆိုင်ကိုက်ညီမှုရှိသည်`,
      invoicePeeled.suffix,
    );
  }

  const bankPeeled = peelKnownSuffix(part2);
  if (bankPeeled.body === "bank statement evidence identified") {
    part2 = withMappedSuffix(
      "ဘဏ်ရှင်းတမ်း သက်သေခံချက် တွေ့ရှိရသည်",
      bankPeeled.suffix,
    );
  } else if (bankPeeled.body === "no bank statement hit") {
    part2 = withMappedSuffix(
      "ဘဏ်ရှင်းတမ်း တိုက်ဆိုင်မှု မရှိပါ",
      bankPeeled.suffix,
    );
  }

  return `${part1}; ${part2}`;
}

export type OcrLanguage = "mya+eng" | "eng";

export interface ReportingConfig {
  currency: string;
  ocrLanguage: OcrLanguage;
}

export const DEFAULT_REPORTING_CURRENCY = "MMK";
export const DEFAULT_OCR_LANGUAGE: OcrLanguage = "mya+eng";

export const REPORTING_CURRENCY_PRESETS = [
  "MMK",
  "USD",
  "EUR",
  "GBP",
  "SGD",
  "THB",
  "JPY",
  "CNY",
  "AUD",
  "INR",
] as const;

export type ReportingCurrencyPreset =
  (typeof REPORTING_CURRENCY_PRESETS)[number];

const DEFAULT_REPORTING: ReportingConfig = {
  currency: DEFAULT_REPORTING_CURRENCY,
  ocrLanguage: DEFAULT_OCR_LANGUAGE,
};

let activeReporting: ReportingConfig = { ...DEFAULT_REPORTING };

export function getReportingConfig(): ReportingConfig {
  return { ...activeReporting };
}

export function setReportingConfig(patch: Partial<ReportingConfig>) {
  activeReporting = {
    currency: patch.currency
      ? resolveCurrency(patch.currency)
      : activeReporting.currency,
    ocrLanguage: patch.ocrLanguage
      ? resolveOcrLanguage(patch.ocrLanguage)
      : activeReporting.ocrLanguage,
  };
}

export function resetReportingConfig() {
  activeReporting = { ...DEFAULT_REPORTING };
}

export function isValidIsoCurrency(code: string): boolean {
  if (!/^[A-Z]{3}$/.test(code)) {
    return false;
  }

  try {
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(1);
    return true;
  } catch {
    return false;
  }
}

export function isPresetCurrency(code: string): boolean {
  return (REPORTING_CURRENCY_PRESETS as readonly string[]).includes(code);
}

export function resolveCurrency(value?: string | null): string {
  const normalized = value?.trim().toUpperCase() ?? "";
  if (isValidIsoCurrency(normalized)) {
    return normalized;
  }
  return DEFAULT_REPORTING_CURRENCY;
}

export function resolveOcrLanguage(value?: string | null): OcrLanguage {
  return value === "eng" ? "eng" : DEFAULT_OCR_LANGUAGE;
}

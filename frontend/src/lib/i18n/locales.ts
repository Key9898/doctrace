export type AppLocale = "my-MM" | "en-US";

export interface LocaleConfig {
  id: AppLocale;
  label: string;
  englishLabel: string;
  numberLocale: string;
  dateLocale: string;
  currency: string;
  ocrLanguage: string;
  direction: "ltr" | "rtl";
}

export const DEFAULT_LOCALE: AppLocale = "my-MM";

export const LOCALE_CONFIGS: Record<AppLocale, LocaleConfig> = {
  "my-MM": {
    id: "my-MM",
    label: "မြန်မာ",
    englishLabel: "Myanmar",
    numberLocale: "my-MM",
    dateLocale: "my-MM",
    currency: "MMK",
    ocrLanguage: "mya+eng",
    direction: "ltr",
  },
  "en-US": {
    id: "en-US",
    label: "English",
    englishLabel: "English",
    numberLocale: "en-US",
    dateLocale: "en-US",
    currency: "USD",
    ocrLanguage: "eng",
    direction: "ltr",
  },
};

export const LOCALE_OPTIONS = Object.values(LOCALE_CONFIGS);

export function resolveSupportedLocale(value?: string | null): AppLocale {
  const normalized = value?.toLowerCase();

  if (!normalized) {
    return DEFAULT_LOCALE;
  }

  if (normalized.startsWith("my") || normalized.startsWith("mm")) {
    return "my-MM";
  }

  if (normalized.startsWith("en")) {
    return "en-US";
  }

  return DEFAULT_LOCALE;
}

let activeLocale: AppLocale = DEFAULT_LOCALE;

export function setActiveLocale(locale: AppLocale) {
  activeLocale = resolveSupportedLocale(locale);
}

export function getActiveLocale() {
  return activeLocale;
}

export function getActiveLocaleConfig() {
  return LOCALE_CONFIGS[activeLocale];
}

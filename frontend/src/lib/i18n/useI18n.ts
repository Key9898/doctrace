import { useDocTraceStore } from "@/stores/app-store";
import { LOCALE_CONFIGS } from "@/lib/i18n/locales";
import { translate, type TranslationKey } from "@/lib/i18n/translations";

export function useI18n() {
  const locale = useDocTraceStore((state) => state.locale);

  return {
    locale,
    localeConfig: LOCALE_CONFIGS[locale],
    t: (key: TranslationKey) => translate(locale, key),
  };
}

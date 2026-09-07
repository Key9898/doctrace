import type { TranslationKey } from "@/lib/i18n/translations";
import type { AppModule } from "@/types/domain";

export const CORE_APP_MODULES: AppModule[] = ["engagements", "matching"];

export const PREP_APP_MODULES: AppModule[] = [
  "trial-balance",
  "workpapers",
  "client-portal",
];

export function isPrepModulesEnabled(
  flag: string | undefined = import.meta.env.VITE_SHOW_PREP_MODULES,
): boolean {
  return Boolean(flag?.trim());
}

export function visibleAppModules(
  flag: string | undefined = import.meta.env.VITE_SHOW_PREP_MODULES,
): AppModule[] {
  return isPrepModulesEnabled(flag)
    ? [...CORE_APP_MODULES, ...PREP_APP_MODULES]
    : [...CORE_APP_MODULES];
}

export function isVisibleAppModule(
  module: AppModule,
  flag: string | undefined = import.meta.env.VITE_SHOW_PREP_MODULES,
): boolean {
  return visibleAppModules(flag).includes(module);
}

export function navTranslationKey(module: AppModule): TranslationKey {
  switch (module) {
    case "matching":
      return "nav.matching";
    case "engagements":
      return "nav.engagements";
    case "trial-balance":
      return "nav.trialBalance";
    case "workpapers":
      return "nav.workpapers";
    case "client-portal":
      return "nav.clientPortal";
  }
}

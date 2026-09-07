const LEGACY_THEME_KEY = "doctrace-theme";
const EXCEL_THEME_KEY = "doctrace-theme-excel";
const PREVIEW_THEME_KEY = "doctrace-theme-preview";

export type Theme = "light" | "dark" | "system";

type ThemeHostKind = "unknown" | "excel" | "preview";

let hostKind: ThemeHostKind = "unknown";

function isThemeValue(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function isExcelHostName(host: unknown): boolean {
  if (host === undefined || host === null) {
    return false;
  }
  const office = typeof window !== "undefined" ? window.Office : undefined;
  if (office?.HostType && host === office.HostType.Excel) {
    return true;
  }
  return String(host).toLowerCase() === "excel";
}

export function isExcelTaskPane(info?: { host?: unknown }): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (isExcelHostName(info?.host)) {
    return true;
  }
  const context = window.Office?.context as
    | { document?: unknown; host?: unknown; platform?: unknown }
    | undefined;
  if (!context) {
    return false;
  }
  if (context.document) {
    return true;
  }
  return isExcelHostName(context.host);
}

export function showPreviewWebsiteLink(officeReady: boolean): boolean {
  return officeReady && !isExcelTaskPane();
}

function storageKey(): string {
  if (hostKind === "preview") {
    return PREVIEW_THEME_KEY;
  }
  if (hostKind === "excel") {
    return EXCEL_THEME_KEY;
  }
  if (typeof window !== "undefined" && typeof window.Office !== "undefined") {
    return EXCEL_THEME_KEY;
  }
  return PREVIEW_THEME_KEY;
}

function defaultThemeForKey(key: string): Theme {
  return key === EXCEL_THEME_KEY ? "dark" : "light";
}

function migrateLegacyExcelTheme(): void {
  if (typeof window === "undefined") {
    return;
  }
  if (localStorage.getItem(EXCEL_THEME_KEY)) {
    return;
  }
  const legacy = localStorage.getItem(LEGACY_THEME_KEY);
  if (isThemeValue(legacy)) {
    localStorage.setItem(EXCEL_THEME_KEY, legacy);
  }
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }
  const key = storageKey();
  if (key === EXCEL_THEME_KEY) {
    migrateLegacyExcelTheme();
  }
  const stored = localStorage.getItem(key);
  return isThemeValue(stored) ? stored : defaultThemeForKey(key);
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") {
    return;
  }
  const key = storageKey();
  if (key === EXCEL_THEME_KEY) {
    migrateLegacyExcelTheme();
  }
  localStorage.setItem(key, theme);
}

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const effectiveTheme = theme === "system" ? getSystemTheme() : theme;

  if (effectiveTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function initializeTheme(): Theme {
  hostKind = "unknown";
  const stored = getStoredTheme();
  applyTheme(stored);
  return stored;
}

export function syncThemeAfterOfficeReady(info?: { host?: unknown }): Theme {
  hostKind = isExcelTaskPane(info) ? "excel" : "preview";
  const stored = getStoredTheme();
  applyTheme(stored);
  return stored;
}

export function resetThemeHostForTests(): void {
  hostKind = "unknown";
}

export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const systemTheme = getSystemTheme();
  const effectiveCurrent = current === "system" ? systemTheme : current;

  const next = effectiveCurrent === "dark" ? "light" : "dark";
  setStoredTheme(next);
  applyTheme(next);
  return next;
}

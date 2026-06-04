const THEME_KEY = "doctrace-theme";

export type Theme = "light" | "dark" | "system";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY) as Theme;
  return stored || "dark";
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
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
  const stored = getStoredTheme();
  applyTheme(stored);
  return stored;
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

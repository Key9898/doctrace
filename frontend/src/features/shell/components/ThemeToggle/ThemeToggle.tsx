import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getStoredTheme,
  getSystemTheme,
  setStoredTheme,
  applyTheme,
  type Theme,
} from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  const toggleTheme = () => {
    const effectiveTheme = theme === "system" ? getSystemTheme() : theme;
    const next: Theme = effectiveTheme === "light" ? "dark" : "light";
    setTheme(next);
    setStoredTheme(next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <button
        className="dt-button-ghost"
        type="button"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }

  const effectiveTheme = theme === "system" ? getSystemTheme() : theme;
  const label = `Current theme: ${theme}${theme === "system" ? ` (${effectiveTheme})` : ""}`;

  return (
    <button
      className="dt-button-ghost"
      onClick={toggleTheme}
      type="button"
      aria-label={label}
      title={label}
    >
      {effectiveTheme === "dark" ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}

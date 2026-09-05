import { copy, SITE_LANG_KEY, type CopyKey, type SiteLocale } from "./copy";

function readLocale(): SiteLocale {
  try {
    const stored = localStorage.getItem(SITE_LANG_KEY);
    if (stored === "en" || stored === "my") {
      return stored;
    }
  } catch {
    /* private mode */
  }
  return "my";
}

function writeLocale(locale: SiteLocale): void {
  try {
    localStorage.setItem(SITE_LANG_KEY, locale);
  } catch {
    /* private mode */
  }
}

function apply(locale: SiteLocale): void {
  const strings = copy[locale];
  document.documentElement.lang = locale === "my" ? "my" : "en";
  document.documentElement.dataset.locale = locale;

  const page = document.body.dataset.page;
  if (page === "landing") {
    document.title = strings.landingTitle;
  } else if (page === "support") {
    document.title = strings.supportTitle;
  } else if (page === "privacy") {
    document.title = strings.privacyTitle;
  } else if (page === "terms") {
    document.title = strings.termsTitle;
  }

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n as CopyKey | undefined;
    if (!key || !(key in strings)) {
      return;
    }
    el.textContent = strings[key];
  });

  document
    .querySelectorAll<HTMLButtonElement>("[data-locale-set]")
    .forEach((btn) => {
      const value = btn.dataset.localeSet;
      const pressed = value === locale;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    });
}

const initial = readLocale();
apply(initial);

document
  .querySelectorAll<HTMLButtonElement>("[data-locale-set]")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.localeSet;
      if (next !== "en" && next !== "my") {
        return;
      }
      writeLocale(next);
      apply(next);
    });
  });

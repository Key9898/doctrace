import {
  logoutCloudUser,
  requestCloudOtp,
  verifyCloudOtp,
} from "@/lib/cloud/cloud-auth";
import { isCloudEnabled } from "@/lib/cloud/cloud-config";
import {
  clearCloudSession,
  readCloudSession,
  writeCloudSession,
} from "@/lib/cloud/cloud-session";

import { copy, SITE_LANG_KEY, type CopyKey, type SiteLocale } from "./copy";

const OTP_CHALLENGE_KEY = "doctrace.site.otp";

type OtpIntent = "login" | "signup";

type StoredOtpChallenge = {
  email: string;
  intent: OtpIntent;
};

function readLocale(): SiteLocale {
  try {
    const stored = localStorage.getItem(SITE_LANG_KEY);
    if (stored === "en" || stored === "my") {
      return stored;
    }
  } catch {
    /* private mode */
  }
  return "en";
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
  } else if (page === "sign-in") {
    document.title = strings.authSignInTitle;
  } else if (page === "sign-up") {
    document.title = strings.authSignUpTitle;
  } else if (page === "auth-code") {
    document.title = strings.authCodeTitle;
  } else if (page === "guide") {
    document.title = strings.guideTitle;
  } else if (page === "faq") {
    document.title = strings.faqTitle;
  } else if (page === "contact") {
    document.title = strings.contactTitle;
  }

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n as CopyKey | undefined;
    if (!key || !(key in strings)) {
      return;
    }
    el.textContent = strings[key];
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt") as CopyKey | null;
    if (!key || !(key in strings) || !(el instanceof HTMLImageElement)) {
      return;
    }
    el.alt = strings[key];
  });

  document
    .querySelectorAll<HTMLElement>('[data-i18n="langSwitch"]')
    .forEach((el) => {
      el.lang = locale === "en" ? "my" : "en";
    });

  document.querySelectorAll("[data-locale-toggle]").forEach((el) => {
    if (el instanceof HTMLButtonElement) {
      el.setAttribute("aria-label", strings.langSwitchAria);
    }
  });
}

function readChallenge(): StoredOtpChallenge | null {
  try {
    const raw = sessionStorage.getItem(OTP_CHALLENGE_KEY);
    if (!raw) {
      return null;
    }
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) {
      return null;
    }
    if (!("email" in value) || !("intent" in value)) {
      return null;
    }
    if (typeof value.email !== "string") {
      return null;
    }
    if (value.intent !== "login" && value.intent !== "signup") {
      return null;
    }
    return { email: value.email, intent: value.intent };
  } catch {
    return null;
  }
}

function writeChallenge(challenge: StoredOtpChallenge): void {
  try {
    sessionStorage.setItem(OTP_CHALLENGE_KEY, JSON.stringify(challenge));
  } catch {
    /* private mode */
  }
}

function clearChallenge(): void {
  try {
    sessionStorage.removeItem(OTP_CHALLENGE_KEY);
  } catch {
    /* private mode */
  }
}

function setAuthStatus(key: CopyKey | null): void {
  const el = document.querySelector("[data-auth-status]");
  if (!(el instanceof HTMLElement)) {
    return;
  }
  el.textContent = key ? copy[readLocale()][key] : "";
}

function statusFromError(error?: string): CopyKey {
  if (error === "user_not_found") {
    return "authUserNotFound";
  }
  if (error === "email_taken") {
    return "authEmailTaken";
  }
  if (error === "otp_cooldown") {
    return "authCooldown";
  }
  if (error === "otp_mail_not_live") {
    return "authNotLive";
  }
  if (
    error === "unauthorized" ||
    error === "otp_expired" ||
    error === "otp_locked"
  ) {
    return "authInvalidCode";
  }
  return "authFailed";
}

function bindCloudVisibility(): void {
  const cloudOn = isCloudEnabled();
  document.querySelectorAll("[data-auth-off]").forEach((el) => {
    el.classList.toggle("hidden", cloudOn);
  });
  document.querySelectorAll("[data-auth-on]").forEach((el) => {
    el.classList.toggle("hidden", !cloudOn);
  });
}

function bindRequestForm(): void {
  const form = document.querySelector<HTMLFormElement>(
    '[data-otp-form="request"]',
  );
  if (!form) {
    return;
  }
  const intentRaw = form.dataset.otpIntent;
  const intent: OtpIntent = intentRaw === "signup" ? "signup" : "login";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isCloudEnabled()) {
      setAuthStatus("authCloudOff");
      return;
    }
    const data = new FormData(form);
    const emailRaw = data.get("email");
    const email =
      typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
    if (!email.includes("@") || !email.includes(".")) {
      setAuthStatus("authInvalidEmail");
      return;
    }
    const submit = form.querySelector("button[type='submit']");
    if (submit instanceof HTMLButtonElement) {
      submit.disabled = true;
    }
    setAuthStatus(null);
    void requestCloudOtp({ email, intent }).then((result) => {
      if (submit instanceof HTMLButtonElement) {
        submit.disabled = false;
      }
      if (result.status === "ok") {
        writeChallenge({ email, intent });
        window.location.href = "/auth-code.html";
        return;
      }
      if (result.status === "skipped") {
        setAuthStatus("authCloudOff");
        return;
      }
      setAuthStatus(statusFromError(result.error));
    });
  });
}

function setChromeMenuOpen(
  toggle: HTMLButtonElement,
  menu: HTMLElement,
  open: boolean,
): void {
  menu.classList.toggle("hidden", !open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
}

function closeProfileMenu(): void {
  const toggle = document.querySelector("[data-profile-toggle]");
  const menu = document.querySelector("[data-profile-menu]");
  if (toggle instanceof HTMLButtonElement && menu instanceof HTMLElement) {
    setChromeMenuOpen(toggle, menu, false);
  }
}

function closeMoreMenu(): void {
  const toggle = document.querySelector("[data-more-toggle]");
  const menu = document.querySelector("[data-more-menu]");
  if (toggle instanceof HTMLButtonElement && menu instanceof HTMLElement) {
    setChromeMenuOpen(toggle, menu, false);
  }
}

function bindProfile(): void {
  const root = document.querySelector("[data-profile]");
  if (!(root instanceof HTMLElement)) {
    return;
  }
  const toggle = root.querySelector("[data-profile-toggle]");
  const menu = root.querySelector("[data-profile-menu]");
  const guest = root.querySelector("[data-profile-guest]");
  const sessionBlock = root.querySelector("[data-profile-session]");
  const emailEl = root.querySelector("[data-profile-email]");
  const signOut = root.querySelector("[data-profile-signout]");
  if (
    !(toggle instanceof HTMLButtonElement) ||
    !(menu instanceof HTMLElement) ||
    !(guest instanceof HTMLElement) ||
    !(sessionBlock instanceof HTMLElement)
  ) {
    return;
  }

  const setOpen = (open: boolean) => {
    if (open) {
      closeMoreMenu();
    }
    setChromeMenuOpen(toggle, menu, open);
  };

  const syncSession = () => {
    const session = readCloudSession();
    const signedIn = Boolean(session);
    guest.classList.toggle("hidden", signedIn);
    sessionBlock.classList.toggle("hidden", !signedIn);
    if (emailEl instanceof HTMLElement) {
      emailEl.textContent = session?.user.email ?? "";
    }
  };

  syncSession();

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(menu.classList.contains("hidden"));
  });

  document.addEventListener("pointerdown", (event) => {
    if (!root.contains(event.target as Node)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  if (signOut instanceof HTMLButtonElement) {
    signOut.addEventListener("click", () => {
      const session = readCloudSession();
      setOpen(false);
      const finish = () => {
        clearCloudSession();
        syncSession();
      };
      if (!session?.token) {
        finish();
        return;
      }
      void logoutCloudUser(session.token).finally(finish);
    });
  }
}

function bindMore(): void {
  const root = document.querySelector("[data-more]");
  if (!(root instanceof HTMLElement)) {
    return;
  }
  const toggle = root.querySelector("[data-more-toggle]");
  const menu = root.querySelector("[data-more-menu]");
  if (
    !(toggle instanceof HTMLButtonElement) ||
    !(menu instanceof HTMLElement)
  ) {
    return;
  }

  const setOpen = (open: boolean) => {
    if (open) {
      closeProfileMenu();
    }
    setChromeMenuOpen(toggle, menu, open);
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(menu.classList.contains("hidden"));
  });

  document.addEventListener("pointerdown", (event) => {
    if (!root.contains(event.target as Node)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
}

function bindVerifyForm(): void {
  const form = document.querySelector<HTMLFormElement>(
    '[data-otp-form="verify"]',
  );
  if (!form) {
    return;
  }
  const challenge = readChallenge();
  const emailEl = document.querySelector("[data-otp-email]");
  if (!challenge) {
    window.location.replace("/sign-in.html");
    return;
  }
  if (emailEl) {
    emailEl.textContent = challenge.email;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isCloudEnabled()) {
      setAuthStatus("authCloudOff");
      return;
    }
    const data = new FormData(form);
    const codeRaw = data.get("code");
    const code = typeof codeRaw === "string" ? codeRaw.trim() : "";
    if (!/^\d{6}$/.test(code)) {
      setAuthStatus("authInvalidCode");
      return;
    }
    const submit = form.querySelector("button[type='submit']");
    if (submit instanceof HTMLButtonElement) {
      submit.disabled = true;
    }
    setAuthStatus(null);
    void verifyCloudOtp({ email: challenge.email, code }).then((result) => {
      if (submit instanceof HTMLButtonElement) {
        submit.disabled = false;
      }
      if (result.status === "ok" && result.token && result.user) {
        writeCloudSession({ token: result.token, user: result.user });
        clearChallenge();
        window.location.href = "/";
        return;
      }
      if (result.status === "skipped") {
        setAuthStatus("authCloudOff");
        return;
      }
      setAuthStatus(statusFromError(result.error));
    });
  });
}

function bindStuckHeader(): void {
  const sentinel = document.querySelector("[data-header-sentinel]");
  const header = document.querySelector("header");
  if (!(sentinel instanceof HTMLElement) || !(header instanceof HTMLElement)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry) {
      return;
    }
    if (entry.isIntersecting) {
      header.removeAttribute("data-stuck");
      return;
    }
    header.setAttribute("data-stuck", "");
  });
  observer.observe(sentinel);
}

function bindFooterYear(): void {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-footer-year]").forEach((el) => {
    if (el instanceof HTMLElement) {
      el.textContent = year;
    }
  });
}

function bindFaqAccordion(): void {
  if (document.body.dataset.page !== "faq") {
    return;
  }

  const openFromHash = (): void => {
    const id = window.location.hash.replace(/^#/, "");
    if (!/^faq-(?:[1-9]|1[0-2])$/.test(id)) {
      return;
    }
    const el = document.getElementById(id);
    if (el instanceof HTMLDetailsElement) {
      el.open = true;
    }
  };

  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  document.querySelectorAll("details[id^='faq-']").forEach((node) => {
    node.addEventListener("toggle", () => {
      if (!(node instanceof HTMLDetailsElement)) {
        return;
      }
      if (node.open) {
        history.replaceState(null, "", `#${node.id}`);
        return;
      }
      if (window.location.hash === `#${node.id}`) {
        history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }
    });
  });
}

function bindContactForm(): void {
  if (document.body.dataset.page !== "contact") {
    return;
  }
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-status]");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (status instanceof HTMLElement) {
      status.classList.remove("hidden");
      status.removeAttribute("aria-hidden");
    }
  });
}

const initial = readLocale();
apply(initial);
bindFooterYear();
bindStuckHeader();
bindCloudVisibility();
bindProfile();
bindMore();
bindRequestForm();
bindVerifyForm();
bindContactForm();
bindFaqAccordion();

document.querySelectorAll("[data-locale-toggle]").forEach((el) => {
  el.addEventListener("click", () => {
    const next: SiteLocale = readLocale() === "en" ? "my" : "en";
    writeLocale(next);
    apply(next);
  });
});

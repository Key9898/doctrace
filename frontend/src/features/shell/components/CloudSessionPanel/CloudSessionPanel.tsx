import {
  CircleUser,
  CloudDownload,
  CloudUpload,
  Mail,
  ShieldOff,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { hashSha256 } from "@/features/documents/services/evidence-normalize.service";
import { loadEvidence } from "@/features/office/services/workbook-evidence.service";
import {
  fetchCloudMe,
  loginCloudUser,
  logoutCloudUser,
  registerCloudUser,
} from "@/lib/cloud/cloud-auth";
import { pickBackupDocument } from "@/lib/cloud/cloud-backup-pick";
import { isCloudEnabled } from "@/lib/cloud/cloud-config";
import {
  backupCloudEvidence,
  restoreCloudEvidence,
} from "@/lib/cloud/cloud-evidence";
import { requestCloudAccountNotice } from "@/lib/cloud/cloud-mail";
import {
  clearCloudSession,
  readCloudSession,
  writeCloudSession,
  type CloudSession,
} from "@/lib/cloud/cloud-session";
import type { AppLocale } from "@/lib/i18n/locales";
import { translate, type TranslationKey } from "@/lib/i18n/translations";
import { loadBlob } from "@/lib/persistence/indexeddb.service";
import { useDocTraceStore } from "@/stores/app-store";

const MIN_PASSWORD_LENGTH = 8;
const MAX_BACKUP_BYTES = 20 * 1024 * 1024;

type CloudSessionPanelProps = {
  locale: AppLocale;
};

type StatusCopy =
  | "failed"
  | "skipped"
  | "invalid"
  | "backupOk"
  | "mailOk"
  | "backupFailed"
  | "mailFailed"
  | "restoreOk"
  | "restoreFailed"
  | "noEvidence"
  | null;

const STATUS_KEYS: Record<Exclude<StatusCopy, null>, TranslationKey> = {
  failed: "cloud.failed",
  skipped: "cloud.skipped",
  invalid: "cloud.invalid",
  backupOk: "cloud.backupOk",
  mailOk: "cloud.mailOk",
  backupFailed: "cloud.backupFailed",
  mailFailed: "cloud.mailFailed",
  restoreOk: "cloud.restoreOk",
  restoreFailed: "cloud.restoreFailed",
  noEvidence: "cloud.noEvidence",
};

async function loadBackupBytes(
  documentId: string,
  contentSha256?: string,
): Promise<{ data: ArrayBuffer; mimeType: string } | undefined> {
  if (contentSha256) {
    const hashed = await loadBlob(contentSha256);
    if (hashed) {
      return hashed;
    }
  }
  const byId = await loadBlob(documentId);
  if (byId) {
    return byId;
  }
  if (!contentSha256) {
    return undefined;
  }
  try {
    const workbook = await loadEvidence(contentSha256);
    if (!workbook) {
      return undefined;
    }
    return { data: workbook.bytes, mimeType: workbook.mimeType };
  } catch {
    return undefined;
  }
}

export function CloudSessionPanel({ locale }: CloudSessionPanelProps) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const documents = useDocTraceStore((state) => state.documents);
  const viewerDocumentId = useDocTraceStore((state) => state.viewer.documentId);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<StatusCopy>(null);
  const [session, setSession] = useState<CloudSession | null>(() =>
    isCloudEnabled() ? readCloudSession() : null,
  );

  useEffect(() => {
    if (!isCloudEnabled()) {
      return;
    }
    const stored = readCloudSession();
    if (!stored) {
      return;
    }
    const abortController = new AbortController();
    void fetchCloudMe(stored.token, { signal: abortController.signal }).then(
      (result) => {
        if (abortController.signal.aborted) {
          return;
        }
        if (result.status === "ok" && result.user) {
          const next = { token: stored.token, user: result.user };
          writeCloudSession(next);
          setSession(next);
          return;
        }
        if (result.status === "failed") {
          clearCloudSession();
          setSession(null);
        }
      },
    );
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (!isCloudEnabled()) {
    return null;
  }

  const submit = async (mode: "login" | "register") => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.length < MIN_PASSWORD_LENGTH) {
      setMessage("invalid");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const result =
        mode === "login"
          ? await loginCloudUser({ email: trimmedEmail, password })
          : await registerCloudUser({ email: trimmedEmail, password });
      if (result.status === "ok" && result.token && result.user) {
        const next = { token: result.token, user: result.user };
        writeCloudSession(next);
        setSession(next);
        setPassword("");
        setMessage(null);
        return;
      }
      setMessage(result.status === "skipped" ? "skipped" : "failed");
    } catch {
      setMessage("failed");
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    setBusy(true);
    try {
      if (session?.token) {
        await logoutCloudUser(session.token);
      }
    } catch {
      setMessage("failed");
    } finally {
      clearCloudSession();
      setSession(null);
      setPassword("");
      setBusy(false);
    }
  };

  const onBackup = async () => {
    if (!session?.token) {
      setMessage("failed");
      return;
    }
    const picked = pickBackupDocument(documents, viewerDocumentId);
    if (!picked) {
      setMessage("noEvidence");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const stored = await loadBackupBytes(picked.id, picked.contentSha256);
      if (!stored || stored.data.byteLength > MAX_BACKUP_BYTES) {
        setMessage("noEvidence");
        return;
      }
      const contentSha256 = await hashSha256(stored.data);
      const result = await backupCloudEvidence({
        contentSha256,
        bytes: stored.data,
        mimeType: stored.mimeType || picked.mimeType,
        token: session.token,
      });
      if (result.status === "ok") {
        setMessage("backupOk");
        return;
      }
      setMessage(result.status === "skipped" ? "skipped" : "backupFailed");
    } catch {
      setMessage("backupFailed");
    } finally {
      setBusy(false);
    }
  };

  const onMail = async () => {
    if (!session?.token) {
      setMessage("failed");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const result = await requestCloudAccountNotice({ token: session.token });
      if (result.status === "ok") {
        setMessage("mailOk");
        return;
      }
      setMessage(result.status === "skipped" ? "skipped" : "mailFailed");
    } catch {
      setMessage("mailFailed");
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    if (!session?.token) {
      setMessage("failed");
      return;
    }
    const picked = pickBackupDocument(documents, viewerDocumentId);
    if (!picked?.contentSha256) {
      setMessage("noEvidence");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const result = await restoreCloudEvidence({
        contentSha256: picked.contentSha256,
        token: session.token,
      });
      if (result.status === "ok") {
        setMessage("restoreOk");
        return;
      }
      setMessage(result.status === "skipped" ? "skipped" : "restoreFailed");
    } catch {
      setMessage("restoreFailed");
    } finally {
      setBusy(false);
    }
  };

  const statusKey = message ? STATUS_KEYS[message] : null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={t("cloud.session")}
        className="dt-button-ghost"
        disabled={busy}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <CircleUser aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">{t("cloud.session")}</span>
      </button>
      {open ? (
        <div
          className="absolute top-full right-0 z-20 mt-1 w-56 rounded-lg border border-white/80 bg-white/95 p-2 shadow-md dark:border-white/10 dark:bg-slate-900/95"
          id={panelId}
        >
          {session ? (
            <div className="flex flex-col gap-2">
              <p className="truncate text-[0.65rem] font-semibold text-slate-700 dark:text-slate-200">
                <span className="sr-only">{t("cloud.signedIn")} </span>
                {session.user.email}
              </p>
              <p className="text-[0.62rem] leading-4 font-semibold text-slate-600 dark:text-slate-300">
                {t("cloud.firmRole")}: {t("cloud.firmRoleLocal")}.{" "}
                {t("cloud.firmAccessNotLive")}
              </p>
              <p className="inline-flex items-start gap-1 text-[0.62rem] leading-4 font-semibold text-slate-600 dark:text-slate-300">
                <ShieldOff
                  aria-hidden="true"
                  className="mt-0.5 h-3 w-3 shrink-0"
                />
                <span>
                  {t("cloud.mfa")}: {t("cloud.mfaNotLive")}
                </span>
              </p>
              <div className="flex flex-wrap gap-1">
                <button
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                  disabled={busy}
                  onClick={() => {
                    void onBackup();
                  }}
                  type="button"
                >
                  <CloudUpload aria-hidden="true" className="h-3 w-3" />
                  {t("cloud.backup")}
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                  disabled={busy}
                  onClick={() => {
                    void onMail();
                  }}
                  type="button"
                >
                  <Mail aria-hidden="true" className="h-3 w-3" />
                  {t("cloud.mail")}
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                  disabled={busy}
                  onClick={() => {
                    void onRestore();
                  }}
                  type="button"
                >
                  <CloudDownload aria-hidden="true" className="h-3 w-3" />
                  {t("cloud.restore")}
                </button>
              </div>
              <button
                className="rounded-md bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                disabled={busy}
                onClick={() => {
                  void onLogout();
                }}
                type="button"
              >
                {t("cloud.logout")}
              </button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void submit("login");
              }}
            >
              <label className="grid gap-1 text-[0.58rem] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {t("cloud.email")}
                <input
                  autoComplete="username"
                  className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:border-white/10 dark:bg-slate-800/60 dark:text-white"
                  disabled={busy}
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                />
              </label>
              <label className="grid gap-1 text-[0.58rem] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {t("cloud.password")}
                <input
                  autoComplete="current-password"
                  className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 dark:border-white/10 dark:bg-slate-800/60 dark:text-white"
                  disabled={busy}
                  minLength={MIN_PASSWORD_LENGTH}
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  value={password}
                />
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  className="rounded-md bg-sky-600 px-2 py-1 text-[0.65rem] font-bold text-white hover:bg-sky-500 disabled:opacity-50"
                  disabled={busy}
                  type="submit"
                >
                  {t("cloud.login")}
                </button>
                <button
                  className="rounded-md bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                  disabled={busy}
                  onClick={() => {
                    void submit("register");
                  }}
                  type="button"
                >
                  {t("cloud.register")}
                </button>
              </div>
            </form>
          )}
          {statusKey ? (
            <p
              className="mt-2 text-[0.62rem] leading-4 font-semibold text-slate-600 dark:text-slate-300"
              role="status"
            >
              {t(statusKey)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

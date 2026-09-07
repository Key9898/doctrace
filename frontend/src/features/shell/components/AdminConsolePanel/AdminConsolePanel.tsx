import { Server, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchAdminDeploy, fetchAdminRoster } from "@/lib/cloud/cloud-admin";
import { isCloudEnabled } from "@/lib/cloud/cloud-config";
import {
  CLOUD_SESSION_EVENT,
  readCloudSession,
  type CloudSession,
} from "@/lib/cloud/cloud-session";
import type { AppLocale } from "@/lib/i18n/locales";
import { translate, type TranslationKey } from "@/lib/i18n/translations";

type AdminConsolePanelProps = {
  locale: AppLocale;
  hidden?: boolean;
};

type StatusCopy = "skipped" | "adminNotLive" | "adminFailed" | null;

const STATUS_KEYS: Record<Exclude<StatusCopy, null>, TranslationKey> = {
  skipped: "cloud.skipped",
  adminNotLive: "cloud.adminNotLive",
  adminFailed: "cloud.adminFailed",
};

export function AdminConsolePanel({ locale, hidden }: AdminConsolePanelProps) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const [session, setSession] = useState<CloudSession | null>(() =>
    isCloudEnabled() ? readCloudSession() : null,
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<StatusCopy>(null);

  useEffect(() => {
    if (!isCloudEnabled()) {
      return;
    }
    const onChange = () => {
      setSession(readCloudSession());
    };
    window.addEventListener(CLOUD_SESSION_EVENT, onChange);
    return () => {
      window.removeEventListener(CLOUD_SESSION_EVENT, onChange);
    };
  }, []);

  if (!isCloudEnabled() || hidden || !session) {
    return null;
  }

  const probe = async (kind: "roster" | "deploy") => {
    setBusy(true);
    setMessage(null);
    try {
      const result =
        kind === "roster"
          ? await fetchAdminRoster({ token: session.token })
          : await fetchAdminDeploy({ token: session.token });
      if (result.status === "skipped") {
        setMessage("skipped");
        return;
      }
      if (result.status === "not_live") {
        setMessage("adminNotLive");
        return;
      }
      setMessage("adminFailed");
    } catch {
      setMessage("adminFailed");
    } finally {
      setBusy(false);
    }
  };

  const statusKey = message ? STATUS_KEYS[message] : null;

  return (
    <details>
      <summary className="cursor-pointer list-none rounded-lg border border-white/80 bg-white/50 px-3 py-2 text-xs font-bold text-slate-800 marker:content-none dark:border-white/5 dark:bg-slate-900/40 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 truncate">{t("cloud.admin")}</span>
      </summary>
      <div className="mt-2 flex flex-col gap-2 rounded-lg border border-white/80 bg-white/50 p-2 dark:border-white/5 dark:bg-slate-900/40">
        <p className="text-[0.62rem] leading-4 font-semibold text-slate-600 dark:text-slate-300">
          {t("cloud.adminNotLive")}
        </p>
        <div className="flex flex-wrap gap-1">
          <button
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            disabled={busy}
            onClick={() => {
              void probe("roster");
            }}
            type="button"
          >
            <Users aria-hidden="true" className="h-3 w-3" />
            {t("cloud.adminRoster")}
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[0.65rem] font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            disabled={busy}
            onClick={() => {
              void probe("deploy");
            }}
            type="button"
          >
            <Server aria-hidden="true" className="h-3 w-3" />
            {t("cloud.adminDeploy")}
          </button>
        </div>
        {statusKey ? (
          <p
            className="text-[0.62rem] leading-4 font-semibold text-slate-600 dark:text-slate-300"
            role="status"
          >
            {t(statusKey)}
          </p>
        ) : null}
      </div>
    </details>
  );
}

import { AlertTriangle, CheckCircle2, Clock3, Info } from "lucide-react";

import type { ActivityEvent } from "@/types/domain";
import { useI18n } from "@/hooks/useI18n";

interface ActivityPanelProps {
  activityFeed: ActivityEvent[];
  busyMessage?: string;
}

export function ActivityPanel({
  activityFeed,
  busyMessage,
}: ActivityPanelProps) {
  const { t } = useI18n();
  return (
    <section className="dt-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="dt-kicker">{t("activity.kicker")}</p>
          <h2 className="dt-section-title">{t("activity.title")}</h2>
          <p className="mt-1 text-xs text-slate-500">{t("activity.desc")}</p>
        </div>
        <span className="dt-badge dt-badge-neutral">
          {activityFeed.length} {t("activity.events")}
        </span>
      </div>

      {busyMessage ? (
        <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-900">
          {busyMessage}
        </div>
      ) : null}

      {activityFeed.length ? (
        <div className="mt-4 grid gap-3">
          {activityFeed.map((activity) => (
            <article
              className="rounded-2xl border border-slate-200/60 bg-white/40 px-4 py-3 shadow-sm transition-all hover:border-white hover:bg-white/80 dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10 dark:hover:bg-white/10"
              key={activity.id}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {activity.tone === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : activity.tone === "error" ? (
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                  ) : (
                    <Info className="h-4 w-4 text-sky-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {activity.title}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium tracking-[0.12em] text-slate-400 uppercase">
                      <Clock3 className="h-3 w-3" />
                      {formatEventTime(activity.createdAt, t)}
                    </span>
                  </div>
                  {activity.description ? (
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {activity.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="dt-empty-state mt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
            <Clock3 className="h-6 w-6 text-slate-400" />
          </div>
          <p className="max-w-[240px]">{t("activity.emptyState")}</p>
        </div>
      )}
    </section>
  );
}

function formatEventTime(value: string, t: (key: any) => string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return t("activity.justNow");
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

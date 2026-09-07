import { CheckCircle, FolderLock, PenTool, Send } from "lucide-react";
import { useState, useMemo } from "react";

import { pbcMinutesDemoLinks } from "@/features/pbc-portal/services/pbc-minutes";
import {
  canSignTodWorkpaperFile,
  hasFollowUpOpen,
  unsignedOpenRows,
} from "@/features/workpapers/services/wp-signoff";
import { statusLabel } from "@/lib/formatters";
import { useI18n } from "@/lib/i18n/useI18n";
import { useDocTraceStore } from "@/stores/app-store";
import type { PbcMinutesLink } from "@/types/domain";

interface WorkpaperItem {
  reference: string;
  name: string;
  preparer: string;
  reviewer: string;
  status: "Not Started" | "In Progress" | "Ready for Review" | "Approved";
  progress: number;
}

interface ReviewNote {
  id: string;
  workpaperRef: string;
  author: string;
  message: string;
  status: "Open" | "Responded" | "Closed";
  response?: string;
}

const initialWorkpapers: WorkpaperItem[] = [
  {
    reference: "A.10",
    name: "Lead Schedule - Cash & Cash Equivalents",
    preparer: "Ma Thiri",
    reviewer: "Ko Thura",
    status: "Approved",
    progress: 100,
  },
  {
    reference: "A.20",
    name: "Bank Reconciliation - CB Bank",
    preparer: "Ma Thiri",
    reviewer: "Ko Thura",
    status: "Approved",
    progress: 100,
  },
  {
    reference: "A.30",
    name: "Bank Reconciliation - KBZ Bank",
    preparer: "Ma Thiri",
    reviewer: "Ko Thura",
    status: "Ready for Review",
    progress: 90,
  },
  {
    reference: "B.10",
    name: "Lead Schedule - Accounts Receivable",
    preparer: "Ma Thiri",
    reviewer: "Ko Thura",
    status: "In Progress",
    progress: 50,
  },
  {
    reference: "C.10",
    name: "Lead Schedule - Prepayments",
    preparer: "Ko Nay Win",
    reviewer: "Daw Aye Aye",
    status: "Not Started",
    progress: 0,
  },
  {
    reference: "H.10",
    name: "Test of Details - Operating Expenses",
    preparer: "Maung Min Min",
    reviewer: "Daw Aye Aye",
    status: "Ready for Review",
    progress: 85,
  },
];

const initialReviewNotes: ReviewNote[] = [
  {
    id: "note_1",
    workpaperRef: "A.30",
    author: "Ko Thura (Senior)",
    message:
      "The bank balance on the confirmation letter shows a discrepancy of $120. Please double check bank charges.",
    status: "Open",
  },
  {
    id: "note_2",
    workpaperRef: "B.10",
    author: "Daw Aye Aye (Manager)",
    message:
      "Several invoices listed in the AR ledger are missing customer sign-offs. Please run visual snipping to bind links.",
    status: "Open",
  },
  {
    id: "note_3",
    workpaperRef: "H.10",
    author: "Daw Aye Aye (Manager)",
    message:
      "Operating expenses show a 15% increase compared to last year. Please add analytical variance notes.",
    status: "Open",
  },
];

export function Workpapers({
  onSignTodWorkpaperFile,
}: {
  onSignTodWorkpaperFile: () => boolean;
}) {
  const {
    todWorkpaperPack,
    pbcMinutesLinks,
    rowSignOffs,
    identity,
    engagements,
    activeEngagementId,
  } = useDocTraceStore();
  const { t } = useI18n();
  const [workpapers] = useState<WorkpaperItem[]>(initialWorkpapers);
  const [notes, setNotes] = useState<ReviewNote[]>(initialReviewNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const isLocked =
    engagements.find((engagement) => engagement.id === activeEngagementId)
      ?.isLocked ?? false;

  const activeNotesCount = useMemo(
    () => notes.filter((n) => n.status !== "Closed").length,
    [notes],
  );

  const handleSubmitResponse = (id: string) => {
    if (!responseText.trim()) return;
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, status: "Responded", response: responseText }
          : note,
      ),
    );
    setResponseText("");
    setActiveNoteId(null);
  };

  const handleClearNote = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, status: "Closed" } : note,
      ),
    );
  };

  const workpaperStatusLabel = (status: WorkpaperItem["status"]) => {
    switch (status) {
      case "Approved":
        return t("wp.statusApproved");
      case "Ready for Review":
        return t("wp.statusReadyForReview");
      case "In Progress":
        return t("wp.statusInProgress");
      case "Not Started":
        return t("wp.statusNotStarted");
    }
  };

  const noteStatusLabel = (status: ReviewNote["status"]) => {
    switch (status) {
      case "Open":
        return t("wp.noteOpen");
      case "Responded":
        return t("wp.noteResponded");
      case "Closed":
        return t("wp.noteClosed");
    }
  };

  const hintCard = (
    <section className="rounded-[2.5rem] border border-white/80 bg-white/40 p-5 shadow-sm backdrop-blur-md xl:col-span-2 dark:border-white/5 dark:bg-slate-900/40">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/10">
          <FolderLock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        </div>
        <p className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-400">
          {t("wp.fileHint")}
        </p>
      </div>
    </section>
  );

  const titleBlock = (
    <div>
      <p className="dt-kicker">{t("wp.kicker")}</p>
      <h2 className="dt-section-title">{t("wp.title")}</h2>
    </div>
  );

  const minutesLinks = pbcMinutesLinks ?? pbcMinutesDemoLinks();

  const minutesStatusLabel = (status: PbcMinutesLink["status"]) => {
    switch (status) {
      case "Pending":
        return t("pbc.statusPending");
      case "Uploaded":
        return t("pbc.statusUploaded");
      case "Approved":
        return t("pbc.statusApproved");
      case "Rejected":
        return t("pbc.statusRejected");
    }
  };

  const minutesPanel = (
    <section className="dt-panel">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        {t("wp.minutesTitle")}
      </h3>
      {minutesLinks.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {t("wp.minutesEmpty")}
        </p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {minutesLinks.map((link) => (
            <li
              key={link.requestId}
              className="rounded-xl border border-slate-200/80 px-3 py-2 text-xs dark:border-slate-800"
            >
              <p className="font-bold text-slate-900 dark:text-white">
                {link.item}
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {link.fileName}
              </p>
              <span className="dt-badge dt-badge-neutral mt-2">
                {minutesStatusLabel(link.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  if (todWorkpaperPack) {
    const matchedCount = todWorkpaperPack.rows.filter(
      (row) => row.status === "matched",
    ).length;
    const partialCount = todWorkpaperPack.rows.filter(
      (row) => row.status === "partial",
    ).length;
    const exceptionCount = todWorkpaperPack.rows.filter(
      (row) => row.status === "exception",
    ).length;
    const openRows = unsignedOpenRows(todWorkpaperPack, rowSignOffs);
    const canSign =
      canSignTodWorkpaperFile(todWorkpaperPack, rowSignOffs, identity) &&
      !isLocked;
    const followUp = hasFollowUpOpen(todWorkpaperPack, rowSignOffs);

    return (
      <div className="grid gap-3">
        <section className="dt-panel">
          <div className="flex flex-wrap items-start justify-between gap-3">
            {titleBlock}
            <button
              className="dt-button-primary"
              disabled={!canSign}
              onClick={() => onSignTodWorkpaperFile()}
              type="button"
            >
              <FolderLock className="h-4 w-4" />
              {t("wp.signFile")}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            {todWorkpaperPack.sentAt} · {todWorkpaperPack.identity.preparer} /{" "}
            {todWorkpaperPack.identity.reviewer}
          </p>
          {todWorkpaperPack.fileSignOff ? (
            <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {todWorkpaperPack.fileSignOff.signedAt} ·{" "}
              {todWorkpaperPack.fileSignOff.preparer} /{" "}
              {todWorkpaperPack.fileSignOff.reviewer}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="dt-badge dt-badge-success">
              {matchedCount} {t("results.matched")}
            </span>
            <span className="dt-badge dt-badge-neutral">
              {partialCount} {t("results.partial")}
            </span>
            <span className="dt-badge dt-badge-danger">
              {exceptionCount} {t("results.exception")}
            </span>
            <span className="dt-badge dt-badge-neutral">
              {t("wp.snipCount")}: {todWorkpaperPack.snips.length}
            </span>
          </div>
          {openRows.length > 0 ? (
            <p className="mt-3 text-xs font-medium text-rose-700 dark:text-rose-400">
              {t("wp.unsignedHint")}
            </p>
          ) : null}
          {followUp ? (
            <p className="mt-3 text-xs font-medium text-amber-700 dark:text-amber-400">
              {t("wp.followUpWarn")}
            </p>
          ) : null}
        </section>

        <section className="dt-panel overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                <th className="px-3 py-2.5 font-bold">{t("results.row")}</th>
                <th className="px-3 py-2.5 font-bold">{t("eng.status")}</th>
                <th className="px-3 py-2.5 font-bold">
                  {t("results.signOff")}
                </th>
              </tr>
            </thead>
            <tbody>
              {todWorkpaperPack.rows.map((row) => (
                <tr
                  key={row.rowNumber}
                  className="border-b border-slate-100 dark:border-slate-800/60"
                >
                  <td className="px-3 py-2.5 font-mono font-bold">
                    {row.rowNumber}
                  </td>
                  <td className="px-3 py-2.5">{statusLabel(row.status)}</td>
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                    {rowSignOffs[row.rowNumber]?.action ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dt-panel">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t("wp.snipCount")}
          </h3>
          {todWorkpaperPack.snips.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {t("wp.noSnips")}
            </p>
          ) : (
            <ul className="mt-3 grid gap-2">
              {todWorkpaperPack.snips.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl border border-slate-200/80 px-3 py-2 text-xs dark:border-slate-800"
                >
                  {entry.fileName} · {entry.pageNumber}
                </li>
              ))}
            </ul>
          )}
        </section>

        {minutesPanel}

        {hintCard}
      </div>
    );
  }

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      {/* Left side: Workpapers List */}
      <div className="grid gap-3 self-start">
        <section className="dt-panel">
          <div>
            {titleBlock}
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {t("wp.subtitle")}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {workpapers.map((wp) => (
              <article
                key={wp.reference}
                className="rounded-[2rem] border border-white/80 bg-white/40 p-5 shadow-sm transition-all hover:bg-white dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                        {wp.reference}
                      </span>
                      <span
                        className={`dt-badge ${
                          wp.status === "Approved"
                            ? "dt-badge-success"
                            : wp.status === "Ready for Review"
                              ? "border-sky-200/50 bg-sky-100/80 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400"
                              : wp.status === "In Progress"
                                ? "border-amber-200/50 bg-amber-100/80 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                                : "dt-badge-neutral"
                        }`}
                      >
                        {workpaperStatusLabel(wp.status)}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {wp.name}
                    </h3>
                    <p className="mt-1 text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
                      {t("wp.assigned")
                        .replace("{preparer}", wp.preparer)
                        .replace("{reviewer}", wp.reviewer)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        wp.status === "Approved"
                          ? "bg-emerald-500"
                          : "bg-sky-500"
                      }`}
                      style={{ width: `${wp.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[0.65rem] font-bold text-slate-600 dark:text-slate-400">
                    {wp.progress}%
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Right side: Review Notes Module */}
      <div className="grid gap-3 self-start">
        <section className="dt-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="dt-kicker">{t("wp.feedbackKicker")}</p>
              <h2 className="dt-section-title">{t("wp.feedbackTitle")}</h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t("wp.feedbackSubtitle")}
              </p>
            </div>
            <span className="dt-badge dt-badge-neutral" aria-live="polite">
              {t("wp.notesCount").replace("{count}", String(activeNotesCount))}
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {notes.map((note) => {
              const isOpen = activeNoteId === note.id;

              return (
                <article
                  key={note.id}
                  className={`rounded-[2rem] border p-5 shadow-sm transition-all ${
                    note.status === "Closed"
                      ? "border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-800/20 dark:bg-slate-950/20"
                      : note.status === "Responded"
                        ? "border-emerald-250 bg-emerald-50/10 dark:border-emerald-500/10 dark:bg-emerald-500/5"
                        : "border-white/80 bg-white/40 dark:border-white/5 dark:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="dark:text-slate-450 text-[0.62rem] font-bold tracking-wider text-slate-500">
                      {t("wp.workpaperLabel")}{" "}
                      <strong className="font-mono text-sky-600 dark:text-sky-400">
                        {note.workpaperRef}
                      </strong>
                    </span>
                    <span
                      className={`dt-badge ${
                        note.status === "Closed"
                          ? "dt-badge-neutral"
                          : note.status === "Responded"
                            ? "dt-badge-success"
                            : "dt-badge-danger"
                      }`}
                    >
                      {noteStatusLabel(note.status)}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed font-semibold text-slate-900 dark:text-white">
                    <strong className="block text-[0.7rem] text-slate-500 dark:text-slate-400">
                      {t("wp.reviewerLabel")} {note.author}
                    </strong>
                    {note.message}
                  </p>

                  {/* Preparer Response */}
                  {note.response && (
                    <div className="mt-4 rounded-2xl bg-white/60 p-3 text-[0.75rem] leading-relaxed font-medium text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                      <span className="block text-[0.62rem] font-bold text-sky-600 dark:text-sky-400">
                        {t("wp.responseLabel")}
                      </span>
                      {note.response}
                    </div>
                  )}

                  {note.status !== "Closed" && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {note.status === "Open" && !isOpen && (
                        <button
                          onClick={() => {
                            setActiveNoteId(note.id);
                            setResponseText("");
                          }}
                          className="dt-button-secondary px-3 py-1.5 text-[0.7rem]"
                          type="button"
                        >
                          <PenTool className="h-3 w-3" />
                          {t("wp.respond")}
                        </button>
                      )}

                      {note.status === "Responded" && (
                        <button
                          onClick={() => handleClearNote(note.id)}
                          className="dt-button-secondary border-emerald-500/25 bg-emerald-500/5 px-3 py-1.5 text-[0.7rem] text-emerald-600 dark:text-emerald-400"
                          type="button"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {t("wp.clearClose")}
                        </button>
                      )}
                    </div>
                  )}

                  {isOpen && (
                    <div className="mt-4 grid gap-2">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder={t("wp.responsePlaceholder")}
                        className="w-full rounded-xl border border-slate-200 bg-white/60 p-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                        rows={2}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveNoteId(null)}
                          className="dt-button-ghost px-3 py-1 text-[0.7rem]"
                          type="button"
                        >
                          {t("wp.cancel")}
                        </button>
                        <button
                          onClick={() => handleSubmitResponse(note.id)}
                          className="dt-button-primary px-3 py-1 text-[0.7rem]"
                          type="button"
                        >
                          <Send className="h-3 w-3" />
                          {t("wp.submit")}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <div className="xl:col-span-2">{minutesPanel}</div>

      {/* Audit compliance notes card */}
      {hintCard}
    </div>
  );
}

import { CheckCircle, FolderLock, PenTool, Send } from "lucide-react";
import { useState, useMemo } from "react";
import { useDocTraceStore } from "@/state/app-store";

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

export function Workpapers() {
  const { locale } = useDocTraceStore();
  const [workpapers] = useState<WorkpaperItem[]>(initialWorkpapers);
  const [notes, setNotes] = useState<ReviewNote[]>(initialReviewNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

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

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      {/* Left side: Workpapers List */}
      <div className="grid gap-3 self-start">
        <section className="dt-panel">
          <div>
            <p className="dt-kicker">📁 Audit Documentation</p>
            <h2 className="dt-section-title">
              {locale === "my-MM"
                ? "Audit Workpapers စာရင်း"
                : "Audit Workpapers Checklist"}
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Manage workpaper sign-offs, preparer assignments, and overall
              execution progress.
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
                        {wp.status}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {wp.name}
                    </h3>
                    <p className="mt-1 text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
                      Assigned: {wp.preparer} (Prep) | {wp.reviewer} (Review)
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
              <p className="dt-kicker">💬 Auditor Feedback</p>
              <h2 className="dt-section-title">
                {locale === "my-MM"
                  ? "ကျန်ရှိနေသော Review Notes များ"
                  : "Outstanding Review Notes"}
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Clear manager and partner notes to finalize document sign-offs.
              </p>
            </div>
            <span className="dt-badge dt-badge-neutral" aria-live="polite">
              {activeNotesCount} Notes
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
                      Workpaper:{" "}
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
                      {note.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed font-semibold text-slate-900 dark:text-white">
                    <strong className="block text-[0.7rem] text-slate-500 dark:text-slate-400">
                      Reviewer: {note.author}
                    </strong>
                    {note.message}
                  </p>

                  {/* Preparer Response */}
                  {note.response && (
                    <div className="mt-4 rounded-2xl bg-white/60 p-3 text-[0.75rem] leading-relaxed font-medium text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                      <span className="block text-[0.62rem] font-bold text-sky-600 dark:text-sky-400">
                        Response:
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
                          Respond
                        </button>
                      )}

                      {note.status === "Responded" && (
                        <button
                          onClick={() => handleClearNote(note.id)}
                          className="dt-button-secondary border-emerald-500/25 bg-emerald-500/5 px-3 py-1.5 text-[0.7rem] text-emerald-600 dark:text-emerald-400"
                          type="button"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Clear & Close
                        </button>
                      )}
                    </div>
                  )}

                  {isOpen && (
                    <div className="mt-4 grid gap-2">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your audit response details..."
                        className="w-full rounded-xl border border-slate-200 bg-white/60 p-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
                        rows={2}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveNoteId(null)}
                          className="dt-button-ghost px-3 py-1 text-[0.7rem]"
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitResponse(note.id)}
                          className="dt-button-primary px-3 py-1 text-[0.7rem]"
                          type="button"
                        >
                          <Send className="h-3 w-3" />
                          Submit
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

      {/* Audit compliance notes card */}
      <section className="rounded-[2.5rem] border border-white/80 bg-white/40 p-5 shadow-sm backdrop-blur-md xl:col-span-2 dark:border-white/5 dark:bg-slate-900/40">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/10">
            <FolderLock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              ISQM 1 Documentation Compliance
            </p>
            <p className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              In accordance with international audit standards, all outstanding
              review queries must be cleared before the engagement partner can
              sign off and execute final archival database locks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

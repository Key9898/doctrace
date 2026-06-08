import {
  FileQuestion,
  HelpCircle,
  HardDriveUpload,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useDocTraceStore } from "@/state/app-store";

interface PBCRequest {
  id: string;
  item: string;
  category: string;
  dueDate: string;
  status: "Pending" | "Uploaded" | "Approved" | "Rejected";
  fileName?: string;
  uploadedAt?: string;
}

const initialRequests: PBCRequest[] = [
  {
    id: "pbc_1",
    item: "Accounts Payable Ledger FY25-26",
    category: "Accounts Payable",
    dueDate: "2026-06-15",
    status: "Approved",
    fileName: "ap_ledger_final.xlsx",
    uploadedAt: "2026-06-02T10:30:00Z",
  },
  {
    id: "pbc_2",
    item: "Bank Confirmation Letters (All Accounts)",
    category: "Cash & Bank",
    dueDate: "2026-06-18",
    status: "Uploaded",
    fileName: "kbz_confirmation_signed.pdf",
    uploadedAt: "2026-06-07T14:15:00Z",
  },
  {
    id: "pbc_3",
    item: "Sample Invoices Evidence (TOD Selection)",
    category: "Expenses",
    dueDate: "2026-06-20",
    status: "Pending",
  },
  {
    id: "pbc_4",
    item: "Fixed Asset Additions Invoices & Vouchers",
    category: "Fixed Assets",
    dueDate: "2026-06-22",
    status: "Pending",
  },
  {
    id: "pbc_5",
    item: "Board Meeting Minutes (2025)",
    category: "Governance",
    dueDate: "2026-06-10",
    status: "Approved",
    fileName: "board_minutes_combined.pdf",
    uploadedAt: "2026-06-01T09:00:00Z",
  },
];

export function ClientPortal() {
  const { locale } = useDocTraceStore();
  const [requests, setRequests] = useState<PBCRequest[]>(initialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const stats = useMemo(() => {
    let pending = 0;
    let uploaded = 0;
    let approved = 0;

    requests.forEach((r) => {
      if (r.status === "Pending") pending++;
      else if (r.status === "Uploaded") uploaded++;
      else if (r.status === "Approved") approved++;
    });

    return { pending, uploaded, approved, total: requests.length };
  }, [requests]);

  const handleSimulateUpload = (id: string, fileName: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Uploaded",
              fileName,
              uploadedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setSelectedRequestId(null);
  };

  const handleReviewAction = (id: string, action: "Approved" | "Rejected") => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: action } : r)),
    );
  };

  const handleRemoveFile = (id: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Pending",
              fileName: undefined,
              uploadedAt: undefined,
            }
          : r,
      ),
    );
  };

  return (
    <div className="grid gap-3">
      {/* Title */}
      <section className="dt-panel">
        <div>
          <p className="dt-kicker">🌐 Client Communication Portal</p>
          <h2 className="dt-section-title">
            {locale === "my-MM"
              ? "Client PBC စာရွက်စာတမ်း တောင်းဆိုမှုများ"
              : "Client PBC Portal & Requests"}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Track and verify document request templates prepared by the client
            (PBC) for audit testing.
          </p>
        </div>

        {/* PBC Stats widget */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="dt-stat">
            <span className="dt-stat-label">Pending PBC</span>
            <strong className="dt-stat-value text-amber-500">
              {stats.pending}
            </strong>
          </div>
          <div className="dt-stat">
            <span className="dt-stat-label">Uploaded / Unreviewed</span>
            <strong className="dt-stat-value text-sky-500">
              {stats.uploaded}
            </strong>
          </div>
          <div className="dt-stat">
            <span className="dt-stat-label">Approved & Audit-Ready</span>
            <strong className="dt-stat-value text-emerald-500">
              {stats.approved}
            </strong>
          </div>
        </div>
      </section>

      {/* Requests Lists */}
      <section className="dt-panel">
        <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
          <FileQuestion className="h-3.5 w-3.5 text-sky-500" />
          <span>Active PBC Checklist ({stats.total} requested)</span>
        </div>

        <div className="mt-6 grid gap-4">
          {requests.map((req) => (
            <article
              key={req.id}
              className="rounded-[2rem] border border-white/80 bg-white/40 p-5 shadow-sm transition-all hover:bg-white dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[0.62rem] font-bold text-slate-500">
                      ID: {req.id}
                    </span>
                    <span
                      className={`dt-badge ${
                        req.status === "Approved"
                          ? "dt-badge-success"
                          : req.status === "Uploaded"
                            ? "border-sky-200/50 bg-sky-100/80 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400"
                            : req.status === "Rejected"
                              ? "dt-badge-danger"
                              : "border-amber-200/50 bg-amber-100/80 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="dt-chip py-0.5 text-[0.6rem]">
                      {req.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                    {req.item}
                  </h3>
                  <p className="mt-1 text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
                    Deadline: {req.dueDate}
                  </p>
                </div>
              </div>

              {/* Uploaded File Detail */}
              {req.fileName ? (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/60 p-3 shadow-inner dark:bg-slate-950/60">
                  <div className="min-w-0">
                    <span className="block text-[0.65rem] font-bold tracking-tight text-slate-400 uppercase">
                      Uploaded File
                    </span>
                    <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {req.fileName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === "Uploaded" && (
                      <>
                        <button
                          onClick={() => handleReviewAction(req.id, "Approved")}
                          className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[0.65rem] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300"
                          type="button"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewAction(req.id, "Rejected")}
                          className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-[0.65rem] font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300"
                          type="button"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleRemoveFile(req.id)}
                      className="text-slate-450 rounded-lg p-1 hover:text-rose-600"
                      title="Remove file"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  {selectedRequestId === req.id ? (
                    <div className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/10 p-4 text-center dark:border-sky-500/30">
                      <HardDriveUpload className="mx-auto h-5 w-5 animate-bounce text-sky-500" />
                      <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Select a file to simulate PBC upload
                      </p>
                      <div className="mt-3 flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleSimulateUpload(req.id, "audit_ledger_v2.xlsx")
                          }
                          className="dt-button-primary px-2.5 py-1 text-[0.65rem]"
                          type="button"
                        >
                          Upload Excel Ledger
                        </button>
                        <button
                          onClick={() =>
                            handleSimulateUpload(
                              req.id,
                              "confirmations_combined.pdf",
                            )
                          }
                          className="dt-button-primary px-2.5 py-1 text-[0.65rem]"
                          type="button"
                        >
                          Upload Signed PDF
                        </button>
                        <button
                          onClick={() => setSelectedRequestId(null)}
                          className="dt-button-ghost px-2 py-1 text-[0.65rem]"
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedRequestId(req.id)}
                      className="dt-button-secondary px-3 py-1.5 text-[0.7rem]"
                      type="button"
                    >
                      <HardDriveUpload className="h-3 w-3" />
                      Simulate Upload
                    </button>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Info Card */}
      <section className="rounded-[2.5rem] border border-white/80 bg-white/40 p-5 dark:border-white/5 dark:bg-slate-900/40">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/10">
            <HelpCircle className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              What is a PBC List?
            </p>
            <p className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              PBC stands for <strong>Prepared by Client</strong>. It is a
              comprehensive checklist of documents, details, and schedules that
              the audit team requests from the client at the planning stage.
              Approved documents can be linked directly to execution workpapers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

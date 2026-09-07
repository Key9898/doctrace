import {
  FileQuestion,
  HelpCircle,
  HardDriveUpload,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  isTodPbcIntake,
  PBC_INTAKE_CASES,
  pbcDocumentKind,
  pbcIntakeKind,
} from "@/features/pbc-portal/services/pbc-intake";
import {
  clearPbcUploadedFile,
  pbcImportedDocumentIds,
} from "@/features/pbc-portal/services/pbc-library";
import { minutesLinksFromRequests } from "@/features/pbc-portal/services/pbc-minutes";
import { EVIDENCE_FILE_ACCEPT } from "@/lib/files/evidence-file";
import {
  isEvidencePickerAvailable,
  pickEvidenceFiles,
} from "@/lib/files/file-picker.service";
import { useI18n } from "@/lib/i18n/useI18n";
import { useDocTraceStore } from "@/stores/app-store";
import type { DocumentKind } from "@/types/domain";

interface PBCRequest {
  id: string;
  item: string;
  category: string;
  dueDate: string;
  status: "Pending" | "Uploaded" | "Approved" | "Rejected";
  fileName?: string;
  uploadedAt?: string;
  importedDocumentIds?: string[];
}

const requestExtras: Record<
  string,
  Omit<PBCRequest, "id" | "item" | "category">
> = {
  pbc_1: {
    dueDate: "2026-06-15",
    status: "Approved",
    fileName: "ap_ledger_final.xlsx",
    uploadedAt: "2026-06-02T10:30:00Z",
  },
  pbc_2: {
    dueDate: "2026-06-18",
    status: "Uploaded",
    fileName: "kbz_confirmation_signed.pdf",
    uploadedAt: "2026-06-07T14:15:00Z",
  },
  pbc_3: {
    dueDate: "2026-06-20",
    status: "Pending",
  },
  pbc_4: {
    dueDate: "2026-06-22",
    status: "Pending",
  },
  pbc_5: {
    dueDate: "2026-06-10",
    status: "Approved",
    fileName: "board_minutes_combined.pdf",
    uploadedAt: "2026-06-01T09:00:00Z",
  },
};

const initialRequests: PBCRequest[] = PBC_INTAKE_CASES.map((row) => ({
  ...row,
  ...requestExtras[row.id],
}));

interface ClientPortalProps {
  onImportPickedFiles: (kind: DocumentKind, files: File[]) => Promise<string[]>;
  onRemoveImportedDocuments: (documentIds: string[]) => void;
}

export function ClientPortal({
  onImportPickedFiles,
  onRemoveImportedDocuments,
}: ClientPortalProps) {
  const { t } = useI18n();
  const activeEngagementId = useDocTraceStore(
    (state) => state.activeEngagementId,
  );
  const setPbcMinutesLinks = useDocTraceStore(
    (state) => state.setPbcMinutesLinks,
  );
  const [requests, setRequests] = useState<PBCRequest[]>(initialRequests);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingImport = useRef<{
    requestId: string;
    kind: DocumentKind;
  } | null>(null);

  useEffect(() => {
    setPbcMinutesLinks(minutesLinksFromRequests(requests));
  }, [requests, activeEngagementId, setPbcMinutesLinks]);

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

  const markUploaded = (
    id: string,
    fileName: string,
    importedDocumentIds?: string[],
  ) => {
    setRequests((current) =>
      current.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Uploaded",
              fileName,
              uploadedAt: new Date().toISOString(),
              importedDocumentIds,
            }
          : r,
      ),
    );
  };

  const applyPickedFiles = async (
    requestId: string,
    kind: DocumentKind,
    files: File[],
  ) => {
    if (!files.length) {
      return;
    }

    const importedIds = pbcImportedDocumentIds(
      await onImportPickedFiles(kind, files),
    );

    if (importedIds.length) {
      markUploaded(requestId, files[0].name, importedIds);
    }

    pendingImport.current = null;
  };

  const handleBrowseTod = async (requestId: string, kind: DocumentKind) => {
    pendingImport.current = { requestId, kind };

    if (!isEvidencePickerAvailable()) {
      fileInputRef.current?.click();
      return;
    }

    try {
      const pickedFiles = await pickEvidenceFiles();

      if (pickedFiles === undefined) {
        fileInputRef.current?.click();
        return;
      }

      await applyPickedFiles(requestId, kind, pickedFiles);
    } catch {
      fileInputRef.current?.click();
    }
  };

  const handleMarkReceived = (id: string) => {
    markUploaded(id, t("pbc.received"));
  };

  const handleReviewAction = (id: string, action: "Approved" | "Rejected") => {
    setRequests((current) =>
      current.map((r) => (r.id === id ? { ...r, status: action } : r)),
    );
  };

  const handleRemoveFile = (id: string) => {
    const target = requests.find((r) => r.id === id);
    const importedIds = pbcImportedDocumentIds(target?.importedDocumentIds);

    if (importedIds.length) {
      onRemoveImportedDocuments(importedIds);
    }

    setRequests((current) =>
      current.map((r) => (r.id === id ? clearPbcUploadedFile(r) : r)),
    );
  };

  const statusLabel = (status: PBCRequest["status"]) => {
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

  const categoryLabel = (category: string) => {
    switch (category) {
      case "Accounts Payable":
        return t("pbc.catAccountsPayable");
      case "Cash & Bank":
        return t("pbc.catCashBank");
      case "Expenses":
        return t("pbc.catExpenses");
      case "Fixed Assets":
        return t("pbc.catFixedAssets");
      case "Governance":
        return t("pbc.catGovernance");
      default:
        return category;
    }
  };

  return (
    <div className="grid gap-3">
      <section className="dt-panel">
        <div>
          <p className="dt-kicker">{t("pbc.kicker")}</p>
          <h2 className="dt-section-title">{t("pbc.title")}</h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {t("pbc.subtitle")}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="dt-stat">
            <span className="dt-stat-label">{t("pbc.statPending")}</span>
            <strong className="dt-stat-value text-amber-500">
              {stats.pending}
            </strong>
          </div>
          <div className="dt-stat">
            <span className="dt-stat-label">{t("pbc.statUploaded")}</span>
            <strong className="dt-stat-value text-sky-500">
              {stats.uploaded}
            </strong>
          </div>
          <div className="dt-stat">
            <span className="dt-stat-label">{t("pbc.statApproved")}</span>
            <strong className="dt-stat-value text-emerald-500">
              {stats.approved}
            </strong>
          </div>
        </div>
      </section>

      <section className="dt-panel">
        <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
          <FileQuestion className="h-3.5 w-3.5 text-sky-500" />
          <span>
            {t("pbc.checklist").replace("{count}", String(stats.total))}
          </span>
        </div>

        <input
          accept={EVIDENCE_FILE_ACCEPT}
          aria-label={t("pbc.uploadToImport")}
          className="sr-only"
          multiple
          onChange={(event) => {
            const pending = pendingImport.current;
            const files = event.target.files
              ? Array.from(event.target.files)
              : [];
            event.currentTarget.value = "";

            if (!pending) {
              return;
            }

            void applyPickedFiles(pending.requestId, pending.kind, files);
          }}
          ref={fileInputRef}
          tabIndex={-1}
          type="file"
        />

        <div className="mt-6 grid gap-4">
          {requests.map((req) => {
            const intakeKind = pbcIntakeKind(req);
            const documentKind = pbcDocumentKind(intakeKind);
            const todIntake = isTodPbcIntake(intakeKind);

            return (
              <article
                key={req.id}
                className="rounded-[2rem] border border-white/80 bg-white/40 p-5 shadow-sm transition-all hover:bg-white dark:border-white/5 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.62rem] font-bold text-slate-500">
                        {t("pbc.idLabel")} {req.id}
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
                        {statusLabel(req.status)}
                      </span>
                      <span className="dt-chip py-0.5 text-[0.6rem]">
                        {categoryLabel(req.category)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                      {req.item}
                    </h3>
                    <p className="mt-1 text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
                      {t("pbc.deadlineLabel")} {req.dueDate}
                    </p>
                  </div>
                </div>

                {req.fileName ? (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/60 p-3 shadow-inner dark:bg-slate-950/60">
                    <div className="min-w-0">
                      <span className="block text-[0.65rem] font-bold tracking-tight text-slate-400 uppercase">
                        {t("pbc.uploadedFile")}
                      </span>
                      <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
                        {req.fileName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {req.status === "Uploaded" && (
                        <>
                          <button
                            onClick={() =>
                              handleReviewAction(req.id, "Approved")
                            }
                            className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[0.65rem] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300"
                            type="button"
                          >
                            {t("pbc.approve")}
                          </button>
                          <button
                            onClick={() =>
                              handleReviewAction(req.id, "Rejected")
                            }
                            className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-[0.65rem] font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300"
                            type="button"
                          >
                            {t("pbc.reject")}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleRemoveFile(req.id)}
                        className="rounded-lg p-1 text-slate-400 hover:text-rose-600"
                        title={t("pbc.removeFile")}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-2">
                    <p className="text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
                      {todIntake ? t("pbc.todHint") : t("pbc.listOnlyHint")}
                    </p>
                    {todIntake && documentKind ? (
                      <button
                        onClick={() =>
                          void handleBrowseTod(req.id, documentKind)
                        }
                        className="dt-button-secondary px-3 py-1.5 text-[0.7rem]"
                        type="button"
                      >
                        <HardDriveUpload className="h-3 w-3" />
                        {t("pbc.uploadToImport")}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkReceived(req.id)}
                        className="dt-button-secondary px-3 py-1.5 text-[0.7rem]"
                        type="button"
                      >
                        {t("pbc.markReceived")}
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-white/80 bg-white/40 p-5 dark:border-white/5 dark:bg-slate-900/40">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/10">
            <HelpCircle className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {t("pbc.whatTitle")}
            </p>
            <p className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              {t("pbc.whatBody")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

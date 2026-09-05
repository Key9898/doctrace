import { useEffect, useState } from "react";
import {
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  Trash2,
  User,
  Users,
  X,
  FileSpreadsheet,
  Lock,
  Unlock,
} from "lucide-react";

import { useDocTraceStore } from "@/stores/app-store";
import { translate } from "@/lib/i18n/translations";
import { formatCurrency } from "@/lib/formatters";
import {
  isPresetCurrency,
  isValidIsoCurrency,
  REPORTING_CURRENCY_PRESETS,
  resolveCurrency,
  resolveOcrLanguage,
  type OcrLanguage,
} from "@/lib/i18n/reporting";
import type {
  AuditFramework,
  EngagementStatus,
  ParsedDocument,
  MatchResult,
  EngagementTeam,
} from "@/types/domain";

export function EngagementManager() {
  const {
    locale,
    engagements,
    activeEngagementId,
    createEngagement,
    selectEngagement,
    updateEngagementStatus,
    updateEngagementTeam,
    updateEngagementLock,
    updateEngagementReporting,
    deleteEngagement,
    pushToast,
    documents,
    results,
  } = useDocTraceStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [clientName, setClientName] = useState("");
  const [financialYear, setFinancialYear] = useState("FY 2025-26");
  const [framework, setFramework] = useState<AuditFramework>("ISA");
  const [status, setStatus] = useState<EngagementStatus>("In Progress");
  const [overallMateriality, setOverallMateriality] = useState(10000);
  const [performanceMateriality, setPerformanceMateriality] = useState(7500);
  const [trivialThreshold, setTrivialThreshold] = useState(500);
  const [teamPartner, setTeamPartner] = useState("");
  const [teamManager, setTeamManager] = useState("");
  const [teamSenior, setTeamSenior] = useState("");
  const [teamAssociate, setTeamAssociate] = useState("");
  const [teamEqReviewer, setTeamEqReviewer] = useState("");
  const [otherCurrencyOpen, setOtherCurrencyOpen] = useState(false);
  const [otherCurrencyDraft, setOtherCurrencyDraft] = useState("");

  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  const getStatusLabel = (status: EngagementStatus) => {
    switch (status) {
      case "Not Started":
        return t("eng.status.notStarted");
      case "In Progress":
        return t("eng.status.inProgress");
      case "Pending Client":
        return t("eng.status.pendingClient");
      case "Under Review":
        return t("eng.status.underReview");
      case "Cleared for Partner Review":
        return t("eng.status.clearedPartner");
      case "Completed":
        return t("eng.status.completed");
      case "Archived":
        return t("eng.status.archived");
      default:
        return status;
    }
  };

  const getEngagementProgress = (
    eng: (typeof engagements)[0],
    docs: ParsedDocument[],
    res: MatchResult[],
  ) => {
    if (eng.status === "Completed" || eng.status === "Archived") return 100;

    if (docs.length === 0) {
      if (eng.status === "Not Started") return 0;
      if (eng.status === "Pending Client") return 5;
      return 10; // Basic planning phase
    }

    if (res.length === 0) {
      if (eng.status === "Not Started") return 15;
      if (eng.status === "Pending Client") return 25;
      if (eng.status === "Under Review") return 60;
      if (eng.status === "Cleared for Partner Review") return 75;
      return 45;
    }

    let base = 65;
    if (eng.status === "Under Review") base = 85;
    if (eng.status === "Cleared for Partner Review") base = 95;
    if (eng.status === "Not Started") base = 35;
    if (eng.status === "Pending Client") base = 50;

    const docWeight = Math.min(15, docs.length * 5);
    return Math.min(95, base + docWeight);
  };

  const rawActiveEngagement =
    engagements.find((e) => e.id === activeEngagementId) || null;
  const activeEngagement = rawActiveEngagement
    ? {
        ...rawActiveEngagement,
        progressPercentage: getEngagementProgress(
          rawActiveEngagement,
          documents,
          results,
        ),
      }
    : null;

  const storedCurrency = resolveCurrency(activeEngagement?.currency);
  const storedOcr = resolveOcrLanguage(activeEngagement?.ocrLanguage);

  useEffect(() => {
    const eng = useDocTraceStore
      .getState()
      .engagements.find((entry) => entry.id === activeEngagementId);
    const stored = resolveCurrency(eng?.currency);
    const isOther = !isPresetCurrency(stored);
    setOtherCurrencyOpen(isOther);
    setOtherCurrencyDraft(isOther ? stored : "");
  }, [activeEngagementId]);

  useEffect(() => {
    if (!isPresetCurrency(storedCurrency)) {
      setOtherCurrencyOpen(true);
      setOtherCurrencyDraft(storedCurrency);
    }
  }, [storedCurrency]);

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clientName.trim()) {
      pushToast({
        tone: "error",
        title: t("app.error"),
        description: t("eng.clientRequired"),
      });
      return;
    }

    createEngagement(
      clientName.trim(),
      financialYear,
      framework,
      status,
      overallMateriality,
      performanceMateriality,
      trivialThreshold,
      {
        partner: teamPartner.trim(),
        manager: teamManager.trim(),
        senior: teamSenior.trim(),
        associate: teamAssociate.trim(),
        eqReviewer: teamEqReviewer.trim(),
      },
    );

    setClientName("");
    setWizardStep(1);
    setOverallMateriality(10000);
    setPerformanceMateriality(7500);
    setTrivialThreshold(500);
    setTeamPartner("");
    setTeamManager("");
    setTeamSenior("");
    setTeamAssociate("");
    setTeamEqReviewer("");
    setShowCreateForm(false);

    pushToast({
      tone: "success",
      title: t("app.success"),
      description: t("eng.createdSuccess"),
    });
  };

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteEngagement(deleteTarget.id);
    pushToast({
      tone: "info",
      title: t("app.notice"),
      description: t("eng.deletedSuccess"),
    });
    setDeleteTarget(null);
  };

  const handleTeamChange = (role: keyof EngagementTeam, name: string) => {
    if (!activeEngagement) return;
    updateEngagementTeam(activeEngagement.id, { [role]: name });
  };

  // Mock stats based on engagement status and progress
  const getMockStats = (
    engId: string,
    progress: number,
    status: EngagementStatus,
  ) => {
    const seed = engId.charCodeAt(engId.length - 1) || 5;
    const isCompleted = status === "Completed";

    // 1. Review Notes
    let openNotes = 0;
    let respondedNotes = 0;
    let closedNotes = 0;

    // 2. Workpapers Done
    const baseWorkpapers = 5 + (seed % 3);
    const totalWorkpapers = baseWorkpapers;
    let completedWorkpapers = 0;

    // 3. PBC Requests
    const pbcTotal = 3 + (seed % 2);
    const loadedCount = documents.length;
    let pbcApproved = 0;
    let pbcUploaded = 0;
    let pbcPending = 0;

    if (isCompleted) {
      openNotes = 0;
      respondedNotes = 0;
      closedNotes = 15 + (seed % 5);
      completedWorkpapers = totalWorkpapers;
      pbcApproved = pbcTotal;
      pbcUploaded = 0;
      pbcPending = 0;
    } else if (progress < 15) {
      // Stage 1: Planning phase, no documents loaded yet
      openNotes = 1;
      respondedNotes = 0;
      closedNotes = 3 + (seed % 2);
      completedWorkpapers = 1; // Planning workpaper is done
      pbcApproved = 0;
      pbcUploaded = 0;
      pbcPending = pbcTotal; // Waiting for documents
    } else if (results.length === 0) {
      // Stage 2: Files loaded, but matching not run
      openNotes = 3 + (seed % 2);
      respondedNotes = 1;
      closedNotes = 6 + (seed % 3);
      completedWorkpapers = 2; // Planning + Setup workpapers done
      pbcApproved = 0;
      pbcUploaded = Math.min(pbcTotal, loadedCount);
      pbcPending = Math.max(0, pbcTotal - pbcUploaded);
    } else {
      // Stage 3: Matching run successfully
      openNotes = 1;
      respondedNotes = 2;
      closedNotes = 10 + (seed % 4);
      completedWorkpapers = Math.min(totalWorkpapers - 1, 4 + (seed % 2));
      pbcApproved = Math.min(pbcTotal, loadedCount);
      pbcUploaded = 0;
      pbcPending = Math.max(0, pbcTotal - pbcApproved);
    }

    return {
      workpapers: { completed: completedWorkpapers, total: totalWorkpapers },
      notes: {
        open: openNotes,
        responded: respondedNotes,
        closed: closedNotes,
      },
      pbc: {
        approved: pbcApproved,
        uploaded: pbcUploaded,
        pending: pbcPending,
        total: pbcTotal,
      },
    };
  };

  // Status badges colors mapping
  const getStatusColor = (status: EngagementStatus) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "Under Review":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20";
      case "Cleared for Partner Review":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20";
      case "Pending Client":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      case "Archived":
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
    }
  };

  const getFrameworkLabel = (fw: AuditFramework) => {
    if (fw === "IFRS_SMEs") return t("eng.fw.ifrs_smes");
    if (fw === "IAS_IFRS") return t("eng.fw.ias_ifrs");
    return t("eng.fw.isa");
  };

  // Progress ring variables
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:gap-6">
      {/* Left panel - Engagement List & Creator */}
      <div className="flex flex-col gap-3 md:col-span-1">
        <section className="dt-panel flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="dt-kicker">{t("eng.kicker")}</p>
              <h2 className="dt-section-title">{t("eng.listTitle")}</h2>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/60 bg-white/40 shadow-sm backdrop-blur-md transition-all hover:bg-white dark:border-white/5 dark:bg-slate-800/40 dark:hover:bg-slate-800/60"
              title={t("eng.new")}
              aria-expanded={showCreateForm}
            >
              {showCreateForm ? (
                <X className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* New engagement form (Step-by-step Wizard) */}
          {showCreateForm && (
            <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/30">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                <h3 className="text-xs font-black tracking-wider text-slate-800 uppercase dark:text-slate-200">
                  {t("eng.wizard.title")}
                </h3>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                  {t("eng.wizard.progress")
                    .replace("{current}", String(wizardStep))
                    .replace("{total}", "4")}
                </span>
              </div>

              {/* Step indicator header */}
              <div className="text-[10px] font-bold text-slate-500 uppercase">
                {wizardStep === 1 && t("eng.wizard.step1")}
                {wizardStep === 2 && t("eng.wizard.step2")}
                {wizardStep === 3 && t("eng.wizard.step3")}
                {wizardStep === 4 && t("eng.wizard.step4")}
              </div>

              {/* Step 1: Basics */}
              {wizardStep === 1 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.clientName")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("eng.placeholder.clientExample")}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                        {t("eng.financialYear")}
                      </label>
                      <select
                        value={financialYear}
                        onChange={(e) => setFinancialYear(e.target.value)}
                        className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="FY 2024-25">FY 2024-25</option>
                        <option value="FY 2025-26">FY 2025-26</option>
                        <option value="FY 2026-27">FY 2026-27</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                        {t("eng.framework")}
                      </label>
                      <select
                        value={framework}
                        onChange={(e) =>
                          setFramework(e.target.value as AuditFramework)
                        }
                        className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="ISA">{t("eng.fw.isa")}</option>
                        <option value="IAS_IFRS">{t("eng.fw.ias_ifrs")}</option>
                        <option value="IFRS_SMEs">
                          {t("eng.fw.ifrs_smes")}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.status")}
                    </label>
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as EngagementStatus)
                      }
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="Not Started">
                        {t("eng.status.notStarted")}
                      </option>
                      <option value="In Progress">
                        {t("eng.status.inProgress")}
                      </option>
                      <option value="Pending Client">
                        {t("eng.status.pendingClient")}
                      </option>
                      <option value="Under Review">
                        {t("eng.status.underReview")}
                      </option>
                      <option value="Cleared for Partner Review">
                        {t("eng.status.clearedPartner")}
                      </option>
                      <option value="Completed">
                        {t("eng.status.completed")}
                      </option>
                      <option value="Archived">
                        {t("eng.status.archived")}
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Materiality & Scope */}
              {wizardStep === 2 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.overallMateriality")}
                    </label>
                    <input
                      type="number"
                      value={overallMateriality}
                      onChange={(e) =>
                        setOverallMateriality(Number(e.target.value))
                      }
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.performanceMateriality")}
                    </label>
                    <input
                      type="number"
                      value={performanceMateriality}
                      onChange={(e) =>
                        setPerformanceMateriality(Number(e.target.value))
                      }
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.trivialThreshold")}
                    </label>
                    <input
                      type="number"
                      value={trivialThreshold}
                      onChange={(e) =>
                        setTrivialThreshold(Number(e.target.value))
                      }
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Team Assignment */}
              {wizardStep === 3 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.partner")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("eng.placeholder.epName")}
                      value={teamPartner}
                      onChange={(e) => setTeamPartner(e.target.value)}
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.manager")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("eng.placeholder.emName")}
                      value={teamManager}
                      onChange={(e) => setTeamManager(e.target.value)}
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.senior")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("eng.placeholder.seniorInCharge")}
                      value={teamSenior}
                      onChange={(e) => setTeamSenior(e.target.value)}
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.associate")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("eng.placeholder.associate")}
                      value={teamAssociate}
                      onChange={(e) => setTeamAssociate(e.target.value)}
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {t("eng.eqReviewer")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("eng.placeholder.eqReviewer")}
                      value={teamEqReviewer}
                      onChange={(e) => setTeamEqReviewer(e.target.value)}
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Summary & Confirm */}
              {wizardStep === 4 && (
                <div className="flex flex-col gap-2 rounded-xl bg-slate-100/60 p-3 text-xs dark:bg-slate-800/40">
                  <div className="grid grid-cols-2 gap-y-2 text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">
                      {t("eng.clientName")}:
                    </span>
                    <span className="truncate font-bold text-slate-900 dark:text-white">
                      {clientName}
                    </span>
                    <span className="font-semibold">
                      {t("eng.financialYear")}:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {financialYear}
                    </span>
                    <span className="font-semibold">{t("eng.framework")}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {getFrameworkLabel(framework)}
                    </span>
                    <span className="font-semibold">{t("eng.status")}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {getStatusLabel(status)}
                    </span>

                    <span className="col-span-2 my-1 border-t border-slate-200 dark:border-slate-700"></span>

                    <span className="font-semibold">
                      {t("eng.overallMateriality")}:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(overallMateriality)}
                    </span>
                    <span className="font-semibold">
                      {t("eng.performanceMateriality")}:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(performanceMateriality)}
                    </span>
                    <span className="font-semibold">
                      {t("eng.trivialThreshold")}:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(trivialThreshold)}
                    </span>

                    <span className="col-span-2 my-1 border-t border-slate-200 dark:border-slate-700"></span>

                    <span className="font-semibold">{t("eng.partner")}:</span>
                    <span className="truncate font-bold text-slate-900 dark:text-white">
                      {teamPartner || "-"}
                    </span>
                    <span className="font-semibold">{t("eng.manager")}:</span>
                    <span className="truncate font-bold text-slate-900 dark:text-white">
                      {teamManager || "-"}
                    </span>
                    <span className="font-semibold">{t("eng.senior")}:</span>
                    <span className="truncate font-bold text-slate-900 dark:text-white">
                      {teamSenior || "-"}
                    </span>
                    <span className="font-semibold">{t("eng.associate")}:</span>
                    <span className="truncate font-bold text-slate-900 dark:text-white">
                      {teamAssociate || "-"}
                    </span>
                    <span className="font-semibold">
                      {t("eng.eqReviewer")}:
                    </span>
                    <span className="truncate font-bold text-slate-900 dark:text-white">
                      {teamEqReviewer || "-"}
                    </span>
                  </div>
                </div>
              )}

              {/* Wizard Action Footer */}
              <div className="mt-3 flex gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="dt-button-secondary h-9 px-3 text-xs"
                  >
                    {t("eng.wizard.back")}
                  </button>
                )}

                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && !clientName.trim()) {
                        pushToast({
                          tone: "error",
                          title: t("app.error"),
                          description: t("eng.clientRequired"),
                        });
                        return;
                      }
                      setWizardStep(wizardStep + 1);
                    }}
                    className="dt-button-primary h-9 flex-1 text-xs"
                  >
                    {t("eng.wizard.next")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCreate()}
                    className="dt-button-primary h-9 flex-1 text-xs"
                  >
                    {t("eng.wizard.finish")}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setClientName("");
                    setWizardStep(1);
                    setOverallMateriality(10000);
                    setPerformanceMateriality(7500);
                    setTrivialThreshold(500);
                    setTeamPartner("");
                    setTeamManager("");
                    setTeamSenior("");
                    setTeamAssociate("");
                    setTeamEqReviewer("");
                    setShowCreateForm(false);
                  }}
                  className="dt-button-secondary h-9 text-xs"
                >
                  {t("eng.cancel")}
                </button>
              </div>
            </div>
          )}

          {/* Engagement Cards List */}
          <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto pr-1">
            {engagements.map((rawEng) => {
              const active = rawEng.id === activeEngagementId;
              const eng = {
                ...rawEng,
                progressPercentage: getEngagementProgress(
                  rawEng,
                  active ? documents : rawEng.documents || [],
                  active ? results : rawEng.results || [],
                ),
              };
              return (
                <div
                  key={eng.id}
                  onClick={() => selectEngagement(eng.id)}
                  className={`group relative flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-all ${
                    active
                      ? "border-sky-500 bg-sky-500/5 shadow-md"
                      : "border-white/80 bg-white/40 hover:bg-white dark:border-white/10 dark:bg-slate-800/40 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {eng.clientName}
                      </h4>
                      <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                        {eng.financialYear} • {getFrameworkLabel(eng.framework)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getStatusColor(eng.status)}`}
                    >
                      {getStatusLabel(eng.status)}
                    </span>
                  </div>

                  {/* Micro progress line */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                      <span>{t("eng.progress")}</span>
                      <span>{eng.progressPercentage}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500"
                        style={{ width: `${eng.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right panel - Dashboard & Details */}
      <div className="flex flex-col gap-3 md:col-span-2">
        {activeEngagement ? (
          <div className="flex flex-col gap-3">
            {/* Header Details */}
            <section className="dt-panel">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="dt-kicker">
                    {activeEngagement.financialYear} •{" "}
                    {getFrameworkLabel(activeEngagement.framework)}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeEngagement.clientName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Dropdown selector */}
                  <select
                    value={activeEngagement.status}
                    disabled={activeEngagement.isLocked}
                    onChange={(e) =>
                      updateEngagementStatus(
                        activeEngagement.id,
                        e.target.value as EngagementStatus,
                      )
                    }
                    className="h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 outline-none disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <option value="Not Started">
                      {t("eng.status.notStarted")}
                    </option>
                    <option value="In Progress">
                      {t("eng.status.inProgress")}
                    </option>
                    <option value="Pending Client">
                      {t("eng.status.pendingClient")}
                    </option>
                    <option value="Under Review">
                      {t("eng.status.underReview")}
                    </option>
                    <option value="Cleared for Partner Review">
                      {t("eng.status.clearedPartner")}
                    </option>
                    <option value="Completed">
                      {t("eng.status.completed")}
                    </option>
                    <option value="Archived">{t("eng.status.archived")}</option>
                  </select>

                  {/* Lock/Unlock Button (EP Control) */}
                  <button
                    onClick={() =>
                      updateEngagementLock(
                        activeEngagement.id,
                        !activeEngagement.isLocked,
                      )
                    }
                    className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-all ${
                      activeEngagement.isLocked
                        ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                        : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                    }`}
                    title={
                      activeEngagement.isLocked
                        ? t("eng.unlock")
                        : t("eng.lock")
                    }
                  >
                    {activeEngagement.isLocked ? (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span>{t("eng.locked")}</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3.5 w-3.5" />
                        <span>{t("eng.unlocked")}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setDeleteTarget({
                        id: activeEngagement.id,
                        name: activeEngagement.clientName,
                      })
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition-all hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                    title={t("eng.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Planning & Materiality Section */}
            <section className="dt-panel flex flex-col gap-2 p-4 sm:p-5">
              <h4 className="text-xs font-black tracking-wider text-slate-800 uppercase dark:text-slate-200">
                {t("eng.planningScope")}
              </h4>
              <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {t("eng.framework")}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-slate-900 dark:text-white">
                    {getFrameworkLabel(activeEngagement.framework)}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {t("eng.overallMateriality")}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-sky-600 dark:text-sky-400">
                    {activeEngagement.overallMateriality !== undefined
                      ? formatCurrency(
                          activeEngagement.overallMateriality,
                          storedCurrency,
                        )
                      : "--"}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {t("eng.performanceMateriality")}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {activeEngagement.performanceMateriality !== undefined
                      ? formatCurrency(
                          activeEngagement.performanceMateriality,
                          storedCurrency,
                        )
                      : "--"}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {t("eng.trivialThreshold")}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-amber-600 dark:text-amber-400">
                    {activeEngagement.trivialThreshold !== undefined
                      ? formatCurrency(
                          activeEngagement.trivialThreshold,
                          storedCurrency,
                        )
                      : "--"}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {t("eng.currency")}
                  </label>
                  {activeEngagement.isLocked ? (
                    <span className="h-9 px-3 text-xs leading-9 font-bold text-slate-700 dark:text-slate-300">
                      {storedCurrency}
                    </span>
                  ) : (
                    <>
                      <select
                        value={
                          otherCurrencyOpen || !isPresetCurrency(storedCurrency)
                            ? "OTHER"
                            : storedCurrency
                        }
                        onChange={(event) => {
                          const next = event.target.value;
                          if (next === "OTHER") {
                            setOtherCurrencyOpen(true);
                            setOtherCurrencyDraft(
                              isPresetCurrency(storedCurrency)
                                ? ""
                                : storedCurrency,
                            );
                            return;
                          }
                          setOtherCurrencyOpen(false);
                          setOtherCurrencyDraft("");
                          updateEngagementReporting(
                            activeEngagement.id,
                            next,
                            storedOcr,
                          );
                        }}
                        className="h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {REPORTING_CURRENCY_PRESETS.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                        <option value="OTHER">{t("eng.currencyOther")}</option>
                      </select>
                      {(otherCurrencyOpen ||
                        !isPresetCurrency(storedCurrency)) && (
                        <input
                          value={otherCurrencyDraft}
                          maxLength={3}
                          onChange={(event) =>
                            setOtherCurrencyDraft(
                              event.target.value.toUpperCase(),
                            )
                          }
                          onBlur={() => {
                            const next = otherCurrencyDraft
                              .trim()
                              .toUpperCase();
                            if (!isValidIsoCurrency(next)) {
                              pushToast({
                                tone: "error",
                                title: t("eng.currency"),
                                description: t("eng.currencyInvalid"),
                              });
                              return;
                            }
                            updateEngagementReporting(
                              activeEngagement.id,
                              next,
                              storedOcr,
                            );
                          }}
                          className="h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold tracking-widest text-slate-700 uppercase outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          placeholder={t("eng.placeholder.iso")}
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {t("eng.ocrLanguage")}
                  </label>
                  {activeEngagement.isLocked ? (
                    <span className="h-9 px-3 text-xs leading-9 font-bold text-slate-700 dark:text-slate-300">
                      {storedOcr === "eng"
                        ? t("eng.ocrEnglish")
                        : t("eng.ocrMyanmarEnglish")}
                    </span>
                  ) : (
                    <select
                      value={storedOcr}
                      onChange={(event) => {
                        updateEngagementReporting(
                          activeEngagement.id,
                          storedCurrency,
                          event.target.value as OcrLanguage,
                        );
                      }}
                      className="h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <option value="mya+eng">
                        {t("eng.ocrMyanmarEnglish")}
                      </option>
                      <option value="eng">{t("eng.ocrEnglish")}</option>
                    </select>
                  )}
                </div>
              </div>
            </section>

            {/* Dashboard metrics grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Circular progress */}
              <article className="dt-panel flex flex-col items-center justify-center p-6 text-center">
                <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  {t("eng.progress")}
                </h4>
                <div className="relative mt-4 flex items-center justify-center">
                  <svg className="h-28 w-28 -rotate-95">
                    {/* Background circle */}
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="fill-none stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth={strokeWidth}
                    />
                    {/* Active circle */}
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="fill-none stroke-sky-500 transition-all duration-1000"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={
                        circumference -
                        (activeEngagement.progressPercentage / 100) *
                          circumference
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Inside text */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {activeEngagement.progressPercentage}%
                    </span>
                  </div>
                </div>
              </article>

              {/* Workpapers and stats */}
              <article className="dt-panel flex flex-col justify-between p-6">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    {t("eng.workpapers")}
                  </h4>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {
                        getMockStats(
                          activeEngagement.id,
                          activeEngagement.progressPercentage,
                          activeEngagement.status,
                        ).workpapers.completed
                      }
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      /{" "}
                      {
                        getMockStats(
                          activeEngagement.id,
                          activeEngagement.progressPercentage,
                          activeEngagement.status,
                        ).workpapers.total
                      }
                    </span>
                  </div>
                </div>
                {/* Horizontal bar */}
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                      style={{
                        width: `${
                          (getMockStats(
                            activeEngagement.id,
                            activeEngagement.progressPercentage,
                            activeEngagement.status,
                          ).workpapers.completed /
                            getMockStats(
                              activeEngagement.id,
                              activeEngagement.progressPercentage,
                              activeEngagement.status,
                            ).workpapers.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </article>

              {/* Review Notes Status */}
              <article className="dt-panel p-6">
                <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <Layers className="h-4 w-4 text-indigo-500" />
                  {t("eng.reviewNotes")}
                </h4>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-rose-50 p-3 text-center dark:bg-rose-500/10">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {t("snips.statOpen")}
                    </span>
                    <p className="mt-1 text-2xl font-black text-rose-700 dark:text-rose-300">
                      {
                        getMockStats(
                          activeEngagement.id,
                          activeEngagement.progressPercentage,
                          activeEngagement.status,
                        ).notes.open
                      }
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3 text-center dark:bg-amber-500/10">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {t("eng.responded")}
                    </span>
                    <p className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">
                      {
                        getMockStats(
                          activeEngagement.id,
                          activeEngagement.progressPercentage,
                          activeEngagement.status,
                        ).notes.responded
                      }
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3 text-center dark:bg-emerald-500/10">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {t("eng.closed")}
                    </span>
                    <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">
                      {
                        getMockStats(
                          activeEngagement.id,
                          activeEngagement.progressPercentage,
                          activeEngagement.status,
                        ).notes.closed
                      }
                    </p>
                  </div>
                </div>
              </article>

              {/* PBC Requests breakdown */}
              <article className="dt-panel p-6">
                <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                  {t("eng.pbcRequests")}
                </h4>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Clock className="h-3 w-3 text-amber-500" />{" "}
                      {t("eng.status.pendingClient")}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {
                        getMockStats(
                          activeEngagement.id,
                          activeEngagement.progressPercentage,
                          activeEngagement.status,
                        ).pbc.pending
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Activity className="h-3 w-3 text-sky-500" />{" "}
                      {t("eng.pbc.uploaded")}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {
                        getMockStats(
                          activeEngagement.id,
                          activeEngagement.progressPercentage,
                          activeEngagement.status,
                        ).pbc.uploaded
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                      {t("eng.pbc.approved")}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {
                        getMockStats(
                          activeEngagement.id,
                          activeEngagement.progressPercentage,
                          activeEngagement.status,
                        ).pbc.approved
                      }
                    </span>
                  </div>
                </div>
              </article>
            </div>

            {/* Team assignment section */}
            <section className="dt-panel">
              <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                <Users className="h-4 w-4 text-sky-500" />
                {t("eng.team")}
              </h4>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    <Award className="h-3 w-3 text-sky-500" />{" "}
                    {t("eng.partner")}
                  </label>
                  <input
                    type="text"
                    disabled={activeEngagement.isLocked}
                    value={activeEngagement.teamAssignments.partner}
                    onChange={(e) =>
                      handleTeamChange("partner", e.target.value)
                    }
                    placeholder={t("eng.placeholder.partner")}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    <User className="h-3 w-3 text-emerald-500" />{" "}
                    {t("eng.manager")}
                  </label>
                  <input
                    type="text"
                    disabled={activeEngagement.isLocked}
                    value={activeEngagement.teamAssignments.manager}
                    onChange={(e) =>
                      handleTeamChange("manager", e.target.value)
                    }
                    placeholder={t("eng.placeholder.manager")}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    <User className="h-3 w-3 text-indigo-500" />{" "}
                    {t("eng.senior")}
                  </label>
                  <input
                    type="text"
                    disabled={activeEngagement.isLocked}
                    value={activeEngagement.teamAssignments.senior}
                    onChange={(e) => handleTeamChange("senior", e.target.value)}
                    placeholder={t("eng.placeholder.senior")}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    <User className="h-3 w-3 text-slate-500" />{" "}
                    {t("eng.associate")}
                  </label>
                  <input
                    type="text"
                    disabled={activeEngagement.isLocked}
                    value={activeEngagement.teamAssignments.associate}
                    onChange={(e) =>
                      handleTeamChange("associate", e.target.value)
                    }
                    placeholder={t("eng.placeholder.associate")}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    <User className="h-3 w-3 text-sky-600" />{" "}
                    {t("eng.eqReviewer")}
                  </label>
                  <input
                    type="text"
                    disabled={activeEngagement.isLocked}
                    value={activeEngagement.teamAssignments.eqReviewer || ""}
                    onChange={(e) =>
                      handleTeamChange("eqReviewer", e.target.value)
                    }
                    placeholder={t("eng.placeholder.eqReviewer")}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </section>
          </div>
        ) : (
          <section className="dt-panel flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-transparent py-16 text-center dark:border-slate-700">
            <Users className="h-12 w-12 stroke-1 text-slate-400" />
            <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("eng.selectEngagementPrompt")}
            </p>
          </section>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="dt-panel animate-in fade-in zoom-in-95 flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl duration-150">
            <h3 className="text-base font-bold text-white">
              {t("eng.deleteTitle")}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {t("eng.deleteDesc").replace("{name}", deleteTarget.name)}
            </p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="dt-button-secondary h-9 rounded-xl px-4 py-2 text-xs"
              >
                {t("eng.cancelBtn")}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="dt-button-primary h-9 rounded-xl bg-rose-600 px-4 py-2 text-xs shadow-rose-600/20 hover:bg-rose-500 hover:shadow-rose-500/30"
              >
                {t("eng.deleteBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

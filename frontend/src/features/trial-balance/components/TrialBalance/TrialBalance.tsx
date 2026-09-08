import {
  ArrowRightLeft,
  ChevronDown,
  CloudUpload,
  Coins,
  FileCheck,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  filterListingByLead,
  leadTieOut,
  mappedLeadOptions,
  TB_STANDARD_GROUPS,
} from "@/features/trial-balance/services/tb-lead";
import { listingToSelectionSnapshot } from "@/features/trial-balance/services/tb-selection";
import {
  SPREADSHEET_FILE_ACCEPT,
  type ListingRow,
  type TrialBalanceAccount,
} from "@/features/trial-balance/services/tb-types";
import {
  parseListingWorkbook,
  parseTrialBalanceWorkbook,
} from "@/features/trial-balance/services/tb-workbook";
import { formatCurrency } from "@/lib/formatters";
import { useI18n } from "@/lib/i18n/useI18n";
import { useDocTraceStore } from "@/stores/app-store";
import type { SelectionSnapshot } from "@/types/domain";

const mockInitialAccounts: TrialBalanceAccount[] = [
  {
    code: "10100",
    description: "Cash on Hand",
    debit: 4500,
    credit: 0,
    mapping: "Cash & Equivalents",
  },
  {
    code: "10200",
    description: "CB Bank - Operating",
    debit: 125400,
    credit: 0,
    mapping: "Cash & Equivalents",
  },
  {
    code: "10300",
    description: "KBZ Bank - Saving",
    debit: 75000,
    credit: 0,
    mapping: "Cash & Equivalents",
  },
  {
    code: "11100",
    description: "Accounts Receivable",
    debit: 45800,
    credit: 0,
    mapping: "Accounts Receivable",
  },
  {
    code: "11200",
    description: "Allowance for Doubtful Accounts",
    debit: 0,
    credit: 1500,
    mapping: "Accounts Receivable",
  },
  {
    code: "12100",
    description: "Prepaid Insurance",
    debit: 12000,
    credit: 0,
    mapping: "Prepayments & Other Assets",
  },
  {
    code: "15100",
    description: "Office Equipment",
    debit: 34000,
    credit: 0,
    mapping: "Property, Plant & Equipment",
  },
  {
    code: "15200",
    description: "Accumulated Depreciation",
    debit: 0,
    credit: 8400,
    mapping: "Property, Plant & Equipment",
  },
  {
    code: "20100",
    description: "Accounts Payable",
    debit: 0,
    credit: 32400,
    mapping: "Accounts Payable",
  },
  {
    code: "20200",
    description: "Accrued Liabilities",
    debit: 0,
    credit: 5400,
    mapping: "Accrued Expenses",
  },
  {
    code: "30100",
    description: "Share Capital",
    debit: 0,
    credit: 200000,
    mapping: "Equity",
  },
  {
    code: "30200",
    description: "Retained Earnings",
    debit: 0,
    credit: 37900,
    mapping: "Equity",
  },
  {
    code: "40100",
    description: "Service Revenue",
    debit: 0,
    credit: 114500,
    mapping: "Revenue",
  },
  {
    code: "50100",
    description: "Rent Expense",
    debit: 18000,
    credit: 0,
    mapping: "Expenses",
  },
  {
    code: "50200",
    description: "Salaries Expense",
    debit: 65000,
    credit: 0,
    mapping: "Expenses",
  },
  {
    code: "50300",
    description: "Office Supplies",
    debit: 1600,
    credit: 0,
    mapping: "Expenses",
  },
];

interface TrialBalanceProps {
  onApplyTbSampleSelection: (selection: SelectionSnapshot) => boolean;
}

export function TrialBalance({ onApplyTbSampleSelection }: TrialBalanceProps) {
  const { pushToast } = useDocTraceStore();
  const { t } = useI18n();
  const [accounts, setAccounts] =
    useState<TrialBalanceAccount[]>(mockInitialAccounts);
  const [listing, setListing] = useState<ListingRow[]>([]);
  const [hasAccountColumn, setHasAccountColumn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMappingCode, setActiveMappingCode] = useState<string | null>(
    null,
  );
  const [selectedLead, setSelectedLead] = useState("Accounts Payable");
  const [tickedIds, setTickedIds] = useState<Set<string>>(new Set());
  const tbInputRef = useRef<HTMLInputElement>(null);
  const listingInputRef = useRef<HTMLInputElement>(null);
  const mappingRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeMappingCode) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        mappingRootRef.current &&
        !mappingRootRef.current.contains(event.target as Node)
      ) {
        setActiveMappingCode(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMappingCode(null);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMappingCode]);

  const { totalDebits, totalCredits, isBalanced } = useMemo(() => {
    let debits = 0;
    let credits = 0;
    accounts.forEach((acc) => {
      debits += acc.debit;
      credits += acc.credit;
    });
    return {
      totalDebits: debits,
      totalCredits: credits,
      isBalanced: Math.abs(debits - credits) < 0.01,
    };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return accounts;
    const query = searchQuery.toLowerCase();
    return accounts.filter(
      (acc) =>
        acc.code.includes(query) ||
        acc.description.toLowerCase().includes(query) ||
        acc.mapping.toLowerCase().includes(query),
    );
  }, [accounts, searchQuery]);

  const leadOptions = useMemo(() => mappedLeadOptions(accounts), [accounts]);

  const activeLead = leadOptions.includes(selectedLead)
    ? selectedLead
    : (leadOptions[0] ?? "");

  const population = useMemo(
    () => filterListingByLead(listing, accounts, activeLead, hasAccountColumn),
    [listing, accounts, activeLead, hasAccountColumn],
  );

  const tieOut = useMemo(
    () => (activeLead ? leadTieOut(accounts, population, activeLead) : null),
    [accounts, population, activeLead],
  );

  const handleUpdateMapping = (code: string, nextGroup: string) => {
    setAccounts((current) =>
      current.map((account) =>
        account.code === code ? { ...account, mapping: nextGroup } : account,
      ),
    );
    setActiveMappingCode(null);
  };

  const toastParseError = () => {
    pushToast({
      tone: "error",
      title: t("tb.parseFailed"),
    });
  };

  const handleTbFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) {
      return;
    }

    const parsed = parseTrialBalanceWorkbook(await file.arrayBuffer());

    if (!parsed.ok) {
      toastParseError();
      return;
    }

    setAccounts(parsed.value);
    setActiveMappingCode(null);
  };

  const handleListingFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) {
      return;
    }

    const parsed = parseListingWorkbook(await file.arrayBuffer());

    if (!parsed.ok) {
      toastParseError();
      return;
    }

    setListing(parsed.value.rows);
    setHasAccountColumn(parsed.value.hasAccountColumn);
    setTickedIds(new Set());
  };

  const toggleTick = (id: string) => {
    setTickedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllInView = () => {
    setTickedIds((current) => {
      const next = new Set(current);
      population.forEach((row) => next.add(row.id));
      return next;
    });
  };

  const tickedRows = population.filter((row) => tickedIds.has(row.id));

  const handleSend = () => {
    onApplyTbSampleSelection(listingToSelectionSnapshot(tickedRows));
  };

  return (
    <div className="grid gap-3">
      <section className="dt-panel">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="dt-kicker">{t("tb.kicker")}</p>
            <h2 className="dt-section-title">{t("tb.title")}</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {t("tb.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => tbInputRef.current?.click()}
              className="dt-button-primary"
              type="button"
            >
              <CloudUpload className="h-4 w-4" />
              {t("tb.importTb")}
            </button>
            <button
              onClick={() => listingInputRef.current?.click()}
              className="dt-button-secondary"
              type="button"
            >
              <CloudUpload className="h-4 w-4" />
              {t("tb.importListing")}
            </button>
            <input
              accept={SPREADSHEET_FILE_ACCEPT}
              aria-label={t("tb.importTb")}
              className="sr-only"
              onChange={(event) => {
                void handleTbFile(event.target.files);
                event.currentTarget.value = "";
              }}
              ref={tbInputRef}
              tabIndex={-1}
              type="file"
            />
            <input
              accept={SPREADSHEET_FILE_ACCEPT}
              aria-label={t("tb.importListing")}
              className="sr-only"
              onChange={(event) => {
                void handleListingFile(event.target.files);
                event.currentTarget.value = "";
              }}
              ref={listingInputRef}
              tabIndex={-1}
              type="file"
            />
          </div>
        </div>
      </section>

      <section className="dt-panel p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {isBalanced ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/10">
                <XCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBalanced ? t("tb.balanceOk") : t("tb.balanceWarn")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("tb.balanceHint")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="rounded-xl border border-white/60 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5">
              {t("tb.debits")}{" "}
              <span className="text-sky-600 dark:text-sky-400">
                {formatCurrency(totalDebits)}
              </span>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5">
              {t("tb.credits")}{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalCredits)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="dt-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
            <Coins className="h-3.5 w-3.5 text-sky-500" />
            <span>{t("tb.mappings")}</span>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t("tb.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/60 py-2.5 pr-3 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex min-w-0 flex-col gap-2">
          {filteredAccounts.map((account) => {
            const isMappingActive = activeMappingCode === account.code;

            return (
              <article
                key={account.code}
                className="flex min-w-0 flex-col gap-2 rounded-xl border border-slate-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-950/40"
              >
                <div className="flex min-w-0 items-baseline justify-between gap-2">
                  <span className="shrink-0 font-mono text-[0.65rem] font-bold text-slate-500 dark:text-slate-400">
                    {account.code}
                  </span>
                  <span className="min-w-0 truncate text-xs font-bold text-slate-900 dark:text-white">
                    {account.description}
                  </span>
                </div>
                <div className="flex min-w-0 justify-between gap-2 text-[0.65rem] font-medium text-slate-700 dark:text-slate-300">
                  <span>
                    {t("tb.colDebit")}{" "}
                    {account.debit > 0 ? formatCurrency(account.debit) : "-"}
                  </span>
                  <span>
                    {t("tb.colCredit")}{" "}
                    {account.credit > 0 ? formatCurrency(account.credit) : "-"}
                  </span>
                </div>
                <div
                  className="relative min-w-0"
                  ref={isMappingActive ? mappingRootRef : undefined}
                >
                  <button
                    aria-expanded={isMappingActive}
                    aria-haspopup="listbox"
                    aria-label={t("tb.colMapping")}
                    className="flex w-full min-w-0 items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-left text-[0.65rem] font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                    onClick={() =>
                      setActiveMappingCode(
                        isMappingActive ? null : account.code,
                      )
                    }
                    type="button"
                  >
                    <ArrowRightLeft className="h-3 w-3 shrink-0 text-sky-500" />
                    <span className="min-w-0 flex-1 truncate">
                      {account.mapping}
                    </span>
                    <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
                  </button>
                  {isMappingActive ? (
                    <div className="absolute top-full right-0 left-0 z-20 mt-1 rounded-xl border border-white/80 bg-white/95 p-1 shadow-xl dark:border-white/5 dark:bg-slate-900/95">
                      <ul
                        className="max-h-40 overflow-y-auto py-1 text-[0.7rem] font-bold"
                        role="listbox"
                      >
                        {TB_STANDARD_GROUPS.map((group) => (
                          <li key={group}>
                            <button
                              onClick={() =>
                                handleUpdateMapping(account.code, group)
                              }
                              className={`w-full rounded-lg px-2.5 py-1.5 text-left ${
                                account.mapping === group
                                  ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400"
                                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                              }`}
                              type="button"
                            >
                              {group}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dt-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="grid gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            {t("tb.pickLead")}
            <select
              className="rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
              onChange={(event) => setSelectedLead(event.target.value)}
              value={activeLead}
            >
              {leadOptions.length === 0 ? (
                <option value="">{t("tb.pickLead")}</option>
              ) : (
                leadOptions.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))
              )}
            </select>
          </label>
          {tieOut ? (
            <p className="text-[0.7rem] font-medium text-slate-600 dark:text-slate-400">
              {tieOut.tied ? t("tb.tieOutOk") : t("tb.tieOutWarn")}{" "}
              {formatCurrency(tieOut.listingAbs)} /{" "}
              {formatCurrency(tieOut.tbAbs)}
            </p>
          ) : null}
        </div>

        {population.length === 0 ? (
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            {t("tb.listingEmpty")}
          </p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="dt-button-ghost px-3 py-1.5 text-[0.7rem]"
                onClick={selectAllInView}
                type="button"
              >
                {t("tb.selectAll")}
              </button>
              <button
                className="dt-button-primary px-3 py-1.5 text-[0.7rem]"
                disabled={tickedRows.length === 0}
                onClick={handleSend}
                type="button"
              >
                {t("tb.sendToMatching")}
              </button>
            </div>
            <div className="mt-4 flex min-w-0 flex-col gap-2">
              {population.map((row) => (
                <article
                  key={row.id}
                  className="flex min-w-0 flex-col gap-1 rounded-xl border border-slate-200/80 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-950/40"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <input
                      aria-label={row.invoice}
                      checked={tickedIds.has(row.id)}
                      className="shrink-0"
                      onChange={() => toggleTick(row.id)}
                      type="checkbox"
                    />
                    <span className="min-w-0 truncate font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {row.invoice}
                    </span>
                  </div>
                  <div className="flex min-w-0 justify-between gap-2 text-[0.65rem] text-slate-700 dark:text-slate-300">
                    <span>{row.date}</span>
                    <span className="font-mono">
                      {formatCurrency(row.amount)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="rounded-[2.5rem] border border-white/80 bg-white/40 p-5 dark:border-white/5 dark:bg-slate-900/40">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/10">
            <FileCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {t("tb.guidelinesTitle")}
            </p>
            <p className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              {t("tb.sendHint")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

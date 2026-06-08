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
import { useState, useMemo } from "react";
import { useDocTraceStore } from "@/state/app-store";

interface TrialBalanceAccount {
  code: string;
  description: string;
  debit: number;
  credit: number;
  mapping: string;
}

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

const standardGroups = [
  "Unmapped",
  "Cash & Equivalents",
  "Accounts Receivable",
  "Prepayments & Other Assets",
  "Property, Plant & Equipment",
  "Accounts Payable",
  "Accrued Expenses",
  "Equity",
  "Revenue",
  "Expenses",
];

export function TrialBalance() {
  const { locale } = useDocTraceStore();
  const [accounts, setAccounts] =
    useState<TrialBalanceAccount[]>(mockInitialAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeMappingIndex, setActiveMappingIndex] = useState<number | null>(
    null,
  );

  // Compute totals
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

  // Filter accounts
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

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Simulate randomizing some debit/credit balances
      const updated = accounts.map((acc) => {
        if (acc.code === "10100") return { ...acc, debit: 5500 }; // change cash
        if (acc.code === "50300") return { ...acc, debit: 2600 }; // balance Rent vs supplies
        return acc;
      });
      setAccounts(updated);
    }, 1200);
  };

  const handleUpdateMapping = (index: number, nextGroup: string) => {
    const updated = [...accounts];
    updated[index] = { ...updated[index], mapping: nextGroup };
    setAccounts(updated);
    setActiveMappingIndex(null);
  };

  return (
    <div className="grid gap-3">
      {/* Title section */}
      <section className="dt-panel">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="dt-kicker">⚖️ Trial Balance Module</p>
            <h2 className="dt-section-title">
              {locale === "my-MM"
                ? "Trial Balance စစ်ဆေးခြင်း"
                : "Trial Balance Verification"}
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Import audit trial balances, map ledger accounts, and verify
              mathematical accuracy.
            </p>
          </div>
          <button
            onClick={handleSimulateUpload}
            disabled={isUploading}
            className="dt-button-primary"
            type="button"
          >
            <CloudUpload className="h-4 w-4" />
            {isUploading ? "Importing..." : "Import Trial Balance"}
          </button>
        </div>
      </section>

      {/* Balance checker banner */}
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
                {isBalanced
                  ? "Balance Status: Ledger Balanced"
                  : "Balance Status: Ledger Imbalance"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Debits must exactly match Total Credits to proceed.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="rounded-xl border border-white/60 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5">
              Debits:{" "}
              <span className="text-sky-600 dark:text-sky-400">
                $
                {totalDebits.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5">
              Credits:{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                $
                {totalCredits.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Accounts List and Mapper */}
      <section className="dt-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
            <Coins className="h-3.5 w-3.5 text-sky-500" />
            <span>Ledger Account Mappings</span>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/60 py-2.5 pr-3 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                <th className="px-3 py-2.5 font-bold">Code</th>
                <th className="px-3 py-2.5 font-bold">Account Description</th>
                <th className="px-3 py-2.5 text-right font-bold">Debit</th>
                <th className="px-3 py-2.5 text-right font-bold">Credit</th>
                <th className="px-3 py-2.5 text-center font-bold">
                  F/S Group Mapping
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredAccounts.map((account, index) => {
                const isMappingActive = activeMappingIndex === index;

                return (
                  <tr
                    key={account.code}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/10"
                  >
                    <td className="text-slate-550 px-3 py-3 font-mono font-bold dark:text-slate-400">
                      {account.code}
                    </td>
                    <td className="px-3 py-3 font-bold text-slate-900 dark:text-white">
                      {account.description}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                      {account.debit > 0
                        ? `$${account.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : "-"}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                      {account.credit > 0
                        ? `$${account.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : "-"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() =>
                            setActiveMappingIndex(
                              isMappingActive ? null : index,
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-[0.65rem] font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                          type="button"
                        >
                          <ArrowRightLeft className="h-3 w-3 text-sky-500" />
                          <span>{account.mapping}</span>
                          <ChevronDown className="h-3 w-3 text-slate-400" />
                        </button>

                        {isMappingActive && (
                          <div className="absolute right-0 bottom-full z-20 mb-2 w-48 rounded-xl border border-white/80 bg-white/95 p-1 shadow-xl backdrop-blur-md dark:border-white/5 dark:bg-slate-900/95">
                            <ul className="max-h-40 overflow-y-auto py-1 text-[0.7rem] font-bold">
                              {standardGroups.map((group) => (
                                <li key={group}>
                                  <button
                                    onClick={() =>
                                      handleUpdateMapping(index, group)
                                    }
                                    className={`w-full rounded-lg px-2.5 py-1.5 text-left transition-colors ${
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
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Instructions check card */}
      <section className="rounded-[2.5rem] border border-white/80 bg-white/40 p-5 dark:border-white/5 dark:bg-slate-900/40">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/10">
            <FileCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Analytical TB Rollover Guidelines
            </p>
            <p className="text-xs leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              Ledger lines mapped to <strong>Cash & Equivalents</strong> and{" "}
              <strong>Accounts Payable</strong> will automatically populate in
              Step 1 Selection mapping models. Updates to Trial Balance
              classifications refresh workbook reference targets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

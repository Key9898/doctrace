import * as XLSX from "xlsx";

import {
  TB_DEFAULT_MAPPING,
  type ListingRow,
  type TbParseResult,
  type TrialBalanceAccount,
} from "@/features/trial-balance/services/tb-types";

const TB_CODE_ALIASES = [
  "code",
  "account",
  "account code",
  "gl",
  "gl code",
  "acc",
] as const;

const TB_DESCRIPTION_ALIASES = ["description", "name", "account name"] as const;

const TB_DEBIT_ALIASES = ["debit"] as const;
const TB_CREDIT_ALIASES = ["credit"] as const;

const LISTING_INVOICE_ALIASES = [
  "invoice",
  "invoice number",
  "invoice no",
  "inv",
  "voucher",
  "reference",
] as const;

const LISTING_DATE_ALIASES = ["date", "invoice date"] as const;
const LISTING_AMOUNT_ALIASES = ["amount", "value"] as const;
const LISTING_ACCOUNT_ALIASES = ["account", "account code"] as const;
const LISTING_VENDOR_ALIASES = ["vendor"] as const;

export function normalizeHeader(raw: unknown): string {
  return String(raw ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function indexForAliases(
  headers: string[],
  aliases: readonly string[],
): number | "missing" | "duplicate" {
  const hits: number[] = [];

  headers.forEach((header, index) => {
    if (aliases.includes(header)) {
      hits.push(index);
    }
  });

  if (hits.length === 0) {
    return "missing";
  }

  if (hits.length > 1) {
    return "duplicate";
  }

  return hits[0] ?? "missing";
}

function readFirstSheetRows(buffer: ArrayBuffer): unknown[][] | null {
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
  });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return null;
  }

  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    return null;
  }

  return XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: true,
    defval: null,
  });
}

function cellText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function cellNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function cellIsoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const parsed = XLSX.SSF.parse_date_code(value);

    if (parsed) {
      const month = String(parsed.m).padStart(2, "0");
      const day = String(parsed.d).padStart(2, "0");
      return `${parsed.y}-${month}-${day}`;
    }
  }

  return cellText(value);
}

function requiredIndex(
  headers: string[],
  aliases: readonly string[],
): TbParseResult<number> {
  const index = indexForAliases(headers, aliases);

  if (index === "missing") {
    return { ok: false, error: "headers" };
  }

  if (index === "duplicate") {
    return { ok: false, error: "duplicate" };
  }

  return { ok: true, value: index };
}

export function parseTrialBalanceWorkbook(
  buffer: ArrayBuffer,
): TbParseResult<TrialBalanceAccount[]> {
  const matrix = readFirstSheetRows(buffer);

  if (!matrix || matrix.length === 0) {
    return { ok: false, error: "empty" };
  }

  const headers = (matrix[0] ?? []).map(normalizeHeader);
  const code = requiredIndex(headers, TB_CODE_ALIASES);

  if (!code.ok) {
    return code;
  }

  const description = requiredIndex(headers, TB_DESCRIPTION_ALIASES);

  if (!description.ok) {
    return description;
  }

  const debit = requiredIndex(headers, TB_DEBIT_ALIASES);

  if (!debit.ok) {
    return debit;
  }

  const credit = requiredIndex(headers, TB_CREDIT_ALIASES);

  if (!credit.ok) {
    return credit;
  }

  const rows: TrialBalanceAccount[] = [];

  for (let index = 1; index < matrix.length; index += 1) {
    const row = matrix[index] ?? [];
    const accountCode = cellText(row[code.value]);

    if (!accountCode) {
      continue;
    }

    rows.push({
      code: accountCode,
      description: cellText(row[description.value]),
      debit: cellNumber(row[debit.value]),
      credit: cellNumber(row[credit.value]),
      mapping: TB_DEFAULT_MAPPING,
    });
  }

  if (rows.length === 0) {
    return { ok: false, error: "empty" };
  }

  return { ok: true, value: rows };
}

export function parseListingWorkbook(
  buffer: ArrayBuffer,
): TbParseResult<{ rows: ListingRow[]; hasAccountColumn: boolean }> {
  const matrix = readFirstSheetRows(buffer);

  if (!matrix || matrix.length === 0) {
    return { ok: false, error: "empty" };
  }

  const headers = (matrix[0] ?? []).map(normalizeHeader);
  const invoice = requiredIndex(headers, LISTING_INVOICE_ALIASES);

  if (!invoice.ok) {
    return invoice;
  }

  const date = requiredIndex(headers, LISTING_DATE_ALIASES);

  if (!date.ok) {
    return date;
  }

  const amount = requiredIndex(headers, LISTING_AMOUNT_ALIASES);

  if (!amount.ok) {
    return amount;
  }

  const accountIndex = indexForAliases(headers, LISTING_ACCOUNT_ALIASES);

  if (accountIndex === "duplicate") {
    return { ok: false, error: "duplicate" };
  }

  const vendorIndex = indexForAliases(headers, LISTING_VENDOR_ALIASES);

  if (vendorIndex === "duplicate") {
    return { ok: false, error: "duplicate" };
  }

  const hasAccountColumn = accountIndex !== "missing";
  const rows: ListingRow[] = [];

  for (let index = 1; index < matrix.length; index += 1) {
    const row = matrix[index] ?? [];
    const invoiceValue = cellText(row[invoice.value]);
    const dateValue = cellIsoDate(row[date.value]);
    const amountValue = cellNumber(row[amount.value]);

    if (!invoiceValue && !dateValue && amountValue === 0) {
      continue;
    }

    const account =
      hasAccountColumn && typeof accountIndex === "number"
        ? cellText(row[accountIndex])
        : "";
    const vendor =
      vendorIndex !== "missing" && typeof vendorIndex === "number"
        ? cellText(row[vendorIndex])
        : "";

    rows.push({
      id: `list_${index}`,
      invoice: invoiceValue,
      date: dateValue,
      amount: amountValue,
      ...(account ? { account } : {}),
      ...(vendor ? { vendor } : {}),
    });
  }

  if (rows.length === 0) {
    return { ok: false, error: "empty" };
  }

  return { ok: true, value: { rows, hasAccountColumn } };
}

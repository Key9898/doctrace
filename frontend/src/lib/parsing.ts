import type { ExcelPrimitive } from "@/types/domain";

const AMOUNT_PATTERN =
  /(?:USD|EUR|GBP|MMK|\$)?\s*-?(?:\b\d{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{2})\b|\b\d+(?:[.,]\d{2})\b|\b\d{1,3}(?:[.,\s]\d{3})+(?!\d))/gi;
const DATE_PATTERNS = [
  /\b\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}\b/g,
  /\b\d{4}[/.-]\d{1,2}[/.-]\d{1,2}\b/g,
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi,
];

export function normalizeText(value: ExcelPrimitive) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

export function normalizeAlphaNumeric(value: ExcelPrimitive) {
  return normalizeText(value)
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase();
}

export function parseFlexibleNumber(rawValue: ExcelPrimitive) {
  if (typeof rawValue === "number") {
    return Number.isFinite(rawValue) ? rawValue : undefined;
  }

  const raw = normalizeText(rawValue).replace(/[^\d,.-]/g, "");

  if (!raw) {
    return undefined;
  }

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  let normalized = raw;

  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) {
      normalized = raw.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = raw.replace(/,/g, "");
    }
  } else if (lastComma > -1) {
    const decimals = raw.length - lastComma - 1;
    normalized =
      decimals === 2
        ? raw.replace(/\./g, "").replace(",", ".")
        : raw.replace(/,/g, "");
  } else {
    normalized = raw.replace(/,/g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parsePossibleDate(rawValue: ExcelPrimitive) {
  const value = normalizeText(rawValue);

  if (!value) {
    return undefined;
  }

  const isoCandidate = new Date(value);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate.toISOString().slice(0, 10);
  }

  const match = value.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})\b/);
  if (match) {
    const [, dd, mm, yyyy] = match;
    const year = yyyy.length === 2 ? `20${yyyy}` : yyyy;
    const date = new Date(Number(year), Number(mm) - 1, Number(dd));
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  return undefined;
}

export function extractAmounts(text: string) {
  return collectRegexMatches(text, AMOUNT_PATTERN)
    .map((value) => ({
      raw: value,
      value: parseFlexibleNumber(value),
    }))
    .filter((entry) => typeof entry.value === "number");
}

export function extractDates(text: string) {
  const matches = DATE_PATTERNS.reduce<string[]>(
    (items, pattern) => [...items, ...collectRegexMatches(text, pattern)],
    [],
  );

  return matches
    .map((value) => ({
      raw: value,
      value: parsePossibleDate(value),
    }))
    .filter((entry) => Boolean(entry.value));
}

export function extractInvoiceIdentifiers(text: string) {
  const exactMatches = collectRegexMatches(
    text,
    /\b(?:invoice|inv|reference|ref|voucher|receipt)\s*(?:no|number|#|nr)?[:\s-]*([a-z0-9-]{4,})\b/gi,
    1,
  );
  const fallbackTokens = collectRegexMatches(text, /\b[A-Z0-9-]{6,}\b/g);

  const candidates = [...new Set([...exactMatches, ...fallbackTokens])];

  const EXCLUDED_WORDS = new Set([
    "bill",
    "to",
    "from",
    "date",
    "due",
    "invoice",
    "receipt",
    "reference",
    "statement",
    "payment",
    "amount",
    "total",
    "tax",
    "vat",
    "consignee",
    "client",
    "vendor",
    "customer",
    "terms",
    "description",
    "qty",
    "quantity",
    "price",
    "subtotal",
    "phone",
    "email",
    "address",
    "page",
    "code",
    "bank",
    "account",
    "number",
    "value",
    "name",
    "charges",
    "service",
    "office",
    "cardholder",
    "withdrawals",
    "deposits",
    "balance",
    "details",
    "references",
    "erences",
  ]);

  return candidates.filter((token) => {
    const norm = token.toLowerCase();

    // Exclude dates (e.g. 2026-05-02, 2026/05/02)
    if (/^\d{4}[/.-]\d{2}[/.-]\d{2}$/.test(token)) return false;

    // Exclude pure numbers of 4 digits or less (e.g. years like 2026)
    if (/^\d{1,4}$/.test(token)) return false;

    // Exclude common header keywords
    if (EXCLUDED_WORDS.has(norm)) return false;

    return true;
  });
}

function collectRegexMatches(text: string, pattern: RegExp, groupIndex = 0) {
  const matches: string[] = [];
  const flags = pattern.global ? pattern.flags : `${pattern.flags}g`;
  const safePattern = new RegExp(pattern.source, flags);
  let match: RegExpExecArray | null;

  while ((match = safePattern.exec(text)) !== null) {
    const value = match[groupIndex];

    if (value) {
      matches.push(value);
    }

    if (safePattern.lastIndex === match.index) {
      safePattern.lastIndex += 1;
    }
  }

  return matches;
}

export function splitIntoLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function compareDatesWithinTolerance(
  left?: string,
  right?: string,
  toleranceDays = 0,
) {
  if (!left || !right) {
    return false;
  }

  const leftDate = new Date(left);
  const rightDate = new Date(right);

  if (Number.isNaN(leftDate.getTime()) || Number.isNaN(rightDate.getTime())) {
    return false;
  }

  const delta = Math.abs(leftDate.getTime() - rightDate.getTime());
  return delta <= toleranceDays * 24 * 60 * 60 * 1000;
}

export function fuzzyIncludes(left: string, right: string) {
  const normalizedLeft = normalizeAlphaNumeric(left);
  const normalizedRight = normalizeAlphaNumeric(right);

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  return (
    normalizedLeft.includes(normalizedRight) ||
    normalizedRight.includes(normalizedLeft) ||
    levenshteinDistance(normalizedLeft, normalizedRight) <= 2
  );
}

function levenshteinDistance(left: string, right: string) {
  const matrix = Array.from({ length: left.length + 1 }, () =>
    Array(right.length + 1).fill(0),
  );

  for (let i = 0; i <= left.length; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= right.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[left.length][right.length];
}

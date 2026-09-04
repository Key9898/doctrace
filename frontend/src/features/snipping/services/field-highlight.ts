import type {
  MatchResult,
  ParsedDocument,
  SnipBoundingBox,
} from "@/types/domain";
import { normalizeAlphaNumeric } from "@/lib/parsing";

const MIN_QUERY_LENGTH = 3;

export interface FieldLocateItem {
  str: string;
  boundingBox: SnipBoundingBox;
}

function wantsInvoiceNumber(fields: string[]) {
  return fields.some(
    (field) => field === "invoice number" || field.startsWith("invoice number"),
  );
}

function pushQuery(queries: string[], value?: string | number) {
  if (value === undefined || value === null) {
    return;
  }

  const text = String(value).trim();
  if (!text) {
    return;
  }

  queries.push(text);
}

export function queriesForMatch(
  result: MatchResult,
  document: ParsedDocument,
): string[] {
  const queries: string[] = [];

  if (document.id === result.invoiceMatch?.documentId) {
    const fields = result.matchedFields ?? [];
    if (wantsInvoiceNumber(fields)) {
      pushQuery(queries, document.invoiceNumber?.sourceText);
      pushQuery(queries, document.invoiceNumber?.value);
    }
    if (fields.includes("amount")) {
      pushQuery(queries, document.amount?.sourceText);
      pushQuery(queries, document.amount?.value);
    }
    if (fields.includes("date")) {
      pushQuery(queries, document.date?.sourceText);
      pushQuery(queries, document.date?.value);
    }
  }

  if (document.id === result.bankMatch?.documentId) {
    const fields = result.bankMatchedFields ?? [];
    const entry = document.statementEntries.find(
      (item) => item.id === result.bankMatch?.entryId,
    );
    if (entry) {
      if (wantsInvoiceNumber(fields)) {
        pushQuery(queries, entry.reference);
      }
      if (fields.includes("amount") && typeof entry.amount === "number") {
        pushQuery(queries, entry.amount);
      }
      if (fields.includes("date")) {
        pushQuery(queries, entry.date);
      }
      if (fields.length > 0) {
        pushQuery(queries, entry.rawLine);
      }
    }
  }

  return [...new Set(queries)];
}

function boxKey(box: SnipBoundingBox) {
  return `${box.x}:${box.y}:${box.width}:${box.height}`;
}

function lineGroupKey(y: number) {
  return Math.round(y * 100);
}

export function locateFieldBoxes(
  items: FieldLocateItem[],
  queries: string[],
): SnipBoundingBox[] {
  const boxes: SnipBoundingBox[] = [];
  const seen = new Set<string>();

  const addBox = (box: SnipBoundingBox) => {
    const key = boxKey(box);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    boxes.push(box);
  };

  for (const query of queries) {
    const normalizedQuery = normalizeAlphaNumeric(query);
    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      continue;
    }

    let hit = false;
    for (const item of items) {
      const normalizedItem = normalizeAlphaNumeric(item.str);
      if (normalizedItem.length < MIN_QUERY_LENGTH) {
        continue;
      }
      if (
        normalizedItem.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedItem)
      ) {
        addBox(item.boundingBox);
        hit = true;
      }
    }

    if (hit) {
      continue;
    }

    const lines = new Map<number, FieldLocateItem[]>();
    for (const item of items) {
      const key = lineGroupKey(item.boundingBox.y);
      const line = lines.get(key) ?? [];
      line.push(item);
      lines.set(key, line);
    }

    for (const line of lines.values()) {
      const sorted = [...line].sort(
        (left, right) => left.boundingBox.x - right.boundingBox.x,
      );
      let concat = "";
      const spans: Array<{
        start: number;
        end: number;
        item: FieldLocateItem;
      }> = [];

      for (const item of sorted) {
        const token = normalizeAlphaNumeric(item.str);
        if (!token) {
          continue;
        }
        spans.push({
          start: concat.length,
          end: concat.length + token.length,
          item,
        });
        concat += token;
      }

      if (concat.length < MIN_QUERY_LENGTH) {
        continue;
      }

      const index = concat.indexOf(normalizedQuery);
      if (index >= 0) {
        const end = index + normalizedQuery.length;
        for (const span of spans) {
          if (span.end > index && span.start < end) {
            addBox(span.item.boundingBox);
          }
        }
        continue;
      }

      if (normalizedQuery.includes(concat)) {
        for (const span of spans) {
          addBox(span.item.boundingBox);
        }
      }
    }
  }

  return boxes;
}

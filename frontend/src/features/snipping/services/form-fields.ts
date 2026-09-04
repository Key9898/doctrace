import type { AppLocale } from "@/lib/i18n/locales";
import { translate, type TranslationKey } from "@/lib/i18n/translations";
import type { Snip, SnipFormField } from "@/types/domain";

export const FORM_FIELD_ORDER: SnipFormField[] = [
  "invoice-number",
  "date",
  "amount",
  "reference",
  "other",
];

export const FORM_FIELD_LABEL_KEYS: Record<SnipFormField, TranslationKey> = {
  "invoice-number": "snips.formFieldInvoiceNumber",
  date: "snips.formFieldDate",
  amount: "snips.formFieldAmount",
  reference: "snips.formFieldReference",
  other: "snips.formFieldOther",
};

export type FormSnipsReadyResult =
  | { status: "ready"; snips: Snip[] }
  | { status: "empty" }
  | { status: "mixed-document" };

export function canTagSnip(snip: Pick<Snip, "sourceType">) {
  return (
    snip.sourceType === "pdf-word" ||
    snip.sourceType === "pdf-line" ||
    snip.sourceType === "pdf-text"
  );
}

export function sortFormSnips(snips: Snip[]) {
  return [...snips]
    .filter((snip) => canTagSnip(snip) && snip.formField)
    .sort((left, right) => {
      const leftField = left.formField;
      const rightField = right.formField;
      const rank =
        (leftField ? FORM_FIELD_ORDER.indexOf(leftField) : 99) -
        (rightField ? FORM_FIELD_ORDER.indexOf(rightField) : 99);
      if (rank !== 0) {
        return rank;
      }
      return (
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      );
    });
}

export function formSnipsReady(snips: Snip[]): FormSnipsReadyResult {
  const tagged = snips.filter((snip) => canTagSnip(snip) && snip.formField);
  if (tagged.length === 0) {
    return { status: "empty" };
  }

  const documentId = tagged[0]?.documentId;
  if (tagged.some((snip) => snip.documentId !== documentId)) {
    return { status: "mixed-document" };
  }

  return { status: "ready", snips: sortFormSnips(tagged) };
}

export function buildFormGrid(snips: Snip[], locale: AppLocale) {
  return sortFormSnips(snips).map((snip) => {
    const field = snip.formField;
    return [
      field ? translate(locale, FORM_FIELD_LABEL_KEYS[field]) : "",
      snip.text,
    ];
  });
}

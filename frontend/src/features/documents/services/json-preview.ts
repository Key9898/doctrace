import type { ParsedDocument } from "@/types/domain";

export function jsonDocumentPreviewText(
  document: Pick<ParsedDocument, "extractedText" | "pages">,
): string {
  const extracted = document.extractedText.trim();
  if (extracted) {
    return extracted;
  }

  return document.pages
    .map((page) => page.text)
    .join("\n")
    .trim();
}

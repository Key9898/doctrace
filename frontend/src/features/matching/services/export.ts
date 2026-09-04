import type { MatchResult } from "@/types/domain";

export function exportMatchResultsToCsv(results: MatchResult[]): string {
  const headers = [
    "Row",
    "Status",
    "Confidence",
    "Invoice File",
    "Bank File",
    "Explanation",
  ];

  const rows = results.map((result) => [
    result.rowNumber.toString(),
    result.status,
    `${result.confidence}%`,
    result.invoiceMatch?.fileName ?? "",
    result.bankMatch?.fileName ?? "",
    result.explanation.replace(/"/g, '""'),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

export function downloadCsv(content: string, fileName: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportMatchResultsToExcel(
  results: MatchResult[],
): Record<string, unknown>[] {
  return results.map((result) => ({
    Row: result.rowNumber,
    Status: result.status,
    Confidence: result.confidence,
    "Invoice File": result.invoiceMatch?.fileName ?? "",
    "Bank File": result.bankMatch?.fileName ?? "",
    Explanation: result.explanation,
  }));
}

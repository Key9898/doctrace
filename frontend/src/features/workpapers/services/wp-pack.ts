import { normalizeIdentity } from "@/features/office/services/audit-log.service";
import type {
  AuditIdentity,
  MatchResult,
  Snip,
  TodWorkpaperPack,
} from "@/types/domain";

export type TodWorkpaperPackResult =
  | { ok: true; value: TodWorkpaperPack }
  | { ok: false };

export function buildTodWorkpaperPack(
  results: MatchResult[],
  snips: Snip[],
  identity: AuditIdentity,
): TodWorkpaperPackResult {
  if (results.length === 0) {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      sentAt: new Date().toISOString(),
      identity: normalizeIdentity(identity),
      rows: results.map((result) => ({
        rowNumber: result.rowNumber,
        status: result.status,
      })),
      snips: snips.map((snip) => ({
        id: snip.id,
        fileName: snip.fileName,
        pageNumber: snip.pageNumber,
      })),
    },
  };
}

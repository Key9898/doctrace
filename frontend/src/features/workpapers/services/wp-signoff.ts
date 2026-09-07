import { evaluateIdentity } from "@/features/office/services/audit-log.service";
import type {
  AuditIdentity,
  RowSignOff,
  TodWorkpaperPack,
  TodWorkpaperRow,
} from "@/types/domain";

const OPEN_STATUSES = new Set(["partial", "exception"]);

export function unsignedOpenRows(
  pack: TodWorkpaperPack | undefined,
  rowSignOffs: Record<number, RowSignOff>,
): TodWorkpaperRow[] {
  if (!pack) {
    return [];
  }

  return pack.rows.filter(
    (row) => OPEN_STATUSES.has(row.status) && !rowSignOffs[row.rowNumber],
  );
}

export function canSignTodWorkpaperFile(
  pack: TodWorkpaperPack | undefined,
  rowSignOffs: Record<number, RowSignOff>,
  identity: AuditIdentity,
): boolean {
  if (!pack) {
    return false;
  }

  if (!evaluateIdentity(identity).ok) {
    return false;
  }

  return unsignedOpenRows(pack, rowSignOffs).length === 0;
}

export function hasFollowUpOpen(
  pack: TodWorkpaperPack | undefined,
  rowSignOffs: Record<number, RowSignOff>,
): boolean {
  if (!pack) {
    return false;
  }

  return pack.rows.some((row) => {
    if (!OPEN_STATUSES.has(row.status)) {
      return false;
    }

    return rowSignOffs[row.rowNumber]?.action === "follow-up";
  });
}

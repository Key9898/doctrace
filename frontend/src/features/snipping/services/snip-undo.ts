import type { SnipAnchorRecord } from "@/features/office/services/workbook-snip-anchor.service";
import type { SnipLink } from "@/types/domain";

export const SNIP_UNDO_TTL_MS = 30_000;

export interface SnipUndoStash {
  token: number;
  sheetName: string;
  cellAddress: string;
  previousText: string;
  replacedWithText: string;
  bindingId?: string;
  anchor?: SnipAnchorRecord;
  link?: SnipLink;
  grid?: {
    originAddress: string;
    rangeAddress: string;
    rowCount: number;
    columnCount: number;
    previousFormulas: (string | number | boolean)[][];
    previousNumberFormats: string[][];
    writtenValues: string[][];
    displacedLinks: SnipLink[];
    displacedAnchors: SnipAnchorRecord[];
    createdBindingId?: string;
    createdBindingIds?: string[];
  };
  expiresAt: number;
}

let stash: SnipUndoStash | null = null;
let nextToken = 1;

export function setStash(
  payload: Omit<SnipUndoStash, "token" | "expiresAt"> & { expiresAt?: number },
): number {
  const token = nextToken;
  nextToken += 1;
  stash = {
    ...payload,
    token,
    expiresAt: payload.expiresAt ?? Date.now() + SNIP_UNDO_TTL_MS,
  };
  return token;
}

export function takeStash(token?: number): SnipUndoStash | undefined {
  if (!stash) {
    return undefined;
  }

  if (token !== undefined && stash.token !== token) {
    return undefined;
  }

  if (Date.now() > stash.expiresAt) {
    stash = null;
    return undefined;
  }

  const value = stash;
  stash = null;
  return value;
}

export function patchStash(
  token: number,
  patch: Partial<Omit<SnipUndoStash, "token" | "expiresAt">>,
) {
  if (!stash || stash.token !== token) {
    return;
  }

  stash = {
    ...stash,
    ...patch,
    grid: patch.grid ? { ...stash.grid, ...patch.grid } : stash.grid,
    token: stash.token,
    expiresAt: stash.expiresAt,
  };
}

export function clearStash() {
  stash = null;
}

export function resetSnipUndoForTests() {
  stash = null;
  nextToken = 1;
}

import { describe, expect, it } from "vitest";

import { buildTodWorkpaperPack } from "@/features/workpapers/services/wp-pack";
import {
  canSignTodWorkpaperFile,
  hasFollowUpOpen,
  unsignedOpenRows,
} from "@/features/workpapers/services/wp-signoff";
import type {
  AuditIdentity,
  MatchResult,
  RowSignOff,
  Snip,
} from "@/types/domain";

const identity: AuditIdentity = { preparer: "KZ", reviewer: "AY" };

function result(rowNumber: number, status: MatchResult["status"]): MatchResult {
  return {
    id: `row-${rowNumber}`,
    rowNumber,
    inputValues: {},
    status,
    confidence: 80,
    explanation: status,
    outputValues: {
      invoiceDocument: null,
      invoiceAmount: null,
      invoiceDate: null,
      invoiceNumber: null,
      bankDocument: null,
      bankAmount: null,
      bankDate: null,
      bankReference: null,
      status,
      confidence: 80,
    },
  };
}

function snip(id: string): Snip {
  return {
    id,
    documentId: "doc-1",
    fileName: `${id}.pdf`,
    pageNumber: 1,
    text: id,
    boundingBox: { x: 0, y: 0, width: 1, height: 1 },
    createdAt: "2026-09-06T00:00:00.000Z",
  };
}

function signOff(rowNumber: number, action: RowSignOff["action"]): RowSignOff {
  return {
    rowNumber,
    action,
    comment: action,
    materialityKey: "",
    signedAt: "2026-09-06T00:00:00.000Z",
    preparer: "KZ",
    reviewer: "AY",
  };
}

describe("workpaper ToD pack", () => {
  it("fails closed when there are no match results", () => {
    expect(buildTodWorkpaperPack([], [snip("s1")], identity)).toEqual({
      ok: false,
    });
  });

  it("snapshots row statuses and snip ids without a file sign-off", () => {
    const built = buildTodWorkpaperPack(
      [result(2, "matched"), result(3, "exception")],
      [snip("snip-a")],
      { preparer: " KZ ", reviewer: " AY " },
    );

    expect(built.ok).toBe(true);
    if (!built.ok) {
      return;
    }

    expect(built.value.fileSignOff).toBeUndefined();
    expect(built.value.identity).toEqual({ preparer: "KZ", reviewer: "AY" });
    expect(built.value.rows).toEqual([
      { rowNumber: 2, status: "matched" },
      { rowNumber: 3, status: "exception" },
    ]);
    expect(built.value.snips).toEqual([
      { id: "snip-a", fileName: "snip-a.pdf", pageNumber: 1 },
    ]);
    expect(built.value.sentAt).toEqual(expect.any(String));
  });

  it("blocks file sign-off when a partial or exception row has no live sign-off", () => {
    const built = buildTodWorkpaperPack(
      [result(2, "matched"), result(3, "exception"), result(4, "partial")],
      [],
      identity,
    );
    expect(built.ok).toBe(true);
    if (!built.ok) {
      return;
    }

    expect(
      unsignedOpenRows(built.value, {}).map((row) => row.rowNumber),
    ).toEqual([3, 4]);
    expect(canSignTodWorkpaperFile(built.value, {}, identity)).toBe(false);
    expect(
      canSignTodWorkpaperFile(
        built.value,
        { 3: signOff(3, "waive") },
        identity,
      ),
    ).toBe(false);
  });

  it("allows file sign-off when every row is matched", () => {
    const built = buildTodWorkpaperPack(
      [result(2, "matched"), result(5, "matched")],
      [],
      identity,
    );
    expect(built.ok).toBe(true);
    if (!built.ok) {
      return;
    }

    expect(canSignTodWorkpaperFile(built.value, {}, identity)).toBe(true);
    expect(
      canSignTodWorkpaperFile(
        built.value,
        {},
        { preparer: "", reviewer: "AY" },
      ),
    ).toBe(false);
  });

  it("does not block file sign-off when open rows are follow-up documented", () => {
    const built = buildTodWorkpaperPack([result(3, "exception")], [], identity);
    expect(built.ok).toBe(true);
    if (!built.ok) {
      return;
    }

    const rowSignOffs = { 3: signOff(3, "follow-up") };
    expect(canSignTodWorkpaperFile(built.value, rowSignOffs, identity)).toBe(
      true,
    );
    expect(hasFollowUpOpen(built.value, rowSignOffs)).toBe(true);
    expect(hasFollowUpOpen(built.value, { 3: signOff(3, "conclude") })).toBe(
      false,
    );
  });

  it("omits file sign-off when the pack is rebuilt on re-send", () => {
    const first = buildTodWorkpaperPack([result(2, "matched")], [], identity);
    expect(first.ok).toBe(true);
    if (!first.ok) {
      return;
    }

    const signed = {
      ...first.value,
      fileSignOff: {
        signedAt: "2026-09-06T12:00:00.000Z",
        preparer: "KZ",
        reviewer: "AY",
      },
    };
    expect(signed.fileSignOff).toBeDefined();

    const resent = buildTodWorkpaperPack([result(2, "matched")], [], identity);
    expect(resent.ok).toBe(true);
    if (!resent.ok) {
      return;
    }

    expect(resent.value.fileSignOff).toBeUndefined();
  });
});

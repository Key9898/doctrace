import { describe, expect, it } from "vitest";

import {
  EVIDENCE_PROCESS_THRESHOLD_BYTES,
  EXCEL_SAFETY_MAX_BYTES,
  EvidenceTooLargeError,
  hashSha256,
  prepareEvidence,
} from "@/features/documents/services/evidence-normalize.service";

function bufferFromString(value: string) {
  return new TextEncoder().encode(value).buffer;
}

function paddedJson(size: number) {
  const padding = "x".repeat(Math.max(0, size - 40));
  return `{  "padding"  :  "${padding}"  }`;
}

describe("hashSha256", () => {
  it("returns a stable 64-character hex digest", async () => {
    const first = await hashSha256(bufferFromString("doctrace-evidence"));
    const second = await hashSha256(bufferFromString("doctrace-evidence"));

    expect(first).toHaveLength(64);
    expect(first).toBe(second);
  });

  it("changes when the bytes change", async () => {
    const left = await hashSha256(bufferFromString("alpha"));
    const right = await hashSha256(bufferFromString("beta"));
    expect(left).not.toBe(right);
  });
});

describe("prepareEvidence", () => {
  it("keeps files at or under 512 KB untouched", async () => {
    const bytes = bufferFromString('{"ok":true}');
    const prepared = await prepareEvidence({
      bytes,
      mimeType: "application/json",
      sourceKind: "json",
      fileName: "small.json",
    });

    expect(prepared.normalized).toBe(false);
    expect(prepared.storedSize).toBe(bytes.byteLength);
    expect(prepared.originalSize).toBe(bytes.byteLength);
    expect(prepared.mimeType).toBe("application/json");
    expect(new TextDecoder().decode(prepared.bytes)).toBe('{"ok":true}');
  });

  it("minifies JSON over 512 KB and keeps application/json", async () => {
    const raw = paddedJson(EVIDENCE_PROCESS_THRESHOLD_BYTES + 2048);
    const bytes = bufferFromString(raw);
    expect(bytes.byteLength).toBeGreaterThan(EVIDENCE_PROCESS_THRESHOLD_BYTES);

    const prepared = await prepareEvidence({
      bytes,
      mimeType: "application/json",
      sourceKind: "json",
      fileName: "large.json",
    });

    expect(prepared.normalized).toBe(true);
    expect(prepared.mimeType).toBe("application/json");
    expect(prepared.storedSize).toBeLessThan(prepared.originalSize);
    expect(JSON.parse(new TextDecoder().decode(prepared.bytes))).toEqual(
      JSON.parse(raw),
    );
  });

  it("hashes the original bytes even after JSON minify", async () => {
    const raw = paddedJson(EVIDENCE_PROCESS_THRESHOLD_BYTES + 1024);
    const bytes = bufferFromString(raw);
    const originalHash = await hashSha256(bytes);

    const prepared = await prepareEvidence({
      bytes,
      mimeType: "application/json",
      sourceKind: "json",
      fileName: "hashed.json",
    });

    expect(prepared.contentSha256).toBe(originalHash);
    expect(prepared.normalized).toBe(true);
  });

  it("refuses evidence still over the 20 MB safety cap", async () => {
    const bytes = new ArrayBuffer(EXCEL_SAFETY_MAX_BYTES + 1);

    await expect(
      prepareEvidence({
        bytes,
        mimeType: "image/tiff",
        sourceKind: "image",
        fileName: "huge.tiff",
      }),
    ).rejects.toBeInstanceOf(EvidenceTooLargeError);
  });
});

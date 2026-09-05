import { describe, expect, it } from "vitest";

import { pickBackupDocument } from "@/lib/cloud/cloud-backup-pick";

const docs = [
  { id: "a", contentSha256: undefined },
  { id: "b", contentSha256: "bb".repeat(32) },
  { id: "c", contentSha256: "cc".repeat(32) },
];

describe("pickBackupDocument", () => {
  it("prefers the viewer document when it exists", () => {
    expect(pickBackupDocument(docs, "c")?.id).toBe("c");
  });

  it("falls back to the first hashed document, then the first row", () => {
    expect(pickBackupDocument(docs)?.id).toBe("b");
    expect(pickBackupDocument([{ id: "x" }])?.id).toBe("x");
  });

  it("returns null when there are no documents", () => {
    expect(pickBackupDocument([], "a")).toBeNull();
  });
});

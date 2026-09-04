import { describe, expect, it, vi } from "vitest";
import { createId } from "@/lib/id";

describe("createId utility", () => {
  it("should generate a string ID", () => {
    const id = createId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("should generate unique IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(createId());
    }
    expect(ids.size).toBe(100);
  });

  it("should use crypto.randomUUID when available", () => {
    const mockRandomUUID = vi.fn().mockReturnValue("test-uuid-1234");
    const originalRandomUUID = crypto.randomUUID;
    crypto.randomUUID = mockRandomUUID;

    const id = createId();
    expect(id).toBe("test-uuid-1234");

    crypto.randomUUID = originalRandomUUID;
  });

  it("should generate fallback ID with prefix when crypto.randomUUID is not available", () => {
    const originalRandomUUID = crypto.randomUUID;
    const originalCrypto = globalThis.crypto;

    // @ts-expect-error - testing fallback
    delete globalThis.crypto;

    const id = createId("test");
    expect(id).toMatch(/^test-/);

    globalThis.crypto = originalCrypto;
    crypto.randomUUID = originalRandomUUID;
  });
});

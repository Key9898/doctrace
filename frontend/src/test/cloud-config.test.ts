import { describe, expect, it } from "vitest";

import { getCloudApiUrl, isCloudEnabled } from "@/lib/cloud/cloud-config";

describe("cloud-config", () => {
  it("treats empty and whitespace as local-only", () => {
    expect(isCloudEnabled("")).toBe(false);
    expect(isCloudEnabled("   ")).toBe(false);
    expect(isCloudEnabled(undefined)).toBe(false);
    expect(getCloudApiUrl("")).toBeNull();
    expect(getCloudApiUrl("   ")).toBeNull();
    expect(getCloudApiUrl(undefined)).toBeNull();
  });

  it("treats a trimmed API URL as cloud-enabled", () => {
    expect(isCloudEnabled("http://127.0.0.1:3001")).toBe(true);
    expect(isCloudEnabled("  http://127.0.0.1:3001  ")).toBe(true);
    expect(getCloudApiUrl("http://127.0.0.1:3001")).toBe(
      "http://127.0.0.1:3001",
    );
    expect(getCloudApiUrl("  http://127.0.0.1:3001  ")).toBe(
      "http://127.0.0.1:3001",
    );
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  FIRST_RUN_STORAGE_KEY,
  dismissFirstRun,
  isFirstRunDismissed,
} from "@/lib/persistence/first-run";

describe("first-run localStorage helper", () => {
  afterEach(() => {
    window.localStorage.removeItem(FIRST_RUN_STORAGE_KEY);
    vi.unstubAllGlobals();
  });

  it("is not dismissed until stored", () => {
    expect(isFirstRunDismissed()).toBe(false);
    expect(dismissFirstRun()).toBe(true);
    expect(isFirstRunDismissed()).toBe(true);
    expect(window.localStorage.getItem(FIRST_RUN_STORAGE_KEY)).toBe("true");
  });

  it("hides only for this session when storage is blocked", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => undefined,
    });

    expect(isFirstRunDismissed()).toBe(false);
    expect(dismissFirstRun()).toBe(false);
    expect(isFirstRunDismissed()).toBe(false);
  });
});

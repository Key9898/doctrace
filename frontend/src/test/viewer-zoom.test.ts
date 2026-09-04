import { describe, expect, it, vi } from "vitest";

import {
  createDebouncedCallback,
  pdfRenderScaleForSurface,
  resolveZoomFactor,
  roundSurfaceWidth,
  shouldCommitSurfaceWidth,
  stepZoomFactor,
  SURFACE_WIDTH_DEBOUNCE_MS,
} from "@/features/snipping/services/viewer-zoom";

describe("viewer zoom", () => {
  it("defaults unknown zoom values to fit width", () => {
    expect(resolveZoomFactor(undefined)).toBe(1);
    expect(resolveZoomFactor(1.1)).toBe(1);
  });

  it("steps between discrete fit-width factors", () => {
    expect(stepZoomFactor(1, 1)).toBe(1.25);
    expect(stepZoomFactor(2, 1)).toBe(2);
    expect(stepZoomFactor(0.75, -1)).toBe(0.75);
  });

  it("does not stack CSS zoom onto a second render multiplier", () => {
    expect(pdfRenderScaleForSurface(300, 600, 1.5)).toBe(1.5);
    expect(pdfRenderScaleForSurface(1200, 600, 1.5)).toBe(2);
  });

  it("rounds surface width to a non-negative integer", () => {
    expect(roundSurfaceWidth(349.6)).toBe(350);
    expect(roundSurfaceWidth(-2)).toBe(0);
    expect(roundSurfaceWidth(Number.NaN)).toBe(0);
  });

  it("does not commit when only the rounded width is unchanged", () => {
    expect(shouldCommitSurfaceWidth(350, 350.2)).toBe(false);
    expect(shouldCommitSurfaceWidth(350, 360)).toBe(true);
  });

  it("coalesces surface width commits", () => {
    vi.useFakeTimers();
    const calls: number[] = [];
    const apply = createDebouncedCallback((width: number) => {
      calls.push(width);
    }, SURFACE_WIDTH_DEBOUNCE_MS);

    apply(100);
    apply(110);
    apply(120);
    expect(calls).toEqual([]);
    vi.advanceTimersByTime(SURFACE_WIDTH_DEBOUNCE_MS - 1);
    expect(calls).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(calls).toEqual([120]);
    apply.cancel();
    vi.useRealTimers();
  });
});

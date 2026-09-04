import type { ViewerZoomFactor } from "@/types/domain";

export const VIEWER_ZOOM_FACTORS: ViewerZoomFactor[] = [0.75, 1, 1.25, 1.5, 2];

const ZOOM_WIDTH_CLASS: Record<ViewerZoomFactor, string> = {
  0.75: "w-[75%]",
  1: "w-full",
  1.25: "w-[125%]",
  1.5: "w-[150%]",
  2: "w-[200%]",
};

export function resolveZoomFactor(value: number | undefined): ViewerZoomFactor {
  return VIEWER_ZOOM_FACTORS.includes(value as ViewerZoomFactor)
    ? (value as ViewerZoomFactor)
    : 1;
}

export function viewerZoomWidthClass(factor: ViewerZoomFactor) {
  return ZOOM_WIDTH_CLASS[factor];
}

export function stepZoomFactor(
  current: ViewerZoomFactor,
  direction: 1 | -1,
): ViewerZoomFactor {
  const index = VIEWER_ZOOM_FACTORS.indexOf(current);
  const next = VIEWER_ZOOM_FACTORS[index + direction];
  return next ?? current;
}

export function pdfRenderScaleForSurface(
  surfaceWidth: number,
  pageWidthAtScale1: number,
  minimumScale: number,
) {
  if (surfaceWidth <= 0 || pageWidthAtScale1 <= 0) {
    return minimumScale;
  }

  return Math.max(minimumScale, surfaceWidth / pageWidthAtScale1);
}

export const SURFACE_WIDTH_DEBOUNCE_MS = 150;

export function roundSurfaceWidth(width: number) {
  if (!Number.isFinite(width)) {
    return 0;
  }

  return Math.max(0, Math.round(width));
}

export function shouldCommitSurfaceWidth(previous: number, next: number) {
  return roundSurfaceWidth(next) !== previous;
}

export function createDebouncedCallback<T extends unknown[]>(
  fn: (...args: T) => void,
  waitMs: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const wrapped = (...args: T) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, waitMs);
  };

  wrapped.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return wrapped;
}

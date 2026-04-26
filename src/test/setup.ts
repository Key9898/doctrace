import "@testing-library/jest-dom/vitest";

globalThis.URL.createObjectURL =
  globalThis.URL.createObjectURL || (() => "blob:mock");
globalThis.URL.revokeObjectURL =
  globalThis.URL.revokeObjectURL || (() => undefined);

Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

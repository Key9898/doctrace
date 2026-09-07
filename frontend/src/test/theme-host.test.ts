import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  getStoredTheme,
  initializeTheme,
  isExcelTaskPane,
  resetThemeHostForTests,
  setStoredTheme,
  showPreviewWebsiteLink,
  syncThemeAfterOfficeReady,
} from "@/lib/theme";

const LEGACY_KEY = "doctrace-theme";
const EXCEL_KEY = "doctrace-theme-excel";
const PREVIEW_KEY = "doctrace-theme-preview";

describe("host-aware pane theme", () => {
  beforeEach(() => {
    resetThemeHostForTests();
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem(EXCEL_KEY);
    localStorage.removeItem(PREVIEW_KEY);
    document.documentElement.classList.remove("dark");
    Reflect.deleteProperty(window, "Office");
  });

  afterEach(() => {
    resetThemeHostForTests();
    Reflect.deleteProperty(window, "Office");
  });

  it("defaults to dark when Excel is proven and the excel key is unset", () => {
    window.Office = {
      context: { document: {} },
    } as unknown as typeof Office;
    syncThemeAfterOfficeReady({ host: "Excel" });
    expect(getStoredTheme()).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("defaults to light when Office is ready without Excel", () => {
    window.Office = {
      context: {},
    } as unknown as typeof Office;
    syncThemeAfterOfficeReady({ host: undefined });
    expect(getStoredTheme()).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("does not treat platform-only Office context as Excel", () => {
    window.Office = {
      context: { platform: "PC" },
    } as unknown as typeof Office;
    expect(isExcelTaskPane()).toBe(false);
    syncThemeAfterOfficeReady();
    expect(getStoredTheme()).toBe("light");
  });

  it("does not copy preview writes onto the excel key", () => {
    window.Office = { context: {} } as unknown as typeof Office;
    syncThemeAfterOfficeReady();
    setStoredTheme("dark");
    expect(localStorage.getItem(PREVIEW_KEY)).toBe("dark");
    expect(localStorage.getItem(EXCEL_KEY)).toBeNull();
  });

  it("migrates the legacy key onto excel only", () => {
    localStorage.setItem(LEGACY_KEY, "dark");
    window.Office = {
      context: { document: {} },
    } as unknown as typeof Office;
    syncThemeAfterOfficeReady({ host: "Excel" });
    expect(localStorage.getItem(EXCEL_KEY)).toBe("dark");
    resetThemeHostForTests();
    window.Office = { context: {} } as unknown as typeof Office;
    syncThemeAfterOfficeReady();
    expect(getStoredTheme()).toBe("light");
    expect(localStorage.getItem(PREVIEW_KEY)).toBeNull();
  });

  it("keeps first paint dark when Office.js exists but Excel is unproven", () => {
    window.Office = { context: {} } as unknown as typeof Office;
    initializeTheme();
    expect(getStoredTheme()).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("hides the preview Website link until Office is ready", () => {
    window.Office = {
      context: { platform: "PC" },
    } as unknown as typeof Office;
    expect(showPreviewWebsiteLink(false)).toBe(false);
  });

  it("shows the preview Website link when Office is ready without Excel", () => {
    window.Office = {
      context: { platform: "PC" },
    } as unknown as typeof Office;
    expect(showPreviewWebsiteLink(true)).toBe(true);
  });

  it("hides the preview Website link when Excel is proven", () => {
    window.Office = {
      context: { document: {} },
    } as unknown as typeof Office;
    expect(showPreviewWebsiteLink(true)).toBe(false);
    window.Office = {
      context: { host: "Excel" },
    } as unknown as typeof Office;
    expect(showPreviewWebsiteLink(true)).toBe(false);
  });
});

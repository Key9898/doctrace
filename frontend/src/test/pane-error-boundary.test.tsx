import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PaneErrorBoundary } from "@/features/shell/components/PaneErrorBoundary/PaneErrorBoundary";
import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";
import { useDocTraceStore } from "@/stores/app-store";

const CRASH_KEYS = [
  "app.crashTitle",
  "app.crashLead",
  "app.crashReload",
  "app.crashAria",
] as const satisfies readonly TranslationKey[];

function ThrowingChild(): never {
  throw new Error("test crash");
}

describe("pane ErrorBoundary", () => {
  afterEach(() => {
    cleanup();
  });

  it("returns non-empty crash copy in both locales", () => {
    for (const key of CRASH_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("shows the pane crash screen when a child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    useDocTraceStore.getState().setLocale("en-US");

    render(
      <PaneErrorBoundary>
        <ThrowingChild />
      </PaneErrorBoundary>,
    );

    expect(
      screen.getByRole("alert", {
        name: translate("en-US", "app.crashAria"),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translate("en-US", "app.crashTitle")),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translate("en-US", "app.crashLead")),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: translate("en-US", "app.crashReload"),
      }),
    ).toBeInTheDocument();

    spy.mockRestore();
  });

  it("does not import site 404 or 500 pages", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "frontend/src/features/shell/components/PaneErrorBoundary/PaneErrorBoundary.tsx",
      ),
      "utf8",
    );

    expect(source).not.toContain("404.html");
    expect(source).not.toContain("500.html");
    expect(source).not.toContain("error404Title");
  });

  it("keeps site 404 copy out of the Excel task pane", () => {
    const html = readFileSync(
      resolve(process.cwd(), "frontend/taskpane.html"),
      "utf8",
    );
    expect(html).not.toContain("error404Title");
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { TrialBalance } from "@/features/trial-balance/components/TrialBalance/TrialBalance";
import { translate } from "@/lib/i18n/translations";
import { useDocTraceStore } from "@/stores/app-store";

const noopApply = () => false;

function mappingButtons() {
  return screen.getAllByRole("button", {
    name: translate("en-US", "tb.colMapping"),
  });
}

describe("trial balance mapping pane", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows stacked mapping rows with no table on first paint", () => {
    useDocTraceStore.getState().setLocale("en-US");
    render(<TrialBalance onApplyTbSampleSelection={noopApply} />);

    expect(screen.queryAllByRole("table")).toHaveLength(0);
    expect(mappingButtons().length).toBeGreaterThan(0);
  });

  it("closes the mapping list on pointerdown outside", () => {
    useDocTraceStore.getState().setLocale("en-US");
    render(<TrialBalance onApplyTbSampleSelection={noopApply} />);

    act(() => {
      mappingButtons()[0].click();
    });
    expect(screen.getByText("Unmapped")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    });
    expect(screen.queryByText("Unmapped")).not.toBeInTheDocument();
  });

  it("closes the mapping list on Escape", () => {
    useDocTraceStore.getState().setLocale("en-US");
    render(<TrialBalance onApplyTbSampleSelection={noopApply} />);

    act(() => {
      mappingButtons()[0].click();
    });
    expect(screen.getByText("Unmapped")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(screen.queryByText("Unmapped")).not.toBeInTheDocument();
  });

  it("toggles the mapping list on the same trigger", () => {
    useDocTraceStore.getState().setLocale("en-US");
    render(<TrialBalance onApplyTbSampleSelection={noopApply} />);

    const trigger = mappingButtons()[0];
    act(() => {
      trigger.click();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Unmapped")).toBeInTheDocument();

    act(() => {
      trigger.click();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Unmapped")).not.toBeInTheDocument();
  });
});

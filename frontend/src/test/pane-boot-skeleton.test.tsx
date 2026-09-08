import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DocumentLibraryPanel } from "@/features/documents/components/DocumentLibraryPanel/DocumentLibraryPanel";
import { ResultsPanel } from "@/features/matching/components/ResultsPanel/ResultsPanel";
import { PaneSkeleton } from "@/features/shell/components/PaneSkeleton/PaneSkeleton";
import { ViewerPane } from "@/features/snipping/components/ViewerPane/ViewerPane";
import type { TranslationKey } from "@/lib/i18n/translations";
import { translate } from "@/lib/i18n/translations";
import { AppLayout } from "@/layouts/AppLayout";
import { useDocTraceStore } from "@/stores/app-store";
import type { ParsedDocument } from "@/types/domain";

vi.mock("@/features/documents/services/pdf.service", () => ({
  getPdfPageSizeAtScale1: () => new Promise(() => undefined),
  renderPdfPageToCanvas: () => new Promise(() => undefined),
}));

const BOOT_ARIA_KEYS = [
  "app.bootSkeletonAria",
  "import.busySkeletonAria",
  "results.busySkeletonAria",
  "viewer.busySkeletonAria",
] as const satisfies readonly TranslationKey[];

const noop = () => undefined;

const pdfDocument: ParsedDocument = {
  id: "doc-pdf",
  fileName: "invoice.pdf",
  kind: "invoice",
  sourceKind: "pdf",
  mimeType: "application/pdf",
  objectUrl: "blob:mock-pdf",
  importedAt: new Date().toISOString(),
  size: 1024,
  pageCount: 1,
  status: "parsed",
  extractedText: "invoice",
  pages: [],
  statementEntries: [],
};

describe("pane boot splash and busy skeletons", () => {
  afterEach(() => {
    cleanup();
    useDocTraceStore.getState().setOfficeState(false, false);
  });

  it("paints a static splash in taskpane.html before office.js", () => {
    const html = readFileSync(
      resolve(process.cwd(), "frontend/taskpane.html"),
      "utf8",
    );
    const head = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
    const rootIndex = html.indexOf('<div id="root">');
    const splashMarkupIndex = html.indexOf('class="dt-boot-splash"', rootIndex);
    const officeIndex = html.indexOf("office.js");

    const htmlRootRule = html.slice(
      html.indexOf("html,"),
      html.indexOf(".dt-boot-splash"),
    );
    const splashRule = html.slice(
      html.indexOf(".dt-boot-splash {"),
      html.indexOf(".dt-boot-splash svg"),
    );

    expect(htmlRootRule).not.toContain("#020617");
    expect(splashRule).toContain("background: #020617");
    expect(html).toContain("DocTrace");
    expect(html).toContain("Booting / စတင်နေသည်");
    expect(rootIndex).toBeGreaterThan(-1);
    expect(splashMarkupIndex).toBeGreaterThan(rootIndex);
    expect(officeIndex).toBeGreaterThan(splashMarkupIndex);
    expect(head).not.toContain("office.js");
  });

  it("keeps the pane BrandMark third bar cyan in light and dark", () => {
    const appShell = readFileSync(
      resolve(
        process.cwd(),
        "frontend/src/features/shell/components/AppShell/AppShell.tsx",
      ),
      "utf8",
    );
    const crashMark = readFileSync(
      resolve(
        process.cwd(),
        "frontend/src/features/shell/components/PaneErrorBoundary/PaneErrorBoundary.tsx",
      ),
      "utf8",
    );

    expect(appShell).toContain('className="fill-[#7DD3FC]"');
    expect(crashMark).toContain('className="fill-[#7DD3FC]"');
    expect(appShell).not.toContain("fill-white dark:fill-[#7DD3FC]");
    expect(crashMark).not.toContain("fill-white dark:fill-[#7DD3FC]");
  });

  it("returns non-empty aria copy in both locales", () => {
    for (const key of BOOT_ARIA_KEYS) {
      expect(translate("en-US", key).trim().length).toBeGreaterThan(0);
      expect(translate("my-MM", key).trim().length).toBeGreaterThan(0);
    }
  });

  it("renders PaneSkeleton as a busy status region", () => {
    render(
      <PaneSkeleton
        kind="boot"
        label={translate("en-US", "app.bootSkeletonAria")}
      />,
    );
    const status = screen.getByRole("status", {
      name: translate("en-US", "app.bootSkeletonAria"),
    });
    expect(status).toHaveAttribute("aria-busy", "true");
  });

  it("shows the boot skeleton until officeReady", () => {
    useDocTraceStore.getState().setOfficeState(false, false);
    act(() => {
      render(<AppLayout />);
    });
    expect(
      screen.getByRole("status", {
        name: translate("en-US", "app.bootSkeletonAria"),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Booting")).toBeInTheDocument();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("does not show the boot skeleton after officeReady", () => {
    useDocTraceStore.getState().setOfficeState(true, false);
    act(() => {
      render(<AppLayout />);
    });
    expect(
      screen.queryByRole("status", {
        name: translate("en-US", "app.bootSkeletonAria"),
      }),
    ).toBeNull();
  });

  it("shows library row skeletons when import is busy", () => {
    render(
      <DocumentLibraryPanel
        documents={[]}
        busyMessage="Reading invoices"
        onImport={noop}
        onImportPickedFiles={noop}
        onPreview={noop}
        onRemove={noop}
        onRename={noop}
        onDownload={noop}
      />,
    );
    expect(
      screen.getByRole("status", {
        name: translate("en-US", "import.busySkeletonAria"),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Reading invoices")).toBeInTheDocument();
  });

  it("does not show library skeletons when idle", () => {
    render(
      <DocumentLibraryPanel
        documents={[]}
        onImport={noop}
        onImportPickedFiles={noop}
        onPreview={noop}
        onRemove={noop}
        onRename={noop}
        onDownload={noop}
      />,
    );
    expect(
      screen.queryByRole("status", {
        name: translate("en-US", "import.busySkeletonAria"),
      }),
    ).toBeNull();
  });

  it("shows result-card skeletons when matching is busy", () => {
    render(
      <ResultsPanel
        results={[]}
        busyMessage="Matching rows"
        onFocusInvoice={noop}
        onFocusBank={noop}
        onClearMatch={noop}
      />,
    );
    expect(
      screen.getByRole("status", {
        name: translate("en-US", "results.busySkeletonAria"),
      }),
    ).toBeInTheDocument();
  });

  it("does not show result skeletons when idle", () => {
    render(
      <ResultsPanel
        results={[]}
        onFocusInvoice={noop}
        onFocusBank={noop}
        onClearMatch={noop}
      />,
    );
    expect(
      screen.queryByRole("status", {
        name: translate("en-US", "results.busySkeletonAria"),
      }),
    ).toBeNull();
  });

  it("shows a viewer pulse frame while a PDF is loading", async () => {
    const clientWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth",
    );
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 320,
    });

    try {
      render(
        <ViewerPane
          documents={[pdfDocument]}
          onViewerChange={noop}
          viewer={{ documentId: pdfDocument.id, pageNumber: 1, zoomFactor: 1 }}
        />,
      );
      await waitFor(() => {
        expect(
          screen.getByRole("status", {
            name: translate("en-US", "viewer.busySkeletonAria"),
          }),
        ).toBeInTheDocument();
      });
    } finally {
      if (clientWidth) {
        Object.defineProperty(
          HTMLElement.prototype,
          "clientWidth",
          clientWidth,
        );
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
      }
    }
  });

  it("does not skeleton CloudSessionPanel leftover-B chrome", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "frontend/src/features/shell/components/CloudSessionPanel/CloudSessionPanel.tsx",
      ),
      "utf8",
    );
    expect(source).not.toContain("PaneSkeleton");
    expect(source).not.toContain("dt-skeleton");
  });
});

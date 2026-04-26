import { describe, expect, it, beforeEach } from "vitest";
import { useDocTraceStore } from "./app-store";

describe("app store", () => {
  beforeEach(() => {
    useDocTraceStore.setState({
      documents: [],
      activityFeed: [],
      busyMessage: undefined,
      viewer: { pageNumber: 1 },
      selection: undefined,
      results: [],
      toasts: [],
    });
  });

  it("should have initial state", () => {
    const state = useDocTraceStore.getState();
    expect(state.documents).toEqual([]);
    expect(state.activityFeed).toEqual([]);
    expect(state.busyMessage).toBeUndefined();
  });

  it("should add a document with upsertDocument", () => {
    const store = useDocTraceStore.getState();
    const mockDocument = {
      id: "test-doc",
      fileName: "test.pdf",
      kind: "invoice" as const,
      sourceKind: "pdf" as const,
      mimeType: "application/pdf",
      objectUrl: "blob:test",
      importedAt: new Date().toISOString(),
      size: 1024,
      pageCount: 1,
      status: "parsed" as const,
      extractedText: "test content",
      pages: [],
      statementEntries: [],
    };

    store.upsertDocument(mockDocument);
    expect(useDocTraceStore.getState().documents).toContainEqual(mockDocument);
  });

  it("should add activity to feed", () => {
    const store = useDocTraceStore.getState();
    store.pushActivity({
      tone: "info",
      title: "Test activity",
    });

    const state = useDocTraceStore.getState();
    expect(state.activityFeed.length).toBe(1);
    expect(state.activityFeed[0].title).toBe("Test activity");
  });

  it("should limit activity feed to 8 items", () => {
    const store = useDocTraceStore.getState();
    for (let i = 0; i < 10; i++) {
      store.pushActivity({
        tone: "info",
        title: `Activity ${i}`,
      });
    }

    const state = useDocTraceStore.getState();
    expect(state.activityFeed.length).toBe(8);
  });

  it("should set and clear busy message", () => {
    const store = useDocTraceStore.getState();

    store.setBusyMessage("Loading...");
    expect(useDocTraceStore.getState().busyMessage).toBe("Loading...");

    store.setBusyMessage(undefined);
    expect(useDocTraceStore.getState().busyMessage).toBeUndefined();
  });

  it("should update viewer state", () => {
    const store = useDocTraceStore.getState();
    store.setViewer({ pageNumber: 2 });

    const state = useDocTraceStore.getState();
    expect(state.viewer.pageNumber).toBe(2);
  });

  it("should remove a document", () => {
    const store = useDocTraceStore.getState();
    const mockDocument = {
      id: "test-doc",
      fileName: "test.pdf",
      kind: "invoice" as const,
      sourceKind: "pdf" as const,
      mimeType: "application/pdf",
      objectUrl: "blob:test",
      importedAt: new Date().toISOString(),
      size: 1024,
      pageCount: 1,
      status: "parsed" as const,
      extractedText: "test content",
      pages: [],
      statementEntries: [],
    };

    store.upsertDocument(mockDocument);
    store.removeDocument("test-doc");

    const state = useDocTraceStore.getState();
    expect(state.documents).not.toContainEqual(mockDocument);
  });

  it("should add and dismiss toasts", () => {
    const store = useDocTraceStore.getState();

    store.pushToast({ tone: "success", title: "Test toast" });
    expect(useDocTraceStore.getState().toasts.length).toBe(1);

    const toastId = useDocTraceStore.getState().toasts[0].id;
    store.dismissToast(toastId);
    expect(useDocTraceStore.getState().toasts.length).toBe(0);
  });
});

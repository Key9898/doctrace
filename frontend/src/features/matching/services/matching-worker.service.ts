import {
  runDocumentMatching,
  type MatchingRunProgress,
} from "@/features/matching/services/matching.service";
import type {
  MatchConfig,
  MatchResult,
  ParsedDocument,
  SelectionSnapshot,
} from "@/types/domain";

interface MatchingWorkerProgress {
  mode: "worker" | "main-thread";
  processed: number;
  total: number;
  detail?: string;
}

interface MatchingWorkerRequest {
  type: "run";
  selection: SelectionSnapshot;
  documents: ParsedDocument[];
  config: MatchConfig;
  batchSize: number;
}

type MatchingWorkerResponse =
  | {
      type: "progress";
      processed: number;
      total: number;
    }
  | {
      type: "complete";
      results: MatchResult[];
    }
  | {
      type: "error";
      message: string;
    };

export async function runDocumentMatchingInWorker(
  selection: SelectionSnapshot,
  documents: ParsedDocument[],
  config: MatchConfig,
  onProgress?: (progress: MatchingWorkerProgress) => void,
) {
  const batchSize = resolveBatchSize(selection.rows.length);

  if (typeof Worker !== "function") {
    onProgress?.({
      mode: "main-thread",
      processed: 0,
      total: selection.rows.length,
      detail: "Web Worker is unavailable in this host; using safe fallback.",
    });

    return runDocumentMatching(selection, documents, config, {
      batchSize,
      onProgress: toMainThreadProgress(selection.rows.length, onProgress),
    });
  }

  try {
    return await runWorker(selection, documents, config, batchSize, onProgress);
  } catch (error) {
    onProgress?.({
      mode: "main-thread",
      processed: 0,
      total: selection.rows.length,
      detail:
        error instanceof Error
          ? `Worker unavailable: ${error.message}. Falling back safely.`
          : "Worker unavailable. Falling back safely.",
    });

    return runDocumentMatching(selection, documents, config, {
      batchSize,
      onProgress: toMainThreadProgress(selection.rows.length, onProgress),
    });
  }
}

function runWorker(
  selection: SelectionSnapshot,
  documents: ParsedDocument[],
  config: MatchConfig,
  batchSize: number,
  onProgress?: (progress: MatchingWorkerProgress) => void,
) {
  return new Promise<MatchResult[]>((resolve, reject) => {
    const worker = new Worker(
      new URL("../../../workers/matching.worker.ts", import.meta.url),
      {
        name: "DocTraceMatchingWorker",
        type: "module",
      },
    );

    const cleanup = () => worker.terminate();

    worker.onmessage = (event: MessageEvent<MatchingWorkerResponse>) => {
      const message = event.data;

      if (message.type === "progress") {
        onProgress?.({
          mode: "worker",
          processed: message.processed,
          total: message.total,
        });
        return;
      }

      if (message.type === "complete") {
        cleanup();
        resolve(message.results);
        return;
      }

      cleanup();
      reject(new Error(message.message));
    };

    worker.onerror = (event) => {
      cleanup();
      reject(
        new Error(
          event.message || "The matching worker could not be initialized.",
        ),
      );
    };

    const request: MatchingWorkerRequest = {
      type: "run",
      selection,
      documents,
      config,
      batchSize,
    };

    worker.postMessage(request);
  });
}

function resolveBatchSize(rowCount: number) {
  if (rowCount <= 50) {
    return 10;
  }

  return Math.max(25, Math.ceil(rowCount / 20));
}

function toMainThreadProgress(
  total: number,
  onProgress?: (progress: MatchingWorkerProgress) => void,
) {
  return ({ processed }: MatchingRunProgress) => {
    onProgress?.({
      mode: "main-thread",
      processed,
      total,
    });
  };
}

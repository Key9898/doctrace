import { runDocumentMatching } from "@/services/matching/matching.service";
import type {
  MatchConfig,
  MatchResult,
  ParsedDocument,
  SelectionSnapshot,
} from "@/types/domain";

interface MatchingRequest {
  type: "run";
  selection: SelectionSnapshot;
  documents: ParsedDocument[];
  config: MatchConfig;
  batchSize: number;
}

type MatchingWorkerMessage =
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

const postWorkerMessage = (message: MatchingWorkerMessage) => {
  self.postMessage(message);
};

self.onmessage = (event: MessageEvent<MatchingRequest>) => {
  const { selection, documents, config, batchSize } = event.data;

  try {
    const results = runDocumentMatching(selection, documents, config, {
      batchSize,
      onProgress: ({ processed, total }) => {
        postWorkerMessage({ type: "progress", processed, total });
      },
    });

    postWorkerMessage({ type: "complete", results });
  } catch (error) {
    postWorkerMessage({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "The matching worker failed unexpectedly.",
    });
  }
};

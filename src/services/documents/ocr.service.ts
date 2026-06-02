import { createWorker } from "tesseract.js";

import { getActiveLocaleConfig } from "@/i18n/locales";

let workerPromise:
  | Promise<Awaited<ReturnType<typeof createWorker>>>
  | undefined;
let workerLanguage: string | undefined;

async function getWorker() {
  const preferredLanguage = getActiveLocaleConfig().ocrLanguage;

  if (workerPromise && workerLanguage !== preferredLanguage) {
    void workerPromise
      .then((worker) => worker.terminate())
      .catch(() => {
        // Ignore stale worker cleanup failures; the next worker still starts.
      });
    workerPromise = undefined;
  }

  if (!workerPromise) {
    workerLanguage = preferredLanguage;
    workerPromise = createWorker(preferredLanguage, 1, {
      logger: () => undefined,
    }).catch(async (error) => {
      if (preferredLanguage !== "eng") {
        // Keep the preferred locale marked as satisfied so hosts that cannot
        // load Myanmar OCR data do not retry the heavy language bundle forever.
        workerLanguage = preferredLanguage;
        return createWorker("eng", 1, {
          logger: () => undefined,
        });
      }

      workerPromise = undefined;
      throw error;
    });
  }

  return workerPromise;
}

export async function runOcr(
  input: HTMLCanvasElement | string,
  onProgress?: (percent: number) => void,
) {
  const worker = await getWorker();

  if (onProgress) {
    await worker.setParameters({});
  }

  const { data } = await worker.recognize(input);

  onProgress?.(100);

  return data.text.trim();
}

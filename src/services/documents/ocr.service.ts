import { createWorker } from "tesseract.js";

let workerPromise:
  | Promise<Awaited<ReturnType<typeof createWorker>>>
  | undefined;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker("eng", 1, {
      logger: () => undefined,
    }).catch((error) => {
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

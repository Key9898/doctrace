import * as pdfjs from "pdfjs-dist";

import type { ParsedPage } from "@/types/domain";

import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

let pdfWorkerReady = false;
const PDF_RENDER_SCALE = 1.5;

export interface PdfTextLayerItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function ensurePdfWorker() {
  if (pdfWorkerReady) {
    return;
  }

  try {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      pdfWorkerUrl,
      window.location.href,
    ).toString();
    pdfWorkerReady = true;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `PDF worker could not start: ${error.message}`
        : "PDF worker could not start in this host environment.",
    );
  }
}

async function loadPdfDocument(source: string | Uint8Array | ArrayBuffer) {
  ensurePdfWorker();

  try {
    return typeof source === "string"
      ? await pdfjs.getDocument(source).promise
      : await pdfjs.getDocument({ data: source }).promise;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `PDF document could not be loaded: ${error.message}`
        : "PDF document could not be loaded.",
    );
  }
}

export async function readPdfPages(
  fileBuffer: ArrayBuffer,
  ocrFallback?: (canvas: HTMLCanvasElement) => Promise<string>,
) {
  const document = await loadPdfDocument(fileBuffer);
  const pages: ParsedPage[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const directText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    let text = directText;

    if (!text && ocrFallback) {
      const viewport = page.getViewport({ scale: 2 });
      const canvas = globalThis.document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        text = await ocrFallback(canvas);
      }
    }

    pages.push({
      pageNumber,
      text,
      snippets: buildSnippets(text),
    });
  }

  return {
    pageCount: document.numPages,
    pages,
  };
}

export async function renderPdfPageToCanvas(
  source: string | Uint8Array | ArrayBuffer,
  pageNumber: number,
  canvas: HTMLCanvasElement,
) {
  const document = await loadPdfDocument(source);
  const safePageNumber = Math.min(Math.max(pageNumber, 1), document.numPages);
  const page = await document.getPage(safePageNumber);
  const viewport = page.getViewport({ scale: PDF_RENDER_SCALE });
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Unable to create a rendering context for the PDF preview.",
    );
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvas,
    canvasContext: context,
    viewport,
  }).promise;

  return document.numPages;
}

export async function readPdfTextLayerItems(
  source: string | Uint8Array | ArrayBuffer,
  pageNumber: number,
) {
  const document = await loadPdfDocument(source);
  const safePageNumber = Math.min(Math.max(pageNumber, 1), document.numPages);
  const page = await document.getPage(safePageNumber);
  const viewport = page.getViewport({ scale: PDF_RENDER_SCALE });
  const content = await page.getTextContent();

  const items = content.items
    .filter((item) => "str" in item && Boolean(item.str.trim()))
    .map((item) => {
      const textItem = item as {
        str: string;
        transform: number[];
        width: number;
        height: number;
      };
      const x = textItem.transform[4] * PDF_RENDER_SCALE;
      const y =
        viewport.height -
        textItem.transform[5] * PDF_RENDER_SCALE -
        textItem.height * PDF_RENDER_SCALE;

      return {
        str: textItem.str,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.max(8, textItem.width * PDF_RENDER_SCALE),
        height: Math.max(8, textItem.height * PDF_RENDER_SCALE),
      };
    });

  return {
    width: viewport.width,
    height: viewport.height,
    items,
  };
}

function buildSnippets(text: string) {
  if (!text) {
    return [];
  }

  return text
    .split(/(?<=\.)\s+|\n+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 20)
    .slice(0, 6);
}

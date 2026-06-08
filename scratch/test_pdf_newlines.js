import fs from "fs";
import * as pdfjs from "pdfjs-dist";

// Set worker path
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
// Wait, in Node.js environment we can just require the worker or let PDF.js handle it
// Let's use the standard setup for Node.js
import { GlobalWorkerOptions } from "pdfjs-dist";
import { readFile } from "fs/promises";

async function test() {
  const fileBuffer = await readFile("./samples/bank_statement_1.pdf");
  const document = await pdfjs.getDocument({ data: new Uint8Array(fileBuffer) })
    .promise;
  const page = await document.getPage(1);
  const textContent = await page.getTextContent();

  console.log("Number of items:", textContent.items.length);

  // Let's print first 20 items and check their properties
  for (let i = 0; i < Math.min(20, textContent.items.length); i++) {
    const item = textContent.items[i];
    console.log(
      `Item ${i}: "${item.str}" | hasEOL: ${item.hasEOL} | transform:`,
      item.transform,
    );
  }

  // Let's print the reconstructed text joining by checking EOL
  let reconstructed = "";
  for (const item of textContent.items) {
    reconstructed += item.str;
    if (item.hasEOL) {
      reconstructed += "\n";
    } else {
      reconstructed += " ";
    }
  }

  console.log("\n--- Reconstructed Text (first 500 chars) ---\n");
  console.log(reconstructed.slice(0, 800));
}

test().catch(console.error);

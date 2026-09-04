const EVIDENCE_NS = "http://doctrace/evidence/1";
const CHUNK_NS = "http://doctrace/evidence/1/chunk";
const RAW_CHUNK_BYTES = 24 * 1024;
const SYNC_BATCH = 20;

export interface EvidenceIndexEntry {
  contentSha256: string;
  mimeType: string;
  fileName: string;
  originalSize: number;
  storedSize: number;
  chunkCount: number;
}

export interface StoredWorkbookEvidence extends EvidenceIndexEntry {
  bytes: ArrayBuffer;
}

export interface SaveEvidenceInput {
  contentSha256: string;
  mimeType: string;
  fileName: string;
  bytes: ArrayBuffer;
  originalSize: number;
  storedSize: number;
}

type XmlPart = {
  id: string;
  delete: () => void;
  getXml: () => { value: string };
  load: (props: string | string[]) => void;
};

type XmlPartCollection = {
  items: XmlPart[];
  load: (props: string | string[]) => void;
};

type XmlParts = {
  add: (xml: string) => XmlPart;
  getByNamespace: (ns: string) => XmlPartCollection;
};

export function isWorkbookEvidenceSupported() {
  return Boolean(
    typeof Excel !== "undefined" &&
    window.Excel &&
    window.Office?.context?.requirements?.isSetSupported?.("ExcelApi", "1.5"),
  );
}

export async function saveEvidence(input: SaveEvidenceInput): Promise<boolean> {
  if (!isWorkbookEvidenceSupported()) {
    return false;
  }

  await runWithXmlParts(async (parts, context) => {
    const index = await readIndex(parts, context);
    const existing = index.find(
      (entry) => entry.contentSha256 === input.contentSha256,
    );

    if (
      existing &&
      existing.storedSize === input.storedSize &&
      existing.chunkCount > 0
    ) {
      const loaded = await readChunks(
        parts,
        context,
        input.contentSha256,
        existing.chunkCount,
      );
      if (loaded && loaded.byteLength === input.storedSize) {
        return;
      }
    }

    await deleteChunksForHash(parts, context, input.contentSha256);

    const chunkXmls = encodeChunks(input.contentSha256, input.bytes);
    for (let indexChunk = 0; indexChunk < chunkXmls.length; indexChunk += 1) {
      parts.add(chunkXmls[indexChunk]);
      if ((indexChunk + 1) % SYNC_BATCH === 0) {
        await context.sync();
      }
    }
    await context.sync();

    const nextIndex = index.filter(
      (entry) => entry.contentSha256 !== input.contentSha256,
    );
    nextIndex.push({
      contentSha256: input.contentSha256,
      mimeType: input.mimeType,
      fileName: input.fileName,
      originalSize: input.originalSize,
      storedSize: input.storedSize,
      chunkCount: chunkXmls.length,
    });

    await replaceIndex(parts, context, nextIndex);
  });

  return true;
}

export async function loadEvidenceIndex(): Promise<EvidenceIndexEntry[]> {
  if (!isWorkbookEvidenceSupported()) {
    return [];
  }

  return runWithXmlParts(async (parts, context) => readIndex(parts, context));
}

export async function loadEvidence(
  contentSha256: string,
): Promise<StoredWorkbookEvidence | undefined> {
  if (!isWorkbookEvidenceSupported() || !contentSha256) {
    return undefined;
  }

  return runWithXmlParts(async (parts, context) => {
    const index = await readIndex(parts, context);
    const entry = index.find((item) => item.contentSha256 === contentSha256);
    if (!entry) {
      return undefined;
    }

    const bytes = await readChunks(
      parts,
      context,
      contentSha256,
      entry.chunkCount,
    );
    if (!bytes) {
      return undefined;
    }

    return { ...entry, bytes };
  });
}

export async function loadAllEvidence(): Promise<
  Map<string, StoredWorkbookEvidence>
> {
  const result = new Map<string, StoredWorkbookEvidence>();
  if (!isWorkbookEvidenceSupported()) {
    return result;
  }

  return runWithXmlParts(async (parts, context) => {
    const index = await readIndex(parts, context);

    for (const entry of index) {
      const bytes = await readChunks(
        parts,
        context,
        entry.contentSha256,
        entry.chunkCount,
      );
      if (!bytes) {
        continue;
      }
      result.set(entry.contentSha256, { ...entry, bytes });
    }

    return result;
  });
}

export async function removeEvidence(contentSha256: string): Promise<void> {
  if (!isWorkbookEvidenceSupported() || !contentSha256) {
    return;
  }

  await runWithXmlParts(async (parts, context) => {
    await deleteChunksForHash(parts, context, contentSha256);
    const index = await readIndex(parts, context);
    await replaceIndex(
      parts,
      context,
      index.filter((entry) => entry.contentSha256 !== contentSha256),
    );
  });
}

export async function renameEvidenceFileName(
  contentSha256: string,
  fileName: string,
): Promise<boolean> {
  if (!isWorkbookEvidenceSupported() || !contentSha256 || !fileName) {
    return false;
  }

  await runWithXmlParts(async (parts, context) => {
    const index = await readIndex(parts, context);
    const existing = index.find(
      (entry) => entry.contentSha256 === contentSha256,
    );
    if (!existing || existing.fileName === fileName) {
      return;
    }

    await replaceIndex(
      parts,
      context,
      index.map((entry) =>
        entry.contentSha256 === contentSha256 ? { ...entry, fileName } : entry,
      ),
    );
  });

  return true;
}

async function runWithXmlParts<T>(
  work: (parts: XmlParts, context: Excel.RequestContext) => Promise<T> | T,
): Promise<T> {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  return Excel.run(async (context) => {
    const parts = getCustomXmlParts(context);
    return work(parts, context);
  });
}

function getCustomXmlParts(context: Excel.RequestContext): XmlParts {
  const workbook = context.workbook as Excel.Workbook & {
    customXmlParts: XmlParts;
  };
  return workbook.customXmlParts;
}

async function readIndex(
  parts: XmlParts,
  context: Excel.RequestContext,
): Promise<EvidenceIndexEntry[]> {
  const collection = parts.getByNamespace(EVIDENCE_NS);
  collection.load("items");
  await context.sync();

  if (!collection.items.length) {
    return [];
  }

  const xmlResults = collection.items.map((part) => part.getXml());
  await context.sync();

  const merged = new Map<string, EvidenceIndexEntry>();
  for (const xml of xmlResults) {
    for (const entry of parseIndexXml(xml.value)) {
      merged.set(entry.contentSha256, entry);
    }
  }

  return Array.from(merged.values());
}

async function replaceIndex(
  parts: XmlParts,
  context: Excel.RequestContext,
  entries: EvidenceIndexEntry[],
) {
  const collection = parts.getByNamespace(EVIDENCE_NS);
  collection.load("items");
  await context.sync();

  for (const part of collection.items) {
    part.delete();
  }
  await context.sync();

  parts.add(serializeIndex(entries));
  await context.sync();
}

async function deleteChunksForHash(
  parts: XmlParts,
  context: Excel.RequestContext,
  contentSha256: string,
) {
  const collection = parts.getByNamespace(CHUNK_NS);
  collection.load("items");
  await context.sync();

  if (!collection.items.length) {
    return;
  }

  const xmlResults = collection.items.map((part) => ({
    part,
    xml: part.getXml(),
  }));
  await context.sync();

  let deleted = 0;
  for (const item of xmlResults) {
    const chunk = parseChunkXml(item.xml.value);
    if (chunk?.sha256 !== contentSha256) {
      continue;
    }
    item.part.delete();
    deleted += 1;
    if (deleted % SYNC_BATCH === 0) {
      await context.sync();
    }
  }

  if (deleted > 0) {
    await context.sync();
  }
}

async function readChunks(
  parts: XmlParts,
  context: Excel.RequestContext,
  contentSha256: string,
  expectedCount: number,
): Promise<ArrayBuffer | undefined> {
  const collection = parts.getByNamespace(CHUNK_NS);
  collection.load("items");
  await context.sync();

  if (!collection.items.length) {
    return expectedCount === 0 ? new ArrayBuffer(0) : undefined;
  }

  const xmlResults = collection.items.map((part) => part.getXml());
  await context.sync();

  const matching: Array<{ index: number; base64: string; total: number }> = [];
  for (const xml of xmlResults) {
    const chunk = parseChunkXml(xml.value);
    if (!chunk || chunk.sha256 !== contentSha256) {
      continue;
    }
    matching.push({
      index: chunk.index,
      base64: chunk.base64,
      total: chunk.total,
    });
  }

  matching.sort((left, right) => left.index - right.index);

  const total = matching[0]?.total ?? expectedCount;
  if (!matching.length || matching.length !== total) {
    return undefined;
  }

  return decodeChunks(matching.map((chunk) => chunk.base64));
}

function encodeChunks(contentSha256: string, bytes: ArrayBuffer) {
  const view = new Uint8Array(bytes);
  if (view.byteLength === 0) {
    return [serializeChunk(contentSha256, 0, 1, "")];
  }

  const total = Math.ceil(view.byteLength / RAW_CHUNK_BYTES);
  const chunks: string[] = [];

  for (let index = 0; index < total; index += 1) {
    const start = index * RAW_CHUNK_BYTES;
    const end = Math.min(start + RAW_CHUNK_BYTES, view.byteLength);
    const slice = view.subarray(start, end);
    chunks.push(
      serializeChunk(contentSha256, index, total, bytesToBase64(slice)),
    );
  }

  return chunks;
}

function decodeChunks(base64Parts: string[]) {
  const buffers = base64Parts.map((part) => base64ToBytes(part));
  const total = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
  const output = new Uint8Array(total);
  let offset = 0;

  for (const buffer of buffers) {
    output.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return output.buffer;
}

function serializeIndex(entries: EvidenceIndexEntry[]) {
  const files = entries
    .map(
      (entry) =>
        `<file sha256="${escapeXml(entry.contentSha256)}" mime="${escapeXml(entry.mimeType)}" fileName="${escapeXml(entry.fileName)}" originalSize="${entry.originalSize}" storedSize="${entry.storedSize}" chunks="${entry.chunkCount}"/>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><evidence xmlns="${EVIDENCE_NS}">${files}</evidence>`;
}

function parseIndexXml(xml: string): EvidenceIndexEntry[] {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (document.querySelector("parsererror")) {
    return [];
  }

  return Array.from(document.getElementsByTagName("file"))
    .map((element) => ({
      contentSha256: element.getAttribute("sha256") ?? "",
      mimeType: element.getAttribute("mime") ?? "application/octet-stream",
      fileName: element.getAttribute("fileName") ?? "",
      originalSize: Number(element.getAttribute("originalSize") ?? "0"),
      storedSize: Number(element.getAttribute("storedSize") ?? "0"),
      chunkCount: Number(element.getAttribute("chunks") ?? "0"),
    }))
    .filter((entry) => entry.contentSha256);
}

function serializeChunk(
  contentSha256: string,
  index: number,
  total: number,
  base64: string,
) {
  return `<?xml version="1.0" encoding="UTF-8"?><chunk xmlns="${CHUNK_NS}" sha256="${escapeXml(contentSha256)}" index="${index}" total="${total}">${base64}</chunk>`;
}

function parseChunkXml(xml: string) {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (document.querySelector("parsererror")) {
    return undefined;
  }

  const element = document.documentElement;
  if (!element || element.localName !== "chunk") {
    return undefined;
  }

  return {
    sha256: element.getAttribute("sha256") ?? "",
    index: Number(element.getAttribute("index") ?? "0"),
    total: Number(element.getAttribute("total") ?? "0"),
    base64: (element.textContent ?? "").replace(/\s+/g, ""),
  };
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function bytesToBase64(bytes: Uint8Array) {
  const chunkSize = 0x8000;
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const slice = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...slice);
  }

  return btoa(binary);
}

function base64ToBytes(value: string) {
  if (!value) {
    return new ArrayBuffer(0);
  }

  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

import {
  cellIsInsideRange,
  parseA1Cell,
} from "@/features/office/services/cell-address";
import { isWorkbookEvidenceSupported } from "@/features/office/services/workbook-evidence.service";
import type { DocumentKind, SnipSourceType, SourceKind } from "@/types/domain";

export const SNIP_ANCHOR_NS = "http://doctrace/snip-anchor/1";
export const SNIP_BINDING_PREFIX = "dtsnip_";

export interface SnipAnchorRecord {
  bindingId: string;
  snipId: string;
  contentSha256: string;
  documentId: string;
  fileName: string;
  kind: DocumentKind;
  sourceKind: SourceKind;
  sourceType?: SnipSourceType;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

type XmlPart = {
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

type SnipAnchorFocusHandler = (bindingId: string) => void;

let lastSnipClaimAt = 0;
let lastSnipClaimId = "";
let undoSelectGuardUntil = 0;

export function markSnipBindingClaimed(bindingId: string) {
  lastSnipClaimAt = Date.now();
  lastSnipClaimId = bindingId;
}

export function consumeRecentSnipBindingClaim(windowMs = 400) {
  if (!lastSnipClaimId || Date.now() - lastSnipClaimAt > windowMs) {
    return undefined;
  }

  const bindingId = lastSnipClaimId;
  lastSnipClaimId = "";
  return bindingId;
}

export function markSnipUndoSelectGuard(windowMs = 2000) {
  undoSelectGuardUntil = Date.now() + windowMs;
}

export function clearSnipUndoSelectGuard() {
  undoSelectGuardUntil = 0;
}

export function isSnipUndoSelectGuarded() {
  return Date.now() < undoSelectGuardUntil;
}

let snipAnchorFocusHandler: SnipAnchorFocusHandler | undefined;
const attachedBindingIds = new Set<string>();

export function isOfficeBindingsAvailable() {
  return Boolean(window.Office?.context?.document?.bindings);
}

export function isSnipAnchorSupported() {
  return isOfficeBindingsAvailable() && isWorkbookEvidenceSupported();
}

export function isExcelBindingRangeSupported() {
  return Boolean(
    typeof Excel !== "undefined" &&
    window.Excel &&
    window.Office?.context?.requirements?.isSetSupported?.("ExcelApi", "1.7"),
  );
}

export function createSnipBindingId() {
  const raw =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;

  return `${SNIP_BINDING_PREFIX}${raw.replace(/-/g, "")}`;
}

export function isSnipBindingId(id: string) {
  return id.startsWith(SNIP_BINDING_PREFIX);
}

export function serializeSnipAnchorIndex(anchors: SnipAnchorRecord[]) {
  const rows = anchors
    .map(
      (anchor) =>
        `<anchor bindingId="${escapeXml(anchor.bindingId)}" snipId="${escapeXml(anchor.snipId)}" contentSha256="${escapeXml(anchor.contentSha256)}" documentId="${escapeXml(anchor.documentId)}" fileName="${escapeXml(anchor.fileName)}" kind="${escapeXml(anchor.kind)}" sourceKind="${escapeXml(anchor.sourceKind)}" sourceType="${escapeXml(anchor.sourceType ?? "")}" page="${anchor.page}" x="${anchor.x}" y="${anchor.y}" width="${anchor.width}" height="${anchor.height}" text="${escapeXml(anchor.text)}"/>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><anchors xmlns="${SNIP_ANCHOR_NS}">${rows}</anchors>`;
}

export function parseSnipSourceType(
  value: string | undefined,
): SnipSourceType | undefined {
  if (
    value === "pdf-text" ||
    value === "pdf-word" ||
    value === "pdf-line" ||
    value === "pdf-table" ||
    value === "manual-region" ||
    value === "extracted-snippet"
  ) {
    return value;
  }

  return undefined;
}

export function parseSnipAnchorIndex(xml: string): SnipAnchorRecord[] {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (document.querySelector("parsererror")) {
    return [];
  }

  return Array.from(document.getElementsByTagName("anchor"))
    .map((element) => {
      const sourceType = element.getAttribute("sourceType") || undefined;
      const kind = element.getAttribute("kind");
      const sourceKind = element.getAttribute("sourceKind");

      return {
        bindingId: element.getAttribute("bindingId") ?? "",
        snipId: element.getAttribute("snipId") ?? "",
        contentSha256: element.getAttribute("contentSha256") ?? "",
        documentId: element.getAttribute("documentId") ?? "",
        fileName: element.getAttribute("fileName") ?? "",
        kind: kind === "bank-statement" ? "bank-statement" : "invoice",
        sourceKind:
          sourceKind === "pdf" ||
          sourceKind === "json" ||
          sourceKind === "image"
            ? sourceKind
            : "pdf",
        sourceType: parseSnipSourceType(sourceType),
        page: Number(element.getAttribute("page") ?? "1"),
        x: Number(element.getAttribute("x") ?? "0"),
        y: Number(element.getAttribute("y") ?? "0"),
        width: Number(element.getAttribute("width") ?? "0"),
        height: Number(element.getAttribute("height") ?? "0"),
        text: element.getAttribute("text") ?? "",
      } satisfies SnipAnchorRecord;
    })
    .filter((anchor) => anchor.bindingId && anchor.contentSha256);
}

export function upsertSnipAnchor(
  anchors: SnipAnchorRecord[],
  next: SnipAnchorRecord,
) {
  return [
    ...anchors.filter((anchor) => anchor.bindingId !== next.bindingId),
    next,
  ];
}

export function removeSnipAnchorsByBindingIds(
  anchors: SnipAnchorRecord[],
  bindingIds: string[],
) {
  const drop = new Set(bindingIds);
  return anchors.filter((anchor) => !drop.has(anchor.bindingId));
}

export async function saveSnipAnchor(
  record: SnipAnchorRecord,
): Promise<boolean> {
  if (!isSnipAnchorSupported()) {
    return false;
  }

  await runWithXmlParts(async (parts, context) => {
    const current = await readAnchors(parts, context);
    await replaceAnchors(parts, context, upsertSnipAnchor(current, record));
  });

  return true;
}

export async function loadAllSnipAnchors(): Promise<SnipAnchorRecord[]> {
  if (!isSnipAnchorSupported()) {
    return [];
  }

  return runWithXmlParts(async (parts, context) => readAnchors(parts, context));
}

export async function removeSnipAnchor(bindingId: string): Promise<void> {
  if (!isSnipAnchorSupported() || !bindingId) {
    return;
  }

  await runWithXmlParts(async (parts, context) => {
    const current = await readAnchors(parts, context);
    await replaceAnchors(
      parts,
      context,
      removeSnipAnchorsByBindingIds(current, [bindingId]),
    );
  });
}

export async function createSnipBinding(
  bindingId: string,
  bindingType: "text" | "matrix" = "text",
): Promise<void> {
  const bindings = getBindings();
  if (!bindings) {
    throw new Error("Office bindings are not available.");
  }

  const officeType =
    bindingType === "matrix"
      ? Office.BindingType.Matrix
      : Office.BindingType.Text;

  await new Promise<void>((resolve, reject) => {
    bindings.addFromSelectionAsync(officeType, { id: bindingId }, (result) => {
      if (result.status === Office.AsyncResultStatus.Failed) {
        reject(
          new Error(
            result.error?.message ?? "Could not bind the selected cell.",
          ),
        );
        return;
      }
      resolve();
    });
  });
}

export async function deleteSnipBinding(bindingId: string): Promise<void> {
  const bindings = getBindings();
  if (!bindings || !bindingId) {
    return;
  }

  await new Promise<void>((resolve) => {
    bindings.releaseByIdAsync(bindingId, () => resolve());
  });
  attachedBindingIds.delete(bindingId);
}

export async function listSnipBindingIds(): Promise<string[]> {
  const bindings = getBindings();
  if (!bindings) {
    return [];
  }

  const all = await new Promise<Office.Binding[]>((resolve) => {
    bindings.getAllAsync((result) => {
      if (result.status === Office.AsyncResultStatus.Failed) {
        resolve([]);
        return;
      }
      resolve(result.value ?? []);
    });
  });

  return all.map((binding) => binding.id).filter(isSnipBindingId);
}

export async function findSnipBindingOnSelection(): Promise<
  string | undefined
> {
  if (!isExcelBindingRangeSupported()) {
    return undefined;
  }

  const ids = await listSnipBindingIds();
  if (!ids.length) {
    return undefined;
  }

  return Excel.run(async (context) => {
    const selection = context.workbook.getSelectedRange();
    selection.load(["address", "rowCount", "columnCount"]);
    const selectionSheet = selection.worksheet;
    selectionSheet.load("name");

    const workbook = context.workbook as Excel.Workbook & {
      bindings: {
        getItemOrNullObject: (id: string) => {
          isNullObject: boolean;
          load: (props: string | string[]) => void;
          getRange: () => Excel.Range;
        };
      };
    };

    const probes = ids.map((id) => {
      const binding = workbook.bindings.getItemOrNullObject(id);
      binding.load("id");
      const range = binding.getRange();
      range.load([
        "address",
        "rowIndex",
        "columnIndex",
        "rowCount",
        "columnCount",
      ]);
      const sheet = range.worksheet;
      sheet.load("name");
      return { id, binding, range, sheet };
    });

    await context.sync();

    if (selection.rowCount !== 1 || selection.columnCount !== 1) {
      return undefined;
    }

    const selectedAddress = normalizeCellAddress(selection.address);
    const selectedSheet = selectionSheet.name;
    const selectedCell = parseA1Cell(selectedAddress);
    if (!selectedCell) {
      return undefined;
    }

    for (const probe of probes) {
      if (probe.binding.isNullObject) {
        continue;
      }

      if (probe.sheet.name !== selectedSheet) {
        continue;
      }

      const probeAddress = normalizeCellAddress(probe.range.address);
      if (probeAddress === selectedAddress) {
        return probe.id;
      }

      if (
        cellIsInsideRange(selectedCell, {
          rowIndex: probe.range.rowIndex,
          columnIndex: probe.range.columnIndex,
          rowCount: probe.range.rowCount,
          columnCount: probe.range.columnCount,
        })
      ) {
        return probe.id;
      }
    }

    return undefined;
  });
}

export function setSnipAnchorFocusHandler(
  handler: SnipAnchorFocusHandler | undefined,
) {
  snipAnchorFocusHandler = handler;
}

export async function syncSnipBindingHandlers(bindingIds: string[]) {
  const bindings = getBindings();
  if (!bindings) {
    return;
  }

  const next = new Set(bindingIds.filter(isSnipBindingId));

  for (const id of Array.from(attachedBindingIds)) {
    if (next.has(id)) {
      continue;
    }
    attachedBindingIds.delete(id);
  }

  for (const id of next) {
    if (attachedBindingIds.has(id)) {
      continue;
    }

    await new Promise<void>((resolve) => {
      bindings.getByIdAsync(id, (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          resolve();
          return;
        }

        result.value.addHandlerAsync(
          Office.EventType.BindingSelectionChanged,
          () => {
            markSnipBindingClaimed(id);
            snipAnchorFocusHandler?.(id);
          },
          () => {
            attachedBindingIds.add(id);
            resolve();
          },
        );
      });
    });
  }
}

function getBindings() {
  return window.Office?.context?.document?.bindings;
}

function normalizeCellAddress(address: string) {
  const withoutSheet = address.includes("!")
    ? (address.split("!").pop() ?? address)
    : address;
  return withoutSheet.replace(/\$/g, "").toUpperCase();
}

async function runWithXmlParts<T>(
  work: (parts: XmlParts, context: Excel.RequestContext) => Promise<T> | T,
): Promise<T> {
  if (!window.Excel) {
    throw new Error("Excel APIs are not available in this environment.");
  }

  return Excel.run(async (context) => {
    const workbook = context.workbook as Excel.Workbook & {
      customXmlParts: XmlParts;
    };
    return work(workbook.customXmlParts, context);
  });
}

async function readAnchors(
  parts: XmlParts,
  context: Excel.RequestContext,
): Promise<SnipAnchorRecord[]> {
  const collection = parts.getByNamespace(SNIP_ANCHOR_NS);
  collection.load("items");
  await context.sync();

  if (!collection.items.length) {
    return [];
  }

  const xmlResults = collection.items.map((part) => part.getXml());
  await context.sync();

  const merged = new Map<string, SnipAnchorRecord>();
  for (const xml of xmlResults) {
    for (const entry of parseSnipAnchorIndex(xml.value)) {
      merged.set(entry.bindingId, entry);
    }
  }

  return Array.from(merged.values());
}

async function replaceAnchors(
  parts: XmlParts,
  context: Excel.RequestContext,
  anchors: SnipAnchorRecord[],
) {
  const collection = parts.getByNamespace(SNIP_ANCHOR_NS);
  collection.load("items");
  await context.sync();

  for (const part of collection.items) {
    part.delete();
  }
  await context.sync();

  parts.add(serializeSnipAnchorIndex(anchors));
  await context.sync();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

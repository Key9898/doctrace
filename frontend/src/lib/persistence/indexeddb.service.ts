/**
 * IndexedDB persistence for Browser Preview and as a session cache in Excel.
 * Workbook evidence bytes live in Custom XML parts (see workbook-evidence.service).
 * document.settings is only used for match templates.
 */

import {
  areDocumentsStubOnly,
  isFatDocument,
  toDocumentPayload,
} from "@/lib/persistence/engagement-payload";
import type { ParsedDocument } from "@/types/domain";

const DB_NAME = "doctrace";
const DB_VERSION = 3;
const STORE_NAME = "state";
const BLOB_STORE = "blobs";
const ENGAGEMENT_DOCS_STORE = "engagementDocs";

function indexedDbAvailable() {
  return typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE);
      }
      if (!db.objectStoreNames.contains(ENGAGEMENT_DOCS_STORE)) {
        db.createObjectStore(ENGAGEMENT_DOCS_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function persistState<T>(key: string, value: T): Promise<void> {
  if (!indexedDbAvailable()) {
    return;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Silently fail - persistence is best-effort in browser mode.
  }
}

export async function loadState<T>(key: string): Promise<T | undefined> {
  if (!indexedDbAvailable()) {
    return undefined;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    const result = await new Promise<T | undefined>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return result;
  } catch {
    return undefined;
  }
}

export async function clearPersistedState(): Promise<void> {
  if (!indexedDbAvailable()) {
    return;
  }

  try {
    const db = await openDatabase();
    const storeNames = [STORE_NAME, BLOB_STORE, ENGAGEMENT_DOCS_STORE].filter(
      (name) => db.objectStoreNames.contains(name),
    );
    const tx = db.transaction(storeNames, "readwrite");
    if (db.objectStoreNames.contains(STORE_NAME)) {
      tx.objectStore(STORE_NAME).clear();
    }
    if (db.objectStoreNames.contains(BLOB_STORE)) {
      tx.objectStore(BLOB_STORE).clear();
    }
    if (db.objectStoreNames.contains(ENGAGEMENT_DOCS_STORE)) {
      tx.objectStore(ENGAGEMENT_DOCS_STORE).clear();
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Silently fail
  }
}

export async function persistBlob(
  key: string,
  data: ArrayBuffer,
  mimeType: string,
): Promise<boolean> {
  if (!indexedDbAvailable()) {
    return false;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(BLOB_STORE, "readwrite");
    tx.objectStore(BLOB_STORE).put({ data, mimeType }, key);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return true;
  } catch {
    return false;
  }
}

export async function loadBlob(
  key: string,
): Promise<{ data: ArrayBuffer; mimeType: string } | undefined> {
  if (!indexedDbAvailable()) {
    return undefined;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(BLOB_STORE, "readonly");
    const request = tx.objectStore(BLOB_STORE).get(key);
    const result = await new Promise<
      { data: ArrayBuffer; mimeType: string } | undefined
    >((resolve, reject) => {
      request.onsuccess = () =>
        resolve(
          request.result as { data: ArrayBuffer; mimeType: string } | undefined,
        );
      request.onerror = () => reject(request.error);
    });
    db.close();
    return result;
  } catch {
    return undefined;
  }
}

export async function removeBlob(key: string): Promise<void> {
  if (!indexedDbAvailable()) {
    return;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(BLOB_STORE, "readwrite");
    tx.objectStore(BLOB_STORE).delete(key);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Silently fail
  }
}

export async function loadEngagementDocuments(
  engagementId: string,
): Promise<ParsedDocument[] | undefined> {
  if (!indexedDbAvailable()) {
    return undefined;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(ENGAGEMENT_DOCS_STORE, "readonly");
    const request = tx.objectStore(ENGAGEMENT_DOCS_STORE).get(engagementId);
    const result = await new Promise<ParsedDocument[] | undefined>(
      (resolve, reject) => {
        request.onsuccess = () =>
          resolve(request.result as ParsedDocument[] | undefined);
        request.onerror = () => reject(request.error);
      },
    );
    db.close();
    return result;
  } catch {
    return undefined;
  }
}

export async function persistEngagementDocuments(
  engagementId: string,
  documents: ParsedDocument[],
): Promise<boolean> {
  if (!indexedDbAvailable()) {
    return false;
  }

  const incoming = documents.map(toDocumentPayload);
  const existing = await loadEngagementDocuments(engagementId);

  if (existing?.some(isFatDocument) && areDocumentsStubOnly(incoming)) {
    return true;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(ENGAGEMENT_DOCS_STORE, "readwrite");
    tx.objectStore(ENGAGEMENT_DOCS_STORE).put(incoming, engagementId);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return true;
  } catch {
    return false;
  }
}

export async function removeEngagementDocuments(
  engagementId: string,
): Promise<boolean> {
  if (!indexedDbAvailable()) {
    return false;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(ENGAGEMENT_DOCS_STORE, "readwrite");
    tx.objectStore(ENGAGEMENT_DOCS_STORE).delete(engagementId);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return true;
  } catch {
    return false;
  }
}

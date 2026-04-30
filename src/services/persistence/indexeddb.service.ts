/**
 * Lightweight IndexedDB persistence for browser-preview mode.
 * In Excel mode, workbook custom properties are used instead.
 */

const DB_NAME = "doctrace";
const DB_VERSION = 2;
const STORE_NAME = "state";
const BLOB_STORE = "blobs";

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
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function persistState<T>(key: string, value: T): Promise<void> {
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
  try {
    const db = await openDatabase();
    const tx = db.transaction([STORE_NAME, BLOB_STORE], "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.objectStore(BLOB_STORE).clear();
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
  documentId: string,
  data: ArrayBuffer,
  mimeType: string,
): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(BLOB_STORE, "readwrite");
    tx.objectStore(BLOB_STORE).put({ data, mimeType }, documentId);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Silently fail - blob persistence is best-effort.
  }
}

export async function loadBlob(
  documentId: string,
): Promise<{ data: ArrayBuffer; mimeType: string } | undefined> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(BLOB_STORE, "readonly");
    const request = tx.objectStore(BLOB_STORE).get(documentId);
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

export async function removeBlob(documentId: string): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(BLOB_STORE, "readwrite");
    tx.objectStore(BLOB_STORE).delete(documentId);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Silently fail
  }
}

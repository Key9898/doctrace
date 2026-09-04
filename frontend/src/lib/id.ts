let fallbackCounter = 0;

export function createId(prefix = "dt") {
  const randomUuid = globalThis.crypto?.randomUUID;

  if (typeof randomUuid === "function") {
    return randomUuid.call(globalThis.crypto);
  }

  fallbackCounter += 1;

  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 10);
  const counter = fallbackCounter.toString(36);

  return `${prefix}-${timestamp}-${counter}-${randomPart}`;
}

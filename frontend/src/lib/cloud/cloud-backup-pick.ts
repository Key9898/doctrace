export function pickBackupDocument<
  T extends { id: string; contentSha256?: string },
>(documents: T[], viewerDocumentId?: string): T | null {
  if (viewerDocumentId) {
    const viewed = documents.find(
      (document) => document.id === viewerDocumentId,
    );
    if (viewed) {
      return viewed;
    }
  }
  return (
    documents.find((document) => Boolean(document.contentSha256)) ??
    documents[0] ??
    null
  );
}

export interface PbcUploadedFileFields {
  status: "Pending" | "Uploaded" | "Approved" | "Rejected";
  fileName?: string;
  uploadedAt?: string;
  importedDocumentIds?: string[];
}

export function pbcImportedDocumentIds(ids?: string[]): string[] {
  if (!ids) {
    return [];
  }

  return ids.map((id) => id.trim()).filter((id) => id.length > 0);
}

export function clearPbcUploadedFile<T extends PbcUploadedFileFields>(
  request: T,
): T {
  return {
    ...request,
    status: "Pending",
    fileName: undefined,
    uploadedAt: undefined,
    importedDocumentIds: undefined,
  };
}

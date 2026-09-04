export type ExcelPrimitive = string | number | boolean | null;

export type DocumentKind = "invoice" | "bank-statement";
export type SourceKind = "pdf" | "image" | "json";
export type ParserStatus = "idle" | "parsing" | "parsed" | "error";
export type MatchStatus = "matched" | "partial" | "exception";
export type ToastTone = "info" | "success" | "error";
export type MatchOutputField =
  | "invoiceDocument"
  | "invoiceAmount"
  | "invoiceDate"
  | "invoiceNumber"
  | "bankDocument"
  | "bankAmount"
  | "bankDate"
  | "bankReference"
  | "status"
  | "confidence";

export interface SelectionColumn {
  id: string;
  index: number;
  header: string;
  letter: string;
  inferredRole?: MatchFieldRole;
}

export interface SelectionRowRecord {
  rowNumber: number;
  values: Record<string, ExcelPrimitive>;
}

export interface OutputColumnOption {
  id: string;
  columnIndex: number;
  letter: string;
  label: string;
  header?: string;
}

export interface SelectionSnapshot {
  sheetName: string;
  address: string;
  hasHeaders: boolean;
  headerRowNumber: number;
  firstDataRowNumber: number;
  startColumnIndex: number;
  worksheetColumnCount: number;
  rowCount: number;
  columnCount: number;
  columns: SelectionColumn[];
  outputColumnOptions: OutputColumnOption[];
  rows: SelectionRowRecord[];
}

export interface ParsedPage {
  pageNumber: number;
  text: string;
  snippets: string[];
}

export interface FieldCandidate<TValue> {
  value: TValue;
  confidence: number;
  sourceText: string;
  pageNumber: number;
}

export interface StatementEntry {
  id: string;
  documentId: string;
  fileName: string;
  pageNumber: number;
  amount?: number;
  date?: string;
  reference?: string;
  rawLine: string;
}

export interface ParsedDocument {
  id: string;
  fileName: string;
  kind: DocumentKind;
  sourceKind: SourceKind;
  mimeType: string;
  objectUrl: string;
  importedAt: string;
  size: number;
  contentSha256?: string;
  originalSize?: number;
  storedSize?: number;
  normalized?: boolean;
  pageCount: number;
  status: ParserStatus;
  error?: string;
  extractedText: string;
  pages: ParsedPage[];
  invoiceNumber?: FieldCandidate<string>;
  amount?: FieldCandidate<number>;
  date?: FieldCandidate<string>;
  vendor?: FieldCandidate<string>;
  statementEntries: StatementEntry[];
  rawJson?: string;
}

export type MatchFieldRole = "amount" | "date" | "invoiceNumber";
export type OutputColumnMap = Partial<Record<MatchOutputField, number>>;

export interface MatchConfig {
  amountColumnId?: string;
  dateColumnId?: string;
  invoiceNumberColumnId?: string;
  amountTolerance: number;
  amountTolerancePercent?: number;
  dateToleranceDays: number;
  requireInvoiceNumber: boolean;
  fuzzyReferenceMatch: boolean;
  outputFields: MatchOutputField[];
  outputColumnMap: OutputColumnMap;
  scoreWeights?: ScoreWeights;
}

export interface ScoreWeights {
  invoiceNumber: number;
  amount: number;
  date: number;
}

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  invoiceNumber: 60,
  amount: 25,
  date: 15,
};

export interface MatchTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  config: MatchConfig;
}

export interface InvoiceMatch {
  documentId: string;
  fileName: string;
  pageNumber: number;
  score: number;
  snippet: string;
  extractedInvoiceNumber?: string;
  extractedAmount?: number;
  extractedDate?: string;
}

export interface BankMatch {
  documentId: string;
  fileName: string;
  pageNumber: number;
  entryId: string;
  score: number;
  snippet: string;
  extractedReference?: string;
  extractedAmount?: number;
  extractedDate?: string;
}

export interface MatchResult {
  id: string;
  rowNumber: number;
  inputValues: Record<string, ExcelPrimitive>;
  status: MatchStatus;
  confidence: number;
  explanation: string;
  invoiceMatch?: InvoiceMatch;
  bankMatch?: BankMatch;
  matchedFields?: string[];
  bankMatchedFields?: string[];
  outputValues: Record<MatchOutputField, ExcelPrimitive>;
}

export type ViewerZoomFactor = 0.75 | 1 | 1.25 | 1.5 | 2;

export interface ViewerState {
  documentId?: string;
  pageNumber: number;
  query?: string;
  linkedRowId?: string;
  activeSnipId?: string;
  zoomFactor?: ViewerZoomFactor;
  inspectionEpoch?: number;
}

export interface ToastMessage {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export interface ActivityEvent {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  createdAt: string;
}

export interface WorkbookTemplatePayload {
  version: 1;
  templates: MatchTemplate[];
}

export interface AuditIdentity {
  preparer: string;
  reviewer: string;
}

export const EMPTY_AUDIT_IDENTITY: AuditIdentity = {
  preparer: "",
  reviewer: "",
};

export interface WorkbookIdentityPayload {
  version: 1;
  preparer: string;
  reviewer: string;
}

export interface WorkbookReportingPayload {
  version: 1;
  currency: string;
  ocrLanguage: "mya+eng" | "eng";
}

export type ExceptionSignOffAction = "conclude" | "waive" | "follow-up";

export type MaterialityAssessmentKey =
  | "results.clearlyTrivial"
  | "results.belowPerformance"
  | "results.materialException"
  | "results.aboveOverall"
  | "results.unassessed";

export interface RowSignOff {
  rowNumber: number;
  action: ExceptionSignOffAction;
  comment: string;
  materialityKey: MaterialityAssessmentKey | "";
  signedAt: string;
  preparer: string;
  reviewer: string;
}

export type AuditLogEvent = "match" | "signoff";

export interface AuditLogEntry {
  event: AuditLogEvent;
  timestamp: string;
  rowNumber: number;
  status: MatchStatus | "";
  confidence: number | "";
  invoiceFile: string;
  invoiceHash: string;
  bankFile: string;
  bankHash: string;
  explanation: string;
  configSnapshot: string;
  preparer: string;
  reviewer: string;
  signOffAction: string;
  signOffComment: string;
  materiality: string;
}

/** @deprecated Use AuditLogEntry. Kept as an alias for older call sites. */
export type AuditLogRow = AuditLogEntry;

/* Visual Snipping */

export type SnipFormField =
  | "invoice-number"
  | "date"
  | "amount"
  | "reference"
  | "other";

export interface Snip {
  id: string;
  documentId: string;
  fileName: string;
  pageNumber: number;
  text: string;
  boundingBox: SnipBoundingBox;
  createdAt: string;
  sourceType?: SnipSourceType;
  grid?: string[][];
  formField?: SnipFormField;
}

export interface SnipBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SnipSourceType =
  | "pdf-text"
  | "pdf-word"
  | "pdf-line"
  | "pdf-table"
  | "manual-region"
  | "extracted-snippet";

export interface SnipLink {
  id: string;
  snipId: string;
  cellAddress: string;
  sheetName: string;
  linkedAt: string;
  bindingId?: string;
  contentSha256?: string;
  rangeAddress?: string;
}

/* Progress Reporting */

export type ProgressCallback = (message: string) => void;

/* DocTrace Engagements & Dashboard */

export type AuditFramework = "ISA" | "IFRS_SMEs" | "IAS_IFRS";
export type EngagementStatus =
  | "Not Started"
  | "In Progress"
  | "Pending Client"
  | "Under Review"
  | "Cleared for Partner Review"
  | "Completed"
  | "Archived";

export interface EngagementTeam {
  partner: string;
  manager: string;
  senior: string;
  associate: string;
  eqReviewer: string;
}

export interface Engagement {
  id: string;
  clientName: string;
  financialYear: string;
  framework: AuditFramework;
  status: EngagementStatus;
  createdAt: string;
  progressPercentage: number;
  teamAssignments: EngagementTeam;
  documents?: ParsedDocument[];
  results?: MatchResult[];
  overallMateriality?: number;
  performanceMateriality?: number;
  trivialThreshold?: number;
  isLocked?: boolean;
  currency?: string;
  ocrLanguage?: "mya+eng" | "eng";
}

export type AppModule =
  | "matching"
  | "engagements"
  | "trial-balance"
  | "workpapers"
  | "client-portal";

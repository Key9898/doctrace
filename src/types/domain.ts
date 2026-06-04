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
  outputValues: Record<MatchOutputField, ExcelPrimitive>;
}

export interface ViewerState {
  documentId?: string;
  pageNumber: number;
  query?: string;
  linkedRowId?: string;
  activeSnipId?: string;
}

export interface ToastMessage {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
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

export interface AuditLogRow {
  timestamp: string;
  rowNumber: number;
  status: MatchStatus;
  confidence: number;
  invoiceFile?: string;
  bankFile?: string;
  explanation: string;
}

/* Visual Snipping */

export interface Snip {
  id: string;
  documentId: string;
  fileName: string;
  pageNumber: number;
  text: string;
  boundingBox: SnipBoundingBox;
  createdAt: string;
  sourceType?: SnipSourceType;
}

export interface SnipBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SnipSourceType = "pdf-text" | "manual-region" | "extracted-snippet";

export interface SnipLink {
  id: string;
  snipId: string;
  cellAddress: string;
  sheetName: string;
  linkedAt: string;
}

/* Progress Reporting */

export type ProgressCallback = (message: string) => void;

/* EZAAI Engagements & Dashboard */

export type AuditFramework = "ISA" | "IFRS" | "IFRS_SMEs";
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
}

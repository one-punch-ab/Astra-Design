// Recommendation types for failed test cases
export interface Recommendation {
  id: string;
  type: 'knowledge' | 'action' | 'format' | 'intent';
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  actionLabel: string;
  actionLink?: string;
  icon?: string;
  checklist?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  checked: boolean;
}

// Test case row data structure
export interface TestCaseRow {
  id: string;
  question: string;
  expectedAnswer: string;
  leadingQuestions: string;
  aiResponse?: AIResponse;
  metrics?: TestMetrics;
  notes: string;
  runStatus: RunStatus;
  createdAt: Date;
  updatedAt: Date;
  // Custom column data - keyed by column field name
  customData?: Record<string, CustomColumnValue>;
  // AI-generated recommendations for failed tests
  recommendations?: Recommendation[];
}

// Value types for custom columns
export type CustomColumnValue = string | string[] | null;

export interface AIResponse {
  content: string; // Markdown content
  feedback?: 'up' | 'down';
  generatedAt?: Date;
}

export interface TestMetrics {
  accuracy: number; // 0-100
  latency: number; // in seconds
  status: TestStatus;
  tokensUsed?: number;
}

export type RunStatus = 'idle' | 'running' | 'complete' | 'error';
export type TestStatus = 'passed' | 'failed' | 'pending';
export type ViewMode = 'compact' | 'expanded';

// Worksheet (Excel-style tabs)
export interface Worksheet {
  id: string;
  name: string;
  testCases: TestCaseRow[];
  customColumns: CustomColumn[];
  createdAt: Date;
  updatedAt: Date;
}

// Column types for custom columns
export type ColumnType = 'text' | 'multiselect' | 'markdown';

export interface CustomColumn {
  id: string;
  name: string;
  field: string;
  type: ColumnType;
  options?: string[]; // For multiselect
  width?: number;
  createdAt: Date;
}

// CSV Import types
export interface CSVColumnMapping {
  [csvColumn: string]: string | null; // Maps CSV column to table field
}

export interface CSVImportPreview {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

// Filter types
export interface FilterConfig {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
}

export type FilterOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains' 
  | 'startsWith' 
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'isEmpty'
  | 'isNotEmpty';

// Sort types
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Export/Report types
export interface ExportConfig {
  format: 'csv' | 'json' | 'xlsx';
  includeMetrics: boolean;
  includeAIResponses: boolean;
  selectedOnly: boolean;
}

// Auto-generate config
export interface AutoGenerateConfig {
  count: number;
  basedOn: 'knowledge' | 'previous' | 'custom';
  customPrompt?: string;
}

// Bulk actions
export type BulkAction = 
  | 'run' 
  | 'delete' 
  | 'duplicate' 
  | 'moveToWorksheet'
  | 'resetMetrics';

// Cell renderer params extensions
export interface TestCaseCellRendererParams {
  data: TestCaseRow;
  onRunTest: (id: string) => void;
  onFeedback: (id: string, feedback: 'up' | 'down') => void;
  onEdit: (id: string, field: string, value: unknown) => void;
}

// Event types
export interface TestCaseUpdateEvent {
  type: 'create' | 'update' | 'delete' | 'reorder';
  testCaseId: string;
  field?: string;
  value?: unknown;
  previousValue?: unknown;
}

// API response types (for when connecting to backend)
export interface RunTestResponse {
  success: boolean;
  aiResponse: AIResponse;
  metrics: TestMetrics;
  error?: string;
}

export interface AutoGenerateResponse {
  success: boolean;
  testCases: Partial<TestCaseRow>[];
  error?: string;
}

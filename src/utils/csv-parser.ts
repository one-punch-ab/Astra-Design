import Papa from 'papaparse';
import type { TestCaseRow, CSVColumnMapping } from '@/types/test-cases.types';
import { generateId } from '@/lib/utils';

export interface ParseResult {
  success: boolean;
  headers: string[];
  data: string[][];
  totalRows: number;
  errors: string[];
}

/**
 * Parse a CSV file and return headers and data
 */
export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      complete: (results) => {
        const errors = results.errors.map((e) => e.message);
        const data = results.data as string[][];
        
        if (data.length < 1) {
          resolve({
            success: false,
            headers: [],
            data: [],
            totalRows: 0,
            errors: ['CSV file is empty'],
          });
          return;
        }

        const headers = data[0];
        const rows = data.slice(1).filter((row) => row.some((cell) => cell.trim()));

        resolve({
          success: errors.length === 0,
          headers,
          data: rows,
          totalRows: rows.length,
          errors,
        });
      },
      error: (error) => {
        resolve({
          success: false,
          headers: [],
          data: [],
          totalRows: 0,
          errors: [error.message],
        });
      },
    });
  });
}

/**
 * Convert CSV data to test cases using column mapping
 */
export function csvToTestCases(
  headers: string[],
  data: string[][],
  mapping: CSVColumnMapping
): TestCaseRow[] {
  const headerIndexMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    headerIndexMap[header] = index;
  });

  return data.map((row) => {
    const testCase: TestCaseRow = {
      id: generateId(),
      question: '',
      expectedAnswer: '',
      leadingQuestions: '',
      notes: '',
      runStatus: 'idle',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    Object.entries(mapping).forEach(([csvColumn, field]) => {
      if (field && headerIndexMap[csvColumn] !== undefined) {
        const value = row[headerIndexMap[csvColumn]] || '';
        if (field === 'question' || field === 'expectedAnswer' || field === 'leadingQuestions' || field === 'notes') {
          testCase[field] = value;
        }
      }
    });

    return testCase;
  });
}

/**
 * Auto-detect column mapping based on header names
 */
export function autoDetectMapping(headers: string[]): CSVColumnMapping {
  const mapping: CSVColumnMapping = {};

  headers.forEach((header) => {
    const normalizedHeader = header.toLowerCase().replace(/[_-\s]/g, '');

    if (normalizedHeader.includes('question') && !normalizedHeader.includes('leading')) {
      mapping[header] = 'question';
    } else if (normalizedHeader.includes('expected') || normalizedHeader.includes('answer')) {
      mapping[header] = 'expectedAnswer';
    } else if (normalizedHeader.includes('leading')) {
      mapping[header] = 'leadingQuestions';
    } else if (normalizedHeader.includes('note')) {
      mapping[header] = 'notes';
    } else {
      mapping[header] = null;
    }
  });

  return mapping;
}

/**
 * Export test cases to CSV string
 */
export function testCasesToCSV(testCases: TestCaseRow[]): string {
  const headers = [
    'Question',
    'Expected Answer',
    'Leading Questions',
    'AI Response',
    'Accuracy',
    'Latency (s)',
    'Status',
    'Feedback',
    'Notes',
  ];

  const rows = testCases.map((tc) => [
    tc.question,
    tc.expectedAnswer,
    tc.leadingQuestions,
    tc.aiResponse?.content || '',
    tc.metrics?.accuracy?.toString() || '',
    tc.metrics?.latency?.toString() || '',
    tc.metrics?.status || '',
    tc.aiResponse?.feedback || '',
    tc.notes,
  ]);

  const escapeCell = (cell: string) => {
    if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };

  return [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');
}

/**
 * Generate CSV template string
 */
export function generateCSVTemplate(): string {
  const headers = ['Question', 'Expected Answer', 'Leading Questions', 'Notes'];
  const sampleRows = [
    [
      'What are your pricing plans?',
      'We offer three plans: Starter ($29/mo), Pro ($79/mo), and Enterprise (custom pricing).',
      'How much does it cost?',
      'High priority - pricing question',
    ],
    [
      'How do I reset my password?',
      'Click "Forgot Password" on the login page and follow the email instructions.',
      'I forgot my password',
      'Common support question',
    ],
  ];

  const escapeCell = (cell: string) => {
    if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };

  return [
    headers.join(','),
    ...sampleRows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');
}

import React, { useState, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Button,
  Dropdown,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { Upload, ArrowRight, Info, FileUp, X, Download } from 'lucide-react';
import type { CSVImportPreview, CSVColumnMapping } from '@/types/test-cases.types';

interface ImportCSVModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (mapping: CSVColumnMapping, data: string[][]) => void;
  worksheetName: string;
  onDownloadTemplate?: () => void;
}

const TABLE_FIELDS = [
  { value: '', label: "Don't import" },
  { value: 'question', label: 'Question' },
  { value: 'expectedAnswer', label: 'Expected answer' },
  { value: 'leadingQuestions', label: 'Leading questions' },
  { value: 'notes', label: 'Notes' },
];

export const ImportCSVModal: React.FC<ImportCSVModalProps> = ({
  open,
  onOpenChange,
  onImport,
  worksheetName,
  onDownloadTemplate,
}) => {
  const [preview, setPreview] = useState<CSVImportPreview | null>(null);
  const [mapping, setMapping] = useState<CSVColumnMapping>({});
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError('');
    
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the format.');
          return;
        }

        const data = results.data as string[][];
        if (data.length < 2) {
          setError('CSV must have headers and at least one data row');
          return;
        }

        const headers = data[0];
        const rows = data.slice(1).filter(row => row.some(cell => cell.trim()));

        setPreview({
          headers,
          rows: rows.slice(0, 5), // Preview first 5 rows
          totalRows: rows.length,
        });

        // Auto-map columns with matching names
        const autoMapping: CSVColumnMapping = {};
        headers.forEach((header) => {
          const normalizedHeader = header.toLowerCase().replace(/[_-\s]/g, '');
          if (normalizedHeader.includes('question')) {
            autoMapping[header] = 'question';
          } else if (normalizedHeader.includes('expected') || normalizedHeader.includes('answer')) {
            autoMapping[header] = 'expectedAnswer';
          } else if (normalizedHeader.includes('leading')) {
            autoMapping[header] = 'leadingQuestions';
          } else if (normalizedHeader.includes('note')) {
            autoMapping[header] = 'notes';
          } else {
            autoMapping[header] = '';
          }
        });
        setMapping(autoMapping);
      },
      error: () => {
        setError('Failed to read CSV file');
      },
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleMappingChange = (header: string, value: string) => {
    setMapping((prev) => ({ ...prev, [header]: value }));
  };

  const handleImport = () => {
    if (!preview) return;

    // Validate at least question is mapped
    const hasQuestionMapping = Object.values(mapping).includes('question');
    if (!hasQuestionMapping) {
      setError('Please map at least the Question column');
      return;
    }

    // Re-parse the file to get all data
    Papa.parse(fileInputRef.current?.files?.[0] as File, {
      complete: (results) => {
        const data = results.data as string[][];
        const rows = data.slice(1).filter(row => row.some(cell => cell.trim()));
        onImport(mapping, rows);
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setPreview(null);
    setMapping({});
    setError('');
    setIsDragging(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file and map columns to match the table structure
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {!preview ? (
            // File upload area
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                isDragging
                  ? 'border-astra-primary bg-astra-primary-light'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              
              <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your CSV file here, or{' '}
                <label
                  htmlFor="csv-upload"
                  className="text-astra-primary hover:underline cursor-pointer"
                >
                  browse
                </label>
              </p>
              
              <p className="text-xs text-gray-400">
                CSV file with headers in the first row
              </p>

              {onDownloadTemplate && (
                <button
                  onClick={onDownloadTemplate}
                  className="inline-flex items-center gap-1.5 text-sm text-astra-primary hover:underline mt-4"
                >
                  <Download className="w-4 h-4" />
                  Download sample file
                </button>
              )}

              {error && (
                <p className="text-sm text-error mt-4">{error}</p>
              )}
            </div>
          ) : (
            <>
              {/* File info */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">
                    {preview.totalRows} rows to import
                  </span>
                </div>
                <button
                  onClick={() => {
                    setPreview(null);
                    setMapping({});
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CSV preview table */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="border rounded-lg overflow-auto max-h-48">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {preview.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-3 py-2 text-left font-medium text-gray-700 border-b whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row, i) => (
                        <tr key={i} className="border-t">
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="px-3 py-2 text-gray-600 max-w-[200px] truncate"
                            >
                              {cell || <span className="text-gray-300">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {preview.totalRows > 5 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Showing first 5 of {preview.totalRows} rows
                  </p>
                )}
              </div>

              {/* Column mapping */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Map CSV columns to table fields
                </h4>
                <div className="space-y-3">
                  {preview.headers.map((header) => (
                    <div key={header} className="flex items-center gap-3">
                      <div className="w-40 text-sm font-medium text-gray-700 truncate">
                        {header}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                      <Dropdown
                        value={mapping[header] || ''}
                        onChange={(val) => handleMappingChange(header, val)}
                        options={TABLE_FIELDS}
                        placeholder="Select field..."
                        className="w-48"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Import info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-astra-primary-light p-3 rounded-lg">
                <Info className="w-4 h-4 text-astra-primary shrink-0" />
                <span>
                  Importing {preview.totalRows} rows into "{worksheetName}"
                </span>
              </div>

              {error && (
                <p className="text-sm text-error">{error}</p>
              )}
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!preview || !Object.values(mapping).includes('question')}
          >
            <Upload className="w-4 h-4" />
            Import {preview?.totalRows || 0} rows
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Dropdown,
} from '@/components/ui';
import { Trash2, GripVertical, X } from 'lucide-react';
import type { SortConfig } from '@/types/test-cases.types';

interface SortModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sorts: SortConfig[];
  onApply: (sorts: SortConfig[]) => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

// Column options with their types for determining sort options
const COLUMN_OPTIONS = [
  { value: 'question', label: 'Question', type: 'text' },
  { value: 'expectedAnswer', label: 'Expected answer', type: 'text' },
  { value: 'leadingQuestions', label: 'Leading questions', type: 'text' },
  { value: 'notes', label: 'Notes', type: 'text' },
  { value: 'aiResponse.content', label: 'AI Response', type: 'markdown' },
  { value: 'metrics.accuracy', label: 'Accuracy', type: 'metric' },
  { value: 'metrics.latency', label: 'Latency', type: 'metric' },
  { value: 'metrics.status', label: 'Status', type: 'status' },
];

// Sort options based on column type
const SORT_OPTIONS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  text: [
    { value: 'asc', label: 'A → Z' },
    { value: 'desc', label: 'Z → A' },
  ],
  markdown: [
    { value: 'asc', label: 'A → Z' },
    { value: 'desc', label: 'Z → A' },
  ],
  metric: [
    { value: 'desc', label: 'Highest to Lowest' },
    { value: 'asc', label: 'Lowest to Highest' },
  ],
  status: [
    { value: 'asc', label: 'Passed to Failed' },
    { value: 'desc', label: 'Failed to Passed' },
  ],
};

const getColumnType = (field: string): string => {
  const column = COLUMN_OPTIONS.find(c => c.value === field);
  return column?.type || 'text';
};

const getSortOptionsForField = (field: string) => {
  const type = getColumnType(field);
  return SORT_OPTIONS_BY_TYPE[type] || SORT_OPTIONS_BY_TYPE.text;
};

export const SortModal: React.FC<SortModalProps> = ({
  open,
  onOpenChange,
  sorts: initialSorts,
  onApply,
  anchorRef,
}) => {
  const [sorts, setSorts] = useState<SortConfig[]>(
    initialSorts.length > 0 ? initialSorts : [{ field: '', direction: 'asc' }]
  );
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on anchor element
  useEffect(() => {
    if (open && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(16, rect.left - 150),
      });
    }
  }, [open, anchorRef]);

  // Reset sorts when modal opens
  useEffect(() => {
    if (open) {
      setSorts(initialSorts.length > 0 ? initialSorts : [{ field: '', direction: 'asc' }]);
    }
  }, [open, initialSorts]);

  // Handle click outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, handleClickOutside, handleEscape]);

  const handleAddSort = () => {
    setSorts([...sorts, { field: '', direction: 'asc' }]);
  };

  const handleRemoveSort = (index: number) => {
    if (sorts.length > 1) {
      setSorts(sorts.filter((_, i) => i !== index));
    }
  };

  const handleSortChange = (index: number, updates: Partial<SortConfig>) => {
    setSorts(
      sorts.map((sort, i) => {
        if (i === index) {
          const newSort = { ...sort, ...updates };
          // If field changed, reset direction to first option for that field type
          if (updates.field && updates.field !== sort.field) {
            const sortOptions = getSortOptionsForField(updates.field);
            newSort.direction = sortOptions[0].value as 'asc' | 'desc';
          }
          return newSort;
        }
        return sort;
      })
    );
  };

  const handleApply = () => {
    // Remove sorts without a field selected
    const validSorts = sorts.filter((s) => s.field !== '');
    onApply(validSorts);
    onOpenChange(false);
  };

  const handleClear = () => {
    setSorts([{ field: '', direction: 'asc' }]);
    onApply([]);
    onOpenChange(false);
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      {/* Transparent backdrop for click outside detection */}
      <div className="fixed inset-0 z-40" />
      
      {/* Popover content */}
      <div
        ref={popoverRef}
        className="fixed z-50 w-[420px] bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {/* Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Sort test cases</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Add sorting rules to order the test cases
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-3">
          {sorts.map((sort, index) => (
            <div key={index} className="flex items-center gap-2">
              {/* Drag handle */}
              <div className="p-1 text-gray-400 cursor-grab shrink-0">
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Column selector */}
              <Dropdown
                value={sort.field}
                onChange={(val) => handleSortChange(index, { field: val })}
                options={[
                  { value: '', label: 'Select a column' },
                  ...COLUMN_OPTIONS.map(c => ({ value: c.value, label: c.label }))
                ]}
                className="w-[160px]"
                placeholder="Select a column"
              />

              {/* Sort direction selector */}
              <Dropdown
                value={sort.direction}
                onChange={(val) => handleSortChange(index, { direction: val as 'asc' | 'desc' })}
                options={sort.field ? getSortOptionsForField(sort.field) : [{ value: 'asc', label: 'Select one' }]}
                className="w-[170px]"
                placeholder="Select one"
                disabled={!sort.field}
              />

              {/* Remove button */}
              <button
                onClick={() => handleRemoveSort(index)}
                disabled={sorts.length === 1}
                className="p-1.5 text-gray-400 hover:text-error hover:bg-error-light rounded disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add sort button */}
          <button
            onClick={handleAddSort}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            Add sort
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex items-center justify-end gap-2 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear all
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </>,
    document.body
  );
};

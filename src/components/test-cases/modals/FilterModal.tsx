import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Input,
  Dropdown,
} from '@/components/ui';
import { Plus, Trash2, X } from 'lucide-react';
import type { FilterConfig, FilterOperator } from '@/types/test-cases.types';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterConfig[];
  onApply: (filters: FilterConfig[]) => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

const FIELD_OPTIONS = [
  { value: 'question', label: 'Question' },
  { value: 'expectedAnswer', label: 'Expected answer' },
  { value: 'leadingQuestions', label: 'Leading questions' },
  { value: 'notes', label: 'Notes' },
  { value: 'metrics.status', label: 'Test status' },
  { value: 'metrics.accuracy', label: 'Accuracy' },
  { value: 'aiResponse.feedback', label: 'Feedback' },
  { value: 'runStatus', label: 'Run status' },
];

const OPERATOR_OPTIONS: { value: FilterOperator; label: string }[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does not contain' },
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Does not equal' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'lessThan', label: 'Less than' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onOpenChange,
  filters: initialFilters,
  onApply,
  anchorRef,
}) => {
  const [filters, setFilters] = useState<FilterConfig[]>(
    initialFilters.length > 0 ? initialFilters : [{ field: 'question', operator: 'contains', value: '' }]
  );
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on anchor element
  useEffect(() => {
    if (open && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(16, rect.left - 200), // Offset to align better with the button
      });
    }
  }, [open, anchorRef]);

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

  const handleAddFilter = () => {
    setFilters([...filters, { field: 'question', operator: 'contains', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index: number, updates: Partial<FilterConfig>) => {
    setFilters(
      filters.map((filter, i) => (i === index ? { ...filter, ...updates } : filter))
    );
  };

  const handleApply = () => {
    // Remove empty filters
    const validFilters = filters.filter((f) => {
      if (f.operator === 'isEmpty' || f.operator === 'isNotEmpty') {
        return true;
      }
      return f.value !== '' && f.value !== undefined;
    });
    onApply(validFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setFilters([{ field: 'question', operator: 'contains', value: '' }]);
    onApply([]);
    onOpenChange(false);
  };

  const needsValue = (operator: FilterOperator) => {
    return operator !== 'isEmpty' && operator !== 'isNotEmpty';
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      {/* Transparent backdrop for click outside detection */}
      <div className="fixed inset-0 z-40" />
      
      {/* Popover content */}
      <div
        ref={popoverRef}
        className="fixed z-50 w-[720px] bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {/* Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Filter test cases</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Add conditions to narrow down the test cases
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
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2">
              {/* Field selector */}
              <Dropdown
                value={filter.field}
                onChange={(val) => handleFilterChange(index, { field: val })}
                options={FIELD_OPTIONS}
                className="flex-1"
              />

              {/* Operator selector */}
              <Dropdown
                value={filter.operator}
                onChange={(val) =>
                  handleFilterChange(index, { operator: val as FilterOperator })
                }
                options={OPERATOR_OPTIONS}
                className="flex-1"
              />

              {/* Value input */}
              {needsValue(filter.operator) && (
                <Input
                  value={String(filter.value)}
                  onChange={(e) => handleFilterChange(index, { value: e.target.value })}
                  placeholder="Value..."
                  className="flex-1"
                />
              )}

              {/* Remove button */}
              <button
                onClick={() => handleRemoveFilter(index)}
                disabled={filters.length === 1}
                className="p-1.5 text-gray-400 hover:text-error hover:bg-error-light rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add filter button */}
          <button
            onClick={handleAddFilter}
            className="flex items-center gap-1.5 text-sm text-astra-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add filter
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex items-center justify-end gap-2 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear all
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply filters
          </Button>
        </div>
      </div>
    </>,
    document.body
  );
};

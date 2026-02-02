import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { Trash2, Plus } from 'lucide-react';
import type { CustomColumn } from '@/types/test-cases.types';

interface FilterCondition {
  operator: string;
  value: string;
}

interface ColumnFilterOverlayProps {
  column: CustomColumn;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSave: (filters: FilterCondition[]) => void;
}

const operators = [
  { value: 'equals', label: 'is equal to' },
  { value: 'notEquals', label: 'is not equal to' },
  { value: 'contains', label: 'contains' },
  { value: 'notContains', label: 'does not contain' },
  { value: 'isEmpty', label: 'is empty' },
  { value: 'isNotEmpty', label: 'is not empty' },
];

export const ColumnFilterOverlay: React.FC<ColumnFilterOverlayProps> = ({
  column,
  anchorEl,
  onClose,
  onSave,
}) => {
  const [filters, setFilters] = useState<FilterCondition[]>([
    { operator: 'equals', value: '' },
  ]);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Position the overlay relative to the anchor element
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: Math.min(rect.left, window.innerWidth - 520),
      });
    }
  }, [anchorEl]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const addFilter = () => {
    setFilters([...filters, { operator: 'equals', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof FilterCondition, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleSave = () => {
    onSave(filters);
    onClose();
  };

  const handleClearAll = () => {
    setFilters([{ operator: 'equals', value: '' }]);
  };

  if (!anchorEl) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        top: position.top,
        left: position.left,
        minWidth: '500px',
      }}
    >
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="p-4 space-y-3">
        {filters.map((filter, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Column indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg min-w-[180px]">
              <span className="text-gray-500">
                {column.type === 'text' && <span className="text-sm">T</span>}
                {column.type === 'multiselect' && <span className="text-sm">≡</span>}
                {column.type === 'markdown' && <span className="text-sm">¶</span>}
              </span>
              <span className="text-sm text-gray-700 truncate">{column.name}</span>
            </div>

            {/* Operator select */}
            <select
              value={filter.operator}
              onChange={(e) => updateFilter(index, 'operator', e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
            >
              {operators.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>

            {/* Value input (hidden for isEmpty/isNotEmpty) */}
            {!['isEmpty', 'isNotEmpty'].includes(filter.operator) && (
              <Input
                value={filter.value}
                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                placeholder="Enter value..."
                className="flex-1"
              />
            )}

            {/* Delete button */}
            <button
              onClick={() => removeFilter(index)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Add filter button */}
        <button
          onClick={addFilter}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Filter
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>
    </div>
  );
};

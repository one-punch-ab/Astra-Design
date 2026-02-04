import React from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { cn } from '@/lib/utils';

interface MultiSelectCellRendererProps extends ICellRendererParams {
  value: string[] | string | null;
}

export const MultiSelectCellRenderer: React.FC<MultiSelectCellRendererProps> = ({ value }) => {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  if (values.length === 0) {
    return (
      <div className="flex items-center h-full">
        <span className="text-gray-400 text-sm">Select...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1 h-full">
      {values.map((val, index) => (
        <span
          key={index}
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-medium',
            'bg-gray-100 text-zinc-600 border border-gray-200'
          )}
        >
          {val}
        </span>
      ))}
    </div>
  );
};

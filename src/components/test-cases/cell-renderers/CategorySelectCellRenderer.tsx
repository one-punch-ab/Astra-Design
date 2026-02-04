import React from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { cn } from '@/lib/utils';
import { CATEGORY_COLORS, DEFAULT_COLOR } from './CategorySelectCellEditor';

interface CategorySelectCellRendererProps extends ICellRendererParams {
  value: string | null;
}

export const CategorySelectCellRenderer: React.FC<CategorySelectCellRendererProps> = ({ value }) => {
  if (!value) {
    return <span className="text-gray-400 text-sm">Select...</span>;
  }

  const colors = CATEGORY_COLORS[value] || DEFAULT_COLOR;

  return (
    <div className="flex items-center py-1">
      <span
        className={cn(
          'inline-flex items-center px-1.5 py-1 rounded-[6px] text-[12px] font-medium leading-4 border',
          colors.bg,
          colors.border,
          colors.text
        )}
      >
        {value}
      </span>
    </div>
  );
};

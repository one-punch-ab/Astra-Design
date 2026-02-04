import React from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { cn } from '@/lib/utils';

interface SingleSelectCellRendererProps extends ICellRendererParams {
  value: string | null;
}

export const SingleSelectCellRenderer: React.FC<SingleSelectCellRendererProps> = ({ value }) => {
  if (!value) {
    return (
      <div className="flex items-center h-full">
        <span className="text-gray-400 text-sm">Select...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center h-full">
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-medium',
          'bg-gray-100 text-zinc-600 border border-gray-200'
        )}
      >
        {value}
      </span>
    </div>
  );
};

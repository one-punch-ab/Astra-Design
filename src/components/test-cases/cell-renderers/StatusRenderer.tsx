import React from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { Tag } from '@/components/ui';
import type { TestCaseRow } from '@/types/test-cases.types';

interface StatusRendererProps extends ICellRendererParams {
  data: TestCaseRow;
  onViewFixes?: (testCase: TestCaseRow) => void;
}

export const StatusRenderer: React.FC<StatusRendererProps> = ({ data, onViewFixes }) => {
  if (!data) return null;

  const { metrics, runStatus } = data;

  // Show loading state when running
  if (runStatus === 'running') {
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const isFailed = metrics.status === 'failed';

  return (
    <div className="flex items-center gap-2 py-1">
      <Tag variant={metrics.status === 'passed' ? 'success' : 'error'}>
        {metrics.status === 'passed' ? 'Passed' : 'Failed'}
      </Tag>
      {isFailed && onViewFixes && (
        <button
          onClick={() => onViewFixes(data)}
          className="inline-flex items-center text-[13px] text-astra-primary hover:text-astra-primary-dark hover:underline transition-colors"
        >
          View fixes
        </button>
      )}
    </div>
  );
};

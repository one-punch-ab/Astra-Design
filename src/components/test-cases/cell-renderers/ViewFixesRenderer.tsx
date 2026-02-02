import React from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { Sparkles } from 'lucide-react';
import type { TestCaseRow } from '@/types/test-cases.types';

interface ViewFixesRendererProps extends ICellRendererParams {
  data: TestCaseRow;
  onViewFixes?: (testCase: TestCaseRow) => void;
}

export const ViewFixesRenderer: React.FC<ViewFixesRendererProps> = ({ data, onViewFixes }) => {
  if (!data) return null;

  // Only show the link if the test has been run and has metrics
  const hasMetrics = data.metrics && data.runStatus === 'complete';
  
  // Show fixes link for failed tests or tests with low accuracy
  const needsFixes = hasMetrics && (
    data.metrics?.status === 'failed' || 
    (data.metrics?.accuracy !== undefined && data.metrics.accuracy < 90)
  );

  if (!needsFixes) {
    return null;
  }

  return (
    <button
      onClick={() => onViewFixes?.(data)}
      className="inline-flex items-center gap-1.5 text-sm text-astra-primary hover:text-astra-primary-dark hover:underline transition-colors"
    >
      <Sparkles className="w-4 h-4" />
      <span>View fixes</span>
    </button>
  );
};

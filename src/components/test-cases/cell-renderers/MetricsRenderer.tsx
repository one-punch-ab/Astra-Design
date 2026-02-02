import React from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { Tag } from '@/components/ui';
import { Crosshair, Hourglass } from 'lucide-react';
import type { TestCaseRow } from '@/types/test-cases.types';

interface MetricsRendererProps extends ICellRendererParams {
  data: TestCaseRow;
}

export const MetricsRenderer: React.FC<MetricsRendererProps> = (props) => {
  const { data } = props;

  if (!data) return null;

  const { metrics, runStatus } = data;

  // Show loading state when running
  if (runStatus === 'running') {
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const getAccuracyVariant = (acc: number) => {
    if (acc >= 90) return 'success';
    if (acc >= 70) return 'warning';
    return 'error';
  };

  const getLatencyVariant = (lat: number) => {
    if (lat < 2) return 'success';
    if (lat < 5) return 'warning';
    return 'error';
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      <Tag variant={getAccuracyVariant(metrics.accuracy)}>
        <Crosshair className="w-3 h-3" />
        {metrics.accuracy}%
      </Tag>
      <Tag variant={getLatencyVariant(metrics.latency)}>
        <Hourglass className="w-3 h-3" />
        {metrics.latency}s
      </Tag>
    </div>
  );
};

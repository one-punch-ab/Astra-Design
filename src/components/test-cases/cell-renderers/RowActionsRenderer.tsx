import React, { useCallback } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import { cn } from '@/lib/utils';
import { Play, Loader2 } from 'lucide-react';
import type { TestCaseRow } from '@/types/test-cases.types';

interface RowActionsRendererProps extends ICellRendererParams {
  data: TestCaseRow;
  onRunTest?: (id: string) => void;
}

export const RowActionsRenderer: React.FC<RowActionsRendererProps> = (props) => {
  const { data, onRunTest, value } = props;

  if (!data) return null;

  // Comprehensive event stopper to prevent AG Grid from starting cell edit
  const stopAllEvents = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
  }, []);

  const handleRunTest = useCallback((e: React.MouseEvent) => {
    stopAllEvents(e);
    onRunTest?.(data.id);
  }, [data.id, onRunTest, stopAllEvents]);

  const isRunning = data.runStatus === 'running';

  return (
    <div className="question-cell-content flex items-center group w-full h-full">
      <div className="play-button-wrapper flex-shrink-0 flex items-center justify-center w-0 overflow-hidden transition-all duration-200 group-hover:w-8">
        <button
          className={cn(
            'flex items-center justify-center rounded transition-all',
            'hover:bg-blue-100',
            'w-6 h-6',
            isRunning && 'bg-blue-50'
          )}
          onClick={handleRunTest}
          onMouseDown={stopAllEvents}
          onPointerDown={stopAllEvents}
          onDoubleClick={stopAllEvents}
          disabled={isRunning}
          title="Run test"
          data-action="run-test"
        >
          {isRunning ? (
            <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          )}
        </button>
      </div>
      <span className="truncate flex-1">{value}</span>
    </div>
  );
};

import React from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownCellRendererProps extends ICellRendererParams {
  value: string | null;
  isExpanded?: boolean;
}

export const MarkdownCellRenderer: React.FC<MarkdownCellRendererProps> = ({ 
  value,
  isExpanded = false,
}) => {
  if (!value) {
    return <span className="text-zinc-400 text-[13px]">Enter markdown...</span>;
  }

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-[13px] text-zinc-600',
        !isExpanded && 'line-clamp-2'
      )}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-1 last:mb-0 text-[13px] text-zinc-600">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-1 text-[13px] text-zinc-600">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 text-[13px] text-zinc-600">{children}</ol>,
          li: ({ children }) => <li className="text-[13px] text-zinc-600 mb-0.5">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-zinc-600">{children}</strong>,
          code: ({ children }) => (
            <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="p-2 bg-gray-100 rounded text-xs overflow-x-auto">{children}</pre>
          ),
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
};

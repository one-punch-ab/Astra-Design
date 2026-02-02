import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { ICellRendererParams } from 'ag-grid-community';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import type { TestCaseRow } from '@/types/test-cases.types';

interface AIResponseRendererProps extends ICellRendererParams {
  data: TestCaseRow;
  onFeedback?: (id: string, feedback: 'up' | 'down') => void;
  isExpanded?: boolean; // View mode from parent (expanded vs compact)
}

interface OverlayPosition {
  top: number;
  left: number;
  showAbove: boolean;
}

const INACCURACY_REASONS = [
  { id: 'incorrect_facts', label: 'Contains incorrect facts' },
  { id: 'outdated_info', label: 'Information is outdated' },
  { id: 'missing_info', label: 'Missing important information' },
  { id: 'irrelevant', label: 'Response is irrelevant to the question' },
  { id: 'misleading', label: 'Response is misleading' },
  { id: 'incomplete', label: 'Response is incomplete' },
  { id: 'other', label: 'Other' },
];

export const AIResponseRenderer: React.FC<AIResponseRendererProps> = (props) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition | null>(null);
  const [showInaccuracyOptions, setShowInaccuracyOptions] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const cellRef = useRef<HTMLDivElement>(null);
  const { data, onFeedback, isExpanded: isExpandedView = false } = props;

  // Handle Escape key to close overlay
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && showOverlay) {
      setShowOverlay(false);
    }
  }, [showOverlay]);

  useEffect(() => {
    if (showOverlay) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showOverlay, handleKeyDown]);

  if (!data) return null;

  const { aiResponse } = data;

  if (!aiResponse?.content) {
    return (
      <span className="text-[13px] text-gray-400 italic">No response yet</span>
    );
  }

  const handleFeedback = (e: React.MouseEvent, feedback: 'up' | 'down') => {
    e.stopPropagation();
    if (feedback === 'down') {
      setShowInaccuracyOptions(true);
    } else {
      setShowInaccuracyOptions(false);
      setSelectedReasons([]);
    }
    onFeedback?.(data.id, feedback);
  };

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons(prev => 
      prev.includes(reasonId) 
        ? prev.filter(id => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleSubmitFeedback = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Here you could send the selected reasons to a backend
    console.log('Feedback submitted with reasons:', selectedReasons);
    setShowInaccuracyOptions(false);
    // Optionally close the overlay after submission
  };

  const handleCellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Calculate position based on cell location
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const overlayHeight = 400; // Approximate overlay height
      
      // Determine if we should show above or below
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const showAbove = spaceBelow < overlayHeight && spaceAbove > spaceBelow;
      
      setOverlayPosition({
        top: showAbove ? rect.top : rect.bottom,
        left: Math.min(rect.left, window.innerWidth - 520), // Ensure it doesn't go off-screen
        showAbove
      });
    }
    
    setShowOverlay(true);
  };

  const handleCloseOverlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowOverlay(false);
    setShowInaccuracyOptions(false);
    setSelectedReasons([]);
  };

  // In expanded view, show full content; in compact view, truncate
  const displayContent = aiResponse.content;

  // Render overlay using portal to ensure it's above everything
  const overlayContent = showOverlay && overlayPosition ? ReactDOM.createPortal(
    <>
      {/* Invisible backdrop for click outside detection */}
      <div 
        className="fixed inset-0 z-[9998]"
        onClick={() => handleCloseOverlay()}
      />
      
      {/* Positioned overlay content */}
      <div 
        className={cn(
          "fixed z-[9999] w-[500px] flex flex-col gap-[6px] bg-white p-4 shadow-lg rounded-[6px] border border-zinc-300",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        style={{
          top: overlayPosition.showAbove ? 'auto' : overlayPosition.top + 8,
          bottom: overlayPosition.showAbove ? window.innerHeight - overlayPosition.top + 8 : 'auto',
          left: overlayPosition.left,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with label and close button */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 leading-4">
            AI Response
          </span>
          <button
            onClick={() => handleCloseOverlay()}
            className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
          >
            <X className="h-4 w-4 text-zinc-500" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        
        {/* Content area styled like Figma text area */}
        <div className="bg-white rounded-[6px] px-2 py-1.5 min-h-[96px] max-h-[60vh] overflow-auto">
          <div className="text-[14px] text-zinc-600 leading-5 prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-4 last:mb-0 leading-5 text-[14px] text-zinc-600">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 pl-4 list-disc space-y-2 text-[14px] text-zinc-600">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 pl-4 list-decimal space-y-2 text-[14px] text-zinc-600">{children}</ol>,
                li: ({ children }) => <li className="leading-5 text-[14px] text-zinc-600">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-zinc-600">{children}</strong>,
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[13px] font-mono">
                    {children}
                  </code>
                ),
              }}
            >
              {aiResponse.content}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Footer with feedback */}
        <div className="flex flex-col gap-3 pt-2 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Was the response accurate?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleFeedback(e, 'up')}
                className={cn(
                  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[13px] font-medium",
                  "ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
                  "h-8 px-3 py-1.5",
                  aiResponse.feedback === 'up'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-600'
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                Yes
              </button>
              <button
                onClick={(e) => handleFeedback(e, 'down')}
                className={cn(
                  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[13px] font-medium",
                  "ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
                  "h-8 px-3 py-1.5",
                  aiResponse.feedback === 'down' || showInaccuracyOptions
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-600'
                )}
              >
                <ThumbsDown className="h-4 w-4" />
                No
              </button>
            </div>
          </div>
          
          {/* Expanded inaccuracy options */}
          {showInaccuracyOptions && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <p className="text-xs font-medium text-zinc-700 mb-2">
                What was inaccurate about this response? (Select all that apply)
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {INACCURACY_REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => handleReasonToggle(reason.id)}
                    className={cn(
                      "inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                      selectedReasons.includes(reason.id)
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                    )}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={selectedReasons.length === 0}
                  className={cn(
                    "inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    selectedReasons.length > 0
                      ? 'bg-astra-primary text-white hover:bg-astra-primary-hover'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  )}
                >
                  Submit feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      {/* Cell content - clickable to open overlay */}
      <div 
        ref={cellRef}
        className={cn(
          "relative w-full h-full cursor-pointer",
          !isExpandedView && "overflow-hidden text-ellipsis whitespace-nowrap"
        )}
        style={!isExpandedView ? { lineHeight: '28px' } : undefined}
        onClick={handleCellClick}
      >
        {isExpandedView ? (
          <div className="text-[13px] text-zinc-600 ai-response-prose">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="text-[13px] text-zinc-600 mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="pl-4 list-disc text-[13px] text-zinc-600 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="pl-4 list-decimal text-[13px] text-zinc-600 mb-2">{children}</ol>,
                li: ({ children }) => <li className="text-[13px] text-zinc-600 mb-1">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-zinc-600">{children}</strong>,
                code: ({ children }) => (
                  <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
              }}
            >
              {displayContent}
            </ReactMarkdown>
          </div>
        ) : (
          <span className="text-[13px] text-zinc-600">
            {displayContent}
          </span>
        )}
      </div>

      {/* Render overlay via portal */}
      {overlayContent}
    </>
  );
};

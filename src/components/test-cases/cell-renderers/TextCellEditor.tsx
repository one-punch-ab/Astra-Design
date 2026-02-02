import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import type { ICellEditorParams } from 'ag-grid-community';
import { cn } from '@/lib/utils';
import { Type } from 'lucide-react';

interface TextCellEditorProps extends ICellEditorParams {
  maxLength?: number;
  rows?: number;
  columnName?: string;
}

export const TextCellEditor = forwardRef<unknown, TextCellEditorProps>(
  (props, ref) => {
    const { value, stopEditing, colDef, maxLength = 2000, rows = 5 } = props;
    const [text, setText] = useState<string>(value || '');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get the column header name (uppercase as per Figma design)
    const columnName = (colDef?.headerName || 'Edit').toUpperCase();

    useImperativeHandle(ref, () => ({
      getValue() {
        return text;
      },
      isCancelAfterEnd() {
        return false;
      },
      isPopup() {
        return true;
      },
    }));

    useEffect(() => {
      // Focus the textarea and place cursor at the end (don't select all)
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Move cursor to end of text
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }, []);

    // Auto-resize textarea based on content
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const scrollHeight = textareaRef.current.scrollHeight;
        const minHeight = rows * 20; // Approximate line height
        const maxHeight = 300;
        textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
      }
    }, [text, rows]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopEditing(true); // Cancel editing
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Enter to save (Shift+Enter for new line)
        e.preventDefault();
        stopEditing(false);
      }
    };

    const characterCount = text.length;
    const isNearLimit = maxLength && characterCount > maxLength * 0.9;
    const isOverLimit = maxLength && characterCount > maxLength;

    return (
      <div
        ref={containerRef}
        className="flex flex-col overflow-hidden rounded-lg bg-white"
        style={{ 
          boxShadow: '0px 0px 1px 0px rgba(24, 24, 27, 0.3), 0px 8px 16px 0px rgba(24, 24, 27, 0.1)',
          minWidth: '320px',
          maxWidth: '420px',
          animation: 'notion-fade-in 0.1s ease-out',
        }}
      >
        {/* Header - matches Figma: 32px height, gray-100 bg */}
        <div 
          className="flex items-center gap-2 px-2 shrink-0 w-full"
          style={{ 
            backgroundColor: '#f4f4f5', 
            height: '32px',
          }}
        >
          {/* Icon container */}
          <div className="flex items-center justify-center w-4 h-4 shrink-0">
            <Type className="w-[10px] h-[10px] text-zinc-500" strokeWidth={2.5} />
          </div>
          {/* Column name - 12px semibold */}
          <span 
            className="text-xs font-semibold shrink-0"
            style={{ 
              color: '#71717a',
              lineHeight: '16px',
            }}
          >
            {columnName}
          </span>
        </div>

        {/* Text area - white bg, padding 8px */}
        <div className="flex-1 p-2 bg-white min-h-0">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            placeholder="Type something..."
            className={cn(
              "w-full resize-none outline-none bg-transparent border-none",
              "placeholder:text-zinc-400",
              "focus:outline-none focus:ring-0 focus:border-none"
            )}
            style={{
              fontSize: '13px',
              lineHeight: '1.25',
              color: '#3f3f46',
              minHeight: '100px',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
          />
        </div>

        {/* Footer - matches Figma: 32px height, gray-100 bg */}
        <div 
          className="flex items-center justify-between px-2 shrink-0 w-full"
          style={{ 
            backgroundColor: '#f4f4f5', 
            height: '32px',
          }}
        >
          {/* Character count */}
          <span 
            className={cn(
              "text-xs",
              isOverLimit ? "text-red-500 font-medium" : 
              isNearLimit ? "text-amber-500" : ""
            )}
            style={{ 
              color: isOverLimit ? undefined : isNearLimit ? undefined : '#71717a',
              lineHeight: '16px',
            }}
          >
            {characterCount.toLocaleString()}/{maxLength?.toLocaleString()}
          </span>

          {/* Keyboard shortcuts */}
          <div className="flex items-center gap-2">
            {/* Esc to close */}
            <div className="flex items-center gap-1">
              <kbd 
                className="flex items-center justify-center px-0.5 rounded-sm"
                style={{
                  backgroundColor: '#fafafa',
                  border: '0.5px solid #e4e4e7',
                  height: '16px',
                  minWidth: '16px',
                  fontSize: '10px',
                  lineHeight: '1.25',
                  color: '#71717a',
                }}
              >
                Esc
              </kbd>
              <span 
                className="text-xs"
                style={{ color: '#a1a1aa', lineHeight: '16px' }}
              >
                to close
              </span>
            </div>

            {/* Enter to save */}
            <div className="flex items-center gap-1">
              <kbd 
                className="flex items-center justify-center rounded-sm"
                style={{
                  backgroundColor: '#fafafa',
                  border: '0.5px solid #e4e4e7',
                  width: '16px',
                  height: '16px',
                  fontSize: '10px',
                  lineHeight: '1.25',
                  color: '#71717a',
                }}
              >
                ↵
              </kbd>
              <span 
                className="text-xs"
                style={{ color: '#a1a1aa', lineHeight: '16px' }}
              >
                to save
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TextCellEditor.displayName = 'TextCellEditor';

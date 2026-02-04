import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import type { ICellEditorParams } from 'ag-grid-community';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface SingleSelectCellEditorProps extends ICellEditorParams {
  options: string[];
}

export const SingleSelectCellEditor = forwardRef<unknown, SingleSelectCellEditorProps>(
  (props, ref) => {
    const { value, options = [], stopEditing } = props;
    const [selectedValue, setSelectedValue] = useState<string | null>(value || null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getValue() {
        return selectedValue;
      },
      isCancelAfterEnd() {
        return false;
      },
    }));

    useEffect(() => {
      // Focus the container when opened
      containerRef.current?.focus();
    }, []);

    const selectOption = (option: string) => {
      setSelectedValue(option);
      // Auto-close after selection for single select
      setTimeout(() => stopEditing(false), 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopEditing(true); // Cancel editing
      } else if (e.key === 'Enter' && !e.shiftKey) {
        stopEditing(false); // Save changes
      }
    };

    return (
      <div
        ref={containerRef}
        className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 min-w-[200px] max-h-[300px] overflow-auto"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="space-y-1">
          {options.map((option) => {
            const isSelected = selectedValue === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => selectOption(option)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors',
                  isSelected
                    ? 'bg-astra-primary-light text-astra-primary'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0',
                    isSelected
                      ? 'bg-astra-primary border-astra-primary'
                      : 'border-gray-300'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="flex-1 truncate">{option}</span>
              </button>
            );
          })}
        </div>
        {options.length === 0 && (
          <p className="text-sm text-gray-500 px-3 py-2">No options available</p>
        )}
      </div>
    );
  }
);

SingleSelectCellEditor.displayName = 'SingleSelectCellEditor';

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import type { ICellEditorParams } from 'ag-grid-community';
import { cn } from '@/lib/utils';

// Category color configuration based on Figma design
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Standard queries': {
    bg: 'bg-teal-100',
    border: 'border-green-700',
    text: 'text-green-700',
  },
  'Unauthorised requests': {
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    text: 'text-yellow-600',
  },
  'Jailbreak attempts': {
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-600',
  },
  'Off-topic questions': {
    bg: 'bg-orange-100',
    border: 'border-orange-500',
    text: 'text-orange-500',
  },
  'Casual language': {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-zinc-600',
  },
  'Implied problems': {
    bg: 'bg-blue-100',
    border: 'border-blue-600',
    text: 'text-blue-600',
  },
};

// Default color for unknown categories
const DEFAULT_COLOR = {
  bg: 'bg-gray-100',
  border: 'border-gray-300',
  text: 'text-zinc-600',
};

interface CategorySelectCellEditorProps extends ICellEditorParams {
  options: string[];
}

export const CategorySelectCellEditor = forwardRef<unknown, CategorySelectCellEditorProps>(
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

    const getColorClasses = (option: string) => {
      return CATEGORY_COLORS[option] || DEFAULT_COLOR;
    };

    return (
      <div
        ref={containerRef}
        className="bg-white rounded-[6px] shadow-[0px_0px_1px_0px_rgba(24,24,27,0.3),0px_8px_16px_0px_rgba(24,24,27,0.1)] p-1 min-w-[200px] max-h-[300px] overflow-auto"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col gap-1">
          {options.map((option) => {
            const isSelected = selectedValue === option;
            const colors = getColorClasses(option);
            
            return (
              <button
                key={option}
                type="button"
                onClick={() => selectOption(option)}
                className={cn(
                  'w-full flex items-start px-2 py-1 rounded transition-colors',
                  isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                )}
              >
                <span
                  className={cn(
                    'inline-flex items-center px-1.5 py-1 rounded-[6px] text-[12px] font-semibold leading-4 border',
                    colors.bg,
                    colors.border,
                    colors.text
                  )}
                >
                  {option}
                </span>
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

CategorySelectCellEditor.displayName = 'CategorySelectCellEditor';

// Export the color configuration for use in renderer
export { CATEGORY_COLORS, DEFAULT_COLOR };

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  value: string | null;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full h-9 px-3 flex items-center justify-between gap-2',
          'text-sm bg-white border rounded-astra-input',
          'transition-colors',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error
            ? 'border-error focus:ring-error'
            : 'border-gray-300 hover:border-gray-400',
          isOpen && 'ring-2 ring-blue-500 border-transparent'
        )}
      >
        <span className={cn(!selectedOption && 'text-gray-400')}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-1 py-1',
            'bg-white border border-gray-200 rounded-astra-card shadow-astra-md',
            'max-h-60 overflow-auto'
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !option.disabled && handleSelect(option.value)}
              disabled={option.disabled}
              className={cn(
                'w-full px-3 py-2 flex items-center justify-between gap-2',
                'text-sm text-left',
                'hover:bg-gray-50',
                option.disabled && 'text-gray-400 cursor-not-allowed',
                option.value === value && 'bg-astra-primary-light'
              )}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check className="w-4 h-4 text-astra-primary" />
              )}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

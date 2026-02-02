import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupContextValue {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  disabled,
  children,
  className,
}) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, disabled }}>
      <div role="radiogroup" className={cn('space-y-2', className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  disabled: itemDisabled,
  children,
  className,
}) => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup');
  }

  const { value: selectedValue, onChange, disabled: groupDisabled } = context;
  const isDisabled = itemDisabled || groupDisabled;
  const isSelected = value === selectedValue;

  return (
    <label
      htmlFor={id || value}
      className={cn(
        'flex items-center gap-3 cursor-pointer',
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <button
        type="button"
        role="radio"
        id={id || value}
        aria-checked={isSelected}
        onClick={() => !isDisabled && onChange(value)}
        disabled={isDisabled}
        className={cn(
          'relative w-4 h-4 rounded-full border-2',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          isSelected
            ? 'border-astra-primary bg-astra-primary'
            : 'border-gray-300 bg-white hover:border-gray-400'
        )}
      >
        {isSelected && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        )}
      </button>
      {children && <span className="text-sm text-gray-900">{children}</span>}
    </label>
  );
};

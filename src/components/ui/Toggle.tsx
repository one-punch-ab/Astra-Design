import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className,
}) => {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          checked ? 'bg-astra-primary' : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm',
            'transition duration-200 ease-in-out',
            checked ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-gray-900">{label}</span>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </label>
  );
};

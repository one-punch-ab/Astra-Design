import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-astra-primary focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'rounded-astra-button'
    );

    const variantStyles = {
      primary: cn(
        'bg-astra-primary text-white',
        'hover:bg-astra-primary-hover',
        'active:bg-[#0D2366]' // Darker shade for active state
      ),
      secondary: cn(
        'bg-white text-gray-700 border border-gray-300',
        'hover:bg-gray-50 hover:border-gray-400',
        'active:bg-gray-100'
      ),
      ghost: cn(
        'bg-transparent text-gray-700',
        'hover:bg-gray-100',
        'active:bg-gray-200'
      ),
      destructive: cn(
        'bg-error text-white',
        'hover:bg-error-dark',
        'active:bg-red-700'
      ),
    };

    // Astra DSM 2.0 Button Sizes:
    // - Micro: 20px (xs)
    // - Mini: 24px (sm)
    // - Regular: 32px (md) - DEFAULT
    // - Large: 40px (lg)
    const sizeStyles = {
      xs: 'h-5 px-2 text-[11px]',   // Micro - 20px
      sm: 'h-6 px-3 text-xs',       // Mini - 24px
      md: 'h-8 px-4 text-sm',       // Regular - 32px (DEFAULT)
      lg: 'h-10 px-5 text-sm',      // Large - 40px
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

/**
 * Tag component matching Astra DSM 2.0 specifications
 * Used for status indicators, labels, and metrics display
 */
export const Tag: React.FC<TagProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1 font-medium rounded-md border';

  const variantStyles = {
    default: 'bg-gray-100 border-gray-300 text-gray-700',
    success: 'bg-teal-100 border-green-700 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-[rgba(185,28,28,1)] text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-1 text-xs leading-none',
    md: 'px-2 py-1 text-xs leading-none',
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

import React from 'react';
import { cn } from '@/lib/utils';
import { Info, CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  description?: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  description,
  variant = 'info',
  onClose,
}) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    error: <XCircle className="w-5 h-5 text-error" />,
    warning: <AlertCircle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-astra-primary" />,
  };

  const variantStyles = {
    success: 'border-success-light bg-success-light/10',
    error: 'border-error-light bg-error-light/10',
    warning: 'border-warning-light bg-warning-light/10',
    info: 'border-astra-primary-light bg-astra-primary-light/10',
  };

  return (
    <div 
      className={cn(
        "flex gap-3 p-4 border rounded-lg shadow-astra-lg pointer-events-auto",
        "w-[373px] min-h-[72px]", // Fixed width as per Astra DSM
        variantStyles[variant]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[variant]}
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-900 leading-tight">
          {message}
        </p>
        {description && (
          <p className="text-xs text-gray-600 leading-normal">
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors self-start"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

const useDialogContext = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
};

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
}) => {
  const { onOpenChange } = useDialogContext();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg max-h-[90vh] overflow-auto',
          'bg-white rounded-astra-card shadow-astra-lg',
          'animate-in fade-in zoom-in-95 duration-200',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('px-6 pt-6 pb-4', className)}>
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className,
}) => {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h2>
  );
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <p className={cn('mt-1 text-sm text-gray-500', className)}>
      {children}
    </p>
  );
};

export const DialogBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
};

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'px-6 py-3 bg-gray-50 rounded-b-astra-card',
        'flex items-center justify-end gap-3',
        className
      )}
    >
      {children}
    </div>
  );
};

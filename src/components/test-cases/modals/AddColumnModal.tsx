import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { Type, List, FileText } from 'lucide-react';
import type { ColumnType } from '@/types/test-cases.types';

interface AddColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, type: ColumnType, options?: string[]) => void;
}

export const AddColumnModal: React.FC<AddColumnModalProps> = ({
  open,
  onOpenChange,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ColumnType>('text');
  const [options, setOptions] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Column name is required');
      return;
    }

    if (type === 'multiselect' && !options.trim()) {
      setError('Please add at least one option');
      return;
    }

    const parsedOptions = type === 'multiselect'
      ? options.split('\n').map(o => o.trim()).filter(Boolean)
      : undefined;

    onAdd(name.trim(), type, parsedOptions);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setType('text');
    setOptions('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add column</DialogTitle>
          <DialogDescription>
            Create a custom column to track additional information for your test cases
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Column name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Column name
            </label>
            <Input
              placeholder="e.g., Priority level"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              error={error && !name.trim() ? error : undefined}
            />
          </div>

          {/* Column type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Column type
            </label>
            <RadioGroup value={type} onChange={(v) => setType(v as ColumnType)}>
              {/* Text option */}
              <label
                className={cn(
                  'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                  type === 'text'
                    ? 'border-astra-primary bg-astra-primary-light'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <RadioGroupItem value="text" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">Text</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Single or multi-line text for free-form notes
                  </p>
                </div>
              </label>

              {/* Multi-select option */}
              <label
                className={cn(
                  'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                  type === 'multiselect'
                    ? 'border-astra-primary bg-astra-primary-light'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <RadioGroupItem value="multiselect" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">Multi-select</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select one or more options from a predefined list
                  </p>
                </div>
              </label>

              {/* Markdown option */}
              <label
                className={cn(
                  'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                  type === 'markdown'
                    ? 'border-astra-primary bg-astra-primary-light'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <RadioGroupItem value="markdown" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">Markdown</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Rich text with formatting like bold, lists, and code
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Options for multi-select */}
          {type === 'multiselect' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Options (one per line)
              </label>
              <Textarea
                placeholder={'High\nMedium\nLow'}
                value={options}
                onChange={(e) => {
                  setOptions(e.target.value);
                  setError('');
                }}
                rows={5}
                error={error && type === 'multiselect' && !options.trim() ? error : undefined}
              />
              <p className="text-xs text-gray-500 mt-1">
                Users can select multiple options when editing cells
              </p>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

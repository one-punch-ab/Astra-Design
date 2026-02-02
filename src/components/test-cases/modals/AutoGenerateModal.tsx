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
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { Sparkles, BookOpen, History } from 'lucide-react';
import type { AutoGenerateConfig } from '@/types/test-cases.types';

interface AutoGenerateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (config: AutoGenerateConfig) => void;
  isGenerating: boolean;
}

export const AutoGenerateModal: React.FC<AutoGenerateModalProps> = ({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
}) => {
  const [count, setCount] = useState(10);
  const [basedOn, setBasedOn] = useState<AutoGenerateConfig['basedOn']>('knowledge');

  const handleGenerate = () => {
    onGenerate({
      count,
      basedOn,
    });
  };

  const handleClose = () => {
    if (!isGenerating) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Auto generate test cases</DialogTitle>
          <DialogDescription>
            Let AI create test cases to help ensure your agent responds accurately
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5">
          {/* Number of test cases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Number of test cases
            </label>
            <Input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              helperText="Generate between 1 to 50 test cases at a time."
            />
          </div>

          {/* Generation source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Generate based on
            </label>
            <RadioGroup
              value={basedOn}
              onChange={(v) => setBasedOn(v as AutoGenerateConfig['basedOn'])}
              className="space-y-3"
            >
              {/* Knowledge base option */}
              <label
                className={cn(
                  'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors min-h-[88px]',
                  basedOn === 'knowledge'
                    ? 'border-astra-primary bg-astra-primary-light'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <RadioGroupItem value="knowledge" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">Knowledge base</span>
                    <span className="text-xs text-astra-primary bg-astra-primary-light px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Generate questions based on your agent's knowledge sources and training data
                  </p>
                </div>
              </label>

              {/* Previous conversations option - Coming soon */}
              <div
                className="flex items-start gap-3 p-3 border rounded-lg min-h-[88px] border-gray-300 bg-gray-50 cursor-not-allowed"
              >
                <RadioGroupItem value="previous" className="mt-0.5" disabled />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">Previous conversations from Wati</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--astra-teal-100, #CCFBF1)', color: '#0D9488' }}>
                      Coming soon
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Create test cases from real questions your agent has received
                  </p>
                </div>
              </div>

            </RadioGroup>
          </div>

          {/* Info toast - What happens next */}
          <div 
            className="p-4 rounded-xl border border-blue-300"
            style={{ 
              background: 'linear-gradient(90deg, rgba(189, 217, 255, 0.5) 0%, rgba(220, 235, 255, 0.33) 35%, rgb(255, 255, 255) 100%)'
            }}
          >
            <p className="font-semibold text-sm text-gray-900">What happens next...</p>
            <p className="text-sm text-gray-600 mt-1">
              We'll analyze your agent's setup and generate {count} question-answer pairs. 
              You can review and edit them before running tests.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} isLoading={isGenerating}>
            <Sparkles className="w-4 h-4" />
            Generate {count} test cases
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

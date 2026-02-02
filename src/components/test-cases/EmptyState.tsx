import React from 'react';
import { Button } from '@/components/ui';
import { FlaskConical, Upload, Sparkles, Download } from 'lucide-react';

interface EmptyStateProps {
  onUploadCSV: () => void;
  onAutoGenerate: () => void;
  onDownloadTemplate: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onUploadCSV,
  onAutoGenerate,
  onDownloadTemplate,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto">
      {/* Icon - Rounded square container matching Figma */}
      <div className="w-14 h-14 bg-astra-primary-light rounded-xl flex items-center justify-center mb-6">
        <FlaskConical className="w-7 h-7 text-astra-primary" />
      </div>

      {/* Headline - Matching Figma copy */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Test hundreds of scenarios in one go
      </h3>

      {/* Description - Matching Figma copy */}
      <p className="text-base text-gray-500 mb-8 max-w-lg leading-relaxed">
        Upload all your questions or let AI generate them. Run bulk tests, catch issues early, 
        and get your agent live faster.
      </p>

      {/* CTAs - Matching Figma button labels */}
      <div className="flex flex-row gap-3 items-center mb-5">
        <Button 
          variant="secondary" 
          onClick={onUploadCSV}
        >
          <Upload className="w-4 h-4" />
          Upload CSV
        </Button>
        <Button 
          variant="primary" 
          onClick={onAutoGenerate}
        >
          <Sparkles className="w-4 h-4" />
          Auto generate test cases
        </Button>
      </div>

      {/* Secondary action - Matching Figma copy */}
      <button
        onClick={onDownloadTemplate}
        className="text-sm font-medium text-astra-primary hover:text-astra-primary-hover flex items-center gap-2 transition-colors mb-10"
      >
        <Download className="w-4 h-4" />
        Download sample CSV
      </button>

      {/* Tip Banner - Green styling */}
      <div 
        className="flex items-start gap-3 px-5 py-4 border border-green-200 rounded-xl max-w-xl mx-auto text-left bg-green-50"
      >
        <p className="text-sm text-gray-700 leading-relaxed">
          <span className="font-bold text-gray-900">TIP:</span> Most teams start with 10–20 typical questions. You'll save hours and identify patterns and edge cases you'd never catch individually.
        </p>
      </div>
    </div>
  );
};

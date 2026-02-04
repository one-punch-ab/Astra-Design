import React from 'react';
import { AlertCircle, ArrowRight, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface RecommendationsBannerProps {
  failedCount: number;
  totalRecommendations: number;
  onViewRecommendations: () => void;
  onDismiss: () => void;
}

export const RecommendationsBanner: React.FC<RecommendationsBannerProps> = ({
  failedCount,
  totalRecommendations,
  onViewRecommendations,
  onDismiss,
}) => {
  return (
    <div className={cn(
      "flex items-center gap-4 px-4 py-3 rounded-lg border",
      "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-200"
    )}>
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-amber-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Astra has recommendations to improve your results
          </h3>
        </div>
        <p className="text-sm text-gray-600 mt-0.5">
          {failedCount} test{failedCount !== 1 ? 's' : ''} didn't meet expectations. 
          {' '}Review {totalRecommendations} suggestion{totalRecommendations !== 1 ? 's' : ''} to update your agent's instructions and improve accuracy.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="primary"
          size="md"
          onClick={onViewRecommendations}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View recommendations
        </Button>
        <button
          onClick={onDismiss}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-amber-100/50 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

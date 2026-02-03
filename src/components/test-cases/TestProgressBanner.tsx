import React, { useState } from 'react';
import { Square, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Button,
} from '@/components/ui';

interface TestProgressBannerProps {
  completed: number;
  total: number;
  estimatedTimeRemaining: number | null;
  onStop: () => void;
}

// Format seconds to human-readable string
const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const TestProgressBanner: React.FC<TestProgressBannerProps> = ({
  completed,
  total,
  estimatedTimeRemaining,
  onStop,
}) => {
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = completed === total && total > 0;

  const handleStopClick = () => {
    setShowStopConfirm(true);
  };

  const confirmStop = () => {
    setShowStopConfirm(false);
    onStop();
  };

  return (
    <>
      <div className={cn(
        "flex items-center gap-4 px-3 py-2 rounded-lg border",
        isComplete 
          ? "bg-green-50 border-green-200" 
          : "bg-blue-50 border-blue-200"
      )}>
        {/* Progress indicator */}
        <div className="flex items-center gap-3 flex-1">
          {/* Animated spinner or checkmark */}
          {!isComplete ? (
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          
          {/* Status text */}
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-medium",
              isComplete ? "text-green-700" : "text-gray-900"
            )}>
              {isComplete 
                ? "All tests completed!" 
                : `Running tests: ${completed} of ${total} completed`
              }
            </span>
            {!isComplete && estimatedTimeRemaining !== null && estimatedTimeRemaining > 0 && (
              <span className="text-xs text-gray-700">
                Estimated time remaining: {formatTime(estimatedTimeRemaining)}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-200">
              <div 
                className={cn(
                  "h-full transition-all duration-300 ease-out rounded-full",
                  isComplete ? "bg-green-500" : "bg-blue-500"
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={cn(
              "text-xs font-medium w-10 text-right",
              isComplete ? "text-green-600" : "text-blue-600"
            )}>
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Stop button - only show when not complete */}
        {!isComplete && (
          <Button
            variant="secondary"
            size="md"
            onClick={handleStopClick}
            leftIcon={<Square className="w-4 h-4 text-error" fill="currentColor" />}
          >
            Stop test
          </Button>
        )}
      </div>

      {/* Stop confirmation dialog */}
      <Dialog open={showStopConfirm} onOpenChange={setShowStopConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Stop running tests?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to stop the test run? {completed} of {total} tests have been completed.
            </DialogDescription>
          </DialogHeader>
          
          <DialogBody>
            <p className="text-sm text-gray-600">
              Tests that have already completed will keep their results. Remaining tests will not be executed.
            </p>
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowStopConfirm(false)}>
              Continue testing
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmStop}
              className="bg-red-500 hover:bg-red-600"
            >
              <Square className="w-4 h-4 mr-2" fill="currentColor" />
              Stop tests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

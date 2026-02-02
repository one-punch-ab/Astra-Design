import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Badge,
} from '@/components/ui';
import { 
  FileText, 
  Zap, 
  Target, 
  BookOpen,
  Clock,
  Calendar,
  UserPlus,
  MessageSquare,
  X,
} from 'lucide-react';
import type { TestCaseRow } from '@/types/test-cases.types';

interface RecommendationsModalProps {
  testCase: TestCaseRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RecommendationsModal: React.FC<RecommendationsModalProps> = ({
  testCase,
  open,
  onOpenChange,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      'file-text': FileText,
      'zap': Zap,
      'book': BookOpen,
      'calendar': Calendar,
      'user-plus': UserPlus,
      'message-square': MessageSquare,
      'target': Target,
    };
    return icons[iconName] || FileText;
  };

  const getPriorityVariant = (priority: string): 'error' | 'warning' | 'default' => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return priority;
    }
  };

  const toggleChecklistItem = (recId: string, itemId: string) => {
    const key = `${recId}-${itemId}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!testCase.recommendations || testCase.recommendations.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold">
            Astra Recommendations
          </DialogTitle>
          <DialogDescription>
            Suggestions to improve test results
          </DialogDescription>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="px-6 pb-4 max-h-[60vh] overflow-y-auto">
          {/* Test Case Summary */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">Test case</div>
            <div className="font-semibold text-gray-900 mb-3">{testCase.question}</div>
            
            {testCase.metrics && (
              <div className="flex gap-2">
                <Badge 
                  variant={testCase.metrics.accuracy >= 80 ? 'success' : 'warning'}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Target className="w-3 h-3" />
                  Accuracy - {testCase.metrics.accuracy}%
                </Badge>
                <Badge 
                  variant={testCase.metrics.latency < 2 ? 'success' : 'warning'}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  Latency - {testCase.metrics.latency.toFixed(1)} sec
                </Badge>
              </div>
            )}
          </div>

          {/* Response Comparison */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Response Comparison</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Expected</div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 border border-gray-200 h-32 overflow-y-auto">
                  {testCase.expectedAnswer}
                </div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">AI Response</div>
                <div className="bg-amber-50 p-3 rounded-lg text-sm text-gray-700 border border-amber-200 h-32 overflow-y-auto whitespace-pre-wrap">
                  {testCase.aiResponse?.content || 'No response generated'}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Recommendations ({testCase.recommendations.length})
            </h3>
            
            <div className="space-y-4">
              {testCase.recommendations.map((rec) => {
                const IconComponent = getIconComponent(rec.icon || 'file-text');
                
                return (
                  <div key={rec.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        rec.type === 'knowledge' ? 'bg-blue-50' :
                        rec.type === 'action' ? 'bg-purple-50' :
                        rec.type === 'format' ? 'bg-amber-50' :
                        'bg-gray-50'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          rec.type === 'knowledge' ? 'text-blue-600' :
                          rec.type === 'action' ? 'text-purple-600' :
                          rec.type === 'format' ? 'text-amber-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                          <Badge variant={getPriorityVariant(rec.priority)} size="sm">
                            {getPriorityLabel(rec.priority)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {rec.description}
                        </p>

                        {/* Action Link */}
                        {rec.actionLabel && !rec.checklist && (
                          <div className="flex items-start gap-2 text-sm text-astra-primary font-medium">
                            <span className="mt-0.5">→</span>
                            <span>{rec.actionLabel}</span>
                          </div>
                        )}

                        {/* Checklist for action items */}
                        {rec.checklist && rec.checklist.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <div className="text-sm text-astra-primary font-medium mb-2">
                              → {rec.actionLabel}
                            </div>
                            {rec.checklist.map((item) => {
                              const ItemIcon = getIconComponent(item.icon);
                              const isChecked = checkedItems[`${rec.id}-${item.id}`];
                              
                              return (
                                <label
                                  key={item.id}
                                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked || false}
                                    onChange={() => toggleChecklistItem(rec.id, item.id)}
                                    className="mt-0.5 w-4 h-4 text-astra-primary rounded border-gray-300 focus:ring-2 focus:ring-astra-primary"
                                  />
                                  
                                  <div className="w-8 h-8 rounded flex items-center justify-center bg-gray-100 flex-shrink-0">
                                    <ItemIcon className="w-4 h-4 text-gray-600" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className={`font-medium text-sm ${isChecked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                      {item.label}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {item.description}
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { 
  X, 
  FileText,
  MessageSquare,
  Zap,
  Target,
  BookOpen,
  Calendar,
  UserPlus,
  Crosshair,
  Hourglass,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui';
import type { TestCaseRow } from '@/types/test-cases.types';

interface FixesOverlayProps {
  testCase: TestCaseRow;
  onClose: () => void;
}

interface GeneratedRecommendation {
  id: string;
  type: 'knowledge_base' | 'prompt' | 'context' | 'response_format';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
}

// Generate recommendations based on test case analysis (fallback when no recommendations in data)
const generateRecommendations = (testCase: TestCaseRow): GeneratedRecommendation[] => {
  const recommendations: GeneratedRecommendation[] = [];
  const accuracy = testCase.metrics?.accuracy || 0;
  const latency = testCase.metrics?.latency || 0;
  const aiResponse = testCase.aiResponse?.content || '';
  const expectedAnswer = testCase.expectedAnswer || '';

  // Check for accuracy issues
  if (accuracy < 70) {
    recommendations.push({
      id: '1',
      type: 'knowledge_base',
      priority: 'high',
      title: 'Update Knowledge Base',
      description: 'The AI response significantly differs from the expected answer. Consider adding or updating relevant information in your knowledge base.',
      action: 'Go to Knowledge Base → Add new article or update existing content with accurate information.',
      icon: <BookOpen className="w-5 h-5" />,
    });
  }

  // Check if response is too short or missing key information
  if (aiResponse.length < expectedAnswer.length * 0.5) {
    recommendations.push({
      id: '2',
      type: 'prompt',
      priority: 'high',
      title: 'Enhance System Prompt',
      description: 'The AI response is missing important details. Update the system prompt to encourage more comprehensive answers.',
      action: 'Go to Agent Settings → System Prompt → Add instructions for detailed responses.',
      icon: <MessageSquare className="w-5 h-5" />,
    });
  }

  // Check for latency issues
  if (latency > 2) {
    recommendations.push({
      id: '3',
      type: 'context',
      priority: 'medium',
      title: 'Optimize Context Window',
      description: `Response time (${latency}s) is higher than optimal. Consider reducing the context length or optimizing retrieval.`,
      action: 'Go to Agent Settings → Context → Reduce max context tokens or enable smart chunking.',
      icon: <Zap className="w-5 h-5" />,
    });
  }

  // Check for response format issues
  if (accuracy >= 70 && accuracy < 90) {
    recommendations.push({
      id: '4',
      type: 'response_format',
      priority: 'medium',
      title: 'Refine Response Format',
      description: 'The response is partially correct but could be structured better to match expectations.',
      action: 'Go to Agent Settings → Response Format → Add formatting guidelines or examples.',
      icon: <FileText className="w-5 h-5" />,
    });
  }

  // Add contextual recommendation based on leading questions
  if (testCase.leadingQuestions && testCase.leadingQuestions.length > 0) {
    recommendations.push({
      id: '5',
      type: 'context',
      priority: 'low',
      title: 'Add Intent Recognition',
      description: 'Multiple variations of this question exist. Consider adding intent mapping to handle different phrasings.',
      action: 'Go to Intents → Create new intent with variations from leading questions.',
      icon: <Target className="w-5 h-5" />,
    });
  }

  // Default recommendation if no specific issues found
  if (recommendations.length === 0) {
    recommendations.push({
      id: '6',
      type: 'knowledge_base',
      priority: 'low',
      title: 'Review Knowledge Base Coverage',
      description: 'Consider reviewing the knowledge base to ensure all relevant information is accurately captured.',
      action: 'Go to Knowledge Base → Review related articles for accuracy and completeness.',
      icon: <BookOpen className="w-5 h-5" />,
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

// Get icon component from icon name string
const getIconFromName = (iconName?: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'file-text': <FileText className="w-5 h-5" />,
    'zap': <Zap className="w-5 h-5" />,
    'book': <BookOpen className="w-5 h-5" />,
    'calendar': <Calendar className="w-5 h-5" />,
    'user-plus': <UserPlus className="w-5 h-5" />,
    'message-square': <MessageSquare className="w-5 h-5" />,
    'target': <Target className="w-5 h-5" />,
  };
  return iconMap[iconName || 'file-text'] || <FileText className="w-5 h-5" />;
};

// Get button label and icon based on recommendation type
const getActionButton = (type: string): { label: string; icon: React.ReactNode } => {
  if (type === 'knowledge' || type === 'knowledge_base') {
    return {
      label: 'Add knowledge',
      icon: <BookOpen className="w-4 h-4" />,
    };
  }
  if (type === 'action') {
    return {
      label: 'Add action',
      icon: <Zap className="w-4 h-4" />,
    };
  }
  return {
    label: 'Update instructions',
    icon: <Sparkles className="w-4 h-4" />,
  };
};

// Get priority tag styling and label
const getPriorityTag = (priority: 'high' | 'medium' | 'low'): { label: string; className: string } => {
  switch (priority) {
    case 'high':
      return {
        label: 'High priority',
        className: 'bg-red-50 border-red-300 text-red-600',
      };
    case 'medium':
      return {
        label: 'Medium priority',
        className: 'bg-yellow-50 border-yellow-300 text-yellow-600',
      };
    case 'low':
      return {
        label: 'Low priority',
        className: 'bg-blue-50 border-blue-300 text-blue-600',
      };
  }
};

export const FixesOverlay: React.FC<FixesOverlayProps> = ({ testCase, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Use recommendations from test case data if available, otherwise generate them
  const hasDataRecommendations = testCase.recommendations && testCase.recommendations.length > 0;
  const generatedRecommendations = generateRecommendations(testCase);
  
  const toggleChecklistItem = (recId: string, itemId: string) => {
    const key = `${recId}-${itemId}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const accuracy = testCase.metrics?.accuracy || 0;
  const status = testCase.metrics?.status;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop - subtle, no blur */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Slide-out panel */}
      <div
        ref={overlayRef}
        className="relative w-full max-w-xl bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Astra Recommendations</h2>
            <p className="text-sm text-gray-500">Suggestions to improve test results</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Test Case Summary - Figma Design */}
          <div className="px-6 py-1">
            <div 
              className="relative overflow-hidden rounded-xl border border-yellow-300 p-4 flex flex-col gap-2"
              style={{ 
                background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.2) 1.44%, rgba(220, 235, 255, 0.33) 34.62%, rgb(255, 255, 255) 100%)'
              }}
            >
              {/* Text content */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-900">Test case</p>
                <p className="text-sm font-medium text-gray-700">{testCase.question}</p>
              </div>
              
              {/* Metric Tags */}
              <div className="flex items-center gap-3">
                {/* Accuracy Tag */}
                <div className="inline-flex items-center gap-2 px-1.5 py-1 bg-yellow-100 border border-yellow-500 rounded-md">
                  <Crosshair className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs font-semibold text-yellow-600">Accuracy – {accuracy}%</span>
                </div>
                
                {/* Latency Tag */}
                {testCase.metrics?.latency && (
                  <div className="inline-flex items-center gap-2 px-1.5 py-1 bg-yellow-100 border border-yellow-500 rounded-md">
                    <Hourglass className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-semibold text-yellow-600">Latency – {testCase.metrics.latency.toFixed(1)} sec</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="px-6 pt-4 pb-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Response Comparison</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Expected</p>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-[13px] text-gray-700 max-h-32 overflow-auto">
                  {testCase.expectedAnswer || 'No expected answer provided'}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">AI Response</p>
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-[13px] text-gray-700 max-h-32 overflow-auto">
                    {testCase.aiResponse?.content || 'No response generated'}
                  </div>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline self-start transition-colors">
                    View entire conversation
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="px-6 py-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Recommendations ({hasDataRecommendations ? testCase.recommendations!.length : generatedRecommendations.length})
            </h3>
            <div className="space-y-4">
              {hasDataRecommendations ? (
                // Render recommendations from test case data
                testCase.recommendations!.map((rec) => (
                  <div
                    key={rec.id}
                    className="relative overflow-hidden rounded-xl border border-blue-500/10 px-3 py-2 shadow-[1px_-1px_4px_0px_rgba(0,0,0,0.1),-1px_1px_4px_0px_rgba(0,0,0,0.1)]"
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-b from-blue-50/20 to-gray-400/10" />
                    
                    <div className="relative flex items-start gap-2">
                      {/* Icon container */}
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-blue-100 border border-blue-300">
                        <div className="text-blue-600">
                          {getIconFromName(rec.icon)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        {/* Title with priority tag */}
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-700">{rec.title}</h4>
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium whitespace-nowrap',
                            getPriorityTag(rec.priority).className
                          )}>
                            {getPriorityTag(rec.priority).label}
                          </span>
                        </div>
                        {/* Description */}
                        <p className="text-sm text-gray-700">{rec.description}</p>
                        
                        {/* Action Button */}
                        {rec.actionLabel && !rec.checklist && (
                          <button className="inline-flex items-center gap-1 self-start px-2.5 py-2 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            {getActionButton(rec.type).icon}
                            <span>{getActionButton(rec.type).label}</span>
                          </button>
                        )}
                        
                        {/* Checklist for action items */}
                        {rec.checklist && rec.checklist.length > 0 && (
                          <div className="mt-1 space-y-2">
                            <button className="inline-flex items-center gap-1 self-start px-2.5 py-2 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                              {getActionButton(rec.type).icon}
                              <span>{getActionButton(rec.type).label}</span>
                            </button>
                            {rec.checklist.map((item) => {
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
                                    {getIconFromName(item.icon)}
                                  </div>
                                  <div className="flex-1">
                                    <div className={cn(
                                      'font-medium text-sm',
                                      isChecked ? 'text-gray-400 line-through' : 'text-gray-900'
                                    )}>
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
                ))
              ) : (
                // Render auto-generated recommendations
                generatedRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="relative overflow-hidden rounded-xl border border-blue-500/10 px-3 py-2 shadow-[1px_-1px_4px_0px_rgba(0,0,0,0.1),-1px_1px_4px_0px_rgba(0,0,0,0.1)]"
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-b from-blue-50/20 to-gray-400/10" />
                    
                    <div className="relative flex items-start gap-2">
                      {/* Icon container */}
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-blue-100 border border-blue-300">
                        <div className="text-blue-600 [&>svg]:w-4 [&>svg]:h-4">
                          {rec.icon}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        {/* Title with priority tag */}
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-700">{rec.title}</h4>
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium whitespace-nowrap',
                            getPriorityTag(rec.priority).className
                          )}>
                            {getPriorityTag(rec.priority).label}
                          </span>
                        </div>
                        {/* Description */}
                        <p className="text-sm text-gray-700">{rec.description}</p>
                        
                        {/* Action Button */}
                        <button className="inline-flex items-center gap-1 self-start px-2.5 py-2 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                          {getActionButton(rec.type).icon}
                          <span>{getActionButton(rec.type).label}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end">
            <Button onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

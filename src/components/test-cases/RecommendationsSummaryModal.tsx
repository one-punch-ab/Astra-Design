import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Zap,
  FileText,
  Target,
  Crosshair,
  Hourglass,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import type { TestCaseRow, Recommendation } from '@/types/test-cases.types';

interface RecommendationsSummaryModalProps {
  testCases: TestCaseRow[];
  onClose: () => void;
  onViewTestCase: (testCase: TestCaseRow) => void;
}

// Group recommendations by type
interface GroupedRecommendation {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  testCases: TestCaseRow[];
  priority: 'high' | 'medium' | 'low';
}

// Generate recommendations based on test case analysis
const generateRecommendationsForTestCase = (testCase: TestCaseRow) => {
  const recommendations: { type: string; priority: 'high' | 'medium' | 'low'; reason: string }[] = [];
  const accuracy = testCase.metrics?.accuracy || 0;
  const latency = testCase.metrics?.latency || 0;
  const aiResponse = testCase.aiResponse?.content || '';
  const expectedAnswer = testCase.expectedAnswer || '';

  if (accuracy < 70) {
    recommendations.push({
      type: 'knowledge',
      priority: 'high',
      reason: 'Response significantly differs from expected answer',
    });
  }

  if (aiResponse.length < expectedAnswer.length * 0.5) {
    recommendations.push({
      type: 'prompt',
      priority: 'high',
      reason: 'Response is missing important details',
    });
  }

  if (latency > 2) {
    recommendations.push({
      type: 'context',
      priority: 'medium',
      reason: `High response time (${latency.toFixed(1)}s)`,
    });
  }

  if (accuracy >= 70 && accuracy < 90) {
    recommendations.push({
      type: 'format',
      priority: 'medium',
      reason: 'Response partially correct but could be structured better',
    });
  }

  return recommendations;
};

// Get icon for recommendation type
const getTypeIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'knowledge':
      return <BookOpen className="w-5 h-5" />;
    case 'prompt':
      return <MessageSquare className="w-5 h-5" />;
    case 'context':
      return <Zap className="w-5 h-5" />;
    case 'format':
      return <FileText className="w-5 h-5" />;
    case 'intent':
      return <Target className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

// Get label for recommendation type
const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'knowledge':
      return 'Update Knowledge Base';
    case 'prompt':
      return 'Enhance System Prompt';
    case 'context':
      return 'Optimize Context Window';
    case 'format':
      return 'Refine Response Format';
    case 'intent':
      return 'Add Intent Recognition';
    default:
      return 'Review Configuration';
  }
};

// Get description for recommendation type
const getTypeDescription = (type: string): string => {
  switch (type) {
    case 'knowledge':
      return 'Add or update information in your knowledge base to improve response accuracy.';
    case 'prompt':
      return 'Modify system instructions to encourage more comprehensive and accurate answers.';
    case 'context':
      return 'Reduce context length or optimize retrieval to improve response times.';
    case 'format':
      return 'Add formatting guidelines to structure responses according to expectations.';
    case 'intent':
      return 'Create intent mappings to handle different question phrasings.';
    default:
      return 'Review and update your agent configuration.';
  }
};

// Get action button label
const getActionLabel = (type: string): string => {
  switch (type) {
    case 'knowledge':
      return 'Go to Knowledge Base';
    case 'prompt':
      return 'Edit System Prompt';
    case 'context':
      return 'Agent Settings';
    case 'format':
      return 'Edit Format Rules';
    case 'intent':
      return 'Manage Intents';
    default:
      return 'Update Instructions';
  }
};

// Priority badge styles
const getPriorityStyles = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-50 border-red-300 text-red-600';
    case 'medium':
      return 'bg-yellow-50 border-yellow-300 text-yellow-600';
    case 'low':
      return 'bg-blue-50 border-blue-300 text-blue-600';
  }
};

export const RecommendationsSummaryModal: React.FC<RecommendationsSummaryModalProps> = ({
  testCases,
  onClose,
  onViewTestCase,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['knowledge', 'prompt']));

  // Get only failed test cases
  const failedTestCases = useMemo(() => {
    return testCases.filter(tc => tc.metrics?.status === 'failed');
  }, [testCases]);

  // Group recommendations by type
  const groupedRecommendations = useMemo(() => {
    const groups: Record<string, GroupedRecommendation> = {};

    failedTestCases.forEach(tc => {
      // Use existing recommendations or generate them
      const recs = tc.recommendations && tc.recommendations.length > 0
        ? tc.recommendations.map(r => ({ type: r.type, priority: r.priority, reason: r.description }))
        : generateRecommendationsForTestCase(tc);

      recs.forEach(rec => {
        if (!groups[rec.type]) {
          groups[rec.type] = {
            type: rec.type,
            label: getTypeLabel(rec.type),
            description: getTypeDescription(rec.type),
            icon: getTypeIcon(rec.type),
            count: 0,
            testCases: [],
            priority: rec.priority,
          };
        }
        
        // Only add test case if not already in the group
        if (!groups[rec.type].testCases.find(t => t.id === tc.id)) {
          groups[rec.type].testCases.push(tc);
          groups[rec.type].count++;
        }
        
        // Update priority to highest
        if (rec.priority === 'high' || (rec.priority === 'medium' && groups[rec.type].priority === 'low')) {
          groups[rec.type].priority = rec.priority;
        }
      });
    });

    // Sort by priority and count
    return Object.values(groups).sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.count - a.count;
    });
  }, [failedTestCases]);

  // Calculate total recommendations
  const totalRecommendations = groupedRecommendations.reduce((acc, g) => acc + g.count, 0);

  const toggleGroup = (type: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Astra Recommendations
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {failedTestCases.length} test{failedTestCases.length !== 1 ? 's' : ''} didn't meet expectations. 
                Here's what you can do to improve accuracy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{failedTestCases.length}</span> failed tests
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{groupedRecommendations.length}</span> recommendation types
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{totalRecommendations}</span> total suggestions
              </span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="space-y-4">
            {groupedRecommendations.map((group) => {
              const isExpanded = expandedGroups.has(group.type);
              
              return (
                <div
                  key={group.type}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.type)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      {group.icon}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{group.label}</h3>
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium',
                          getPriorityStyles(group.priority)
                        )}>
                          {group.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{group.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">
                        {group.count} test{group.count !== 1 ? 's' : ''}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {/* Affected Test Cases */}
                      <div className="px-4 py-3 space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Affected Test Cases
                        </p>
                        {group.testCases.map((tc) => (
                          <div
                            key={tc.id}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {tc.question}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                  <Crosshair className="w-3 h-3" />
                                  {tc.metrics?.accuracy || 0}% accuracy
                                </span>
                                {tc.metrics?.latency && (
                                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <Hourglass className="w-3 h-3" />
                                    {tc.metrics.latency.toFixed(1)}s
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => onViewTestCase(tc)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                            >
                              View details
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="px-4 py-3 border-t border-gray-200 bg-white">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={group.icon}
                        >
                          {getActionLabel(group.type)}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {groupedRecommendations.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">All tests passed!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  No recommendations at this time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Implementing these changes can improve your agent's accuracy.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onClose}>
                Dismiss
              </Button>
              <Button variant="primary">
                Update Instructions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

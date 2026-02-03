import { useState, useCallback, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import type {
  TestCaseRow,
  FilterConfig,
  SortConfig,
  CSVColumnMapping,
  AutoGenerateConfig,
} from '@/types/test-cases.types';
import { generateId, deepClone } from '@/lib/utils';

// Simulation configuration for progressive improvement
interface SimulationConfig {
  targetScore: number;  // Target efficiency score to reach
  runsToReach: number;  // Number of full runs to reach target
}

const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  targetScore: 88,
  runsToReach: 3,
};

// Sample test case data for demo
const createSampleTestCases = (): TestCaseRow[] => [
  {
    id: uuid(),
    question: 'What are your pricing plans?',
    expectedAnswer: 'We offer three plans: Starter at $29/month, Pro at $79/month, and Enterprise with custom pricing. All plans include a 14-day free trial.',
    leadingQuestions: 'How much does it cost?\nWhat plans do you have?',
    aiResponse: {
      content: 'We have three pricing tiers:\n\n1. **Starter** - $29/month\n2. **Pro** - $79/month\n3. **Enterprise** - Custom pricing\n\nAll plans include a 14-day free trial.',
      feedback: 'up',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 94,
      latency: 1.2,
      status: 'passed',
    },
    notes: 'Core pricing question - high priority',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'How do I reset my password?',
    expectedAnswer: 'Click the "Forgot Password" link on the login page, enter your email, and follow the instructions sent to your inbox.',
    leadingQuestions: 'I forgot my password\nCan\'t log in',
    aiResponse: {
      content: 'To reset your password:\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your email address\n4. Check your inbox for reset instructions',
      generatedAt: new Date(),
    },
    metrics: {
      accuracy: 88,
      latency: 0.9,
      status: 'passed',
    },
    notes: '',
    runStatus: 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    question: 'Do you offer refunds?',
    expectedAnswer: 'Yes, we offer a 30-day money-back guarantee on all plans. Contact support to request a refund.',
    leadingQuestions: 'Can I get my money back?\nRefund policy',
    aiResponse: undefined,
    metrics: undefined,
    notes: 'Test refund handling',
    runStatus: 'idle',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function useTestCases(initialData?: TestCaseRow[]) {
  const [testCases, setTestCases] = useState<TestCaseRow[]>(
    initialData || []
  );
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [runningIds, setRunningIds] = useState<Set<string>>(new Set());
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  // Progress tracking state
  const [testProgress, setTestProgress] = useState<{
    completed: number;
    total: number;
    startTime: number | null;
    estimatedTimeRemaining: number | null;
  }>({ completed: 0, total: 0, startTime: null, estimatedTimeRemaining: null });
  const stopRequestedRef = useRef(false);
  
  // Simulation state - use ref for immediate access, state for UI
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulationRunCount, setSimulationRunCount] = useState(0);
  const simulationConfigRef = useRef<SimulationConfig>(DEFAULT_SIMULATION_CONFIG);
  const isSimulationModeRef = useRef(false); // Ref for immediate access in callbacks

  // Add a new test case
  const addTestCase = useCallback((testCase: Partial<TestCaseRow>) => {
    const newTestCase: TestCaseRow = {
      id: generateId(),
      question: '',
      expectedAnswer: '',
      leadingQuestions: '',
      notes: '',
      runStatus: 'idle',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...testCase,
    };
    setTestCases((prev) => [...prev, newTestCase]);
    return newTestCase;
  }, []);

  // Update a test case
  const updateTestCase = useCallback((id: string, updates: Partial<TestCaseRow>) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id ? { ...tc, ...updates, updatedAt: new Date() } : tc
      )
    );
  }, []);

  // Delete test cases
  const deleteTestCases = useCallback((ids: string[]) => {
    setTestCases((prev) => prev.filter((tc) => !ids.includes(tc.id)));
  }, []);

  // Duplicate test cases
  const duplicateTestCases = useCallback((ids: string[]) => {
    const toDuplicate = testCases.filter((tc) => ids.includes(tc.id));
    const duplicated = toDuplicate.map((tc) => ({
      ...deepClone(tc),
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      runStatus: 'idle' as const,
      aiResponse: undefined,
      metrics: undefined,
    }));
    setTestCases((prev) => [...prev, ...duplicated]);
    return duplicated;
  }, [testCases]);

  // Reorder test cases
  const reorderTestCases = useCallback((sourceIndex: number, destIndex: number) => {
    setTestCases((prev) => {
      const result = [...prev];
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destIndex, 0, removed);
      return result;
    });
  }, []);

  // Calculate accuracy based on simulation progress
  const calculateSimulationAccuracy = useCallback((currentRun: number): { accuracy: number; passed: boolean } => {
    const config = simulationConfigRef.current;
    
    // Progressive improvement over runs
    // Run 1: 65-80% accuracy, ~50% pass rate
    // Run 2: 75-88% accuracy, ~75% pass rate  
    // Run 3: 85-98% accuracy, ~95% pass rate (guarantees reaching 88% efficiency)
    
    let minAccuracy: number;
    let maxAccuracy: number;
    let guaranteedPassChance: number;
    
    if (currentRun === 1) {
      minAccuracy = 65;
      maxAccuracy = 80;
      guaranteedPassChance = 0.5; // 50% chance to force pass
    } else if (currentRun === 2) {
      minAccuracy = 75;
      maxAccuracy = 88;
      guaranteedPassChance = 0.75; // 75% chance to force pass
    } else {
      // Run 3 and beyond - ensure high pass rate
      minAccuracy = 85;
      maxAccuracy = 98;
      guaranteedPassChance = 0.95; // 95% chance to force pass
    }
    
    // Determine if this test should be guaranteed to pass
    const shouldPass = Math.random() < guaranteedPassChance;
    
    let accuracy: number;
    if (shouldPass) {
      // Ensure accuracy is above pass threshold (80)
      accuracy = Math.round(Math.max(82, minAccuracy) + Math.random() * (maxAccuracy - Math.max(82, minAccuracy)));
    } else {
      // Allow some failures
      accuracy = Math.round(minAccuracy + Math.random() * (maxAccuracy - minAccuracy));
    }
    
    const passed = accuracy >= 80;
    
    return { accuracy: Math.min(accuracy, 99), passed };
  }, []);

  // Run test for a single test case (simulated)
  // simulationRun is passed directly to avoid React state timing issues
  const runTest = useCallback(async (id: string, simulationRun?: number) => {
    // Set status to running and track running ID
    setRunningIds(prev => new Set(prev).add(id));
    updateTestCase(id, { runStatus: 'running' });

    // Check simulation mode from ref (immediate access) not state
    const inSimulationMode = isSimulationModeRef.current;
    
    // Simulate API call delay (shorter in simulation mode)
    const delay = inSimulationMode ? 300 + Math.random() * 300 : 2000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Determine accuracy based on mode
    let accuracy: number;
    let passed: boolean;
    
    if (inSimulationMode && simulationRun !== undefined) {
      // Use simulation-based accuracy that improves over runs
      const result = calculateSimulationAccuracy(simulationRun);
      accuracy = result.accuracy;
      passed = result.passed;
    } else {
      // Normal random accuracy
      accuracy = Math.floor(70 + Math.random() * 30);
      passed = accuracy >= 80;
    }
    
    const latency = Math.round((0.5 + Math.random() * 3) * 10) / 10; // Round to 1 decimal place

    updateTestCase(id, {
      runStatus: 'complete',
      aiResponse: {
        content: 'This is a simulated AI response. In production, this would be the actual response from your AI agent based on the question.',
        generatedAt: new Date(),
      },
      metrics: {
        accuracy,
        latency,
        status: passed ? 'passed' : 'failed',
      },
    });

    // Remove from running IDs
    setRunningIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [updateTestCase, calculateSimulationAccuracy]);

  // Run multiple tests with progress tracking
  const runTests = useCallback(async (ids: string[], simulationRun?: number) => {
    setIsRunningTests(true);
    stopRequestedRef.current = false;
    
    const total = ids.length;
    const startTime = Date.now();
    setTestProgress({ completed: 0, total, startTime, estimatedTimeRemaining: null });
    
    try {
      for (let i = 0; i < ids.length; i++) {
        // Check if stop was requested
        if (stopRequestedRef.current) {
          break;
        }
        
        await runTest(ids[i], simulationRun);
        
        const completed = i + 1;
        const elapsed = Date.now() - startTime;
        const avgTimePerTest = elapsed / completed;
        const remaining = total - completed;
        const estimatedTimeRemaining = Math.round((avgTimePerTest * remaining) / 1000); // in seconds
        
        setTestProgress({
          completed,
          total,
          startTime,
          estimatedTimeRemaining: remaining > 0 ? estimatedTimeRemaining : null,
        });
      }
    } finally {
      setIsRunningTests(false);
      stopRequestedRef.current = false;
      // Reset progress after a short delay to show completion
      setTimeout(() => {
        setTestProgress({ completed: 0, total: 0, startTime: null, estimatedTimeRemaining: null });
      }, 1000);
    }
  }, [runTest]);
  
  // Stop running tests
  const stopTests = useCallback(() => {
    stopRequestedRef.current = true;
  }, []);

  // Run simulation - runs all tests multiple times with improving scores
  const runSimulation = useCallback(async (
    ids: string[],
    config: SimulationConfig = DEFAULT_SIMULATION_CONFIG,
    onRunComplete?: (runNumber: number) => void
  ) => {
    // Set ref FIRST for immediate access in callbacks
    isSimulationModeRef.current = true;
    simulationConfigRef.current = config;
    
    // Then set state for UI updates
    setIsSimulationMode(true);
    setSimulationRunCount(0);

    try {
      for (let run = 1; run <= config.runsToReach; run++) {
        setSimulationRunCount(run);
        
        // Run all tests for this iteration
        await runTests(ids, run);
        
        // Callback for each run completion
        onRunComplete?.(run);
        
        // Small delay between runs for visual feedback
        if (run < config.runsToReach) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } finally {
      // Reset both ref and state
      isSimulationModeRef.current = false;
      setIsSimulationMode(false);
    }
  }, [runTests]);

  // Reset simulation state
  const resetSimulation = useCallback(() => {
    setSimulationRunCount(0);
    setIsSimulationMode(false);
    isSimulationModeRef.current = false;
  }, []);

  // Give feedback on AI response
  const giveFeedback = useCallback((id: string, feedback: 'up' | 'down') => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id && tc.aiResponse
          ? {
              ...tc,
              aiResponse: {
                ...tc.aiResponse,
                feedback: tc.aiResponse.feedback === feedback ? undefined : feedback,
              },
              updatedAt: new Date(),
            }
          : tc
      )
    );
  }, []);

  // Import from CSV
  const importFromCSV = useCallback((mapping: CSVColumnMapping, data: string[][]) => {
    const headers = Object.keys(mapping);
    const newTestCases: TestCaseRow[] = data.map((row) => {
      const testCase: Partial<TestCaseRow> = {
        id: generateId(),
        question: '',
        expectedAnswer: '',
        leadingQuestions: '',
        notes: '',
        runStatus: 'idle',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      headers.forEach((header, index) => {
        const field = mapping[header];
        if (field && row[index]) {
          (testCase as Record<string, unknown>)[field] = row[index];
        }
      });

      return testCase as TestCaseRow;
    });

    setTestCases((prev) => [...prev, ...newTestCases]);
    return newTestCases;
  }, []);

  // Auto-generate test cases (simulated)
  const autoGenerate = useCallback(async (config: AutoGenerateConfig): Promise<TestCaseRow[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate sample test cases
    const generated: TestCaseRow[] = Array.from({ length: config.count }, (_, i) => ({
      id: generateId(),
      question: `Generated question ${i + 1}: What is [topic ${i + 1}]?`,
      expectedAnswer: `Expected answer for question ${i + 1}. This would be generated based on your knowledge base.`,
      leadingQuestions: `Alternative way to ask question ${i + 1}`,
      notes: 'Auto-generated',
      runStatus: 'idle',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    setTestCases((prev) => [...prev, ...generated]);
    return generated;
  }, []);

  // Filter and search logic
  const filteredTestCases = useMemo(() => {
    let result = [...testCases];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tc) =>
          tc.question.toLowerCase().includes(query) ||
          tc.expectedAnswer.toLowerCase().includes(query) ||
          tc.notes.toLowerCase().includes(query)
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      result = result.filter((tc) => {
        const value = getNestedValue(tc, filter.field);
        return applyFilter(value, filter.operator, filter.value);
      });
    });

    // Apply sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.field);
        const bValue = getNestedValue(b, sortConfig.field);
        
        // Handle comparison for different types
        const aStr = String(aValue ?? '');
        const bStr = String(bValue ?? '');
        
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [testCases, searchQuery, filters, sortConfig]);

  return {
    testCases,
    filteredTestCases,
    filters,
    sortConfig,
    searchQuery,
    isRunningTests,
    runningIds,
    // Progress tracking
    testProgress,
    // Simulation state
    isSimulationMode,
    simulationRunCount,
    // Actions
    setTestCases,
    setFilters,
    setSortConfig,
    setSearchQuery,
    addTestCase,
    updateTestCase,
    deleteTestCases,
    duplicateTestCases,
    reorderTestCases,
    runTest,
    runTests,
    stopTests,
    runSimulation,
    resetSimulation,
    giveFeedback,
    importFromCSV,
    autoGenerate,
    loadSampleData: () => setTestCases(createSampleTestCases()),
  };
}

// Helper functions
function getNestedValue<T extends object>(obj: T, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && acc !== null) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

function applyFilter(
  value: unknown,
  operator: FilterConfig['operator'],
  filterValue: string | number | boolean
): boolean {
  const strValue = String(value || '').toLowerCase();
  const strFilterValue = String(filterValue).toLowerCase();

  switch (operator) {
    case 'equals':
      return strValue === strFilterValue;
    case 'notEquals':
      return strValue !== strFilterValue;
    case 'contains':
      return strValue.includes(strFilterValue);
    case 'notContains':
      return !strValue.includes(strFilterValue);
    case 'startsWith':
      return strValue.startsWith(strFilterValue);
    case 'endsWith':
      return strValue.endsWith(strFilterValue);
    case 'isEmpty':
      return !value || strValue === '';
    case 'isNotEmpty':
      return !!value && strValue !== '';
    case 'greaterThan':
      return Number(value) > Number(filterValue);
    case 'lessThan':
      return Number(value) < Number(filterValue);
    default:
      return true;
  }
}

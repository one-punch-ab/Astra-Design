import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { LeftNavBar, TopNavigation } from '@/components/layout';
import { 
  TestCasesTable, 
  TableControls, 
  EmptyState,
  PageHeader,
  ImportCSVModal,
  AutoGenerateModal,
  FixesOverlay,
  EfficiencyBanner,
  TestProgressBanner,
  type ColumnConfig,
} from '@/components/test-cases';
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
import { useTestCases, useWorksheets } from '@/hooks';
import { downloadFile } from '@/lib/utils';
import type { ViewMode, FilterConfig, CSVColumnMapping, AutoGenerateConfig, ColumnType, TestCaseRow } from '@/types/test-cases.types';
import { AlertTriangle, FlaskConical } from 'lucide-react';

export const TestCasesPage: React.FC = () => {
  // Worksheet management
  const {
    worksheets,
    activeWorksheet,
    activeWorksheetId,
    setActiveWorksheetId,
    createWorksheet,
    renameWorksheet,
    duplicateWorksheet,
    deleteWorksheet,
    updateActiveWorksheetTestCases,
    loadSampleDataToActiveWorksheet,
    addCustomColumn,
    updateCustomColumn,
    deleteCustomColumn,
    duplicateCustomColumn,
  } = useWorksheets();

  // Test case management
  const {
    filteredTestCases,
    filters,
    searchQuery,
    isRunningTests,
    testProgress,
    isSimulationMode,
    simulationRunCount,
    setFilters,
    setSearchQuery,
    addTestCase,
    updateTestCase,
    deleteTestCases,
    reorderTestCases,
    runTest,
    runTests,
    stopTests,
    runSimulation,
    resetSimulation,
    giveFeedback,
    importFromCSV,
    autoGenerate,
    setTestCases,
  } = useTestCases(activeWorksheet.testCases);

  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [frozenColumnIds, setFrozenColumnIds] = useState<string[]>(['question']); // Question is frozen by default
  
  // Modal states
  const [showImport, setShowImport] = useState(false);
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSampleData, setIsLoadingSampleData] = useState(false);
  const [fixesTestCase, setFixesTestCase] = useState<TestCaseRow | null>(null);
  
  // Efficiency banner state
  const [showEfficiencyBanner, setShowEfficiencyBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [lastSimulationRunCount, setLastSimulationRunCount] = useState(0);

  // Track syncing state to prevent circular updates
  const isSyncingRef = useRef(false);
  const worksheetTestCasesRef = useRef<string>('');

  // Sync test cases from worksheet to local state
  useEffect(() => {
    // Create a simple hash of the worksheet data to detect external changes
    const currentHash = JSON.stringify(activeWorksheet.testCases.map(tc => tc.id));
    
    // If the worksheet data changed externally (not from our sync)
    if (!isSyncingRef.current && worksheetTestCasesRef.current !== currentHash) {
      setTestCases(activeWorksheet.testCases);
      worksheetTestCasesRef.current = currentHash;
    }
  }, [activeWorksheetId, activeWorksheet.testCases, setTestCases]);

  // Reset selection when switching worksheets
  useEffect(() => {
    setSelectedIds([]);
  }, [activeWorksheetId]);

  // Update worksheet when test cases change (from local edits)
  useEffect(() => {
    const currentHash = JSON.stringify(filteredTestCases.map(tc => tc.id));
    
    // Only sync if data actually changed and we're not already syncing
    if (worksheetTestCasesRef.current !== currentHash) {
      isSyncingRef.current = true;
      worksheetTestCasesRef.current = currentHash;
      updateActiveWorksheetTestCases(filteredTestCases);
      // Reset sync flag after a tick
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  }, [filteredTestCases, updateActiveWorksheetTestCases]);

  // Cell edit handler
  const handleCellEdit = useCallback((id: string, field: string, value: unknown) => {
    updateTestCase(id, { [field]: value });
  }, [updateTestCase]);

  // Row reorder handler
  const handleRowReorder = useCallback((sourceIndex: number, destIndex: number) => {
    reorderTestCases(sourceIndex, destIndex);
  }, [reorderTestCases]);

  // Selection change handler
  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  // Add new row handler
  const handleAddRow = useCallback(() => {
    addTestCase({});
  }, [addTestCase]);

  // Run selected tests
  const handleRunSelected = useCallback(async () => {
    if (selectedIds.length > 0) {
      await runTests(selectedIds);
    }
  }, [selectedIds, runTests]);

  // Delete selected tests
  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.length > 0) {
      setShowDeleteConfirm(true);
    }
  }, [selectedIds]);

  const confirmDelete = useCallback(() => {
    deleteTestCases(selectedIds);
    setSelectedIds([]);
    setShowDeleteConfirm(false);
  }, [selectedIds, deleteTestCases]);

  // Export handler
  const handleExport = useCallback(() => {
    const data = filteredTestCases.map((tc) => ({
      Question: tc.question,
      'Expected Answer': tc.expectedAnswer,
      'Leading Questions': tc.leadingQuestions,
      'AI Response': tc.aiResponse?.content || '',
      'Accuracy': tc.metrics?.accuracy || '',
      'Latency': tc.metrics?.latency || '',
      'Status': tc.metrics?.status || '',
      'Notes': tc.notes,
    }));

    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map((row) => Object.values(row).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    downloadFile(csv, `test-cases-${activeWorksheet.name}.csv`, 'text/csv');
  }, [filteredTestCases, activeWorksheet.name]);

  // Download template handler
  const handleDownloadTemplate = useCallback(() => {
    const template = 'Question,Expected Answer,Leading Questions,Notes\n"What is your product?","Our product is...","Tell me about your product",""';
    downloadFile(template, 'test-cases-template.csv', 'text/csv');
  }, []);

  // Import handler
  const handleImport = useCallback((mapping: CSVColumnMapping, data: string[][]) => {
    importFromCSV(mapping, data);
  }, [importFromCSV]);

  // Filter handler
  const handleApplyFilters = useCallback((newFilters: FilterConfig[]) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Columns config handler - extract frozen column IDs
  const handleColumnsConfigChange = useCallback((columns: ColumnConfig[]) => {
    const frozenIds = columns.filter(col => col.frozen).map(col => col.id);
    setFrozenColumnIds(frozenIds);
  }, []);

  // Auto generate handler
  const handleAutoGenerate = useCallback(async (config: AutoGenerateConfig) => {
    setIsGenerating(true);
    try {
      await autoGenerate(config);
      setShowAutoGenerate(false);
    } catch (error) {
      console.error('Failed to generate test cases:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [autoGenerate]);

  // Load sample data handler
  const handleLoadSampleData = useCallback(async () => {
    setIsLoadingSampleData(true);
    try {
      await loadSampleDataToActiveWorksheet();
    } catch (error) {
      console.error('Failed to load sample data:', error);
    } finally {
      setIsLoadingSampleData(false);
    }
  }, [loadSampleDataToActiveWorksheet]);

  // Compute metrics and efficiency score - only show when tests have been run
  const { metrics, efficiencyScore } = useMemo(() => {
    const withMetrics = filteredTestCases.filter(tc => tc.metrics);
    
    // Only return metrics if at least one test has been run
    if (withMetrics.length === 0) {
      return { metrics: undefined, efficiencyScore: 0 };
    }
    
    const passed = withMetrics.filter(tc => tc.metrics?.status === 'passed').length;
    const avgAccuracy = Math.round(
      withMetrics.reduce((acc, tc) => acc + (tc.metrics?.accuracy || 0), 0) / withMetrics.length
    );
    const avgLatency = (
      withMetrics.reduce((acc, tc) => acc + (tc.metrics?.latency || 0), 0) / withMetrics.length
    ).toFixed(1);

    const efficiencyScore = Math.round((passed / withMetrics.length) * 100);
    
    const metricsData = [
      { label: 'Efficiency Score', value: `${efficiencyScore}%`, variant: (efficiencyScore >= 85 ? 'success' : 'warning') as const, icon: 'efficiency' as const },
      { label: 'Accuracy', value: `${avgAccuracy}%`, variant: 'success' as const, icon: 'accuracy' as const },
      { label: 'Latency', value: `${avgLatency} sec`, variant: 'warning' as const, icon: 'latency' as const },
    ];
    
    return { metrics: metricsData, efficiencyScore };
  }, [filteredTestCases]);

  // Show efficiency banner when score >= 85% and not dismissed
  useEffect(() => {
    if (efficiencyScore >= 85 && !bannerDismissed && !isRunningTests) {
      setShowEfficiencyBanner(true);
      setLastSimulationRunCount(simulationRunCount);
    }
  }, [efficiencyScore, bannerDismissed, isRunningTests, simulationRunCount]);

  // Handle banner dismiss
  const handleBannerDismiss = useCallback(() => {
    setShowEfficiencyBanner(false);
    setBannerDismissed(true);
  }, []);

  // Handle running the simulation (3 runs to reach 88% efficiency)
  const handleRunSimulation = useCallback(async () => {
    // Reset banner state for new simulation
    setBannerDismissed(false);
    setShowEfficiencyBanner(false);
    
    // Get all test case IDs - must have test cases to run simulation
    const allIds = filteredTestCases.map(tc => tc.id);
    
    if (allIds.length === 0) {
      console.warn('No test cases to run simulation on');
      return;
    }
    
    // Run simulation with config: target 88%, reach in 3 runs
    await runSimulation(allIds, {
      targetScore: 88,
      runsToReach: 3,
    });
  }, [filteredTestCases, runSimulation]);

  // Check if empty
  const isEmpty = filteredTestCases.length === 0 && !searchQuery && filters.length === 0;

  return (
    <div className="h-screen flex bg-white">
      {/* Left Navigation Bar */}
      <LeftNavBar activeItem="testing" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNavigation
          breadcrumbs={[
            { label: 'Agents', href: '/agents' },
            { label: 'Aria' },
          ]}
          credits={{ used: 100, total: 100 }}
        />

        {/* Container - with shadow and rounded corner matching Figma design */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-tl-xl shadow-[-4px_0_12px_rgba(0,0,0,0.06)] mr-4">
          {/* Header with title and metrics (metrics only shown when test cases exist) */}
          <div className="px-4 h-14 flex items-center justify-start border-b border-gray-200">
            <PageHeader 
              title="Test cases"
              metrics={!isEmpty ? metrics : undefined}
              isLoading={isRunningTests}
            />
          </div>

          {/* Test Progress Banner - shows when tests are running */}
          {isRunningTests && testProgress.total > 0 && (
            <div className="px-4 pt-3">
              <TestProgressBanner
                completed={testProgress.completed}
                total={testProgress.total}
                estimatedTimeRemaining={testProgress.estimatedTimeRemaining}
                onStop={stopTests}
              />
            </div>
          )}

          {/* Efficiency Banner - shows when score >= 85% */}
          {showEfficiencyBanner && efficiencyScore >= 85 && !isRunningTests && (
            <div className="px-4 pt-3">
              <EfficiencyBanner
                efficiencyScore={efficiencyScore}
                onDismiss={handleBannerDismiss}
                runCount={lastSimulationRunCount > 0 ? lastSimulationRunCount : undefined}
              />
            </div>
          )}

          {/* Controls row with worksheet tabs (always visible) and CTAs (hidden when empty) */}
          <div className="px-4 py-2">
            <TableControls
              worksheets={worksheets}
              activeWorksheetId={activeWorksheetId}
              onSelectWorksheet={setActiveWorksheetId}
              onCreateWorksheet={() => createWorksheet()}
              onRenameWorksheet={renameWorksheet}
              onDuplicateWorksheet={duplicateWorksheet}
              onDeleteWorksheet={deleteWorksheet}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedCount={selectedIds.length}
              filters={filters}
              onApplyFilters={handleApplyFilters}
              onImport={() => setShowImport(true)}
              onExport={handleExport}
              onAutoGenerate={() => setShowAutoGenerate(true)}
              onRunSelected={handleRunSelected}
              onRunAll={() => runTests(filteredTestCases.map(tc => tc.id))}
              onAddTestCase={handleAddRow}
              onDeleteSelected={handleDeleteSelected}
              showControls={!isEmpty}
              customColumns={activeWorksheet.customColumns}
              onDeleteColumn={deleteCustomColumn}
              isRunning={isRunningTests}
              onColumnsConfigChange={handleColumnsConfigChange}
            />
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-hidden relative">
            {isLoadingSampleData && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[1px]">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-600 animate-pulse">Loading sample test cases...</p>
              </div>
            )}
            
            {isEmpty ? (
              <EmptyState
                onUploadCSV={() => setShowImport(true)}
                onAutoGenerate={() => setShowAutoGenerate(true)}
                onManualAdd={handleAddRow}
              />
            ) : (
              <TestCasesTable
                testCases={filteredTestCases}
                viewMode={viewMode}
                customColumns={activeWorksheet.customColumns}
                frozenColumnIds={frozenColumnIds}
                onCellEdit={handleCellEdit}
                onRowReorder={handleRowReorder}
                onSelectionChange={handleSelectionChange}
                onRunTest={runTest}
                onFeedback={giveFeedback}
                onAddRow={handleAddRow}
                onAddColumn={(type: ColumnType) => {
                  const columnNumber = (activeWorksheet.customColumns?.length || 0) + 1;
                  addCustomColumn(`Column ${columnNumber}`, type);
                }}
                onRenameColumn={(columnId, newName) => updateCustomColumn(columnId, { name: newName })}
                onDuplicateColumn={duplicateCustomColumn}
                onDeleteColumn={deleteCustomColumn}
                onViewFixes={setFixesTestCase}
              />
            )}
          </main>

          {/* Simulation & Sample Data CTAs */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            {/* Run Simulation button - visible when test cases exist */}
            {!isEmpty && (
              <button
                onClick={handleRunSimulation}
                disabled={isSimulationMode || isRunningTests}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md text-sm font-medium text-white hover:from-purple-600 hover:to-indigo-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSimulationMode ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Run {simulationRunCount}/3...</span>
                  </>
                ) : (
                  <>
                    <FlaskConical className="w-4 h-4" />
                    <span>Run Simulation (3x)</span>
                  </>
                )}
              </button>
            )}
            
            {/* Load sample data CTA - visible when empty */}
            {isEmpty && (
              <button
                onClick={handleLoadSampleData}
                disabled={isLoadingSampleData}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingSampleData ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                )}
                {isLoadingSampleData ? 'Loading...' : 'Load sample data'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ImportCSVModal
        open={showImport}
        onOpenChange={setShowImport}
        onImport={handleImport}
        worksheetName={activeWorksheet.name}
        onDownloadTemplate={handleDownloadTemplate}
      />

      <AutoGenerateModal
        open={showAutoGenerate}
        onOpenChange={setShowAutoGenerate}
        onGenerate={handleAutoGenerate}
        isGenerating={isGenerating}
      />

      {/* Fixes overlay - slide-in panel with AI recommendations */}
      {fixesTestCase && (
        <FixesOverlay
          testCase={fixesTestCase}
          onClose={() => setFixesTestCase(null)}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Delete test cases
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.length} test case{selectedIds.length > 1 ? 's' : ''}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogBody>
            <p className="text-sm text-gray-600">
              All data including AI responses and metrics will be permanently removed.
            </p>
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete {selectedIds.length} test case{selectedIds.length > 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

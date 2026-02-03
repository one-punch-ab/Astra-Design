import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  X,
  Filter as FilterIcon,
  ArrowUpDown,
  Rows3,
  Rows2,
  ChevronDown,
  Download,
  Upload,
  Trash2,
  Play,
  FlaskConical,
  MoreVertical,
  Columns3,
  Sparkles,
} from 'lucide-react';
import type { ViewMode, Worksheet, FilterConfig, SortConfig, CustomColumn } from '@/types/test-cases.types';
import { WorksheetTabs } from './WorksheetTabs';
import { FilterModal } from './modals/FilterModal';
import { SortModal } from './modals/SortModal';
import { ManageColumnsDropdown, buildColumnsConfig, type ColumnConfig } from './ManageColumnsDropdown';

interface TableControlsProps {
  // Worksheet props
  worksheets: Worksheet[];
  activeWorksheetId: string;
  onSelectWorksheet: (id: string) => void;
  onCreateWorksheet: () => void;
  onRenameWorksheet: (id: string, name: string) => void;
  onDuplicateWorksheet: (id: string) => void;
  onDeleteWorksheet: (id: string) => void;
  // Search and filter props
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCount: number;
  filters: FilterConfig[];
  onApplyFilters: (filters: FilterConfig[]) => void;
  onImport: () => void;
  onExport: () => void;
  onAutoGenerate?: () => void;
  onRunSelected: () => void;
  onRunAll: () => void;
  onAddTestCase: () => void;
  onDeleteSelected: () => void;
  // Show/hide CTAs (hide when worksheet is empty)
  showControls?: boolean;
  // Column management
  customColumns?: CustomColumn[];
  onDeleteColumn?: (columnId: string) => void;
  onColumnsConfigChange?: (columns: ColumnConfig[]) => void;
  // Running state
  isRunning?: boolean;
}

export const TableControls: React.FC<TableControlsProps> = ({
  worksheets,
  activeWorksheetId,
  onSelectWorksheet,
  onCreateWorksheet,
  onRenameWorksheet,
  onDuplicateWorksheet,
  onDeleteWorksheet,
  viewMode,
  onViewModeChange,
  selectedCount,
  filters,
  onApplyFilters,
  onImport,
  onExport,
  onAutoGenerate,
  onRunSelected,
  onRunAll,
  onAddTestCase,
  onDeleteSelected,
  showControls = true,
  customColumns = [],
  onDeleteColumn,
  onColumnsConfigChange,
  isRunning = false,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sorts, setSorts] = useState<SortConfig[]>([]);
  const [showManageColumns, setShowManageColumns] = useState(false);
  const [showAddTestCasesMenu, setShowAddTestCasesMenu] = useState(false);
  const [columnsConfig, setColumnsConfig] = useState<ColumnConfig[]>(() => buildColumnsConfig(customColumns));
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  // Update columns config when custom columns change
  React.useEffect(() => {
    setColumnsConfig(buildColumnsConfig(customColumns));
  }, [customColumns]);

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // When items are selected, show bulk actions UI
  if (selectedCount > 0 && showControls) {
    return (
      <div className="flex items-center justify-between h-9">
        {/* Left side - Selection count and bulk actions */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {selectedCount} selected
          </span>

          <button 
            onClick={onRunSelected}
            className="inline-flex items-center gap-2 h-8 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            Run test
          </button>

          <button 
            onClick={onDeleteSelected}
            className="inline-flex items-center gap-2 h-8 px-4 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>

        {/* Right side - empty for now, could add cancel selection button */}
        <div />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between h-9">
      {/* Left side - Worksheet Tabs */}
      <WorksheetTabs
        worksheets={worksheets}
        activeId={activeWorksheetId}
        onSelect={onSelectWorksheet}
        onCreate={onCreateWorksheet}
        onRename={onRenameWorksheet}
        onDuplicate={onDuplicateWorksheet}
        onDelete={onDeleteWorksheet}
      />

      {/* Right side - CTAs (hidden when worksheet is empty) */}
      {showControls && (
      <div className="flex items-center gap-3">
        {/* Expandable Search */}
        {!isSearchOpen ? (
          <button
            className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            onClick={() => setIsSearchOpen(true)}
            title="Search test cases"
          >
            <Search className="w-5 h-5" />
          </button>
        ) : (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2",
            "bg-white border border-gray-300 rounded-lg",
            "hover:border-gray-400 transition-colors"
          )}>
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent min-w-[240px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              className="p-0 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
              onClick={handleSearchClose}
              title="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Table controls button group */}
        <div className="flex items-center border border-gray-300 rounded-md">
          {/* Filter button */}
          <div className="relative">
            <button
              ref={filterButtonRef}
              onClick={() => setShowFilterModal(true)}
              className={cn(
                'inline-flex items-center justify-center h-8 w-8',
                'text-gray-700',
                'bg-white hover:bg-gray-50 transition-colors',
                filters.length > 0 && 'text-astra-primary'
              )}
              style={{ borderRadius: '6px 0px 0px 6px', borderRight: '1px solid rgb(209, 213, 219)' }}
              title="Filter"
            >
              <FilterIcon className="w-4 h-4" />
            </button>
            {filters.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>

          {/* Sort button */}
          <div className="relative">
            <button
              ref={sortButtonRef}
              onClick={() => setShowSortModal(true)}
              className={cn(
                'inline-flex items-center justify-center h-8 w-8',
                'text-gray-700',
                'bg-white hover:bg-gray-50 transition-colors',
                'border-r border-gray-300',
                sorts.length > 0 && 'text-astra-primary'
              )}
              style={{ borderRadius: 0 }}
              title="Sort"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
            {sorts.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>

          {/* Manage columns button */}
          <div className="relative">
            <button
              onClick={() => setShowManageColumns(!showManageColumns)}
              className={cn(
                'inline-flex items-center justify-center h-8 w-8',
                'text-gray-700',
                'bg-white hover:bg-gray-50 transition-colors',
                'border-r border-gray-300'
              )}
              style={{ borderRadius: 0 }}
              title="Manage columns"
            >
              <Columns3 className="w-4 h-4" />
            </button>

            {/* Manage columns dropdown */}
            {showManageColumns && (
              <ManageColumnsDropdown
                columns={columnsConfig}
                onSave={(newColumns) => {
                  setColumnsConfig(newColumns);
                  onColumnsConfigChange?.(newColumns);
                }}
                onClose={() => setShowManageColumns(false)}
                onDeleteColumn={onDeleteColumn}
              />
            )}
          </div>

          {/* Compact/Expanded view dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              className={cn(
                'inline-flex items-center gap-2 h-8 px-3',
                'text-sm font-medium text-gray-700',
                'bg-white hover:bg-gray-50 transition-colors'
              )}
              style={{ borderRadius: '0px 6px 6px 0px' }}
            >
              {viewMode === 'compact' ? (
                <Rows3 className="w-4 h-4" />
              ) : (
                <Rows2 className="w-4 h-4" />
              )}
              {viewMode === 'compact' ? 'Compact' : 'Expanded'}
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* View mode dropdown menu */}
            {showViewMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowViewMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
                  <button
                    onClick={() => {
                      onViewModeChange('compact');
                      setShowViewMenu(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-sm text-left flex items-center gap-3 whitespace-nowrap',
                      viewMode === 'compact' 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Rows3 className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">Compact view</span>
                    {viewMode === 'compact' && (
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onViewModeChange('expanded');
                      setShowViewMenu(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-sm text-left flex items-center gap-3 whitespace-nowrap',
                      viewMode === 'expanded' 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Rows2 className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">Expanded view</span>
                    {viewMode === 'expanded' && (
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Primary CTA button group - no gap between buttons */}
        <div className="flex items-center">
          {/* Run all test cases - Primary CTA */}
          <button
            onClick={onRunAll}
            disabled={isRunning}
            className={cn(
              'inline-flex items-center justify-center gap-2 h-8 px-4',
              'text-sm font-semibold text-white',
              'transition-colors hover:opacity-90',
              'disabled:opacity-80 disabled:cursor-not-allowed'
            )}
            style={{ 
              background: 'linear-gradient(180deg, #173DA6 0%, #091840 200%)',
              borderRadius: '6px 0px 0px 6px',
              borderRight: '1px solid rgba(255, 255, 255, 1)'
            }}
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4" fill="currentColor" />
            )}
            {isRunning ? 'Running...' : 'Run all'}
          </button>

          {/* Add test cases - Primary CTA with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAddTestCasesMenu(!showAddTestCasesMenu)}
              className={cn(
                'inline-flex items-center justify-center gap-2 h-8 px-4',
                'text-sm font-semibold text-white',
                'transition-colors hover:opacity-90'
              )}
              style={{ 
                background: 'linear-gradient(180deg, #173DA6 0%, #091840 200%)',
                borderRadius: 0,
                borderRight: '1px solid rgba(255, 255, 255, 1)'
              }}
            >
              <FlaskConical className="w-4 h-4" />
              Add test cases
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Add test cases dropdown menu */}
            {showAddTestCasesMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowAddTestCasesMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
                  <button
                    onClick={() => {
                      onImport();
                      setShowAddTestCasesMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-3 text-gray-700 hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    Upload CSV
                  </button>
                  <button
                    onClick={() => {
                      onAutoGenerate?.();
                      setShowAddTestCasesMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-3 text-gray-700 hover:bg-gray-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    Auto-generate
                  </button>
                </div>
              </>
            )}
          </div>

          {/* More menu (3-dot) - Blue gradient */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={cn(
                'inline-flex items-center justify-center w-8 h-8',
                'text-white',
                'transition-colors hover:opacity-90'
              )}
              style={{ background: 'linear-gradient(180deg, #173DA6 0%, #091840 200%)', borderRadius: '0px 6px 6px 0px' }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* More menu dropdown */}
            {showMoreMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
                  <button
                    onClick={() => {
                      onExport();
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left flex items-center gap-3 text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    Export report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filter Modal - positioned near filter button */}
        <FilterModal
          open={showFilterModal}
          onOpenChange={setShowFilterModal}
          filters={filters}
          onApply={onApplyFilters}
          anchorRef={filterButtonRef}
        />

        {/* Sort Modal - positioned near sort button */}
        <SortModal
          open={showSortModal}
          onOpenChange={setShowSortModal}
          sorts={sorts}
          onApply={setSorts}
          anchorRef={sortButtonRef}
        />
      </div>
      )}
    </div>
  );
};

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  GridReadyEvent,
  CellValueChangedEvent,
  RowDragEndEvent,
  SelectionChangedEvent,
  CellClickedEvent,
  GridApi,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/styles/ag-grid-astra-theme.css';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { 
  RowActionsRenderer, 
  AIResponseRenderer, 
  MetricsRenderer,
  StatusRenderer,
  MultiSelectCellEditor,
  MultiSelectCellRenderer,
  MarkdownCellRenderer,
  TextCellEditor,
} from './cell-renderers';
import { AddColumnDropdown } from './AddColumnDropdown';
import { CustomColumnHeader } from './CustomColumnHeader';
import { ColumnHeader } from './ColumnHeader';
import type { TestCaseRow, ViewMode, CustomColumn, ColumnType } from '@/types/test-cases.types';

interface TestCasesTableProps {
  testCases: TestCaseRow[];
  viewMode: ViewMode;
  customColumns?: CustomColumn[];
  frozenColumnIds?: string[];
  onCellEdit: (id: string, field: string, value: unknown) => void;
  onRowReorder: (sourceIndex: number, destIndex: number) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  onRunTest: (id: string) => void;
  onFeedback: (id: string, feedback: 'up' | 'down') => void;
  onAddRow: () => void;
  onAddColumn?: (type: ColumnType) => void;
  onRenameColumn?: (columnId: string, newName: string) => void;
  onDuplicateColumn?: (columnId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  onViewFixes?: (testCase: TestCaseRow) => void;
}

// Cell style for truncation with ellipsis (compact view)
const truncateCellStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
  lineHeight: '28px',
};

// Cell style for expanded view (no truncation)
const expandedCellStyle = {
  whiteSpace: 'pre-wrap',
  lineHeight: '1.5',
  padding: '8px 4px',
};

export const TestCasesTable: React.FC<TestCasesTableProps> = ({
  testCases,
  viewMode,
  customColumns = [],
  frozenColumnIds = [],
  onCellEdit,
  onRowReorder,
  onSelectionChange,
  onRunTest,
  onFeedback,
  onAddRow,
  onAddColumn,
  onRenameColumn,
  onDuplicateColumn,
  onDeleteColumn,
  onViewFixes,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [previousRowCount, setPreviousRowCount] = useState(testCases.length);
  const [previousColumnIds, setPreviousColumnIds] = useState<string[]>(customColumns.map(c => c.id));
  const [newColumnId, setNewColumnId] = useState<string | null>(null);

  // Scroll to and edit new row when added
  useEffect(() => {
    if (gridApi && testCases.length > previousRowCount) {
      // New row was added, scroll to it and start editing
      const lastRowIndex = testCases.length - 1;
      
      // Ensure the grid has rendered the new row
      setTimeout(() => {
        gridApi.ensureIndexVisible(lastRowIndex, 'bottom');
        
        // Start editing the question cell of the new row
        setTimeout(() => {
          gridApi.setFocusedCell(lastRowIndex, 'question');
          gridApi.startEditingCell({
            rowIndex: lastRowIndex,
            colKey: 'question',
          });
        }, 100);
      }, 50);
    }
    setPreviousRowCount(testCases.length);
  }, [testCases.length, gridApi, previousRowCount]);

  // Detect new column added and scroll to it
  useEffect(() => {
    const currentColumnIds = customColumns.map(c => c.id);
    const newIds = currentColumnIds.filter(id => !previousColumnIds.includes(id));
    
    if (newIds.length > 0 && gridApi) {
      const newId = newIds[0]; // Get the first new column
      setNewColumnId(newId);
      
      // Scroll to the new column
      setTimeout(() => {
        const colKey = `customData.${customColumns.find(c => c.id === newId)?.field}`;
        if (colKey) {
          gridApi.ensureColumnVisible(colKey);
        }
      }, 100);
    }
    
    setPreviousColumnIds(currentColumnIds);
  }, [customColumns, gridApi, previousColumnIds]);

  const isExpanded = viewMode === 'expanded';

  // Clear newColumnId after auto-edit is triggered
  const handleAutoEditComplete = useCallback(() => {
    setNewColumnId(null);
  }, []);

  // Generate column definition for a custom column
  const getCustomColumnDef = useCallback((col: CustomColumn, isNewColumn: boolean = false): ColDef => {
    const baseColDef: ColDef = {
      headerName: col.name,
      field: `customData.${col.field}`,
      width: col.width || 200,
      minWidth: 150,
      editable: true,
      wrapText: isExpanded,
      autoHeight: isExpanded,
      headerComponent: () => (
        <CustomColumnHeader
          column={col}
          displayName={col.name}
          onRename={(newName) => onRenameColumn?.(col.id, newName)}
          onFilter={() => {}}
          onDuplicate={() => onDuplicateColumn?.(col.id)}
          onDelete={() => onDeleteColumn?.(col.id)}
          autoEdit={isNewColumn}
          onAutoEditComplete={handleAutoEditComplete}
        />
      ),
    };

    switch (col.type) {
      case 'multiselect':
        return {
          ...baseColDef,
          cellRenderer: MultiSelectCellRenderer,
          cellEditor: MultiSelectCellEditor,
          cellEditorParams: {
            options: col.options || [],
          },
          cellEditorPopup: true,
        };
      case 'markdown':
        return {
          ...baseColDef,
          cellRenderer: MarkdownCellRenderer,
          cellRendererParams: {
            isExpanded,
          },
          cellEditor: TextCellEditor,
          cellEditorParams: {
            maxLength: 2000,
            rows: 5,
          },
          cellEditorPopup: true,
        };
      case 'text':
      default:
        return {
          ...baseColDef,
          cellEditor: TextCellEditor,
          cellEditorParams: {
            maxLength: 1000,
            rows: 3,
          },
          cellEditorPopup: true,
          cellClass: 'editable-cell',
          cellStyle: isExpanded ? expandedCellStyle : truncateCellStyle,
        };
    }
  }, [isExpanded, onRenameColumn, onDuplicateColumn, onDeleteColumn, handleAutoEditComplete]);

  // Helper to apply pinned property based on frozenColumnIds
  const applyPinning = useCallback((colDef: ColDef): ColDef => {
    const fieldId = colDef.field || colDef.colId;
    if (fieldId && frozenColumnIds.includes(fieldId)) {
      return { ...colDef, pinned: 'left' as const };
    }
    return colDef;
  }, [frozenColumnIds]);

  // Column definitions - changes based on viewMode and frozen columns
  const columnDefs = useMemo<ColDef[]>(() => {
    const baseCols: ColDef[] = [
    {
      headerName: '',
      field: 'select',
      colId: 'select',
      width: 32,
      minWidth: 32,
      maxWidth: 32,
      pinned: 'left',
      lockPosition: true,
      suppressMovable: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellClass: 'checkbox-cell',
      headerClass: 'checkbox-header header-gray',
      resizable: false,
      sortable: false,
      filter: false,
    },
    applyPinning({
      headerName: 'Question',
      field: 'question',
      width: 300,
      minWidth: 200,
      editable: true,
      cellEditor: TextCellEditor,
      cellEditorParams: {
        maxLength: 1000,
        rows: 5,
      },
      cellEditorPopup: true,
      cellClass: 'editable-cell question-cell',
      headerClass: 'header-gray-dark',
      headerComponent: () => <ColumnHeader displayName="Question" iconType="text" />,
      cellRenderer: RowActionsRenderer,
      cellRendererParams: {
        onRunTest,
      },
      wrapText: isExpanded,
      autoHeight: isExpanded,
      cellStyle: isExpanded ? expandedCellStyle : truncateCellStyle,
      tooltipField: isExpanded ? undefined : 'question',
    }),
    applyPinning({
      headerName: 'Expected answer',
      field: 'expectedAnswer',
      width: 250,
      minWidth: 180,
      editable: true,
      cellEditor: TextCellEditor,
      cellEditorParams: {
        maxLength: 2000,
        rows: 5,
      },
      cellEditorPopup: true,
      cellClass: 'editable-cell expected-answer-cell',
      headerClass: 'header-gray-dark',
      headerComponent: () => <ColumnHeader displayName="Expected Answer" iconType="text" />,
      wrapText: isExpanded,
      autoHeight: isExpanded,
      cellStyle: isExpanded ? expandedCellStyle : truncateCellStyle,
      tooltipField: isExpanded ? undefined : 'expectedAnswer',
    }),
    applyPinning({
      headerName: 'Leading questions',
      field: 'leadingQuestions',
      width: 250,
      minWidth: 180,
      editable: true,
      cellEditor: TextCellEditor,
      cellEditorParams: {
        maxLength: 1000,
        rows: 3,
      },
      cellEditorPopup: true,
      cellClass: 'editable-cell leading-questions-cell',
      headerClass: 'header-gray',
      headerComponent: () => <ColumnHeader displayName="Leading Questions" iconType="text" />,
      wrapText: isExpanded,
      autoHeight: isExpanded,
      cellStyle: isExpanded ? expandedCellStyle : truncateCellStyle,
      tooltipField: isExpanded ? undefined : 'leadingQuestions',
    }),
    applyPinning({
      headerName: 'AI response',
      field: 'aiResponse',
      width: 300,
      minWidth: 200,
      editable: false,
      cellRenderer: AIResponseRenderer,
      cellRendererParams: {
        onFeedback,
        isExpanded,
      },
      cellClass: 'ai-response-cell',
      headerClass: 'header-blue',
      headerComponent: () => <ColumnHeader displayName="AI Response" iconType="ai" />,
      wrapText: isExpanded,
      autoHeight: isExpanded,
      tooltipValueGetter: isExpanded ? undefined : (params) => {
        const aiResponse = params.data?.aiResponse;
        return aiResponse?.content || 'No response yet';
      },
    }),
    applyPinning({
      headerName: 'Metrics',
      field: 'metrics',
      width: 160,
      minWidth: 130,
      editable: false,
      cellRenderer: MetricsRenderer,
      cellClass: 'metrics-cell',
      headerClass: 'header-blue',
      headerComponent: () => <ColumnHeader displayName="Metrics" iconType="metrics" />,
      sortable: true,
      comparator: (valueA, valueB) => {
        const accA = valueA?.accuracy ?? 0;
        const accB = valueB?.accuracy ?? 0;
        return accA - accB;
      },
    }),
    applyPinning({
      headerName: 'Status',
      field: '__status',
      colId: 'status',
      width: 180,
      minWidth: 150,
      editable: false,
      cellRenderer: StatusRenderer,
      cellRendererParams: {
        onViewFixes,
      },
      cellClass: 'status-cell',
      headerClass: 'header-blue',
      headerComponent: () => <ColumnHeader displayName="Status" iconType="status" />,
      sortable: true,
      comparator: (valueA, valueB, nodeA, nodeB) => {
        const statusA = nodeA?.data?.metrics?.status ?? '';
        const statusB = nodeB?.data?.metrics?.status ?? '';
        return statusA.localeCompare(statusB);
      },
    }),
    applyPinning({
      headerName: 'Notes',
      field: 'notes',
      width: 200,
      minWidth: 150,
      editable: true,
      cellEditor: TextCellEditor,
      cellEditorParams: {
        maxLength: 500,
        rows: 3,
      },
      cellEditorPopup: true,
      cellClass: 'editable-cell',
      headerClass: 'header-gray',
      headerComponent: () => <ColumnHeader displayName="Notes" iconType="notes" />,
      wrapText: isExpanded,
      autoHeight: isExpanded,
      cellStyle: isExpanded ? expandedCellStyle : truncateCellStyle,
      tooltipField: isExpanded ? undefined : 'notes',
    }),
    // Custom columns (with pinning support and auto-edit for new columns)
    ...customColumns.map(col => applyPinning(getCustomColumnDef(col, col.id === newColumnId))),
    // Add column button as the last column (pinned to right, header only)
    ...(onAddColumn ? [{
      headerName: '',
      field: '__addColumn',
      colId: 'addColumn',
      width: 32,
      minWidth: 32,
      maxWidth: 32,
      pinned: 'right' as const,
      lockPosition: true,
      resizable: false,
      sortable: false,
      filter: false,
      suppressMovable: true,
      headerClass: 'header-gray add-column-header',
      cellClass: 'add-column-cell',
      headerComponent: () => (
        <div className="flex items-center justify-center w-full h-full">
          <AddColumnDropdown onAddColumn={onAddColumn} />
        </div>
      ),
      cellRenderer: () => null,
    }] : []),
  ];
  return baseCols;
  }, [onRunTest, onFeedback, isExpanded, customColumns, getCustomColumnDef, onAddColumn, onViewFixes, applyPinning, newColumnId]);

  // Default column definition - changes based on viewMode
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: false,
    suppressMenu: false,
    wrapText: isExpanded,
    autoHeight: isExpanded,
  }), [isExpanded]);

  // Grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  // Cell value changed event
  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    const { data, colDef, newValue } = event;
    if (data && colDef.field) {
      onCellEdit(data.id, colDef.field, newValue);
    }
  }, [onCellEdit]);

  // Row drag end event
  const onRowDragEnd = useCallback((event: RowDragEndEvent) => {
    const { node, overIndex } = event;
    if (node.rowIndex !== null && overIndex !== null && node.rowIndex !== overIndex) {
      onRowReorder(node.rowIndex, overIndex);
    }
  }, [onRowReorder]);

  // Selection changed event
  const handleSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    onSelectionChange(selectedRows.map((row: TestCaseRow) => row.id));
  }, [onSelectionChange]);

  // Get row id for tracking
  const getRowId = useCallback((params: { data: TestCaseRow }) => params.data.id, []);

  // Row class rules for dynamic styling (reactive to data changes)
  const rowClassRules = useMemo(() => ({
    'row-running': (params: { data: TestCaseRow | undefined }) => params.data?.runStatus === 'running',
  }), []);

  // Cell clicked event - suppress edit when clicking on action buttons
  const onCellClicked = useCallback((event: CellClickedEvent) => {
    const target = event.event?.target as HTMLElement;
    // Check if click was on run test button or its children
    if (target?.closest('[data-action="run-test"]') || target?.closest('.play-button-wrapper')) {
      // Stop the grid from starting edit mode
      event.api.stopEditing(true);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <div
          className={cn(
            'ag-theme-alpine ag-theme-astra h-full',
            viewMode === 'compact' && 'compact-view'
          )}
        >
          <AgGridReact
          ref={gridRef}
          rowData={testCases}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          rowClassRules={rowClassRules}
          // Selection
          rowSelection="multiple"
          suppressRowClickSelection={true}
          // Editing - SINGLE CLICK TO EDIT (single cell, not full row)
          singleClickEdit={true}
          stopEditingWhenCellsLoseFocus={true}
          // Popup parent - render popups in document.body to escape overflow hidden
          popupParent={document.body}
          // Row dragging
          rowDragManaged={true}
          rowDragEntireRow={true}
          animateRows={true}
          // Performance
          rowBuffer={20}
          // Styling
          rowHeight={viewMode === 'compact' ? 36 : undefined}
          headerHeight={32}
          // Events
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          onRowDragEnd={onRowDragEnd}
          onSelectionChanged={handleSelectionChanged}
          onCellClicked={onCellClicked}
          // Tooltips - show full content on hover
          tooltipShowDelay={300}
          tooltipHideDelay={0}
          enableBrowserTooltips={false}
          // Suppress cell focus for better UX
          suppressCellFocus={false}
          // Enable browser default tab behavior
          suppressBrowserResizeObserver={false}
        />
        </div>
      </div>

      {/* Add row button at bottom */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddRow}
          className="text-gray-600 hover:text-gray-900"
        >
          <Plus className="w-4 h-4" />
          Add test case
        </Button>
      </div>
    </div>
  );
};

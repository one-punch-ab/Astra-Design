import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, GripVertical, Lock, Unlock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';

export interface ColumnConfig {
  id: string;
  name: string;
  visible: boolean;
  frozen: boolean;
  canFreeze: boolean; // Whether column can be frozen/unfrozen
  canHide: boolean; // Whether column can be hidden
  canDelete: boolean; // Whether column can be deleted (custom columns)
  isCustom: boolean; // Whether this is a custom column
}

interface ManageColumnsDropdownProps {
  columns: ColumnConfig[];
  onSave: (columns: ColumnConfig[]) => void;
  onClose: () => void;
  onDeleteColumn?: (columnId: string) => void;
}

export const ManageColumnsDropdown: React.FC<ManageColumnsDropdownProps> = ({
  columns: initialColumns,
  onSave,
  onClose,
  onDeleteColumn,
}) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sync with external changes
  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  // Filter columns based on search
  const filteredColumns = columns.filter(col =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newColumns = [...columns];
    const [draggedItem] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(dropIndex, 0, draggedItem);
    
    setColumns(newColumns);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Toggle column freeze
  const toggleFreeze = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId && col.canFreeze
        ? { ...col, frozen: !col.frozen }
        : col
    ));
  };

  // Delete column (for custom columns)
  const handleDeleteColumn = (columnId: string) => {
    if (onDeleteColumn) {
      onDeleteColumn(columnId);
    }
    // Remove from local state as well
    setColumns(prev => prev.filter(col => col.id !== columnId));
  };

  // Handle save
  const handleSave = () => {
    onSave(columns);
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Only show visible columns in the list
  const visibleFilteredColumns = filteredColumns.filter(col => col.visible);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div 
        className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-[320px]"
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <h3 className="text-sm font-semibold text-gray-900">Selected Columns</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Move any column to any position based on your priority.
          </p>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Column list */}
        <div className="max-h-[320px] overflow-y-auto px-2">
          {visibleFilteredColumns.map((column) => {
            const actualIndex = columns.findIndex(c => c.id === column.id);
            const isDragging = draggedIndex === actualIndex;
            const isDragOver = dragOverIndex === actualIndex;

            return (
              <div
                key={column.id}
                draggable
                onDragStart={(e) => handleDragStart(e, actualIndex)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, actualIndex)}
                onDrop={(e) => handleDrop(e, actualIndex)}
                className={cn(
                  'flex items-center gap-2 px-2 py-2.5 mx-1 rounded-md transition-colors',
                  'border border-transparent',
                  isDragging && 'opacity-50',
                  isDragOver && 'border-blue-400 bg-blue-50',
                  !isDragging && !isDragOver && 'hover:bg-gray-50'
                )}
              >
                {/* Drag handle */}
                <div className="cursor-grab text-gray-400">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Column name */}
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {column.name}
                </span>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  {/* Always-frozen indicator (non-interactive) */}
                  {column.frozen && !column.canFreeze && (
                    <div
                      className="p-1 text-gray-400"
                      title="This column is always frozen"
                    >
                      <Lock className="w-4 h-4" />
                    </div>
                  )}

                  {/* Freeze/Unfreeze button (interactive) */}
                  {column.canFreeze && (
                    <button
                      onClick={() => toggleFreeze(column.id)}
                      className={cn(
                        'p-1 rounded hover:bg-gray-100 transition-colors',
                        column.frozen ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                      )}
                      title={column.frozen ? 'Unfreeze column' : 'Freeze column'}
                    >
                      {column.frozen ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Delete button - shown for all columns, disabled for non-deletable */}
                  <button
                    onClick={() => column.canDelete && handleDeleteColumn(column.id)}
                    disabled={!column.canDelete}
                    className={cn(
                      'p-1 rounded transition-colors',
                      column.canDelete 
                        ? 'hover:bg-red-50 text-gray-400 hover:text-red-600 cursor-pointer' 
                        : 'text-gray-300 cursor-not-allowed'
                    )}
                    title={column.canDelete ? 'Delete column' : 'This column cannot be deleted'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {visibleFilteredColumns.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No columns found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex-1"
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

// Build columns config from table columns and custom columns
export const buildColumnsConfig = (customColumns: { id: string; name: string }[] = []): ColumnConfig[] => {
  // Base columns - order matches the table
  // Question is always frozen (pinned left), AI Response/Metrics/Status cannot be hidden/deleted
  const baseColumns: ColumnConfig[] = [
    { id: 'question', name: 'Question', visible: true, frozen: true, canFreeze: false, canHide: false, canDelete: false, isCustom: false },
    { id: 'expectedAnswer', name: 'Expected Answer', visible: true, frozen: false, canFreeze: true, canHide: true, canDelete: false, isCustom: false },
    { id: 'leadingQuestions', name: 'Leading Questions', visible: true, frozen: false, canFreeze: true, canHide: true, canDelete: false, isCustom: false },
    { id: 'aiResponse', name: 'AI Response', visible: true, frozen: false, canFreeze: true, canHide: false, canDelete: false, isCustom: false },
    { id: 'metrics', name: 'Metrics', visible: true, frozen: false, canFreeze: true, canHide: false, canDelete: false, isCustom: false },
    { id: 'status', name: 'Status', visible: true, frozen: false, canFreeze: true, canHide: false, canDelete: false, isCustom: false },
    { id: 'notes', name: 'Notes', visible: true, frozen: false, canFreeze: true, canHide: true, canDelete: true, isCustom: false },
  ];

  // Add custom columns
  const customColumnConfigs: ColumnConfig[] = customColumns.map(col => ({
    id: col.id,
    name: col.name,
    visible: true,
    frozen: false,
    canFreeze: true,
    canHide: true,
    canDelete: true,
    isCustom: true,
  }));

  return [...baseColumns, ...customColumnConfigs];
};

// Legacy export for backwards compatibility
export const getDefaultColumnsConfig = buildColumnsConfig;

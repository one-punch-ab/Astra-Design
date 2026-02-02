import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Filter, Copy, Trash2, ChevronDown, Type, List, FileText } from 'lucide-react';
import type { CustomColumn } from '@/types/test-cases.types';
import { ColumnFilterOverlay } from './ColumnFilterOverlay';

interface CustomColumnHeaderProps {
  column: CustomColumn;
  displayName: string;
  onRename: (newName: string) => void;
  onFilter: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  autoEdit?: boolean;
  onAutoEditComplete?: () => void;
}

export const CustomColumnHeader: React.FC<CustomColumnHeaderProps> = ({
  column,
  displayName,
  onRename,
  onFilter,
  onDuplicate,
  onDelete,
  autoEdit = false,
  onAutoEditComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(displayName);
  const [showMenu, setShowMenu] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Auto-edit when requested (for newly added columns)
  useEffect(() => {
    if (autoEdit && !isEditing) {
      setIsEditing(true);
      setEditValue(displayName);
      if (onAutoEditComplete) {
        onAutoEditComplete();
      }
    }
  }, [autoEdit, isEditing, displayName, onAutoEditComplete]);

  // Calculate menu position when opening
  useEffect(() => {
    if (showMenu && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: Math.max(8, rect.right - 160),
      });
    }
  }, [showMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(displayName);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== displayName) {
      onRename(editValue.trim());
    } else {
      setEditValue(displayName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(displayName);
    }
  };

  const getTypeIcon = () => {
    switch (column.type) {
      case 'text':
        return <Type className="w-3.5 h-3.5" />;
      case 'multiselect':
        return <List className="w-3.5 h-3.5" />;
      case 'markdown':
        return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const handleFilterClick = () => {
    setShowMenu(false);
    setShowFilter(true);
  };

  const handleDuplicateClick = () => {
    setShowMenu(false);
    onDuplicate();
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    onDelete();
  };

  return (
    <div ref={headerRef} className="flex items-center gap-1 w-full h-full px-2">
      {/* Type icon */}
      <span className="text-gray-400 flex-shrink-0">{getTypeIcon()}</span>

      {/* Column name */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 px-1 py-0.5 text-sm font-medium bg-white border border-blue-500 rounded outline-none"
        />
      ) : (
        <span
          className="flex-1 text-sm font-medium text-gray-700 truncate cursor-default"
          onDoubleClick={handleDoubleClick}
          title="Double-click to rename"
        >
          {displayName}
        </span>
      )}

      {/* Menu trigger */}
      <button
        ref={menuButtonRef}
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          'p-1 rounded hover:bg-gray-200 transition-colors',
          showMenu && 'bg-gray-200'
        )}
      >
        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
      </button>

      {/* Dropdown menu - rendered via portal */}
      {showMenu && createPortal(
        <div 
          ref={menuRef}
          className="fixed py-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px]"
          style={{ 
            zIndex: 9999,
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            onClick={handleFilterClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            Filter
          </button>
          <button
            onClick={handleDuplicateClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-500" />
            Duplicate
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={handleDeleteClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>,
        document.body
      )}

      {/* Filter overlay */}
      {showFilter && (
        <ColumnFilterOverlay
          column={column}
          anchorEl={headerRef.current}
          onClose={() => setShowFilter(false)}
          onSave={(filters) => {
            console.log('Filters saved:', filters);
            // TODO: Apply filters
          }}
        />
      )}
    </div>
  );
};

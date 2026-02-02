import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, MoreVertical, Pencil, Copy, Trash2, X, Check } from 'lucide-react';
import type { Worksheet } from '@/types/test-cases.types';

interface WorksheetTabsProps {
  worksheets: Worksheet[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WorksheetTabs: React.FC<WorksheetTabsProps> = ({
  worksheets,
  activeId,
  onSelect,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartEdit = (ws: Worksheet) => {
    setEditingId(ws.id);
    setEditValue(ws.name);
    setMenuOpenId(null);
  };

  const handleConfirmEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirmEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDeleteClick = (id: string) => {
    // Don't allow deleting the last worksheet
    if (worksheets.length <= 1) return;
    onDelete(id);
    setMenuOpenId(null);
  };

  return (
    <div className="bg-gray-100 rounded-md p-1 flex items-center">
      {worksheets.map((ws) => {
        const isActive = ws.id === activeId;
        const isEditing = ws.id === editingId;
        const isMenuOpen = ws.id === menuOpenId;

        return (
          <button
            key={ws.id}
            className={cn(
              'relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
              'text-xs font-semibold',
              isActive
                ? 'bg-white border border-gray-300 text-gray-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            )}
            onClick={() => !isEditing && onSelect(ws.id)}
          >
            {isEditing ? (
              <div className="flex items-center gap-1 w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleConfirmEdit}
                  className="flex-1 px-1 py-0.5 text-sm border border-astra-primary rounded outline-none min-w-0"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmEdit();
                  }}
                  className="p-0.5 text-success hover:bg-success-light rounded"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  className="p-0.5 text-gray-400 hover:bg-gray-100 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <span className="truncate">{ws.name} ({ws.testCases.length})</span>
                
                {/* Menu trigger - only show on active tab */}
                {isActive && (
                  <div className="relative" ref={isMenuOpen ? menuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(isMenuOpen ? null : ws.id);
                      }}
                      className="p-0.5 rounded hover:bg-gray-200"
                    >
                      <MoreVertical className="w-3 h-3 text-gray-500" />
                    </button>

                    {/* Dropdown menu */}
                    {isMenuOpen && (
                      <div className="absolute top-full left-0 mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-astra-md z-50 min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(ws);
                          }}
                          className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50"
                        >
                          <Pencil className="w-4 h-4 text-gray-400" />
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(ws.id);
                            setMenuOpenId(null);
                          }}
                          className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                          Duplicate
                        </button>
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(ws.id);
                          }}
                          disabled={worksheets.length <= 1}
                          className={cn(
                            'w-full px-3 py-2 text-sm text-left flex items-center gap-2',
                            worksheets.length <= 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-error hover:bg-error-light'
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </button>
        );
      })}

      {/* Add new worksheet button */}
      <button
        onClick={onCreate}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-gray-600',
          'hover:bg-gray-200 rounded-md transition-colors'
        )}
      >
        <span className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-400">
          <Plus className="w-3 h-3" />
        </span>
        Add
      </button>
    </div>
  );
};

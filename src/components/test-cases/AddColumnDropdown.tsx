import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Type, List, FileText, Plus } from 'lucide-react';
import type { ColumnType } from '@/types/test-cases.types';

interface AddColumnDropdownProps {
  onAddColumn: (type: ColumnType) => void;
}

const columnTypes: { value: ColumnType; label: string; icon: React.ReactNode }[] = [
  {
    value: 'text',
    label: 'Text',
    icon: <Type className="w-4 h-4" />,
  },
  {
    value: 'multiselect',
    label: 'Multi-select',
    icon: <List className="w-4 h-4" />,
  },
  {
    value: 'markdown',
    label: 'Markdown',
    icon: <FileText className="w-4 h-4" />,
  },
];

export const AddColumnDropdown: React.FC<AddColumnDropdownProps> = ({
  onAddColumn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: Math.max(8, rect.right - 160), // Align right edge, with min 8px from left
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectType = (type: ColumnType) => {
    onAddColumn(type);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-center text-[#4f4f4f] hover:text-gray-600 hover:bg-gray-100 transition-colors"
        title="Add column"
      >
        <Plus className="w-4 h-4" />
      </button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed py-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px]"
          style={{ 
            zIndex: 9999,
            top: position.top,
            left: position.left,
          }}
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Add column
          </div>
          {columnTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleSelectType(type.value)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-500">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

import React from 'react';
import { Type, Sparkles, BarChart2, CheckCircle2, FileText } from 'lucide-react';

export type ColumnIconType = 'text' | 'ai' | 'metrics' | 'status' | 'notes';

interface ColumnHeaderProps {
  displayName: string;
  iconType?: ColumnIconType;
}

const iconMap: Record<ColumnIconType, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  ai: <Sparkles className="w-4 h-4" />,
  metrics: <BarChart2 className="w-4 h-4" />,
  status: <CheckCircle2 className="w-4 h-4" />,
  notes: <FileText className="w-4 h-4" />,
};

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  displayName,
  iconType = 'text',
}) => {
  return (
    <div className="flex items-center gap-2 w-full h-full">
      <span className="text-[#71717a] flex-shrink-0">
        {iconMap[iconType]}
      </span>
      <span className="text-xs font-semibold text-[#71717a] uppercase truncate">
        {displayName}
      </span>
    </div>
  );
};

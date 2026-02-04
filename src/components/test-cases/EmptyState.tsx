import React from 'react';
import { Upload, Sparkles, Pencil, FlaskConical } from 'lucide-react';

interface EmptyStateProps {
  onUploadCSV: () => void;
  onAutoGenerate: () => void;
  onManualAdd: () => void;
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  iconBgClassName?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  iconBgClassName = 'bg-gray-100',
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-astra-card shadow-astra hover:shadow-astra-md hover:border-gray-300 hover:bg-blue-50 transition-all w-[320px] text-left cursor-pointer"
    >
      {/* Icon */}
      <div className={`w-10 h-10 ${iconBgClassName} rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      
      {/* Content */}
      <div className="flex flex-col">
        {/* Title */}
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        
        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
    </button>
  );
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  onUploadCSV,
  onAutoGenerate,
  onManualAdd,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-10">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 border border-blue-300 rounded-xl flex items-center justify-center mb-6">
          <FlaskConical className="w-8 h-8 text-astra-primary-hover" />
        </div>
        
        {/* Headline */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Test hundreds of scenarios in one go
        </h2>
        
        {/* Description */}
        <p className="text-base text-gray-500 max-w-lg leading-relaxed">
          Upload all your questions or let AI generate them. Run bulk tests, catch issues early, 
          and get your agent live faster.
        </p>
      </div>

      {/* Action Cards */}
      <div className="flex flex-row gap-4 items-stretch">
        {/* Auto Generate Card */}
        <ActionCard
          icon={<Sparkles className="w-5 h-5" style={{ color: 'var(--astra-primary-light)' }} />}
          title="Auto generate"
          description="Generate test cases automatically based on your knowledge base."
          onClick={onAutoGenerate}
          iconBgClassName="bg-blue-600"
        />

        {/* Add Manually Card */}
        <ActionCard
          icon={<Pencil className="w-5 h-5" style={{ color: 'var(--astra-primary-light)' }} />}
          title="Add manually"
          description="Add test cases one by one with questions and expected answers."
          onClick={onManualAdd}
          iconBgClassName="bg-blue-600"
        />

        {/* Upload CSV Card */}
        <ActionCard
          icon={<Upload className="w-5 h-5" style={{ color: 'var(--astra-primary-light)' }} />}
          title="Upload CSV file"
          description="Import multiple test cases at once by uploading a CSV file."
          onClick={onUploadCSV}
          iconBgClassName="bg-blue-600"
        />
      </div>
    </div>
  );
};

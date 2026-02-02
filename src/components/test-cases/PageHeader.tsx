import React from 'react';
import { Crosshair, Hourglass, BarChart3 } from 'lucide-react';

interface MetricTag {
  label: string;
  value: string | number;
  variant: 'warning' | 'success' | 'error' | 'info';
  icon?: 'efficiency' | 'accuracy' | 'latency';
}

interface PageHeaderProps {
  title: string;
  metrics?: MetricTag[];
  isLoading?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title = 'Test cases',
  metrics,
  isLoading = false,
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Title */}
      <h1 className="text-base font-semibold text-gray-900">
        {title}
      </h1>

      {/* Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Metrics</span>
          <div className="flex items-center gap-2">
            {isLoading ? (
              // Loading skeletons with matching metric colors
              <>
                <MetricSkeleton variant="warning" icon="efficiency" />
                <MetricSkeleton variant="success" icon="accuracy" />
                <MetricSkeleton variant="info" icon="latency" />
              </>
            ) : (
              metrics.map((metric, index) => (
                <MetricBadge key={index} {...metric} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Loading skeleton for metrics with colored variants
interface MetricSkeletonProps {
  variant: 'warning' | 'success' | 'error' | 'info';
  icon: 'efficiency' | 'accuracy' | 'latency';
}

const MetricSkeleton: React.FC<MetricSkeletonProps> = ({ variant, icon }) => {
  const variantStyles = {
    warning: {
      container: 'bg-yellow-50 border-yellow-400',
      pulse: 'bg-yellow-200',
      icon: 'text-yellow-400',
    },
    success: {
      container: 'bg-teal-50 border-teal-500',
      pulse: 'bg-teal-200',
      icon: 'text-teal-400',
    },
    error: {
      container: 'bg-red-50 border-red-400',
      pulse: 'bg-red-200',
      icon: 'text-red-400',
    },
    info: {
      container: 'bg-blue-50 border-blue-400',
      pulse: 'bg-blue-200',
      icon: 'text-blue-400',
    },
  };

  const styles = variantStyles[variant];

  const IconComponent = () => {
    switch (icon) {
      case 'efficiency':
        return <BarChart3 className={`w-3.5 h-3.5 ${styles.icon}`} />;
      case 'accuracy':
        return <Crosshair className={`w-3.5 h-3.5 ${styles.icon}`} />;
      case 'latency':
        return <Hourglass className={`w-3.5 h-3.5 ${styles.icon}`} />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${styles.container}`}>
      <IconComponent />
      <div className={`w-20 h-3.5 ${styles.pulse} rounded animate-pulse`} />
    </div>
  );
};

const MetricBadge: React.FC<MetricTag> = ({ label, value, variant, icon }) => {
  const variantStyles = {
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
    success: 'bg-teal-50 border-teal-500 text-teal-700',
    error: 'bg-red-50 border-red-400 text-red-700',
    info: 'bg-blue-50 border-blue-400 text-blue-700',
  };

  const IconComponent = () => {
    switch (icon) {
      case 'efficiency':
        return <BarChart3 className="w-3.5 h-3.5" />;
      case 'accuracy':
        return <Crosshair className="w-3.5 h-3.5" />;
      case 'latency':
        return <Hourglass className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${variantStyles[variant]}`}>
      <IconComponent />
      <span>{label} – {value}</span>
    </div>
  );
};

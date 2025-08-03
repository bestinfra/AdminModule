import React from 'react';

interface SummaryItem {
  label: string;
  value: string | React.ReactNode;
}

interface SummaryInfoProps {
  title: string;
  status?: {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  };
  rightStatus?: {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
    onClick?: () => void;
  };
  data: {
    leftColumn: SummaryItem[];
    rightColumn: SummaryItem[];
  };
  className?: string;
  titleClassName?: string;
}

const SummaryInfo: React.FC<SummaryInfoProps> = ({
  title,
  status,
  rightStatus,
  data = { leftColumn: [], rightColumn: [] },
  className = '',
  titleClassName = ''
}) => {
  const getStatusVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-secondary-light text-secondary';
      case 'warning':
        return 'bg-warning-light text-warning';
      case 'error':
        return 'bg-warning-light text-danger';
      case 'info':
        return 'bg-accent-light text-accent';
      default:
        return 'bg-primary-light text-text-primary';
    }
  };

  const getRightStatusStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-secondary text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'info':
        return 'bg-accent text-white';
      default:
        return 'bg-warning-light text-warning';
    }
  };



  return (
    <section className={`rounded-lg  p-6 flex flex-col gap-4 ${className} w-full`}>
      {/* Header */}
      <header className="flex justify-between items-start gap-4">
        <div className="flex items-center space-x-4">
          <h3 className={`text-md font-bold text-gray-900 ${titleClassName}`}>{title}</h3>
          {status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusVariantStyles(
                status.variant || 'default'
              )}`}
            >
              {status.text}
            </span>
          )}
        </div>
        {rightStatus && (
          <span
            onClick={rightStatus.onClick}
            className={`px-2 py-1 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm ${getRightStatusStyles(
              rightStatus.variant || 'default'
            )}`}
          >
            {rightStatus.text}
          </span>
        )}
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {data?.leftColumn?.map((item, index) => (
            <article key={index} className="flex flex-col space-y-1">
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-600">{item.value}</span>
            </article>
          )) || []}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {data?.rightColumn?.map((item, index) => (
            <article key={index} className="flex flex-col space-y-1">
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-600">{item.value}</span>
            </article>
          )) || []}
        </div>
      </div>
    </section>
  );
};

export default SummaryInfo;

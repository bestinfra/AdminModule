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
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRightStatusStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500  text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500  text-white';
      default:
        return 'bg-amber-500  text-white';
    }
  };

  const renderSummaryItem = (item: SummaryItem, index: number) => (
    <div key={index} className="flex flex-col space-y-1">
      <span className="text-sm font-semibold text-gray-700">{item.label}</span>
      <span className="text-sm text-gray-600">{item.value}</span>
    </div>
  );

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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm ${getRightStatusStyles(
              rightStatus.variant || 'default'
            )}`}
          >
            {rightStatus.text}
          </span>
        )}
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

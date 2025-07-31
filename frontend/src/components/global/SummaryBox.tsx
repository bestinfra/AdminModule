import React from 'react';

interface SummaryItem {
  label: string;
  value: string | React.ReactNode;
}

interface SummaryBoxProps {
  title: string;
  status?: {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  };
  data: {
    leftColumn: SummaryItem[];
    rightColumn: SummaryItem[];
  };
  className?: string;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({
  title,
  status,
  data,
  className = ''
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

  const renderSummaryItem = (item: SummaryItem, index: number) => (
    <div key={index} className="flex flex-col space-y-1">
      <span className="text-sm font-semibold text-gray-700">{item.label}</span>
      <span className="text-sm text-gray-600">{item.value}</span>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
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

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {data.leftColumn.map((item, index) => renderSummaryItem(item, index))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {data.rightColumn.map((item, index) => renderSummaryItem(item, index))}
        </div>
      </div>
    </div>
  );
};

export default SummaryBox;

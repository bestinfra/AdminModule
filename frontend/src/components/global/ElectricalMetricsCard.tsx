import React from 'react';

export interface ElectricalMetric {
  label: string;
  value: string;
  unit?: string;
  status: 'good' | 'warning' | 'critical' | 'neutral';
  color?: string;
}

export interface ElectricalMetricsCardProps {
  metrics: ElectricalMetric[];
  className?: string;
  title?: string;
}

const ElectricalMetricsCard: React.FC<ElectricalMetricsCardProps> = ({
  metrics,
  className = '',
  title
}) => {
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-secondary'; // Green
      case 'warning':
        return 'bg-warning'; // Orange
      case 'critical':
        return 'bg-danger'; // Red
      case 'neutral':
      default:
        return 'bg-grey'; // Grey
    }
  };

  const getTextColorClass = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-secondary'; // Green
      case 'warning':
        return 'text-warning'; // Orange
      case 'critical':
        return 'text-danger'; // Red
      case 'neutral':
      default:
        return 'text-grey'; // Grey
    }
  };



    return (
    <section className={`rounded-xl border border-primary-border px-4 py-2 ${className}`}>
      {title && (
        <header>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        </header>
      )}
      
      <article className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
        {metrics.map((metric, index) => (
          <article
            key={index}
                className="bg-white rounded-3xl px-4 py-2 border border-primary-border hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColorClass(metric.status)}`}
                  role="status"
                  aria-label={`Status: ${metric.status}`}
                />
                <span className="text-sm font-medium text-gray-600">
                  {metric.label}
                </span>
              </div>
              
              <div className="text-right">
                <span
                  className={`text-sm font-bold ${getTextColorClass(metric.status)}`}
                >
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-sm text-gray-500 ml-1">
                    {metric.unit}
                  </span>
                )}
              </div>
            </div>          
          </article>
        ))}
      </article>
    </section>
  );
};

export default ElectricalMetricsCard;

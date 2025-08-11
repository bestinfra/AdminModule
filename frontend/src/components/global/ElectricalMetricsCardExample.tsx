import React from 'react';
import ElectricalMetricsCard, { ElectricalMetric } from './ElectricalMetricsCard';

const ElectricalMetricsCardExample: React.FC = () => {
  // Example data for electrical metrics
  const exampleMetrics: ElectricalMetric[] = [
    {
      label: 'PF Avg',
      value: '0.90',
      status: 'good',
      color: 'var(--color-secondary)' // Green
    },
    {
      label: 'Freq',
      value: '50.1',
      unit: 'Hz',
      status: 'good',
      color: 'var(--color-primary)' // Blue
    },
    {
      label: 'V Imbalance',
      value: '0.7',
      unit: '%',
      status: 'neutral',
      color: 'var(--color-grey)' // Grey
    }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ElectricalMetricsCard Example
      </h2>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Basic usage */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Usage</h3>
          <ElectricalMetricsCard 
            metrics={exampleMetrics}
            title="Electrical System Metrics"
          />
        </div>

        {/* Without title */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Without Title</h3>
          <ElectricalMetricsCard 
            metrics={exampleMetrics}
            className="bg-gradient-to-r from-blue-50 to-indigo-50"
          />
        </div>

        {/* Custom styling */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Custom Styling</h3>
          <ElectricalMetricsCard 
            metrics={exampleMetrics}
            title="Custom Styled Metrics"
            className="shadow-lg border-2 border-blue-200"
          />
        </div>
      </div>
    </div>
  );
};

export default ElectricalMetricsCardExample;

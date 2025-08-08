import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Page from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';

interface InfoCardProps {
  title: string;
  value: string;
  sub?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, sub }) => (
<div className="bg-white p-4 rounded-xl shadow-sm w-full">
    <div className="text-sm font-medium text-gray-800 mb-2">{title}</div>
    <div className="text-2xl font-semibold text-blue-800">{value}</div>
    {sub && <div className="text-sm text-gray-600 mt-1">{sub}</div>}
  </div>
);

const FinalUsageSummary: React.FC = () => {
  const navigate = useNavigate();

  const headerComponent = useMemo(() => (
    <PageHeader
      title="Final Usage Summary"
      backButtonText="Back to Final Usage Summary"
      onBackClick={() => navigate('/admin')}

    />
  ), [navigate]);

  const sections = useMemo(() => [
    {
      id: 'summary-cards',
      component: (
        <>
          {/* Meter Reading Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center max-w-3xl mx-auto mb-4">
            <InfoCard
              title="Previous Meter Reading"
              value="195.21 kWh"
              sub="31/07/2025, 11:30:02 am"
            />
            <InfoCard
              title="Final / Last Meter Reading"
              value="202.62 kWh"
              sub="04/08/2025, 12:15:09 am"
            />
            <InfoCard
              title="Electricity Usage"
              value="7.41 kWh"
            />
            <InfoCard
              title="Electricity Charges"
              value="₹57.67"
            />
          </div>

          {/* Advanced / Other / Total Amount Summary */}
          <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
            {/* Advanced Amount Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-800">Advanced Amount</span>
                <span className="text-blue-600 text-lg font-bold">+</span>
              </div>
              <span className="text-base font-semibold text-blue-800">₹0.00</span>
            </div>

            {/* Other Charges Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-800">Other Charges</span>
                <span className="text-blue-600 text-lg font-bold">+</span>
              </div>
              <span className="text-base font-semibold text-blue-800">₹0.00</span>
            </div>

            {/* Total Amount Row */}
                     <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">

              <span className="text-base font-semibold text-gray-900">Total Amount</span>
              <span className="text-base font-bold text-green-700">₹56.42</span>
            </div>
            </div>
</div>
          
        </>

      )
    }
  ], []);

  return (
    <Page
      layout="single-column"
      header={headerComponent}
      sections={sections}
      className="p-4"
    />
  );
};

export default FinalUsageSummary;

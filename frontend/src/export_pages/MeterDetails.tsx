import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const Page = lazy(() => import('SuperAdmin/Page'));
import Table from '@components/global/Table';

const summaryCards = [
  {
    title: 'Current Reading',
    value: '12950.11 kWh',
    icon: '/icons/reading.svg',
    subtitle1: 'Last Reading: 12790.97 kWh Consumption: 159.14 kWh',
    subtitle2: '',
  },
  {
    title: 'Status',
    value: 'Active',
    icon: '/icons/status.svg',
    subtitle1: 'Last Communication: 23/07/2025 01:00 pm',
    subtitle2: '',
  },
  {
    title: 'Meter Type',
    value: 'Prepaid',
    icon: '/icons/meter-type.svg',
    subtitle1: 'Phase Type: null',
    subtitle2: '',
  },
  {
    title: 'Location',
    value: '',
    icon: '/icons/location.svg',
    subtitle1: 'Installation Date: N/A',
    subtitle2: '',
  },
];

const meterInfo = [
  { label: 'Meter SI No.', value: 'A9345417' },
  { label: 'Modem SI No', value: 'RFDCU_DCU101' },
  { label: 'UID', value: 'BI25GMRA002' },
  { label: 'Assigned To', value: 'Neo Travels' },
  { label: 'Meter Make', value: 'N/A' },
  { label: 'Meter CT Ratio', value: 'N/A' },
  { label: 'Meter PT Ratio', value: 'N/A' },
  { label: 'External CT Ratio', value: 'N/A' },
  { label: 'External PT Ratio', value: 'N/A' },
  { label: 'Multiplication Factor', value: 'N/A' },
];

const historyColumns = [
  { key: 'consumerName', label: 'Consumer Name' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'paymentStatus', label: 'Payment Status' },
  { key: 'status', label: 'Status' },
];

const historyData = [
  { consumerName: 'John Doe', startDate: '2023-01-01', endDate: '2023-06-30', paymentStatus: 'Completed', status: 'Completed' },
  { consumerName: 'Jane Smith', startDate: '2023-07-01', endDate: '2023-12-31', paymentStatus: 'Overdue', status: 'Completed' },
  { consumerName: 'Current Consumer', startDate: '2024-01-01', endDate: 'Present', paymentStatus: 'Pending', status: 'Active' },
];

const MeterDetails: React.FC = () => {
  const { meterId } = useParams();
  const navigate = useNavigate();
  const info = meterInfo.map((item) =>
    item.label === 'Meter SI No.' ? { ...item, value: meterId || 'A9345417' } : item
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen">
      <Page
        sections={[
          {
            layout: {
              type: 'column',
              gap: 'gap-6',
            },
            components: [
              {
                name: 'PageHeader',
                props: {
                  title: 'Meter Details',
                  onBackClick: () => navigate('/meters'),
                  backButtonText: 'Back to Meters',
                },
              },
            ],
          },
          {
            layout: {
              type: 'grid',
              columns: 4,
              gap: 'gap-4',
            },
            components: summaryCards.map((cardData) => ({
              name: 'Card',
              props: {
                ...cardData,
                icon: cardData.icon || '/icons/default.svg',
              },
            })),
          },
        ]}
      />
      
      {/* Custom sections outside of PageC */}
      <div className="mt-6 space-y-6">
        {/* Meter Information Section */}
        <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-neutral-darker mb-4">Meter Information</h2>
          <div className="grid grid-cols-5 gap-4">
            {info.map((infoItem, index) => (
              <div key={index} className="mb-2">
                <div className="text-neutral text-sm mb-1">{infoItem.label}</div>
                <div className="text-base font-semibold text-neutral-darker">{infoItem.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Meter History Section */}
        <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl p-4">
          <h2 className="text-xl font-semibold text-neutral-darker mb-4">Meter History</h2>
          <div className="bg-white dark:bg-primary-dark">
            <div className="p-4">
              <Table
                data={historyData}
                columns={historyColumns}
                loading={false}
                searchable={true}
                pagination={true}
                showActions={false}
                className="[&_.relative]:mt-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </Suspense>
  );
};

export default MeterDetails; 
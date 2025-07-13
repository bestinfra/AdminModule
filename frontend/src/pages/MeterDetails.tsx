import React from 'react';
import Card from '../components/global/Card';
import Table from '../components/global/Table';
import { useParams, useNavigate } from 'react-router-dom';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import PageHeader from '../components/global/PageHeader';

const summaryCards = [
  {
    title: 'Current Reading',
    value: '10535 kWh',
    icon: '/icons/reading.svg',
    subtitle1: 'Last Reading: 10376.69 kWh Consumption: 158.31 kWh',
    subtitle2: '',
  },
  {
    title: 'Status',
    value: 'Active',
    icon: '/icons/status.svg',
    subtitle1: 'Last Communication: 08/07/2025 05:30 pm',
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
  { label: 'Meter SI No.', value: '' },
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
  const { meterSlNo } = useParams();
  const navigate = useNavigate();
  const info = meterInfo.map((item) =>
    item.label === 'Meter SI No.' ? { ...item, value: meterSlNo || '' } : item
  );

  // Page Header component
  const pageHeader = (
    <PageHeader
      title="Meter Details"
      onBackClick={() => navigate('/meters')}
      backButtonText="Back to Meters"
    />
  );

  // Summary Cards Section
  const summaryCardsSection: Section = {
    id: 'summary-cards',
    component: (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <Card key={idx} {...card}  />
        ))}
      </div>
    )
  };

  // Meter Information Section
  const meterInfoSection: Section = {
    id: 'meter-info',
    component: (
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <div className="text-xl font-semibold mb-4">Meter Information</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {info.map((info, idx) => (
            <div key={idx} className="mb-2">
              <div className="text-gray-500 text-sm">{info.label}</div>
              <div className="text-base font-semibold">{info.value}</div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  // Meter History Section
  const meterHistorySection: Section = {
    id: 'meter-history',
    component: (
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <div className="text-xl font-semibold mb-4">Meter History</div>
        <div className="mb-4 flex items-center"></div>
        <Table columns={historyColumns} data={historyData} pagination={false} searchable={false} />
      </div>
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[summaryCardsSection, meterInfoSection, meterHistorySection]}
      header={pageHeader}
      className=""
    />
  );
};

export default MeterDetails; 
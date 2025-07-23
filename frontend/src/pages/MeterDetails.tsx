import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Page from '@components/global/PageC';

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
    <div className="p-2 min-h-screen">
      <Page
        sections={[
          {
            layout: {
              type: 'column',
              gap: 'gap-6',
              rows: [
                {
                  layout: 'row',
                  columns: [
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
              ],
            },
          },
          {
            layout: {
              type: 'column',
              gap: 'gap-6',
              rows: [
                {
                  layout: 'grid',
                  gridColumns: 4,
                  gap: 'gap-4',
                  columns: summaryCards.map((cardData) => ({
                    name: 'Card',
                    props: cardData,
                  })),
                },
              ],
            },
          },
          {
            layout: {
              type: 'column',
              gap: 'gap-6',
              rows: [
                {
                  layout: 'row',
                  bg: 'bg-white rounded-2xl shadow p-6 border border-neutral-light',
                  columns: [
                    {
                      name: 'Heading',
                      props: {
                        text: 'Meter Information',
                        level: 2,
                        size: 'lg',
                        variant: 'primary',
                        weight: 'bold',
                        align: 'left',
                      },
                    },
                  ],
                },
                {
                  layout: 'grid',
                  gridColumns: 2,
                  gap: 'gap-8',
                  columns: info.map((infoItem) => ({
                    name: 'Holder',
                    props: {
                      children: (
                        <div className="mb-4">
                          <div className="text-neutral text-sm mb-1">{infoItem.label}</div>
                          <div className="text-base font-semibold text-neutral-darker">{infoItem.value}</div>
                        </div>
                      ),
                    },
                  })),
                },
              ],
            },
          },
          {
            layout: {
              type: 'column',
              gap: 'gap-6',
              rows: [
                {
                  layout: 'row',
                  bg: 'bg-white rounded-2xl shadow p-6 border border-neutral-light',
                  columns: [
                    {
                      name: 'Heading',
                      props: {
                        text: 'Meter History',
                        level: 2,
                        size: 'lg',
                        variant: 'primary',
                        weight: 'bold',
                        align: 'left',
                      },
                    },
                  ],
                },
                {
                  layout: 'row',
                  columns: [
                    {
                      name: 'Table',
                      props: {
                        columns: historyColumns,
                        data: historyData,
                        pagination: false,
                        searchable: false,
                      },
                    },
                  ],
                },
              ],
            },
          },
        ]}
      />
    </div>
  );
};

export default MeterDetails; 
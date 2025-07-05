import React, { useState } from 'react';
import Card from '../components/global/Card';
import Button from '../components/global/Button';
import TimeRangeSelector from '../components/global/TimeRangeSelector';
import Table from '../components/global/Table';
import type { Column } from '../components/global/Table';

const cardData = [
  {
    title: 'Cummulative Current Balance',
    value: '-₹55,163.58',
    icon: '/icons/wallet.svg',
    subtitle1: 'Across 4 Consumers',
  },
  {
    title: 'Low Balance Consumers',
    value: '3',
    icon: '/icons/low-balance.svg',
    subtitle1: 'Consumers Below ₹100',
  },
  {
    title: 'Adhoc Credit Issued',
    value: '₹0',
    icon: '/icons/credit-issued.svg',
    subtitle1: '₹0.00 Issued to 12 Consumers',
  },
  {
    title: 'Adhoc Credit Recovered',
    value: '₹0',
    icon: '/icons/credit-recovered.svg',
    subtitle1: '₹0.00 Remaining',
  },
];

const rechargeData = [
  {
    title: 'Total Recharge Collection',
    value: '₹0.00',
    icon: '/icons/total-recharge-collection.svg',
    previousValue: 'vs. ₹0.00 Yesterday',
    subtitle2: '0 Recharges Processed',
  },
  {
    title: 'Total Units Consumed',
    value: '51.07 kWh',
    icon: '/icons/units-consumed.svg',
    previousValue: 'vs. 181.96 kWh Yesterday',
    subtitle2: 'Consumed from 4 Meters',
  },
  {
    title: 'Total Amount Deducted',
    value: '₹2,201.80',
    icon: '/icons/total-amount-deducted.svg',
    previousValue: 'vs. ₹2,249.52 Yesterday',
    subtitle2: 'Deducted from 4 Consumers',
  },
  {
    title: 'No.of Transactions',
    value: '0',
    icon: '/icons/transactions.svg',
    previousValue: 'vs. 0 Yesterday',
    subtitle2: 'Transactions From 0 Consumers',
  },
  {
    title: 'Alerts Triggered',
    value: '0',
    icon: '/icons/alerts.svg',
    previousValue: 'vs. 0 Yesterday',
    subtitle2: '0 sent Today',
  },
  {
    title: 'Auto Disconnects Triggered',
    value: '0',
    icon: '/icons/disconnect.svg',
    previousValue: 'vs. Yesterday Yesterday',
    subtitle2: '0 Consumer Today',
  },
];

const tableColumns: Column[] = [
  { key: 'sNo', label: 'S.No' },
  { key: 'consumer', label: 'Consumer' },
  { key: 'transactionId', label: 'Transaction ID' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const tableData = [
  { sNo: 1, consumer: 'Airborne General Store', transactionId: 'TXN12345', amount: '₹1,000.00', date: '2025-07-05', status: 'Success' },
  { sNo: 2, consumer: 'Neo Travels', transactionId: 'TXN12346', amount: '₹2,000.00', date: '2025-07-05', status: 'Success' },
  { sNo: 3, consumer: 'Dormitory', transactionId: 'TXN12347', amount: '₹500.00', date: '2025-07-05', status: 'Failed' },
  { sNo: 4, consumer: 'Mobikins', transactionId: 'TXN12348', amount: '₹1,500.00', date: '2025-07-05', status: 'Success' },
];

const BillsPrepaid: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Daily');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Prepaid Overview</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">Last Updated on 05/07/2025, 04:23 pm</span>
          <Button label="Generate Report" variant="primary" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recharge & Usage(Today)</h2>
        <TimeRangeSelector
          availableTimeRanges={['Daily', 'Monthly']}
          selectedTimeRange={selectedTimeRange}
          handleTimeRangeChange={setSelectedTimeRange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {rechargeData.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>
      <div className="mt-8">
        <Table
          data={tableData}
          columns={tableColumns}
          pagination
          searchable
          emptyMessage="No transactions found"
        />
      </div>
    </div>
  );
};

export default BillsPrepaid; 
import React, { useState } from 'react';
import Card from '../components/global/Card';
import Button from '../components/global/Button';
import Table from '../components/global/Table';
import type { Column } from '../components/global/Table';
import Dropdown from '../components/global/Dropdown';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import { 
    createHeaderComponent, 
    createActionsComponent, 
    createFooterComponent
} from '../components/global/PageComponents';

const cardData = [
  {
    title: 'Total Bill Amount',
    value: '₹0.00',
    icon: '/icons/total-recharge-collection.svg',
    subtitle2: '0 Total Bills Generated',
  },
  {
    title: 'Outstanding Amount',
    value: '₹0.00',
    icon: '/icons/wallet.svg',
    subtitle2: '0 Pending Bills',
  },
  {
    title: 'Overdue Amount',
    value: '₹0.00',
    icon: '/icons/credit-issued.svg',
    subtitle2: '0 Overdue Bills',
  },
  {
    title: 'Total Amount Paid',
    value: '₹0.00',
    icon: '/icons/paid.svg',
    subtitle2: '0 Consumer Paid',
  },
  {
    title: 'Realization Rate',
    value: '0.00%',
    icon: '/icons/percentage.svg',
    subtitle2: '0 Consumer Paid',
  },
];

const tableColumns: Column[] = [
  { key: 'billNo', label: 'Bill No' },
  { key: 'consumerName', label: 'Consumer Name' },
  { key: 'uid', label: 'UID' },
  { key: 'meterNo', label: 'Meter SI No' },
  { key: 'billDate', label: 'Bill Date' },
  { key: 'units', label: 'No. of Units' },
  { key: 'billAmount', label: 'Bill Amount' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

const tableData: any[] = [];

const amountRangeOptions = [
  { value: '', label: 'Select Amount Range' },
  { value: '0-1000', label: '₹0 - ₹1,000' },
  { value: '1000-5000', label: '₹1,000 - ₹5,000' },
  { value: '5000+', label: '₹5,000+' },
];
const paymentStatusOptions = [
  { value: '', label: 'Select Payment Status' },
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'overdue', label: 'Overdue' },
];

const BillsPostpaid: React.FC = () => {
  const [amountRange, setAmountRange] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [search, setSearch] = useState('');

  // Header component
  const headerComponent = createHeaderComponent(
    'Bills',
    'Manage postpaid billing and payment status',
    '0 bills generated'
  );

  // Actions component
  const actionsComponent = createActionsComponent([
    { label: 'Add Bill', onClick: () => console.log('Adding bill...'), variant: 'primary' },
    { label: 'Export Bills', onClick: () => console.log('Exporting bills...'), variant: 'outline' },
    { label: 'Generate Report', onClick: () => console.log('Generating report...'), variant: 'outline' }
  ]);

  

  // Footer component
  const footerComponent = createFooterComponent({
    id: 'Postpaid Billing ID: POSTPAID-001',
    version: '2.1.0',
    supportLink: '#'
  });

  // Overview Cards Section
  const overviewCardsSection: Section = {
    id: 'overview-cards',
    component: (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cardData.slice(0, 4).map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>
    )
  };

  // Realization Rate Section
  const realizationRateSection: Section = {
    id: 'realization-rate',
    component: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card {...cardData[4]} />
      </div>
    )
  };

  // Filters Section
  const filtersSection: Section = {
    id: 'filters',
    component: (
      <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4 mb-4">
        <Dropdown
          name="amountRange"
          value={amountRange}
          onChange={e => setAmountRange(e.target.value as string)}
          options={amountRangeOptions}
          className="w-full md:w-1/3"
        />
        <input
          type="date"
          className="w-full md:w-1/3 px-4 py-3 border border-gray-200 rounded-full focus:outline-none"
          placeholder="Select Date"
        />
        <Dropdown
          name="paymentStatus"
          value={paymentStatus}
          onChange={e => setPaymentStatus(e.target.value as string)}
          options={paymentStatusOptions}
          className="w-full md:w-1/3"
        />
      </div>
    )
  };

  // Search Section
  const searchSection: Section = {
    id: 'search',
    component: (
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none"
        />
      </div>
    )
  };

  // Bills Table Section
  const billsTableSection: Section = {
    id: 'bills-table',
    component: (
      <Table
        data={tableData}
        columns={tableColumns}
        pagination
        searchable={false}
        emptyMessage="No Bills Found"
      />
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[overviewCardsSection, realizationRateSection, filtersSection, searchSection, billsTableSection]}
      header={headerComponent}
      actions={actionsComponent}
      footer={footerComponent}
      sidebarPosition="right"
      className="p-6"
      sectionClassName=""

    />
  );
};

export default BillsPostpaid; 
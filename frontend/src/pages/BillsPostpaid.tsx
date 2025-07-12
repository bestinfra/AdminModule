import React, { useState } from 'react';
import Card from '../components/global/Card';
import Table from '../components/global/Table';
import type { Column } from '../components/global/Table';
import Dropdown from '../components/global/Dropdown';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import PageHeader from '../components/global/PageHeader';

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
  const headerComponent = (
    <PageHeader
      title="Bills Postpaid"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
      buttonsLabel="Add Bill"
      variant="primary"
      onClick={() => console.log('Adding new bill...')}
      showMenu={true}
      showDropdown={true}
      menuItems={[
        { id: 'all', label: 'All Bills' },
        { id: 'paid', label: 'Paid' },
        { id: 'unpaid', label: 'Unpaid' },
        { id: 'overdue', label: 'Overdue' },
        { id: 'pending', label: 'Pending' },
        { id: 'high-amount', label: 'High Amount' },
        { id: 'low-amount', label: 'Low Amount' }
      ]}
      onMenuItemClick={(itemId) => {
        console.log(`Filter by: ${itemId}`);
        // Apply filters based on selection
        if (itemId === 'paid' || itemId === 'unpaid' || itemId === 'overdue') {
          setPaymentStatus(itemId);
        } else if (itemId === 'high-amount') {
          setAmountRange('5000+');
        } else if (itemId === 'low-amount') {
          setAmountRange('0-1000');
        } else if (itemId === 'all') {
          setPaymentStatus('');
          setAmountRange('');
        }
      }}
   
    />
  );

  

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
      sidebarPosition="right"
      className=""
      sectionClassName=""
    />
  );
};

export default BillsPostpaid; 
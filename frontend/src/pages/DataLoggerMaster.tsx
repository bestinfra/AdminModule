import React from 'react';
import Table from '@components/global/Table';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';
import { useNavigate } from 'react-router-dom';

const columns = [
  { key: 'slNo', label: 'Sl No' },
  { key: 'dcuModemSlNo', label: 'DCU / Modem Sl No' },
  { key: 'hardwareVersion', label: 'Hardware Version' },
  { key: 'firmwareVersion', label: 'Firmware Version' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'installationDate', label: 'Installation Date' },
];

const data = [
  {
    slNo: 'NA',
    dcuModemSlNo: 'RFDCU_DCU101',
    hardwareVersion: 'NA',
    firmwareVersion: 'NA',
    mobile: 'NA',
    installationDate: 'NA',
  },
];

const actions = [
  {
    label: 'View',
    icon: '/icons/eye.svg',
    onClick: () => {},
  },
  {
    label: 'Edit',
    icon: '/icons/edit.svg',
    onClick: () => {},
  },
];

const DataLoggerMaster: React.FC = () => {

  const navigate = useNavigate();
  
  // Header component
  const headerComponent = (
    <PageHeader
      title="Data Loggers List"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
      buttonsLabel="Add Data Logger"
      variant="primary"
      onClick={() => navigate('/meter-management/data-logger-master/add')}
      showMenu={true}
      showDropdown={true}
      menuItems={[
        { id: 'all', label: 'All Data Loggers' },
        { id: 'active', label: 'Active' },
        { id: 'inactive', label: 'Inactive' },
        { id: 'online', label: 'Online' },
        { id: 'offline', label: 'Offline' },
        { id: 'maintenance', label: 'Maintenance' }
      ]}
      onMenuItemClick={(itemId) => {
        console.log(`Filter by: ${itemId}`);
        // TODO: Implement filtering logic based on selection
      }}
    />
  );

  

  // Data Loggers Table Section
  const dataLoggersTableSection: Section = {
    id: 'data-loggers-table',
    component: (
      <Table 
        columns={columns} 
        data={data} 
        actions={actions} 
        pagination={true} 
        searchable={true} 
      />
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[dataLoggersTableSection]}
      header={headerComponent}
      sidebarPosition="right"
      className=""
      sectionClassName=""
    />
  );
};

export default DataLoggerMaster; 
import React from 'react';
import Table from '../components/global/Table';
import Button from '../components/global/Button';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import { 
    createHeaderComponent, 
    createActionsComponent, 
    createFooterComponent
} from '../components/global/PageComponents';
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
  const headerComponent = createHeaderComponent(
    'Data Loggers List',
    'Manage and monitor all data loggers in the system',
    `Total: ${data.length} data loggers`
  );

  // Actions component
  const actionsComponent = createActionsComponent([
    { label: 'Add Data Logger', onClick: () => navigate('/meter-management/data-logger-master/add'), variant: 'primary' },
    { label: 'Export Data', onClick: () => console.log('Exporting data...'), variant: 'outline' },
    { label: 'Bulk Actions', onClick: () => console.log('Bulk actions...'), variant: 'outline' }
  ]);

  

  // Footer component
  const footerComponent = createFooterComponent({
    id: 'Data Logger Master ID: DATALOGGER-001',
    version: '2.1.0',
    supportLink: '#'
  });

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
      actions={actionsComponent}
      footer={footerComponent}
      sidebarPosition="right"
      className="p-2"
      sectionClassName=""

    />
  );
};

export default DataLoggerMaster; 
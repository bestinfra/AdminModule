import React, { useState } from 'react';
import type { Column } from '../components/global/Table';
import Table from '../components/global/Table';
import Dropdown from '../components/global/Dropdown';
import { useNavigate } from 'react-router-dom';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import { 
    createHeaderComponent, 
    createActionsComponent, 
    createFooterComponent
} from '../components/global/PageComponents';

const consumersData = [
  { uid: 'BI25GMRA001', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17 },
  { uid: 'BI25GMRA002', name: 'Neo Travels', meter: 'A9345417', reading: 10157.62 },
  { uid: 'BI25GMRA003', name: 'Dormitory', meter: 'A9345418', reading: 1108.34 },
  { uid: 'BI25GMRA004', name: 'Mobikins', meter: 'A9211433', reading: 1271.76 },
  { uid: 'BI25GMRA005', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17 },
//   { uid: 'BI25GMRA006', name: 'Neo Travels', meter: 'A9345417', reading: 10157.62 },
//   { uid: 'BI25GMRA007', name: 'Dormitory', meter: 'A9345418', reading: 1108.34 },
//   { uid: 'BI25GMRA008', name: 'Mobikins', meter: 'A9211433', reading: 1271.76 },
//   { uid: 'BI25GMRA009', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17 },
//   { uid: 'BI25GMRA0010', name: 'Neo Travels', meter: 'A9345417', reading: 10157.62 },
//   { uid: 'BI25GMRA0011', name: 'Dormitory', meter: 'A9345418', reading: 1108.34 },
//   { uid: 'BI25GMRA0012', name: 'Mobikins', meter: 'A9211433', reading: 1271.76 },
];

const columns: Column[] = [
  { key: 'sNo', label: 'S.No' },
  { key: 'uid', label: 'UID' },
  { key: 'name', label: 'Consumer Name' },
  { key: 'meter', label: 'Meter SI No' },
  { key: 'reading', label: 'Current Reading' },
];

const menuOptions = [
  { value: 'occupied', label: 'Occupied' },
  { value: 'vacant', label: 'Vacant' },
];

const Consumers: React.FC = () => {
  const [menuValue, setMenuValue] = useState('');
  
  // Safely get navigate function, fallback to console.log if not available
  let navigate: any;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn('useNavigate not available in federated context, using fallback');
    navigate = (path: string) => {
      console.log('Navigation requested to:', path);
      // Try to use window.location as fallback
      if (window.location.pathname !== path) {
        window.location.href = path;
      }
    };
  }

  // Add sNo property to each row for serial number
  const tableData = consumersData.map((row, idx) => ({ ...row, sNo: idx + 1 }));

  const actions = [
    {
      label: 'View',
      icon: '/icons/eye.svg',
      onClick: (row: any) => {
        navigate(`/consumers/${row.uid}`);
      },
    },
  ];

  // Header component
  const headerComponent = createHeaderComponent(
    'Consumers',
    'Manage and monitor all consumers in the system',
    `Total: ${consumersData.length} consumers`
  );

  // Actions component
  const actionsComponent = createActionsComponent([
    { label: 'Add Consumer', onClick: () => navigate('/consumers/add'), variant: 'primary' },
    { label: 'Export Consumers', onClick: () => console.log('Exporting consumers...'), variant: 'outline' },
    { label: 'Bulk Actions', onClick: () => console.log('Bulk actions...'), variant: 'outline' }
  ]);

  

  // Footer component
  const footerComponent = createFooterComponent({
    id: 'Consumers List ID: CONSUMERS-001',
    version: '2.1.0',
    supportLink: '#'
  });

  // Consumers Table Section
  const consumersTableSection: Section = {
    id: 'consumers-table',
    component: (
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <div className="relative">
            <Dropdown
              name="consumer-menu"
              value={menuValue}
              onChange={e => setMenuValue(typeof e.target.value === 'string' ? e.target.value : Array.isArray(e.target.value) ? e.target.value[0] : '')}
              options={menuOptions}
              placeholder={''}
              searchable={false}
              className="w-10 h-10 min-w-0 min-h-0 p-0 border-none shadow-none bg-transparent flex items-center justify-center dropdown-below-trigger"
              leftIcon="/icons/menu-dots.svg"
            />
            <style>{`
              .dropdown-below-trigger .absolute.z-10 {
                left: 50% !important;
                top: 110% !important;
                right: auto !important;
                transform: translateX(-50%) !important;
                min-width: 140px;
              }
            `}</style>
          </div>
        </div>
        <Table
          data={tableData}
          columns={columns}
          actions={actions}
          showActions
          searchable={false}
          pagination
          emptyMessage="No consumers found"
        />
      </div>
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[consumersTableSection]}
      header={headerComponent}
      actions={actionsComponent}
      footer={footerComponent}
      sidebarPosition="right"
      className="p-6"
      sectionClassName=""

    />
  );
};

export default Consumers; 
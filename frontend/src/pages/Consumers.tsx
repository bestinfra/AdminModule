import React, { useState, useEffect } from 'react';
import type { Column } from '../components/global/Table';
import Table from '../components/global/Table';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import PageHeader from '../components/global/PageHeader';

const consumersData = [
  { uid: 'BI25GMRA001', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17 },
  { uid: 'BI25GMRA002', name: 'Neo Travels', meter: 'A9345417', reading: 10157.62 },
  { uid: 'BI25GMRA003', name: 'Dormitory', meter: 'A9345418', reading: 1108.34 },
  { uid: 'BI25GMRA004', name: 'Mobikins', meter: 'A9211433', reading: 1271.76 },
];

const columns: Column[] = [
  { key: 'sNo', label: 'S.No' },
  { key: 'uid', label: 'UID' },
  { key: 'name', label: 'Consumer Name' },
  { key: 'meter', label: 'Meter SI No' },
  { key: 'reading', label: 'Current Reading' },
];

const Consumers: React.FC = () => {
  const [menuValue, setMenuValue] = useState('');
  const params = useParams();
  const location = useLocation();
  
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

  // Check for filter parameter from route
  useEffect(() => {
    console.log('Current pathname:', location.pathname);
    console.log('Params uid:', params.uid);
    
    if (location.pathname === '/consumers/high-usage') {
      console.log('Setting filter to high-usage');
      setMenuValue('high-usage');
    } else if (params.uid && params.uid !== 'high-usage') {
      // This is a regular consumer view, not a filter
      console.log('This is a consumer view for UID:', params.uid);
    }
  }, [location.pathname, params.uid]);

  // Add sNo property and filter based on menu selection
  const getFilteredData = () => {
    let filteredData = consumersData;
    
    console.log('Current menuValue:', menuValue);
    console.log('Total consumers before filtering:', consumersData.length);
    
    if (menuValue === 'occupied') {
      // Filter to show occupied consumers (using first 80% as occupied)
      filteredData = consumersData.slice(0, Math.floor(consumersData.length * 0.8));
    } else if (menuValue === 'vacant') {
      // Filter to show vacant consumers (using last 20% as vacant)
      filteredData = consumersData.slice(Math.floor(consumersData.length * 0.8));
    } else if (menuValue === 'high-usage') {
      // Filter to show high usage consumers (reading > 1000)
      filteredData = consumersData.filter(consumer => consumer.reading > 1000);
      console.log('High usage consumers found:', filteredData.length);
    }
    
    console.log('Filtered data length:', filteredData.length);
    return filteredData.map((row, idx) => ({ ...row, sNo: idx + 1 }));
  };

  const tableData = getFilteredData();

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
  const headerComponent = (
    <PageHeader
      title={menuValue === 'high-usage' ? 'High Usage Consumers' : 'Consumers'}
      subtitle={menuValue === 'high-usage' ? undefined : undefined}
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
      buttonsLabel="Add Consumer"
      variant="primary"
      onClick={() => navigate('/consumers/add')}
      showMenu={true}
      showDropdown={true}
      menuItems={[
        { id: 'occupied', label: 'Occupied' },
        { id: 'vacant', label: 'Vacant' },
        { id: 'high-usage', label: 'High Usage' }
      ]}
      onMenuItemClick={(itemId) => {
        console.log(`Filter by: ${itemId}`);
        setMenuValue(itemId);
      }}
    />
  );



  

  // Consumers Table Section
  const consumersTableSection: Section = {
    id: 'consumers-table',
    component: (
      <div className="space-y-4">
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
      sidebarPosition="right"
      className=""
      sectionClassName=""

    />
  );
};

export default Consumers; 
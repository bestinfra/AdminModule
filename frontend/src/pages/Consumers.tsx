import React, { useState, useEffect } from 'react';
import type { Column } from '@components/global/Table';
import Table from '@components/global/Table';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';

const columns: Column[] = [
  { key: 'sNo', label: 'S.No' },
  { key: 'consumerNumber', label: 'UID' },
  { key: 'name', label: 'Consumer Name' },
  { key: 'meter', label: 'Meter SI No' },
  { key: 'reading', label: 'Current Reading' },
];

const Consumers: React.FC = () => {
  const [menuValue, setMenuValue] = useState('');
  const [consumers, setConsumers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch consumers from backend
  useEffect(() => {
    setLoading(true);
    
    fetch('/api/consumers')
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) {
          setConsumers(result.data);
        } else {
          setConsumers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching consumers:', err);
        setConsumers([]);
        setLoading(false);
      });
  }, []);

  // Check for filter parameter from route
  useEffect(() => {
    if (location.pathname === '/consumers/high-usage') {
      setMenuValue('high-usage');
    } else if (params.uid && params.uid !== 'high-usage') {
      // This is a regular consumer view, not a filter
    }
  }, [location.pathname, params.uid]);

  // Add sNo property and filter based on menu selection
  const getFilteredData = () => {
    let filteredData = consumers.map((consumer, idx) => {
      // Find the first meter for the consumer, if any
      const meter = consumer.meters && consumer.meters.length > 0 ? consumer.meters[0] : null;
      return {
        ...consumer,
        sNo: idx + 1,
        meter: meter ? meter.serialNumber : '-',
        reading: meter && meter.readings && meter.readings.length > 0 ? meter.readings[0].value : '-',
      };
    });

    if (menuValue === 'occupied') {
      filteredData = filteredData.slice(0, Math.floor(filteredData.length * 0.8));
    } else if (menuValue === 'vacant') {
      filteredData = filteredData.slice(Math.floor(filteredData.length * 0.8));
    } else if (menuValue === 'high-usage') {
      filteredData = filteredData.filter(consumer => Number(consumer.reading) > 1000);
    }
    return filteredData;
  };

  const tableData = getFilteredData();

  const actions = [
    {
      label: 'View',
      icon: '/icons/eye.svg',
      onClick: (row: any) => {
        navigate(`/consumers/${row.consumerNumber}`);
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
          loading={loading}
          emptyMessage={loading ? 'Loading consumers...' : 'No consumers found'}
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
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
  console.log('🚀 Consumers component is mounting...');
  alert('Consumers component is mounting!'); // Temporary debug
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
    console.log('🔄 useEffect is running - about to fetch data');
    alert('useEffect is running!'); // Temporary debug
    setLoading(true);
    const apiUrl = '/api/consumers';
    console.log('🔍 Fetching consumers from:', apiUrl);
    console.log('🔍 Current window location:', window.location.href);
    console.log('🔍 Current window origin:', window.location.origin);
    
    // Test the proxy directly
    fetch(apiUrl)
      .then(res => {
        console.log('📡 Response status:', res.status);
        console.log('📡 Response status text:', res.statusText);
        console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));
        console.log('📡 Response URL:', res.url);
        console.log('📡 Response type:', res.type);
        return res.text(); // Get raw text first
      })
      .then(text => {
        console.log('📄 Raw response text length:', text.length);
        console.log('📄 Raw response text (first 500 chars):', text.substring(0, 500));
        console.log('📄 Raw response text (last 200 chars):', text.substring(text.length - 200));
        
        // Check if it starts with HTML
        if (text.trim().toLowerCase().startsWith('<!doctype')) {
          console.error('❌ Response is HTML, not JSON!');
          alert('Got HTML instead of JSON! Check proxy configuration.');
          setConsumers([]);
          setLoading(false);
          return;
        }
        
        try {
          const result = JSON.parse(text);
          console.log('✅ Parsed result from backend:', result);
          if (result.success && Array.isArray(result.data)) {
            console.log('✅ Setting consumers data:', result.data.length, 'consumers');
            setConsumers(result.data);
          } else {
            console.log('⚠️ No valid data in response');
            setConsumers([]);
          }
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          console.error('❌ Raw text that failed to parse:', text);
          alert('Failed to parse JSON response!');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Network error fetching consumers:', err);
        alert('Network error: ' + err.message);
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
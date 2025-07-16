import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/global/Card';
import PieChart from '../graphs/PieChart';
import BarChart from '../graphs/BarChart';
import Table from '../components/global/Table';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import PageHeader from '../components/global/PageHeader';


// Mock data (should be shared or moved to a common location in real app)
const consumersData = [
  { uid: 'BI25GMRA001', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17, balance: 0, address: 'GHASL, GMR', mobile: '+91********49', email: '***************@gmail.com', occupancy: 'Occupied' },
  { uid: 'BI25GMRA002', name: 'Neo Travels', meter: 'A9345417', reading: 10157.62, balance: 1250.50, address: 'Airport Road, GMR', mobile: '+91********78', email: 'neo.travels@gmail.com', occupancy: 'Occupied' },
  { uid: 'BI25GMRA003', name: 'Dormitory', meter: 'A9345418', reading: 1108.34, balance: 450.75, address: 'Campus Area, GMR', mobile: '+91********23', email: 'dormitory.admin@gmail.com', occupancy: 'Occupied' },
  { uid: 'BI25GMRA004', name: 'Mobikins', meter: 'A9211433', reading: 1271.76, balance: 890.25, address: 'Tech Park, GMR', mobile: '+91********56', email: 'mobikins.tech@gmail.com', occupancy: 'Vacant' },
  { uid: 'BI25GMRA005', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17, balance: 0, address: 'GHASL, GMR', mobile: '+91********49', email: '***************@gmail.com', occupancy: 'Occupied' },
];

const ConsumerView: React.FC = () => {
  // Try to get uid from useParams first, then fallback to URL parsing
  const params = useParams<{ uid: string }>();

  const uidFromParams = params?.uid;
  
  // Fallback: extract uid from URL path if useParams doesn't work
  const getUidFromUrl = () => {
    const pathSegments = window.location.pathname.split('/');
    const uidIndex = pathSegments.findIndex(segment => segment === 'consumers') + 1;
    return uidIndex > 0 && uidIndex < pathSegments.length ? pathSegments[uidIndex] : null;
  };
  
  const uid = uidFromParams || getUidFromUrl();
  const consumer = consumersData.find(c => c.uid === uid);

  // Menu items for PageHeader
  const menuItems = [
    { id: 'refresh', label: 'Refresh Data', icon: '/icons/refresh.svg' },
    { id: 'export', label: 'Export Data', icon: '/icons/export.svg' },
    { id: 'settings', label: 'Settings', icon: '/icons/settings.svg' },
  ];

  // Handler functions
  const handleMenuItemClick = (itemId: string) => {
    console.log('Menu item clicked:', itemId);
    // Add your menu item logic here
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
    // Add your back navigation logic here
  };

  const handleRefreshClick = () => {
    console.log('Refresh button clicked');
    // Add your refresh logic here
  };

  // Debug information
  console.log('ConsumerView: uid from params:', uidFromParams);
  console.log('ConsumerView: uid from URL fallback:', getUidFromUrl());
  console.log('ConsumerView: final uid:', uid);
  console.log('ConsumerView: found consumer:', consumer);
  console.log('ConsumerView: available consumers:', consumersData.map(c => c.uid));

  if (!consumer) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Consumer not found</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">Debug Information:</h3>
          <p className="text-sm text-red-700 mb-2">UID from URL: <strong>{uid}</strong></p>
          <p className="text-sm text-red-700 mb-2">Available UIDs: <strong>{consumersData.map(c => c.uid).join(', ')}</strong></p>
          <p className="text-sm text-red-700">Please check the URL parameter and ensure it matches one of the available consumer UIDs.</p>
        </div>
      </div>
    );
  }

  // Header component
  const headerComponent = (
    <PageHeader
      title={consumer.name}
      menuItems={menuItems}
      onMenuItemClick={handleMenuItemClick}
      showMenu={true}
      showDropdown={true}
      buttonsLabel="Recharge"
      variant="primary"
      onClick={() => alert('Recharge')}
      onBackClick={handleBackClick}
      backButtonText="Back to Consumers"
      onRightImageClick={handleRefreshClick}
    />
  );



  // Consumer Info Section
  const consumerInfoSection: Section = {
    id: 'consumer-info',
    component: (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">Current Balance (₹)</div>
            <div className="text-green-600 text-lg font-bold">₹{consumer.balance.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Unique Identification No</div>
            <div className="text-md font-medium">{consumer.uid}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Meter Serial Number</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 bg-green-500 rounded-full inline-block"></span>{consumer.meter}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Occupancy Status</div>
            <div className="text-md font-medium">{consumer.occupancy}</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="font-semibold">Permanent Address</div>
            <div className="text-sm text-gray-600">{consumer.address}</div>
          </div>
          <div>
            <div className="font-semibold">Billing Address</div>
            <div className="text-sm text-gray-600">{consumer.address}</div>
          </div>
          <div>
            <div className="font-semibold">Mobile No</div>
            <div className="text-sm text-gray-600">{consumer.mobile}</div>
          </div>
          <div>
            <div className="font-semibold">Email ID</div>
            <div className="text-sm text-gray-600">{consumer.email}</div>
          </div>
        </div>
      </div>
    )
  };

  // Instantaneous Data Section
  const instantaneousDataSection: Section = {
    id: 'instantaneous-data',
    component: (
      <div className="bg-primary-lightest rounded-[var(--radius-2xl)] p-6">
        <div className="flex items-center justify-between bg-primary-lightest rounded-t-lg px-4 py-2">
          <div className="font-semibold">Instantaneous Data</div>
          <div className="text-sm text-gray-500">Last Comm Date: 10/07/2025 07:00:00</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card
            title="R-Phase Voltage"
            value={"233.52"}
            icon="/icons/consumption.svg"
            subtitle1="Volts"
          />
          <Card
            title="Y-Phase Voltage"
            value={"0.0"}
            icon="/icons/consumption.svg"
            subtitle1="Volts"
          />
          <Card
            title="B-Phase Voltage"
            value={"0.0"}
            icon="/icons/consumption.svg"
            subtitle1="Volts"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card
            title="R-Phase Current"
            value={"0.47"}
            icon="/icons/consumption.svg"
            subtitle1="Amps"
          />
          <Card
            title="Y-Phase Current"
            value={"0.0"}
            icon="/icons/consumption.svg"
            subtitle1="Amps"
          />
          <Card
            title="B-Phase Current"
            value={"0.0"}
            icon="/icons/consumption.svg"
            subtitle1="Amps"
          />
        </div>
      </div>
    )
  };

  // Power Analysis Section
  const powerAnalysisSection: Section = {
    id: 'power-analysis',
    component: (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Power Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Power Distribution Card */}
          <div className="rounded-2xl shadow p-0 flex flex-col h-full">
            <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-primary-lightest rounded-t-2xl">
              <div className="font-semibold text-base">Power Distribution</div>
              <span className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border" onClick={() => alert('Download Power Distribution')}>
                <img
                  alt="Download chart"
                  src="icons/download-icon.svg"
                  className="w-4 h-4 [filter:var(--icon-color)]"
                />
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between px-6 pb-6 pt-2 gap-4">
              <div className="flex flex-col items-center w-full md:w-2/3">
                {/* Legend above chart */}
                <div className="flex items-center gap-6 mb-2">
                  <span className="flex items-center gap-1 text-green-500 font-medium text-sm"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>Apparent Power</span>
                  <span className="flex items-center gap-1 text-blue-500 font-medium text-sm"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>Active Power</span>
                  <span className="flex items-center gap-1 text-red-500 font-medium text-sm"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>Reactive Power</span>
                </div>
                <PieChart
                  data={[
                    { value: 0.109, name: 'Apparent Power' },
                    { value: 0.109, name: 'Active Power' },
                    { value: 0, name: 'Reactive Power' },
                  ]}
                  colors={["#22c55e", "#3b82f6", "#ef4444"]}
                  height={220}
                  showNoDataMessage={false}
                  title={''}
                />
              </div>
              {/* Value/percentage box to the right of chart */}
              <div className="flex flex-col items-center w-full md:w-1/3 mt-4 md:mt-0">
                <div className="bg-white rounded-xl p-4 shadow flex flex-col items-start w-full max-w-xs">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-green-500"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>0.109kVA <span className="text-gray-500">50.0%</span></div>
                    <div className="flex items-center gap-2 text-blue-500"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>0.109kVA <span className="text-gray-500">50.0%</span></div>
                    <div className="flex items-center gap-2 text-red-500"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>0kVA <span className="text-gray-500">0.0%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Power Metrics Card */}
          <div className="rounded-2xl shadow p-0 flex flex-col h-full">
            <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-primary-lightest rounded-t-3xl">
              <div className="font-semibold text-base">Power Metrics</div>
              <span className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border" onClick={() => alert('Download Power Metrics')}>
                <img
                  alt="Download chart"
                  src="icons/download-icon.svg"
                  className="w-4 h-4 [filter:var(--icon-color)]"
                />
              </span>
            </div>
            <div className="w-full h-64 px-6 pb-6 pt-2">
              <BarChart
                xAxisData={["kVAh- (i)", "kWh(i)", "kWh(E)", "kVArh-lag(i)", "kVArh-Ld(i)"]}
                seriesData={[{ name: 'Power', data: [150, 145, 0, 0, 30] }]}
                seriesColors={["#1e3a8a"]}
                height={220}
                showLegendInteractions={false}
                showXAxisLabel={false}
                title={''}
              />
            </div>
          </div>
        </div>
      </div>
    )
  };

  // Reports Section
  const reportsSection: Section = {
    id: 'reports',
    component: (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Consumption Card */}
          <div className="rounded-2xl shadow p-0 flex flex-col h-full">
            <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-primary-lightest rounded-t-2xl">
              <div className="font-semibold text-base">Daily Consumption <span className="text-gray-500 font-normal text-sm">(9 May, 2025 - 10 Jul, 2025)</span></div>
              <span className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border" onClick={() => alert('Download Daily Consumption')}>
                <img
                  alt="Download chart"
                  src="icons/download-icon.svg"
                  className="w-4 h-4 [filter:var(--icon-color)]"
                />
              </span>
            </div>
            <div className="w-full h-64 px-6 pb-6 pt-2">
              <BarChart
                xAxisData={Array.from({length: 63}, (_, i) => {
                  const start = new Date(2025, 4, 9); // 9 May 2025
                  const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
                  return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                })}
                seriesData={[{ name: 'Consumption', data: Array(63).fill(0).map(() => Number((Math.random() * 2 + 1.1).toFixed(2))) }]}
                seriesColors={["#1e3a8a"]}
                height={220}
                showLegendInteractions={false}
                showXAxisLabel={false}
                title={''}
              />
            </div>
          </div>
          {/* Monthly Consumption Card */}
          <div className="rounded-2xl shadow p-0 flex flex-col h-full">
            <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-primary-lightest rounded-t-2xl">
              <div className="font-semibold text-base">Monthly Consumption <span className="text-gray-500 font-normal text-sm">(Jul 2024 - Jul 2025)</span></div>
              <span className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border" onClick={() => alert('Download Monthly Consumption')}>
                <img
                  alt="Download chart"
                  src="icons/download-icon.svg"
                  className="w-4 h-4 [filter:var(--icon-color)]"
                />
              </span>
            </div>
            <div className="w-full h-64 px-6 pb-6 pt-2">
              <BarChart
                xAxisData={["Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025"]}
                seriesData={[{ name: 'Consumption', data: [0,0,0,0,0,0,0,0,0,0,60,65,20] }]}
                seriesColors={["#1e3a8a"]}
                height={220}
                showLegendInteractions={false}
                showXAxisLabel={false}
                title={''}
              />
            </div>
          </div>
        </div>
      </div>
    )
  };

  // History Section
  const historySection: Section = {
    id: 'history',
    component: (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-base">Unit History</div>
          <div className="bg-white rounded-2xl shadow p-0">
            <Table
              data={[{ uid: 'BI25GMRA001', meter: 'A9211434', company: 'GHASL', unit: 'Airborne General Store', created: '05/05/2025' }]}
              columns={[
                { key: 'uid', label: 'UID' },
                { key: 'meter', label: 'Meter Serial No' },
                { key: 'company', label: 'Company Name' },
                { key: 'unit', label: 'Unit Name' },
                { key: 'created', label: 'Created On' },
              ]}
              showActions={false}
              pagination
              searchable={false}
              emptyMessage="No unit history found"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-base">Transaction History</div>
          <div className="bg-white rounded-2xl shadow p-0">
            <Table
              data={[
                { id: 'QoZdA2e76ouhhz', credit: '₹1', balance: '₹9426.24', date: '03/07/2025 16:42:16' },
                { id: 'QeDoCcKBdmwoSJ', credit: '₹1', balance: '₹9425.24', date: '07/06/2025 12:51:25' },
                { id: 'QZW4ErZPxJdOUD', credit: '₹1', balance: '₹9424.24', date: '26/05/2025 15:28:06' },
                { id: 'QYN7jRAKNqDYL', credit: '₹1', balance: '₹9496.53', date: '23/05/2025 18:04:07' },
                { id: 'QYHxztpQCUuEa1', credit: '₹1', balance: '₹9495.53', date: '23/05/2025 13:01:27' },
                { id: 'QYHWSWlvVUeYiE', credit: '₹1', balance: '₹9494.53', date: '23/05/2025 12:35:22' },
                { id: '', credit: '₹10,000', balance: '₹9598.39', date: '19/05/2025 11:06:34' },
              ]}
              columns={[
                { key: 'id', label: 'Transaction ID' },
                { key: 'credit', label: 'Credit Amount' },
                { key: 'balance', label: 'Current Balance Amount' },
                { key: 'date', label: 'Payment Date' },
              ]}
              showActions={false}
              pagination
              searchable={false}
              emptyMessage="No transaction history found"
            />
          </div>
        </div>
      </div>
    )
  };

  // Events Section
  const eventsSection: Section = {
    id: 'events',
    component: (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Events</h2>
        <div className="bg-white rounded-2xl">
          <Table
            data={Array.from({ length: 46 }, (_, i) => ({
              sNo: i + 1,
              description: 'Meter Power Fail',
              status: i % 2 === 0 ? 'Start' : 'End',
              date: [
                '10/07/2025 00:49:00', '10/07/2025 00:44:00', '05/07/2025 13:08:00', '05/07/2025 13:01:00',
                '05/07/2025 13:00:00', '05/07/2025 12:57:00', '04/07/2025 14:23:00', '04/07/2025 14:08:00',
                '25/06/2025 07:29:00', '25/06/2025 07:16:00',
              ][i % 10] || '01/07/2025 12:00:00',
            }))}
            columns={[
              { key: 'sNo', label: 'S.No' },
              { key: 'description', label: 'Event Description' },
              { key: 'status', label: 'Status' },
              { key: 'date', label: 'Event Date' },
            ]}
            showActions={false}
            pagination
            searchable={false}
            emptyMessage="No events found"
          />
        </div>
      </div>
    )
  };

  // Connection Activity History Section
  const connectionActivitySection: Section = {
    id: 'connection-activity-history',
    component: (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Connection Activity History</h2>
        <div className="bg-white rounded-2xl shadow ">
          <Table
            data={[
              { sNo: 1, action: 'Connect', performedBy: 'Admin', dateTime: '10/07/2025 09:00:00', remarks: 'Routine connection' },
              { sNo: 2, action: 'Disconnect', performedBy: 'Operator', dateTime: '12/07/2025 14:30:00', remarks: 'Non-payment' },
              { sNo: 3, action: 'Connect', performedBy: 'Admin', dateTime: '15/07/2025 10:15:00', remarks: 'Payment received' },
            ]}
            columns={[
              { key: 'sNo', label: 'S.No' },
              { key: 'action', label: 'Action' },
              { key: 'performedBy', label: 'Performed By' },
              { key: 'dateTime', label: 'Date & Time' },
              { key: 'remarks', label: 'Remarks' },
            ]}
            showActions={false}
            pagination
            searchable={false}
            emptyMessage="No connection activity found"
          />
        </div>
      </div>
    )
  };

  // Debug Section
  const debugSection: Section = {
    id: 'debug',
    component: (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
        <p className="text-sm text-gray-600 mb-1">UID from URL: <strong>{uid}</strong></p>
        <p className="text-sm text-gray-600 mb-1">Consumer found: <strong>{consumer ? 'Yes' : 'No'}</strong></p>
        <p className="text-sm text-gray-600">Total consumers: <strong>{consumersData.length}</strong></p>
      </div>
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[
        debugSection,
        consumerInfoSection, 
        instantaneousDataSection, 
        powerAnalysisSection, 
        reportsSection, 
        historySection, 
        eventsSection,
        connectionActivitySection
      ]}
      header={headerComponent}
      sidebarPosition="right"
      className=" flex flex-col gap-8"
      sectionClassName=""

    />
  );
};

export default ConsumerView; 
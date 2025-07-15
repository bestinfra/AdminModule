import { useNavigate } from 'react-router-dom';
import Card from '@components/global/Card';
import Table from '@components/global/Table';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';

const mockDTRData = {
  name: 'TGNP_DTR-03',
  rating: '15.00 kVA',
  address: 'Prashanth Nagar, Hyderabad, Telangana, India, 500084',
  location: { lat: 17.470268, lng: 78.353907 },
  stats: [
    { title: 'Total LT Feeders', value: 4, icon: '/icons/feeder.svg', subtitle1: 'Connected to DTR' },
    { title: 'Total kW', value: 3.73, icon: '/icons/consumption.svg', subtitle1: 'Active Power' },
    { title: 'Total kVA', value: 3.98, icon: '/icons/consumption.svg', subtitle1: 'Apparent Power' },
    { title: 'Total kWh', value: 20355.16, icon: '/icons/consumption.svg', subtitle1: 'Cumulative Active Energy' },
    { title: 'Total kVAh', value: 20699.25, icon: '/icons/consumption.svg', subtitle1: 'Cumulative Apparent Energy' },
    { title: 'LT Feeders Fuse Blown', value: 0, icon: '/icons/power_failure.svg', subtitle1: 'Requires maintenance' },
    { title: 'Unbalanced LT Feeders', value: 0, icon: '/icons/power_failure.svg', subtitle1: 'Requires attention' },
    { title: 'Power On', value: '00:00:00', icon: '/icons/power_failure.svg', subtitle1: '' },
    { title: 'Power Off', value: '00:00:00', icon: '/icons/power_failure.svg', subtitle1: '' },
    { title: 'Status', value: 'B_PH CT', icon: '/icons/units.svg', subtitle1: '0000-00-00 00:00:00' },
  ],
};

const DTRDetailPage = () => {
  // TODO: Use id to fetch specific DTR data when needed
  // const { id } = useParams();
  const navigate = useNavigate();
  // TODO: Fetch DTR data by id here (using mock for now)
  const dtr = mockDTRData;

  // Header component
  const headerComponent = (
    <PageHeader
      title={dtr.name}
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
      buttonsLabel="Edit DTR"
      variant="primary"
      onClick={() => console.log('Editing DTR...')}
    />
  );

  

  // DTR Information Section
  const dtrInfoSection: Section = {
    id: 'dtr-info',
    component: (
      <section className="border border-primary-border rounded-3xl bg-white dark:bg-primary-dark p-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-main dark:text-white">DTR Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">DTR Name</span>
            <span className="text-base text-main dark:text-white font-medium">{dtr.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Rating</span>
            <span className="text-base text-main dark:text-white font-medium">{dtr.rating}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Address</span>
            <span className="text-base text-main dark:text-white font-medium">{dtr.address}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-semibold">Location</span>
            <span className="text-base text-main dark:text-white font-medium">{dtr.location.lat}, {dtr.location.lng}</span>
          </div>
        </div>
      </section>
    )
  };

  // DTR Statistics Section
  const dtrStatsSection: Section = {
    id: 'dtr-stats',
    component: (
      <section className="border border-primary-border rounded-3xl bg-[var(--color-primary-lightest)] dark:bg-primary-dark p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Distribution Transformer (DTR) Statistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dtr.stats.map((stat, idx) => (
            <Card key={idx} {...stat} />
          ))}
        </div>
      </section>
    )
  };

  // Feeders Section
  const feedersSection: Section = {
    id: 'feeders',
    component: (
      <div className="flex flex-col gap-4 border border-primary-border rounded-2xl p-4 bg-white">
        <h2 className="text-lg font-semibold">Feeders</h2>
        <Table
          columns={[
            { key: 'sNo', label: 'S No' },
            { key: 'feederName', label: 'Feeder Name' },
            { key: 'loadStatus', label: 'Load Status' },
            { key: 'actions', label: 'Actions', render: () => <span className="flex justify-center items-center"><img src="/icons/eye.svg" alt="View" className="w-5 h-5 opacity-50" /></span> },
          ]}
          data={[
            { sNo: 1, feederName: 'D1F1(32500114)', loadStatus: 'Underload', actions: '' },
          ]}
          searchable={true}
          pagination={true}
          initialRowsPerPage={5}
          emptyMessage="No Feeders Found"
          showActions={false}
          onRowClick={(row) => navigate(`/feeders/${row.feederName}`)}
        />
      </div>
    )
  };

  // Alerts Section
  const alertsSection: Section = {
    id: 'alerts',
    component: (
      <div className="flex flex-col gap-4 border border-primary-border rounded-2xl p-4 bg-white">
        <h2 className="text-lg font-semibold">Alerts</h2>
        <Table
          columns={[
            { key: 'alertId', label: 'Alert ID' },
            { key: 'type', label: 'Type' },
            { key: 'feederName', label: 'Feeder Name' },
            { key: 'occuredOn', label: 'Occured On' },
          ]}
          data={[]}
          searchable={true}
          pagination={true}
          initialRowsPerPage={5}
          emptyMessage="No Alerts Found"
          showActions={false}
        />
      </div>
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[dtrInfoSection, dtrStatsSection, feedersSection, alertsSection]}
      header={headerComponent}
      sidebarPosition="right"
      className="p-2 flex flex-col gap-6"
      sectionClassName=""
    />
  );
};

export default DTRDetailPage; 
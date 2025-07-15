import { useEffect, useRef, useState } from 'react';
import Card from '@components/global/Card';
import BarChart from '../graphs/BarChart';
import Table from '@components/global/Table';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import { 
    createHeaderComponent, 
    createActionsComponent,
    createFooterComponent
} from '@components/global/PageComponents';

const feederInfo = {
  name: 'D1F1(32500114)',
  rating: '25 kVA',
  address: 'Waddepally, Warangal, Telangana, India, 506001',
  lastComm: '30/06/2025 22:31:38',
};

const stats = [
  { title: 'R-Phase Voltage', value: '257.686', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts' },
  { title: 'Y-Phase Voltage', value: '255.089', icon: '/icons/y-phase-voltage.svg', subtitle1: 'Volts' },
  { title: 'B-Phase Voltage', value: '254.417', icon: '/icons/b-phase-voltage.svg', subtitle1: 'Volts' },
  { title: 'Apparent Power', value: '19.527', icon: '/icons/consumption.svg', subtitle1: 'kVA' },
  { title: 'MD-kVA', value: '52.220', icon: '/icons/consumption.svg', subtitle1: 'kVA' },
  { title: 'R-Phase Current', value: '15.892', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps' },
  { title: 'Y-Phase Current', value: '27.644', icon: '/icons/y-phase-current.svg', subtitle1: 'Amps' },
  { title: 'B-Phase Current', value: '33.984', icon: '/icons/b-phase-current.svg', subtitle1: 'Amps' },
  { title: 'Neutral Current', value: '12.980', icon: '/icons/consumption.svg', subtitle1: 'Amps' },
  { title: 'Frequency', value: '49.980', icon: '/icons/frequency.svg', subtitle1: 'Hz' },
  { title: 'R-Phase PF', value: '1.000', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor' },
  { title: 'Y-Phase PF', value: '-0.987', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor' },
  { title: 'B-Phase PF', value: '0.998', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor' },
  { title: 'Avg PF', value: '-0.999', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor' },
  { title: 'Cummulative kVAh', value: '77902.296', icon: '/icons/consumption.svg', subtitle1: 'kVAh' },
];

const Feeders = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          // Fallback to a default location (e.g., Hyderabad)
          setLocation({ lat: 17.385044, lng: 78.486671 });
        }
      );
    } else {
      setLocation({ lat: 17.385044, lng: 78.486671 });
    }
  }, []);

  useEffect(() => {
    if (location && mapRef.current && (window as any).google) {
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });
      new (window as any).google.maps.Marker({
        position: location,
        map,
      });
    }
  }, [location]);

  // Header component
  const headerComponent = createHeaderComponent(
    feederInfo.name,
    `Feeder Details - ${feederInfo.rating}`,
    `Last Comm: ${feederInfo.lastComm}`
  );

  // Actions component
  const actionsComponent = createActionsComponent([
    { label: 'Download Data', onClick: () => console.log('Downloading feeder data...'), variant: 'outline' },
    { label: 'Export Report', onClick: () => console.log('Exporting report...'), variant: 'outline' },
    { label: 'Settings', onClick: () => console.log('Opening settings...'), variant: 'outline' }
  ]);

  

  // Footer component
  const footerComponent = createFooterComponent({
    id: `Feeder ID: ${feederInfo.name}`,
    version: '2.1.0',
    supportLink: '#'
  });

  // Feeder Information Section
  const feederInfoSection: Section = {
    id: 'feeder-info',
    component: (
      <section className="border border-primary-border rounded-3xl bg-white p-8 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-main mb-2">Feeder Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-4">
          <div className="flex flex-col">
            <span className="text-base font-bold">Feeder Name:</span>
            <span className="text-lg">{feederInfo.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold">Rating :</span>
            <span className="text-lg">{feederInfo.rating}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold">Address</span>
            <span className="text-lg">{feederInfo.address}</span>
          </div>
        </div>
      </section>
    )
  };

  // Feeder Statistics Section
  const feederStatsSection: Section = {
    id: 'feeder-stats',
    component: (
      <section className="border border-primary-border rounded-3xl bg-[var(--color-primary-lightest)] p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-main">Feeder Statistics</h3>
          <span className="text-sm text-gray-500">Last Comm: {feederInfo.lastComm}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} {...stat} />
          ))}
        </div>
      </section>
    )
  };

  // Daily Metrics Section
  const dailyMetricsSection: Section = {
    id: 'daily-metrics',
    component: (
      <section className="border border-primary-border rounded-3xl p-0 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-main">Metrics</h2>
        <div className="bg-white border border-primary-border rounded-2xl p-0">
          <div className="flex justify-between items-center mb-2 bg-[var(--color-primary-lightest)] rounded-lg px-4 py-4">
            <span className="text-base font-medium text-main">Daily Consumption Metrics (06 May, 2025 - 06 Jul, 2025)</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-primary-lightest)] hover:bg-[var(--color-primary)]">
              <img src="/icons/download-app.svg" alt="Download" className="w-5 h-5" />
            </button>
          </div>
          <div className="px-4 pb-4">
            <BarChart
              xAxisData={['6 May', '7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul', '5 Jul', '6 Jul']}
              seriesData={[{ name: 'Consumption', data: [572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 610, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572] }]}
              height={320}
              ariaLabel="Daily Consumption Metrics Bar Chart"
            />
          </div>
        </div>
      </section>
    )
  };

  // Monthly Metrics Section
  const monthlyMetricsSection: Section = {
    id: 'monthly-metrics',
    component: (
      <section className="border border-primary-border rounded-3xl p-0 flex flex-col gap-4 mt-4">
        <div className="bg-white border border-primary-border rounded-2xl p-0">
          <div className="flex justify-between items-center mb-2 bg-[var(--color-primary-lightest)] rounded-lg px-4 py-4">
            <span className="text-base font-medium text-main">Monthly Consumption Metrics <span className="text-xs text-gray-500">(Jul 2024 - Jul 2025)</span></span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-primary-lightest)] hover:bg-[var(--color-primary)]">
              <img src="/icons/options.svg" alt="Options" className="w-5 h-5" />
            </button>
          </div>
          <div className="px-4 pb-4">
            <BarChart
              xAxisData={['Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025']}
              seriesData={[{ name: 'Consumption', data: [0, 0, 0, 0, 0, 0, 0, 6000, 14000, 18000, 17000, 16000, 0] }]}
              height={320}
              ariaLabel="Monthly Consumption Metrics Bar Chart"
            />
          </div>
        </div>
      </section>
    )
  };

  // Map Section
  const mapSection: Section = {
    id: 'map',
    component: (
      <section className="border border-primary-border rounded-3xl bg-white p-2 mt-4">
        <div className="w-full h-[350px] rounded-2xl overflow-hidden" ref={mapRef} />
      </section>
    )
  };

  // Alerts Section
  const alertsSection: Section = {
    id: 'alerts',
    component: (
      <div className="flex flex-col gap-4 p-4 bg-white">
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
      sections={[
        feederInfoSection, 
        feederStatsSection, 
        dailyMetricsSection, 
        monthlyMetricsSection, 
        mapSection, 
        alertsSection
      ]}
      header={headerComponent}
      actions={actionsComponent}
      footer={footerComponent}
      sidebarPosition="right"
      className="p-2 flex flex-col gap-6"
      sectionClassName=""

    />
  );
};

export default Feeders; 
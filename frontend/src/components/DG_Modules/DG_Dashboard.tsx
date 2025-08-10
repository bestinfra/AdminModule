import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../global/PageC';

const DGDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Enhanced mock data for DG sets with more comprehensive information
  const dgSets = [
    {
      id: 'DG001',
      name: 'DG Set 1',
      location: 'Building A - Basement',
      status: 'running' as const,
      load: 75,
      fuel: 45,
      runningHoursToday: '8.5 hrs',
      runningHoursTotal: '2,450 hrs',
      efficiency: '92%',
      efficiencyTrend: 'up' as const,
      alerts: { count: 2, type: 'warning' as const },
      lastUpdate: '2 min ago',
      // Additional data for better display
      category: 'Industrial Power',
      health: 'Live' as const,
      company: 'PowerCorp Industries',
      subdomain: 'dg001.powercorp.com',
      created: '2023-01-15',
      updated: '2024-01-20',
      website: 'powercorp.com',
      modules: [
        { name: 'Power Monitoring' },
        { name: 'Fuel Management' },
        { name: 'Alert System' }
      ],
      connectedApis: [
        { name: 'SCADA System', status: 'connected' as const },
        { name: 'Fuel Sensor', status: 'connected' as const },
        { name: 'Load Monitor', status: 'connected' as const }
      ],
      meters: { total: 15, active: 12, inactive: 3 },
      tickets: { count: 2, href: '/tickets/dg001' }
    },
    {
      id: 'DG002',
      name: 'DG Set 2',
      location: 'Building B - Ground Floor',
      status: 'stopped' as const,
      load: 0,
      fuel: 80,
      runningHoursToday: '0 hrs',
      runningHoursTotal: '1,890 hrs',
      efficiency: '89%',
      efficiencyTrend: 'down' as const,
      alerts: { count: 0, type: 'warning' as const },
      lastUpdate: '15 min ago',
      category: 'Emergency Power',
      health: 'Down' as const,
      company: 'PowerCorp Industries',
      subdomain: 'dg002.powercorp.com',
      created: '2023-03-22',
      updated: '2024-01-19',
      website: 'powercorp.com',
      modules: [
        { name: 'Emergency Control' },
        { name: 'Battery Backup' }
      ],
      connectedApis: [
        { name: 'Emergency System', status: 'disconnected' as const },
        { name: 'Battery Monitor', status: 'connected' as const }
      ],
      meters: { total: 8, active: 0, inactive: 8 },
      tickets: { count: 0, href: '/tickets/dg002' }
    },
    {
      id: 'DG003',
      name: 'DG Set 3',
      location: 'Building C - Roof',
      status: 'fault' as const,
      load: 0,
      fuel: 65,
      runningHoursToday: '0 hrs',
      runningHoursTotal: '3,120 hrs',
      efficiency: '87%',
      efficiencyTrend: 'down' as const,
      alerts: { count: 5, type: 'critical' as const },
      lastUpdate: '1 min ago',
      category: 'Industrial Power',
      health: 'Down' as const,
      company: 'PowerCorp Industries',
      subdomain: 'dg003.powercorp.com',
      created: '2022-11-08',
      updated: '2024-01-20',
      website: 'powercorp.com',
      modules: [
        { name: 'High Power Control' },
        { name: 'Advanced Monitoring' },
        { name: 'Fault Detection' }
      ],
      connectedApis: [
        { name: 'Power Controller', status: 'error' as const },
        { name: 'Fault Sensor', status: 'connected' as const },
        { name: 'Load Balancer', status: 'disconnected' as const }
      ],
      meters: { total: 22, active: 0, inactive: 22 },
      tickets: { count: 5, href: '/tickets/dg003' }
    },
    {
      id: 'DG004',
      name: 'DG Set 4',
      location: 'Building D - Basement',
      status: 'running' as const,
      load: 60,
      fuel: 55,
      runningHoursToday: '6.2 hrs',
      runningHoursTotal: '2,100 hrs',
      efficiency: '94%',
      efficiencyTrend: 'up' as const,
      alerts: { count: 1, type: 'warning' as const },
      lastUpdate: '5 min ago',
      category: 'Industrial Power',
      health: 'Live' as const,
      company: 'PowerCorp Industries',
      subdomain: 'dg004.powercorp.com',
      created: '2023-06-14',
      updated: '2024-01-20',
      website: 'powercorp.com',
      modules: [
        { name: 'Efficiency Monitor' },
        { name: 'Fuel Optimization' },
        { name: 'Performance Analytics' }
      ],
      connectedApis: [
        { name: 'Efficiency System', status: 'connected' as const },
        { name: 'Fuel Monitor', status: 'connected' as const },
        { name: 'Performance Tracker', status: 'connected' as const }
      ],
      meters: { total: 18, active: 17, inactive: 1 },
      tickets: { count: 1, href: '/tickets/dg004' }
    },
    {
      id: 'DG005',
      name: 'DG Set 5',
      location: 'Building E - Ground Floor',
      status: 'running' as const,
      load: 45,
      fuel: 70,
      runningHoursToday: '7.8 hrs',
      runningHoursTotal: '1,750 hrs',
      efficiency: '91%',
      efficiencyTrend: 'up' as const,
      alerts: { count: 0, type: 'warning' as const },
      lastUpdate: '3 min ago',
      category: 'Support Power',
      health: 'Live' as const,
      company: 'PowerCorp Industries',
      subdomain: 'dg005.powercorp.com',
      created: '2023-08-30',
      updated: '2024-01-20',
      website: 'powercorp.com',
      modules: [
        { name: 'Support Systems' },
        { name: 'Load Management' }
      ],
      connectedApis: [
        { name: 'Support Controller', status: 'connected' as const },
        { name: 'Load Manager', status: 'connected' as const }
      ],
      meters: { total: 12, active: 11, inactive: 1 },
      tickets: { count: 0, href: '/tickets/dg005' }
    },
    {
      id: 'DG006',
      name: 'DG Set 6',
      location: 'Building F - Basement',
      status: 'stopped' as const,
      load: 0,
      fuel: 90,
      runningHoursToday: '0 hrs',
      runningHoursTotal: '2,890 hrs',
      efficiency: '88%',
      efficiencyTrend: 'down' as const,
      alerts: { count: 2, type: 'warning' as const },
      lastUpdate: '20 min ago',
      category: 'Legacy Power',
      health: 'Maintenance' as const,
      company: 'PowerCorp Industries',
      subdomain: 'dg006.powercorp.com',
      created: '2021-12-03',
      updated: '2024-01-18',
      website: 'powercorp.com',
      modules: [
        { name: 'Legacy Control' },
        { name: 'Maintenance Mode' }
      ],
      connectedApis: [
        { name: 'Legacy System', status: 'disconnected' as const },
        { name: 'Maintenance Monitor', status: 'connected' as const }
      ],
      meters: { total: 10, active: 0, inactive: 10 },
      tickets: { count: 2, href: '/tickets/dg006' }
    },
    {
      id: 'DG007',
      name: 'DG Set 7',
      location: 'Building G - Roof',
      status: 'running' as const,
      load: 85,
      fuel: 35,
      runningHoursToday: '9.1 hrs',
      runningHoursTotal: '3,450 hrs',
      efficiency: '93%',
      efficiencyTrend: 'up' as const,
      alerts: { count: 1, type: 'warning' as const },
      lastUpdate: '1 min ago',
      category: 'Critical Power',
      health: 'Live' as const,
      company: 'PowerCorp Industries',
      subdomain: 'dg007.powercorp.com',
      created: '2022-05-17',
      updated: '2024-01-20',
      website: 'powercorp.com',
      modules: [
        { name: 'Critical Control' },
        { name: 'High Performance Monitor' },
        { name: 'Redundancy System' }
      ],
      connectedApis: [
        { name: 'Critical Controller', status: 'connected' as const },
        { name: 'Performance Monitor', status: 'connected' as const },
        { name: 'Redundancy Checker', status: 'connected' as const }
      ],
      meters: { total: 25, active: 24, inactive: 1 },
      tickets: { count: 1, href: '/tickets/dg007' }
    },
    {
      id: 'DG008',
      name: 'DG Set 8',
      location: 'Building H - Basement',
      status: 'fault' as const,
      load: 0,
      fuel: 40,
      runningHoursToday: '0 hrs',
      runningHoursTotal: '2,200 hrs',
      efficiency: '85%',
      efficiencyTrend: 'down' as const,
      alerts: { count: 3, type: 'critical' as const },
      lastUpdate: '10 min ago',
      category: 'Backup Power',
      health: 'Down' as const,
      company: 'PowerCorp Industries',
      subdomain: 'dg008.powercorp.com',
      created: '2023-02-28',
      updated: '2024-01-19',
      website: 'powercorp.com',
      modules: [
        { name: 'Backup Control' },
        { name: 'Fault Detection' }
      ],
      connectedApis: [
        { name: 'Backup Controller', status: 'error' as const },
        { name: 'Fault Detector', status: 'connected' as const },
        { name: 'System Monitor', status: 'disconnected' as const }
      ],
      meters: { total: 14, active: 0, inactive: 14 },
      tickets: { count: 3, href: '/tickets/dg008' }
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'running', label: 'Running' },
    { value: 'stopped', label: 'Stopped' },
    { value: 'fault', label: 'Fault' }
  ];

  const filteredDGSets = dgSets.filter(dg => {
    const matchesSearch = dg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dg.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dg.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dashboardConfig = {
    sections: [
      // Header section
      {
        layout: {
          type: 'grid' as const,
          columns: 1,
          className: '',
        },
        components: [
          {
            name: 'PageHeader',
            props: {
              title: 'DG Monitor Dashboard',
              onBackClick: () => window.history.back(),
              backButtonText: 'Back to Dashboard',
              buttonsLabel: 'Refresh',
              variant: 'primary',
              onClick: () => console.log('Refresh dashboard'),
              showMenu: true,
              showDropdown: true,
              menuItems: [
                { id: 'export', label: 'Export Data' },
                { id: 'settings', label: 'Settings' },
              ],
              onMenuItemClick: (itemId: string) => {
                console.log(`Menu item clicked: ${itemId}`);
              },
            },
          },
        ],
      },
      // Page Title and Description
    //   {
    //     layout: {
    //       type: 'column' as const,
    //       className: 'mb-8',
    //     },
    //     components: [
    //       {
    //         name: 'SectionHeader',
    //         props: {
    //           title: 'DG Monitor Dashboard',
    //           titleLevel: 1,
    //           titleSize: '2xl',
    //           titleVariant: 'colorPrimaryDark',
    //           titleWeight: 'bold',
    //           titleAlign: 'left',
    //           subtitle: 'Welcome back, Admin User. Monitor all your diesel generators in real-time.',
    //           layout: 'vertical',
    //           gap: 'gap-2',
    //         },
    //       },
    //     ],
    //   },
      // Summary Cards
      {
        layout: {
          type: 'grid' as const,
          columns: 5,
          gap: 'gap-4',
          className:'',
        },
        components: [
          {
            name: 'Card',
            props: {
              title: 'Running',
              value: '4',
              icon: '/icons/check-circle.svg',
              bg: 'bg-green-100',
            },
          },
          {
            name: 'Card',
            props: {
              title: 'Fault',
              value: '2',
              icon: '/icons/close.svg',
              bg: 'bg-red-100',
            },
          },
          {
            name: 'Card',
            props: {
              title: 'Stopped',
              value: '2',
              icon: '/icons/minus.svg',
              bg: 'bg-blue-100',
            },
          },
          {
            name: 'Card',
            props: {
              title: 'Alerts',
              value: '10',
              icon: '/icons/alert-triangle.svg',
              bg: 'bg-yellow-100',
            },
          },
          {
            name: 'Card',
            props: {
              title: 'Avg Load',
              value: '34%',
              icon: '/icons/bolt.svg',
              bg: 'bg-gray-100',
            },
          },
        ],
      },
      // Search and Filter
      {
        layout: {
          type: 'grid' as const,
          columns: 2,
          gap: 'gap-4',
          className: 'mb-8',
        },
        components: [
          {
            name: 'Search',
            props: {
              value: searchQuery,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
              placeholder: 'Search by name, location, or ID...',
            },
          },
          {
            name: 'Dropdown',
            props: {
              name: 'statusFilter',
              value: statusFilter,
              onChange: (e: { target: { name: string; value: string | string[] } }) => setStatusFilter(e.target.value as string),
              options: statusOptions,
            },
          },
        ],
      },
      // DG Set Cards Grid
      {
        layout: {
          type: 'grid' as const,
          columns: 3,
          gap: 'gap-6',
          className: '',
        },
        components: filteredDGSets.map(dg => ({
          name: 'ApplicationCard',
          props: {
            // Core DG set data
            appName: dg.name,
            appId: dg.id,
            status: dg.status === 'running' ? 'Running' : dg.status === 'stopped' ? 'Stopped' : 'Fault',
            health: dg.health,
            category: dg.category,
            company: dg.company,
            subdomain: dg.subdomain,
            created: dg.created,
            updated: dg.updated,
            website: dg.website,
            
            // Modules and connections
            modules: dg.modules,
            connectedApis: dg.connectedApis,
            meters: dg.meters,
            tickets: dg.tickets,
            
            // Enhanced metrics display
            metrics: [
              {
                label: 'Load',
                value: dg.load,
                unit: '%',
                color: dg.load > 80 ? 'text-red-600' : dg.load > 50 ? 'text-yellow-600' : 'text-green-600'
              },
              {
                label: 'Fuel',
                value: dg.fuel,
                unit: '%',
                color: dg.fuel < 30 ? 'text-red-600' : dg.fuel < 50 ? 'text-yellow-600' : 'text-green-600'
              },
              {
                label: 'Efficiency',
                value: dg.efficiency,
                color: dg.efficiency === '94%' ? 'text-green-600' : dg.efficiency === '93%' ? 'text-green-600' : dg.efficiency === '92%' ? 'text-green-600' : dg.efficiency === '91%' ? 'text-green-600' : dg.efficiency === '90%' ? 'text-yellow-600' : 'text-red-600'
              },
              {
                label: 'Running Hours',
                value: dg.runningHoursToday,
                color: 'text-blue-600'
              }
            ],
            
            // Navigation props
            onCardClick: () => navigate(`/dg-detail/${dg.id}`),
            isClickable: true,
          },
        })),
      },
    ],
  };

  return (
    <Page sections={dashboardConfig.sections} />
  );
};

export default DGDashboard;

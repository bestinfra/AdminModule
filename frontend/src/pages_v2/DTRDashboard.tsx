import React, { useState, useEffect } from 'react';
import type { TableData } from '@components/global/Table';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';

// Brand green icon style
const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
};

const DTRDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [dtrStats, setDtrStats] = useState<any>({});
    const [consumptionStats, setConsumptionStats] = useState<any>({});
    const [dtrTableData, setDtrTableData] = useState<any[]>([]);
    const [alertsTableData, setAlertsTableData] = useState<any[]>([]);
    
    // Add a type for the trends data
    type Trend = {
      month: string;
      detected_count: number;
      analyzing_count: number;
      repairing_count: number;
      resolved_count: number;
      unresolved_count: number;
    };
    const [trends, setTrends] = useState<Trend[]>([]);

    // State for time range toggle
    const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly'>('Daily');

    // Chart data variables
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const alertSeries = [
        {
            name: 'Alerts',
            data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 10, 11, 12]
        }
    ];
    const alertColors = ['#10B981'];
    const statsRange = selectedTimeRange;

    // Chart download handler
    const handleChartDownload = () => {
        console.log('Downloading chart data...');
        // Add chart download logic here if needed
    };

  // DTR statistics cards data - Using only daily data consistently
  const dtrStatsCards = [
    {
      title: "Total DTRs",
      value: 29,
      icon: "/icons/dtr.svg",
      subtitle1: "Total Transformer Units",
      onValueClick: () => navigate("/dtr-statistics/total-dtrs"),
      iconStyle: ICON_FILTER_STYLE,
      bg: "bg-stat-icon-gradient",
    },
    {
      title: "Total LT Feeders",
      value: 33,
      icon: "/icons/feeder.svg",
      subtitle1: "Connected to DTRs",
      onValueClick: () => navigate("/dtr-statistics/total-lt-feeders"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Today's Fuse Blown",
      value: 1,
      icon: "/icons/power_failure.svg",
      subtitle1: "0.03% of Total DTRs",
      onValueClick: () => navigate("/dtr-statistics/total-fuse-blown"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Overloaded Feeders",
      value: 0,
      icon: "/icons/dtr.svg",
      subtitle1: "0.00% of Total Feeders",
      onValueClick: () => navigate("/dtr-statistics/overloaded-feeders"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Underloaded Feeders",
      value: 33,
      icon: "/icons/dtr.svg",
      subtitle1: "100.0% of Total Feeders",
      onValueClick: () => navigate("/dtr-statistics/underloaded-feeders"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "LT Side Fuse Blown",
      value: 1,
      icon: "/icons/power_failure.svg",
      subtitle1: "1 Incident Today",
      onValueClick: () => navigate("/dtr-statistics/lt-side-fuse-blown"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Unbalanced DTRs",
      value: 0,
      icon: "/icons/dtr.svg",
      subtitle1: "0.00% of Total DTRs",
      onValueClick: () => navigate("/dtr-statistics/unbalanced-dtrs"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Power Failure Feeders",
      value: 0,
      icon: "/icons/power_failure.svg",
      subtitle1: "0.00% of Feeders",
      onValueClick: () => navigate("/dtr-statistics/power-failure-feeders"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "HT Side Fuse Blown",
      value: 0,
      icon: "/icons/power_failure.svg",
      subtitle1: "0 Incident Today",
      onValueClick: () => navigate("/dtr-statistics/ht-side-fuse-blown"),
      iconStyle: ICON_FILTER_STYLE,
    },
  ];

  // DTR Consumption Cards - Daily data
  const dailyConsumptionCards = [
    {
      title: "Total kWh",
      value: "3,847.32",
      icon: "/icons/consumption.svg",
      subtitle1: "Today's Active Energy",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Total kVAh",
      value: "3,892.45",
      icon: "/icons/consumption.svg",
      subtitle1: "Today's Apparent Energy",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Total kW",
      value: "6.10",
      icon: "/icons/consumption.svg",
      subtitle1: "Current Active Power",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Total kVA",
      value: "6.26",
      icon: "/icons/consumption.svg",
      subtitle1: "Current Apparent Power",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Active DTRs",
      value: 29,
      icon: "/icons/dtr.svg",
      subtitle1: "100.00% of Total DTRs",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "In-Active DTRs",
      value: 0,
      icon: "/icons/dtr.svg",
      subtitle1: "0.00% of Total DTRs",
      iconStyle: ICON_FILTER_STYLE,
    },
  ];

  // DTR Consumption Cards - Monthly data
  const monthlyConsumptionCards = [
    {
      title: "Total kWh",
      value: "111,931.96",
      icon: "/icons/consumption.svg",
      subtitle1: "Monthly Active Energy",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Total kVAh",
      value: "113,369.06",
      icon: "/icons/consumption.svg",
      subtitle1: "Monthly Apparent Energy",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Avg kW",
      value: "5.87",
      icon: "/icons/consumption.svg",
      subtitle1: "Monthly Average Power",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Avg kVA",
      value: "6.02",
      icon: "/icons/consumption.svg",
      subtitle1: "Monthly Average Apparent",
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Active DTRs",
      value: 29,
      icon: "/icons/dtr.svg",
      subtitle1: "100.00% of Total DTRs",
      iconStyle: ICON_FILTER_STYLE,
    },
    { 
      title: "In-Active DTRs",
      value: 0,
      icon: "/icons/dtr.svg",
      subtitle1: "0.00% of Total DTRs",
      iconStyle: ICON_FILTER_STYLE,
    },
  ];

  // Get current consumption cards data based on selected time range
  const getCurrentConsumptionCards = () => {
    return selectedTimeRange === 'Daily' ? dailyConsumptionCards : monthlyConsumptionCards;
  };
  // Dummy data for DTRs table
  const dtrTableColumns = [
    { key: "dtrId", label: "DTR ID" },
    { key: "dtrName", label: "DTR Name" },
    { key: "feedersCount", label: "Feeders Count" },
    { key: "streetName", label: "Street Name" },
    { key: "city", label: "City" },
    { key: "commStatus", label: "Comm-Status" },
  ];
  const dtrTableData = [
    {
      dtrId: "TRANSFORMER-01",
      dtrName: "TGNP_DTR-01",
      feedersCount: 1,
      streetName: "Waddepally",
      city: "Warangal",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-02",
      dtrName: "TGNP_DTR-02",
      feedersCount: 1,
      streetName: "Sun city",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-03",
      dtrName: "TGNP_DTR-03",
      feedersCount: 4,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-04",
      dtrName: "TGNP_DTR-04",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-05",
      dtrName: "TGNP_DTR-05",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-06",
      dtrName: "TGNP_DTR-06",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-07",
      dtrName: "TGNP_DTR-07",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-08",
      dtrName: "TGNP_DTR-08",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-09",
      dtrName: "TGNP_DTR-09",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-10",
      dtrName: "TGNP_DTR-10",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
  ];

  const dtrTableActions = [
    {
            label: 'View',
            icon: '/icons/eye.svg',
      onClick: (row: TableData) => navigate(`/dtr/${row.dtrId}`),
    },
  ];

    // Alerts table columns
    const alertsTableColumns = [
        { key: 'alert', label: 'Alert' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
    ];

    // Load data from APIs
    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            console.log('🔍 Fetching DTR data from:', BACKEND_URL);
            
            try {
                // Fetch consolidated DTR stats
                console.log('📊 Fetching consolidated DTR stats...');
                const statsResponse = await fetch(`${BACKEND_URL}/dtrs/stats`);
                console.log('📊 Stats response status:', statsResponse.status);
                if (statsResponse.ok) {
                    const statsResult = await statsResponse.json();
                    console.log('📊 Stats result:', statsResult);
                    if (statsResult.success) {
                        setDtrStats(statsResult.data.row1);
                        setConsumptionStats(statsResult.data.row2[selectedTimeRange.toLowerCase()]);
                    }
                } else {
                    console.error('❌ Stats response not ok:', statsResponse.status, statsResponse.statusText);
                }

                // Fetch DTR table data
                console.log('📋 Fetching DTR table data...');
                const tableResponse = await fetch(`${BACKEND_URL}/dtrs`);
                console.log('📋 Table response status:', tableResponse.status);
                if (tableResponse.ok) {
                    const tableResult = await tableResponse.json();
                    console.log('📋 Table result:', tableResult);
                    if (tableResult.success) {
                        setDtrTableData(tableResult.data || []);
                    }
                                } else {
                    console.error('❌ Table response not ok:', tableResponse.status, tableResponse.statusText);
                }

                // Fetch alerts
                console.log('🚨 Fetching alerts...');
                const alertsResponse = await fetch(`${BACKEND_URL}/dtrs/alerts`);
                console.log('🚨 Alerts response status:', alertsResponse.status);
                if (alertsResponse.ok) {
                    const alertsResult = await alertsResponse.json();
                    console.log('🚨 Alerts result:', alertsResult);
                    if (alertsResult.success) {
                        setAlertsTableData(alertsResult.data || []);
                    }
                                } else {
                    console.error('❌ Alerts response not ok:', alertsResponse.status, alertsResponse.statusText);
                }

                // Fetch DTR alert trends
                console.log('📈 Fetching trends...');
                const trendsResponse = await fetch(`${BACKEND_URL}/dtrs/alerts/trends`);
                console.log('📈 Trends response status:', trendsResponse.status);
                if (trendsResponse.ok) {
                    const trendsResult = await trendsResponse.json();
                    console.log('📈 Trends result:', trendsResult);
                    if (trendsResult.success) {
                        setTrends(trendsResult.data || []);
                    }
                                } else {
                    console.error('❌ Trends response not ok:', trendsResponse.status, trendsResponse.statusText);
                }
                        } catch (err: any) {
                console.error('💥 Error fetching data:', err);
                setError(err.message || 'Failed to fetch DTR data');
            }
        };

        fetchData();
    }, [selectedTimeRange]);

    // Map real-time trends data for the Statistics BarChart
    const xAxisData = trends.map(t => t.month);
    const statusTypes = [
      { key: 'detected_count', name: 'Detected', color: '#e74c3c' },
      { key: 'analyzing_count', name: 'Analyzing', color: '#f39c12' },
      { key: 'repairing_count', name: 'Repairing', color: '#3498db' },
      { key: 'resolved_count', name: 'Resolved', color: '#10B981' },
      { key: 'unresolved_count', name: 'Unresolved', color: '#EF4444' },
    ];
    const seriesData = statusTypes.map(type => ({
      name: type.name,
      data: trends.map(t => {
        switch (type.key) {
          case 'detected_count': return t.detected_count;
          case 'analyzing_count': return t.analyzing_count;
          case 'repairing_count': return t.repairing_count;
          case 'resolved_count': return t.resolved_count;
          case 'unresolved_count': return t.unresolved_count;
          default: return 0;
        }
      })
    }));
    const seriesColors = statusTypes.map(type => type.color);

    // Function to handle time range change
    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range as 'Daily' | 'Monthly');
    };

    // Get current alerts data based on selected time range
    const getCurrentAlertsData = () => {
        return selectedTimeRange === 'Daily' ? dailyAlertsData : monthlyAlertsData;
    };


    // Dummy data for DTR Alert Statistics
    // TODO: Unused - consider removing if not needed.
    // const [statsRange, setStatsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    // const [statsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    // const alertTypes = [
    //     { name: 'LT Fuse Blown (R - Phase)', color: '#e74c3c' },
    //     { name: 'Unbalanced Load', color: '#f39c12' },
    //     { name: 'Low PF (R - Phase)', color: '#3498db' },
    //     { name: 'Power Failure', color: '#9b59b6' },
    //     { name: 'B_PH Missing', color: '#8e44ad' },
    //     { name: 'R_PH CT Reversed', color: '#e67e22' },
    //     { name: 'HT Fuse Blown (B - Phase)', color: '#f1c40f' },
    //     { name: 'LT Fuse Blown (Y - Phase)', color: '#1abc9c' },
    //     { name: 'LT Fuse Blown (B - Phase)', color: '#e67e22' },
    //     { name: 'R-L-P', color: '#9b59b6' },
    // ];
    // const months = [
    //     'May 2025',
    //     'Apr 2025',
    //     'Mar 2025',
    //     'Feb 2025',
    //     'Jan 2025',
    //     'Dec 2024',
    //     'Nov 2024',
    //     'Oct 2024',
    //     'Sept 2024',
    // ];
    // const alertSeries = alertTypes.map((type) => ({
    //     name: type.name,
    //     data: months.map(() => Math.floor(Math.random() * 350)),
    // }));
    // const alertColors = alertTypes.map((type) => type.color);

    // // Handle Excel download for chart data
    // const handleChartDownload = () => {
    //     exportChartData(months, alertSeries, 'dtr-statistics-data');
    // };

    return (
        <div className="p-2 min-h-screen">
            {error && (
                <div className="mb-4 p-4 bg-danger-light border border-danger rounded-md text-danger">
                    {error}
                </div>
            )}
            <Page
                sections={[
                    // Header section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'DTR Dashboard',
                                    onBackClick: () => window.history.back(),
                                    backButtonText: 'Back to Dashboard',
                                    buttonsLabel: 'Upload',
                                    variant: 'primary',
                                    onClick: () =>
                                        console.log('Adding new DTR...'),
                                    showMenu: true,
                                    showDropdown: true,
                                    menuItems: [
                                        { id: 'all', label: 'Alerts' },
                                        { id: 'export', label: 'Export' },
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        console.log(`Filter by: ${itemId}`);
                                    },
                                },
                            },
                        ],
                    },
                    // DTR Statistics Cards
          {
            layout: {
                            type: 'grid' as const,
                            columns: 3,
                            gap: 'gap-4',
                            className: 'mb-8'
                        },
                        components: [
                {
                                name: 'Card',
                                props: {
                                    title: 'Total DTRs',
                                    value: dtrStats.totalDtrs || 0,
                                    icon: '/icons/dtr.svg',
                                    subtitle1: 'Total Transformer Units',
                                    onValueClick: () => navigate('/dtr-statistics/total-dtrs'),
                                    iconStyle: ICON_FILTER_STYLE,
                                    bg: 'bg-stat-icon-gradient',
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Total LT Feeders',
                                    value: dtrStats.totalLtFeeders || 0,
                                    icon: '/icons/feeder.svg',
                                    subtitle1: 'Connected to DTRs',
                                    onValueClick: () => navigate('/dtr-statistics/total-lt-feeders'),
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                    {
                                name: 'Card',
                      props: {
                        title: "Distribution Transformer (DTR) Statistics",
                        titleLevel: 2,
                        titleSize: "md",
                        titleVariant: "colorPrimaryDark",
                        titleWeight: "medium",
                        titleAlign: "left",
                        layout: "horizontal",
                        gap: "gap-4",
                      },
                      span: { col: 3, row: 1 },
                    },
                      ...dtrStatsCards.map((stat) => ({
                       name: "Card",
                       props: {
                                    title: 'Underloaded Feeders',
                                    value: dtrStats.underloadedFeeders || 0,
                                    icon: '/icons/dtr.svg',
                                    subtitle1: `${dtrStats.underloadedPercentage || 0}% of Total Feeders`,
                                    onValueClick: () => navigate('/dtr-statistics/underloaded-feeders'),
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'LT Side Fuse Blown',
                                    value: dtrStats.ltSideFuseBlown || 0,
                                    icon: '/icons/power_failure.svg',
                                    subtitle1: `${dtrStats.ltSideFuseBlown || 0} Incidents`,
                                    onValueClick: () => navigate('/dtr-statistics/lt-side-fuse-blown'),
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                },
                {
                                name: 'Card',
                                props: {
                                    title: 'Unbalanced DTRs',
                                    value: dtrStats.unbalancedDtrs || 0,
                                    icon: '/icons/dtr.svg',
                                    subtitle1: `${dtrStats.unbalancedPercentage || 0}% of Total DTRs`,
                                    onValueClick: () => navigate('/dtr-statistics/unbalanced-dtrs'),
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                                              {
                                name: 'Card',
                          props: {
                                    title: 'Power Failure Feeders',
                                    value: dtrStats.powerFailureFeeders || 0,
                                    icon: '/icons/power_failure.svg',
                                    subtitle1: `${dtrStats.powerFailurePercentage || 0}% of Feeders`,
                                    onValueClick: () => navigate('/dtr-statistics/power-failure-feeders'),
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                            {
                                name: 'Card',
                              props: {
                                    title: 'HT Side Fuse Blown',
                                    value: dtrStats.htSideFuseBlown || 0,
                                    icon: '/icons/power_failure.svg',
                                    subtitle1: `${dtrStats.htSideFuseBlown || 0} Incident`,
                                    onValueClick: () => navigate('/dtr-statistics/ht-side-fuse-blown'),
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            }
                        ]
                    },
                    // Consumption & Energies section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8'
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Consumption & Energies',
                                    level: 2,
                                    size: 'md',
                                    variant: 'primary',
                                    weight: 'bold',
                                    align: 'left',
                                    className: 'mb-4'
                                }
                            },
                            {
                                name: 'TimeRangeSelector',
                                props: {
                                    availableTimeRanges: ['Daily', 'Monthly'],
                                selectedTimeRange: selectedTimeRange,
                                handleTimeRangeChange: handleTimeRangeChange, 
                                }
                            }
                        ]
                    },
                    // Consumption & Energies Cards
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 2,
                            gap: 'gap-4',
                            className: 'mb-8'
                        },
                        components: [
                            {
                                name: 'Card',
                                props: {
                                    title: 'Total kWh',
                                    value: consumptionStats.totalKwh || '0',
                                    icon: '/icons/consumption.svg',
                                    subtitle1: 'Cumulative Active Energy',
                                    iconStyle: ICON_FILTER_STYLE,
                                    bg: 'bg-stat-icon-gradient',
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Total kVAh',
                                    value: consumptionStats.totalKvah || '0',
                                    icon: '/icons/consumption.svg',
                                    subtitle1: 'Cumulative Apparent Energy',
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                            {
                             name: 'Card',
                             props: {
                                    title: 'Total kW',
                                    value: consumptionStats.totalKw || '0',
                                    icon: '/icons/consumption.svg',
                                    subtitle1: 'Active Power',
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Total kVA',
                                    value: consumptionStats.totalKva || '0',
                                    icon: '/icons/consumption.svg',
                                    subtitle1: 'Apparent Power',
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Active DTRs',
                                    value: dtrStats.activeDtrs || 0,
                                    icon: '/icons/dtr.svg',
                                    subtitle1: `${dtrStats.activePercentage || 0}% of Total DTRs`,
                                    iconStyle: ICON_FILTER_STYLE,
                                    iconColor: 'green'
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'In-Active DTRs',
                                    value: dtrStats.inactiveDtrs || 0,
                                    icon: '/icons/dtr.svg',
                                    subtitle1: `${dtrStats.inactivePercentage || 0}% of Total DTRs`,
                                    iconStyle: ICON_FILTER_STYLE,
                                    iconColor: 'red'
                                }
                            }
                        ]
                    },
                    // DTRs Table section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8 border border-primary-border rounded-3xl p-6',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'DTRs',
                                    level: 2,
                                    className: 'text-base font-medium',
                                },
                            },
                            {
                                name: 'Table',
                                props: {
                                    data: dtrTableData,
                                    columns: dtrTableColumns,
                                    actions: dtrTableActions,
                                    showActions: true,
                                    searchable: true,
                                    pagination: true,
                                    initialRowsPerPage: 10,
                                    emptyMessage: 'No DTRs found',
                                    onRowClick: (row: TableData) =>
                                        navigate(`/dtr/${row.dtrId}`),
                                },
                            },
                        ],
                    },
                    // Latest Alerts section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8 border border-primary-border rounded-3xl p-6',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Latest Alerts',
                                    level: 2,
                                    className: 'text-base font-medium',
                                },
                            },
                            {
                                name: 'Table',
                                props: {
                                    data: alertsTableData,
                                    columns: alertsTableColumns,
                                    showActions: false,
                                    searchable: true,
                                    pagination: true,
                                    initialRowsPerPage: 10,
                                    emptyMessage: 'No alerts found',
                                },
                            },
                        ],
                    },
                    // Statistics Chart section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8',
                        },
                        components: [
                            {
                                name: 'BarChart',
                                props: {
                                    xAxisData: months,
                                    seriesData: alertSeries,
                                    seriesColors: alertColors,
                                    height: 300,
                                    showLegendInteractions: true,
                                    timeRange: statsRange,
                                    showHeader: true,
                                    headerTitle: 'Statistics',
                                    showDownloadButton: true,
                                    onDownload: () => handleChartDownload(),
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default DTRDashboard;

import React, { useState, useEffect } from 'react';
import type { TableData } from '@components/global/Table';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import BarChart from '@/graphs/BarChart';
import { exportChartData } from '@/utils/excelExport';
import BACKEND_URL from '@/config';

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

    // DTR table columns
    const dtrTableColumns = [
        { key: 'dtrId', label: 'DTR ID' },
        { key: 'dtrName', label: 'DTR Name' },
        { key: 'feedersCount', label: 'Feeders Count' },
        { key: 'streetName', label: 'Street Name' },
        { key: 'city', label: 'City' },
        { key: 'commStatus', label: 'Comm-Status' },
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

    // Handle Excel download for chart data
    const handleChartDownload = () => {
        exportChartData(xAxisData, seriesData, 'dtr-statistics-data');
    };

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
                                    title: 'Total Fuse Blown',
                                    value: dtrStats.totalFuseBlown || 0,
                                    icon: '/icons/power_failure.svg',
                                    subtitle1: `${dtrStats.fuseBlownPercentage || 0}% of Total DTRs`,
                                    onValueClick: () => navigate('/dtr-statistics/total-fuse-blown'),
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Overloaded Feeders',
                                    value: dtrStats.overloadedFeeders || 0,
                                    icon: '/icons/dtr.svg',
                                    subtitle1: `${dtrStats.overloadedPercentage || 0}% of Total Feeders`,
                                    onValueClick: () => navigate('/dtr-statistics/overloaded-feeders'),
                                    iconStyle: ICON_FILTER_STYLE,
                                }
                            },
                            {
                                name: 'Card',
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
                                name: 'Holder',
                                props: {
                                    title: 'Statistics',
                                    loading: false,
                                    height: 'auto',
                                    className: 'mb-4',
                                    hasDownload: true,
                                    handleDownload: handleChartDownload,
                                    children: (
                                        <BarChart
                                            xAxisData={xAxisData}
                                            seriesData={seriesData}
                                            seriesColors={seriesColors}
                                            height={300}
                                            showLegendInteractions={true}
                                            timeRange="Monthly"
                                        />
                                    ),
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

import React, { useState, useEffect } from 'react';
import type { TableData } from '@components/global/Table';
import { useNavigate } from 'react-router-dom';
import PageC from '@components/global/PageC';
import BACKEND_URL from '../config';

const DTRDashboard: React.FC = () => {
    const navigate = useNavigate();
   // const [loading, setLoading] = useState(true);
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

    // Brand green icon style
    const brandGreenIconStyle = {
        filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
    };

    // Alerts table columns
    const alertsTableColumns = [
        { key: 'alert', label: 'Alert' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
    ];

    // Load data from APIs
    useEffect(() => {
        const fetchData = async () => {
           // setLoading(true);
            setError(null);
            
            try {
                // Fetch DTR stats
                const statsResponse = await fetch(`${BACKEND_URL}/dtrs/stats`);
                if (statsResponse.ok) {
                    const statsResult = await statsResponse.json();
                    if (statsResult.success) {
                        setDtrStats(statsResult.data);
                    }
                }

                // Fetch consumption stats
                const consumptionResponse = await fetch(`${BACKEND_URL}/dtrs/consumptionStats`);
                if (consumptionResponse.ok) {
                    const consumptionResult = await consumptionResponse.json();
                    if (consumptionResult.success) {
                        setConsumptionStats(consumptionResult.data);
                    }
                }

                // Fetch DTR table data
                const tableResponse = await fetch(`${BACKEND_URL}/dtrs`);
                if (tableResponse.ok) {
                    const tableResult = await tableResponse.json();
                    if (tableResult.success) {
                        setDtrTableData(tableResult.data || []);
                    }
                }

                // Fetch alerts
                const alertsResponse = await fetch(`${BACKEND_URL}/dtrs/alerts`);
                if (alertsResponse.ok) {
                    const alertsResult = await alertsResponse.json();
                    if (alertsResult.success) {
                        setAlertsTableData(alertsResult.data || []);
                    }
                }

                // Fetch DTR alert trends
                const trendsResponse = await fetch(`${BACKEND_URL}/dtrs/alerts/trends`);
                if (trendsResponse.ok) {
                    const trendsResult = await trendsResponse.json();
                    if (trendsResult.success) {
                        setTrends(trendsResult.data || []);
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch DTR data');
            } finally {
                //setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    return (
        <div className="p-2 min-h-screen">
            {error && (
                <div className="mb-4 p-4 bg-danger-light border border-danger rounded-md text-danger">
                    {error}
                </div>
            )}
            <PageC
                sections={[
                    // Header section
                    {
                        layout: {
                            type: 'row' as const,
                            className: 'mb-6'
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: "DTR Dashboard",
                                    onBackClick: () => window.history.back(),
                                    backButtonText: "Back to Dashboard",
                                    buttonsLabel: "Add DTR",
                                    variant: "primary",
                                    onClick: () => console.log('Adding new DTR...'),
                                    showMenu: true,
                                    showDropdown: true,
                                    menuItems: [
                                        { id: 'all', label: 'All DTRs' },
                                        { id: 'active', label: 'Active DTRs' },
                                        { id: 'inactive', label: 'Inactive DTRs' },
                                        { id: 'overloaded', label: 'Overloaded' },
                                        { id: 'underloaded', label: 'Underloaded' },
                                        { id: 'fuse-blown', label: 'Fuse Blown' },
                                        { id: 'unbalanced', label: 'Unbalanced' },
                                        { id: 'power-failure', label: 'Power Failure' }
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        console.log(`Filter by: ${itemId}`);
                                    }
                                }
                            }
                        ]
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
                                    iconStyle: brandGreenIconStyle
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
                                    iconStyle: brandGreenIconStyle
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
                                    iconStyle: brandGreenIconStyle
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
                                    iconStyle: brandGreenIconStyle
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
                                    iconStyle: brandGreenIconStyle
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
                                    iconStyle: brandGreenIconStyle
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
                                    iconStyle: brandGreenIconStyle
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
                                    iconStyle: brandGreenIconStyle
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
                                    iconStyle: brandGreenIconStyle
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
                                    selectedTimeRange: 'Daily',
                                    handleTimeRangeChange: () => {},
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
                                    iconStyle: brandGreenIconStyle
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Total kVAh',
                                    value: consumptionStats.totalKvah || '0',
                                    icon: '/icons/consumption.svg',
                                    subtitle1: 'Cumulative Apparent Energy',
                                    iconStyle: brandGreenIconStyle
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Total kW',
                                    value: consumptionStats.totalKw || '0',
                                    icon: '/icons/consumption.svg',
                                    subtitle1: 'Active Power',
                                    iconStyle: brandGreenIconStyle
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Total kVA',
                                    value: consumptionStats.totalKva || '0',
                                    icon: '/icons/consumption.svg',
                                    subtitle1: 'Apparent Power',
                                    iconStyle: brandGreenIconStyle
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Active DTRs',
                                    value: dtrStats.activeDtrs || 0,
                                    icon: '/icons/dtr.svg',
                                    subtitle1: `${dtrStats.activePercentage || 0}% of Total DTRs`,
                                    iconStyle: brandGreenIconStyle
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'In-Active DTRs',
                                    value: dtrStats.inactiveDtrs || 0,
                                    icon: '/icons/dtr.svg',
                                    subtitle1: `${dtrStats.inactivePercentage || 0}% of Total DTRs`,
                                    iconStyle: brandGreenIconStyle
                                }
                            }
                        ]
                    },
                    // DTRs Table section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8'
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'DTRs',
                                    level: 2,
                                    className: 'text-lg font-semibold mb-4'
                                }
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
                                    emptyMessage: "No DTRs found",
                                    onRowClick: (row: TableData) => navigate(`/dtr/${row.dtrId}`)
                                }
                            }
                        ]
                    },
                    // Latest Alerts section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8'
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Latest Alerts',
                                    level: 2,
                                    className: 'text-lg font-semibold mb-4'
                                }
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
                                    emptyMessage: "No alerts found"
                                }
                            }
                        ]
                    },
                    // Statistics Chart section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8'
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Statistics',
                                    level: 2,
                                    className: 'text-lg font-semibold mb-4'
                                }
                            },
                            {
                                name: 'BarChart',
                                props: {
                                    xAxisData,
                                    seriesData,
                                    seriesColors,
                                    height: 300,
                                    showHeader: true,
                                    headerTitle: 'DTR Alerts Trends',
                                    dateRange: '',
                                    showDownloadButton: true,
                                    showViewToggle: true,
                                    viewToggleOptions: ['Graph', 'Table'],
                                    showTableView: true,
                                    ariaLabel: 'Monthly DTR alert statistics chart',
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
};

export default DTRDashboard;

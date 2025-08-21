import React, { useState, Suspense, useEffect } from 'react';
import Page from '@/components/global/PageC';
import { useNavigate } from 'react-router-dom';
// import { exportChartData } from '@/utils/excelExport';
// import { Pagination } from 'antd';

// Dummy data for fallback
const dummyConsumerStatsData = [
    {
        id: 1,
        title: 'Total Consumers',
        value: 'N/A',
        icon: '/icons/units.svg',
        subtitle1: '0 Active',
        subtitle2: '0 In-Active',
        onValueClick: () => {},
    },
    {
        id: 2,
        title: 'High-Usage Consumers',
        value: 'N/A ',
        icon: '/icons/heavy-user.svg',
        subtitle1: 'N/A kWh Average Consumption',
        subtitle2: '',
    },
];

const dummyConsumptionBillingData = [
    {
        id: 1,
        title: 'Total Consumption',
        value: 'N/A',
        icon: '/icons/plug-alt.svg',
        subtitle1: '0 Active Consumption',
        subtitle2: '0 In-Active Consumption',
        onValueClick: () => {},
        showTrend: true,
        comparisonValue: 0,
        previousValue: 'vs. N/A kWh Yesterday',
    },
    {
        id: 2,
        title: 'Total Billing',
        value: 'N/A',
        icon: '/icons/rupee.svg',
        subtitle1: 'N/A kWh Average Billing',
        subtitle2: '0 kWh Average Billing',
        showTrend: true,
        comparisonValue: 0,
        previousValue: 'vs. N/A kWh Yesterday',
    },
];

const dummyOverdueConsumersData = [
    {
        uid: 'N/A',
        consumerName: 'N/A',
        flatNo: 'N/A',
        overdue: '0.00',
    },
      {
        uid: 'N/A',
        consumerName: 'N/A',
        flatNo: 'N/A',
        overdue: '0.00',
    },
    {
        uid: 'N/A',
        consumerName: 'N/A',
        flatNo: 'N/A',
        overdue: '0.00',
    },
    
    {
        uid: 'N/A',
        consumerName: 'N/A',
        flatNo: 'N/A',
        overdue: '0.00',
    },
    {
        uid: 'N/A',
        consumerName: 'N/A',
        flatNo: 'N/A',
        overdue: '0.00',
    },
];

const dummyMeterStatusData = [
    { value: 0, name: 'Communicating' },
    { value: 0, name: 'Non-Communicating' },
];

const dummyBillingChartData = {
    xAxisData: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    seriesData: [
        {
            name: 'Bills Generated',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'Paid',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'Pending',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'Overdue',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ],
    seriesColors: [
        '#3B82F6', // Blue for Bills Generated
        '#10B981', // Green for Paid
        '#EF4444', // Red for Pending
        '#F97316', // Orange for Overdue
    ],
};

const ConsumerDashboard: React.FC = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly'>('Daily');
    const navigate = useNavigate();

    // State for API data
    const [consumerStatsData, setConsumerStatsData] = useState(dummyConsumerStatsData);
    const [consumptionBillingData, setConsumptionBillingData] = useState(dummyConsumptionBillingData);
    const [overdueConsumersData, setOverdueConsumersData] = useState(dummyOverdueConsumersData);
    const [meterStatusData, setMeterStatusData] = useState(dummyMeterStatusData);
    const [billingChartData, setBillingChartData] = useState(dummyBillingChartData);

    // Loading states
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [isBillingLoading, setIsBillingLoading] = useState(true);
    const [isOverdueLoading, setIsOverdueLoading] = useState(true);
    const [isMeterStatusLoading, setIsMeterStatusLoading] = useState(true);
    const [isChartLoading, setIsChartLoading] = useState(true);

    // State for tracking failed APIs
    const [failedApis, setFailedApis] = useState<Array<{
        id: string;
        name: string;
        retryFunction: () => Promise<void>;
        errorMessage: string;
    }>>([]);


    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range as 'Daily' | 'Monthly');
    };

    // Retry functions for each API
    const retryStatsAPI = async () => {
        setIsStatsLoading(true);
        try {
            // Simulate API call - replace with actual API
            const response = await fetch('/api/consumer/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }
            
            const data = await response.json();
            setConsumerStatsData(data);
            setFailedApis(prev => prev.filter(api => api.id !== 'stats'));
        } catch (err: any) {
            console.error("Error in Stats API:", err);
            setConsumerStatsData(dummyConsumerStatsData);
        } finally {
            setTimeout(() => {
                setIsStatsLoading(false);
            }, 1000);
        }
    };

    const retryBillingAPI = async () => {
        setIsBillingLoading(true);
        try {
            // Simulate API call - replace with actual API
            const response = await fetch('/api/consumer/billing');
            if (!response.ok) throw new Error('Failed to fetch billing');
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }
            
            const data = await response.json();
            setConsumptionBillingData(data);
            setFailedApis(prev => prev.filter(api => api.id !== 'billing'));
        } catch (err: any) {
            console.error("Error in Billing API:", err);
            setConsumptionBillingData(dummyConsumptionBillingData);
        } finally {
            setTimeout(() => {
                setIsBillingLoading(false);
            }, 1000);
        }
    };

    const retryOverdueAPI = async () => {
        setIsOverdueLoading(true);
        try {
            // Simulate API call - replace with actual API
            const response = await fetch('/api/consumer/overdue');
            if (!response.ok) throw new Error('Failed to fetch overdue');
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }
            
            const data = await response.json();
            setOverdueConsumersData(data);
            setFailedApis(prev => prev.filter(api => api.id !== 'overdue'));
        } catch (err: any) {
            console.error("Error in Overdue API:", err);
            setOverdueConsumersData(dummyOverdueConsumersData);
        } finally {
            setTimeout(() => {
                setIsOverdueLoading(false);
            }, 1000);
        }
    };

    const retryMeterStatusAPI = async () => {
        setIsMeterStatusLoading(true);
        try {
            // Simulate API call - replace with actual API
            const response = await fetch('/api/consumer/meter-status');
            if (!response.ok) throw new Error('Failed to fetch meter status');
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }
            
            const data = await response.json();
            setMeterStatusData(data);
            setFailedApis(prev => prev.filter(api => api.id !== 'meterStatus'));
        } catch (err: any) {
            console.error("Error in Meter Status API:", err);
            setMeterStatusData(dummyMeterStatusData);
        } finally {
            setTimeout(() => {
                setIsMeterStatusLoading(false);
            }, 1000);
        }
    };

    const retryChartAPI = async () => {
        setIsChartLoading(true);
        try {
            // Simulate API call - replace with actual API
            const response = await fetch('/api/consumer/chart');
            if (!response.ok) throw new Error('Failed to fetch chart');
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }
            
            const data = await response.json();
            setBillingChartData(data);
            setFailedApis(prev => prev.filter(api => api.id !== 'chart'));
        } catch (err: any) {
            console.error("Error in Chart API:", err);
            setBillingChartData(dummyBillingChartData);
        } finally {
            setTimeout(() => {
                setIsChartLoading(false);
            }, 1000);
        }
    };

    // Retry specific API
    const retrySpecificAPI = (apiId: string) => {
        const api = failedApis.find(a => a.id === apiId);
        if (api) {
            api.retryFunction();
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        const fetchStats = async () => {
            setIsStatsLoading(true);
            try {
                // Simulate API call - replace with actual API
                const response = await fetch('/api/consumer/stats');
                if (!response.ok) throw new Error('Failed to fetch stats');
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid response format');
                }
                
                const data = await response.json();
                setConsumerStatsData(data);
            } catch (err: any) {
                console.error('Error fetching stats:', err);
                setConsumerStatsData(dummyConsumerStatsData);
                setFailedApis(prev => {
                    if (!prev.find(api => api.id === 'stats')) {
                        return [...prev, { 
                            id: 'stats', 
                            name: 'Consumer Stats', 
                            retryFunction: retryStatsAPI, 
                            errorMessage: 'Failed to load Consumer Statistics. Please try again.' 
                        }];
                    }
                    return prev;
                });
            } finally {
                setTimeout(() => {
                    setIsStatsLoading(false);
                }, 1000);
            }
        };

        const fetchBilling = async () => {
            setIsBillingLoading(true);
            try {
                // Simulate API call - replace with actual API
                const response = await fetch('/api/consumer/billing');
                if (!response.ok) throw new Error('Failed to fetch billing');
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid response format');
                }
                
                const data = await response.json();
                setConsumptionBillingData(data);
            } catch (err: any) {
                console.error('Error fetching billing:', err);
                setConsumptionBillingData(dummyConsumptionBillingData);
                setFailedApis(prev => {
                    if (!prev.find(api => api.id === 'billing')) {
                        return [...prev, { 
                            id: 'billing', 
                            name: 'Billing Data', 
                            retryFunction: retryBillingAPI, 
                            errorMessage: 'Failed to load Billing Data. Please try again.' 
                        }];
                    }
                    return prev;
                });
            } finally {
                setTimeout(() => {
                    setIsBillingLoading(false);
                }, 1000);
            }
        };

        const fetchOverdue = async () => {
            setIsOverdueLoading(true);
            try {
                // Simulate API call - replace with actual API
                const response = await fetch('/api/consumer/overdue');
                if (!response.ok) throw new Error('Failed to fetch overdue');
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid response format');
                }
                
                const data = await response.json();
                setOverdueConsumersData(data);
            } catch (err: any) {
                console.error('Error fetching overdue:', err);
                setOverdueConsumersData(dummyOverdueConsumersData);
                setFailedApis(prev => {
                    if (!prev.find(api => api.id === 'overdue')) {
                        return [...prev, { 
                            id: 'overdue', 
                            name: 'Overdue Data', 
                            retryFunction: retryOverdueAPI, 
                            errorMessage: 'Failed to load Overdue Data. Please try again.' 
                        }];
                    }
                    return prev;
                });
            } finally {
                setTimeout(() => {
                    setIsOverdueLoading(false);
                }, 1000);
            }
        };

        const fetchMeterStatus = async () => {
            setIsMeterStatusLoading(true);
            try {
                // Simulate API call - replace with actual API
                const response = await fetch('/api/consumer/meter-status');
                if (!response.ok) throw new Error('Failed to fetch meter status');
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid response format');
                }
                
                const data = await response.json();
                setMeterStatusData(data);
            } catch (err: any) {
                console.error('Error fetching meter status:', err);
                setMeterStatusData(dummyMeterStatusData);
                setFailedApis(prev => {
                    if (!prev.find(api => api.id === 'meterStatus')) {
                        return [...prev, { 
                            id: 'meterStatus', 
                            name: 'Meter Status', 
                            retryFunction: retryMeterStatusAPI, 
                            errorMessage: 'Failed to load Meter Status. Please try again.' 
                        }];
                    }
                    return prev;
                });
            } finally {
                setTimeout(() => {
                    setIsMeterStatusLoading(false);
                }, 1000);
            }
        };

        const fetchChart = async () => {
            setIsChartLoading(true);
            try {
                // Simulate API call - replace with actual API
                const response = await fetch('/api/consumer/chart');
                if (!response.ok) throw new Error('Failed to fetch chart');
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid response format');
                }
                
                const data = await response.json();
                setBillingChartData(data);
            } catch (err: any) {
                console.error('Error fetching chart:', err);
                setBillingChartData(dummyBillingChartData);
                setFailedApis(prev => {
                    if (!prev.find(api => api.id === 'chart')) {
                        return [...prev, { 
                            id: 'chart', 
                            name: 'Chart Data', 
                            retryFunction: retryChartAPI, 
                            errorMessage: 'Failed to load Chart Data. Please try again.' 
                        }];
                    }
                    return prev;
                });
            } finally {
                setTimeout(() => {
                    setIsChartLoading(false);
                }, 1000);
            }
        };

        fetchStats();
        fetchBilling();
        fetchOverdue();
        fetchMeterStatus();
        fetchChart();
    }, []);

    const [overdueConsumersColumns] = useState([
        { key: 'uid', label: 'UID' },
        { key: 'consumerName', label: 'Consumer Name' },
        { key: 'flatNo', label: 'Flat No' },
        { key: 'overdue', label: 'Overdue (Rs.)' },
    ]);

    // Chart download handler
    // const handleChartDownload = () => {
    //     exportChartData(billingChartData.xAxisData, 'billing-vs-collection-data');
    // };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page   
                sections={[
                    // Error Section - Above all content
                    ...(failedApis.length > 0 ? [{
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'column' as const,
                                    columns: [
                                        {
                                            name: 'Error',
                                            props: {
                                                visibleErrors: failedApis.map(api => api.errorMessage),
                                                showRetry: true,
                                                maxVisibleErrors: 3, // Show max 3 errors at once
                                                failedApis: failedApis, // Pass all failed APIs for individual retry
                                                onRetrySpecific: retrySpecificAPI, // Pass the retry function
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    }] : []),
                    {
                        layout: {
                            type: 'grid',
                            gap: 'gap-4',
                            columns: 4,
                            rows: [
                                {
                                    layout: "grid",
                                    gap: "gap-4",
                                    gridColumns: 2,
                                    span: { col: 2, row: 1 },
                                    className: 'border border-primary-border rounded-3xl p-4 bg-primary-lightest',
                                    columns: [
                                        {
                                            name: "SectionHeader",
                                            props: {
                                                title: "Consumer Statistics",
                                                titleLevel: 2,
                                                titleSize: "md",
                                                titleVariant: "colorPrimaryDark",
                                                titleWeight: "normal",
                                                titleAlign: "left",
                                            },
                                            span: { col: 2, row: 1 },
                                        },
                                        ...consumerStatsData.map((card) => ({
                                            name: 'Card',
                                            props: {
                                                title: card.title,
                                                value: card.value,
                                                icon: card.icon,
                                                subtitle1: card.subtitle1,
                                                subtitle2: card.subtitle2,
                                                onValueClick: card.onValueClick,
                                                bg: "bg-stat-icon-gradient",
                                                loading: isStatsLoading,
                                            },
                                            span: { col: 1 as const, row: 1 as const },
                                        })),
                                    ],
                                },
                                {
                                    layout: "grid",
                                    gap: "gap-4",
                                    gridColumns: 2,
                                    span: { col: 2, row: 1 },
                                    className:'border border-primary-border rounded-3xl p-4 bg-background-secondary',
                                    columns: [
                                        {
                                            name: "SectionHeader",
                                            props: {
                                                title: "Consumption & Billing (Aug 6, 2025)",
                                                titleLevel: 2,
                                                titleSize: "md",
                                                titleVariant: "colorPrimaryDark",
                                                titleWeight: "normal",
                                                titleAlign: "left",
                                                rightComponent: {
                                                    name: "TimeRangeSelector",
                                                    props: {
                                                        availableTimeRanges: ["Daily", "Monthly"],
                                                        selectedTimeRange: selectedTimeRange,
                                                        handleTimeRangeChange: handleTimeRangeChange,
                                                        timeRangeLabels: {},
                                                    },
                                                },
                                                layout: "horizontal",
                                                gap: "gap-4",
                                            },
                                            span: { col: 2, row: 1 },
                                        },
                                        ...consumptionBillingData.map((card) => ({
                                            name: 'Card',
                                            props: {
                                                title: card.title,
                                                value: card.value,
                                                icon: card.icon,
                                                subtitle1: card.subtitle1,
                                                subtitle2: card.subtitle2,
                                                onValueClick: card.onValueClick,
                                                bg: "bg-stat-icon-gradient",
                                                showTrend: card.showTrend,
                                                comparisonValue: card.comparisonValue,
                                                loading: isBillingLoading,
                                            },
                                            span: { col: 1 as const, row: 1 as const },
                                        })),
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 2,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'column',
                                    gap: 'gap-1',
                                    span:{col:2 as const,row:1 as const},
                                    className: '',
                                    columns: [
                                        {
                                            name: 'BarChart',
                                            props: {
                                                xAxisData: billingChartData.xAxisData,
                                                seriesData: billingChartData.seriesData,
                                                seriesColors: billingChartData.seriesColors,
                                                height: '400px',
                                                showHeader: true,
                                                headerTitle:'Consumption Metrics',
                                                dateRange: '(7 Jun, 2025 - 8 Aug, 2025)',
                                                showDownloadButton: true,
                                                showViewToggle: false,
                                                viewToggleOptions: [
                                                    'Graph',
                                                    'Table',
                                                ],
                                                showTableView: true,
                                                ariaLabel:
                                                    'Monthly billing statistics chart',
                                                yAxisMax: 300,
                                                yAxisStep: 50,
                                                onDownload: "",
                                                isLoading: isChartLoading,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 2,
                            gap: 'gap-4',
                            className:'pb-4',
                            rows: [
                                {
                                    layout: 'column',
                                    gap: 'gap-1',
                                    span:{col:1 as const,row:1 as const},
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-1',
                                    columns: [
                                        {
                                            name: "Holder",
                                            props: {
                                                title: "Meter Status",
                                                subtitle: "Distribution of communicating and non-communicating meters",
                                                className: "border-none rounded-t-3xl ",
                                            },
                                        },
                                        {
                                            name: 'PieChart',
                                            props: {
                                                data: meterStatusData,
                                                height: 330,
                                                showLegend: false,
                                                showNoDataMessage: false,
                                                showHeader: false,
                                                className: 'p-4',
                                                onClick: (
                                                    segmentName?: string
                                                ) => {
                                                    if (
                                                        segmentName ===
                                                        'Communicating'
                                                    )
                                                        navigate(
                                                            '/connect-disconnect/communicating'
                                                        );
                                                    else if (
                                                        segmentName ===
                                                        'Non-Communicating'
                                                    )
                                                        navigate(
                                                            '/connect-disconnect/non-communicating'
                                                        );
                                                    else
                                                        navigate(
                                                            '/connect-disconnect'
                                                        );
                                                },
                                                isLoading: isMeterStatusLoading,
                                            },
                                        },
                                    ],
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-1',
                                    span:{col:1 as const,row:1 as const},
                                    className: '',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: overdueConsumersData,
                                                columns: overdueConsumersColumns,
                                                loading: isOverdueLoading,
                                                searchable: true,
                                                pagination: true,
                                                showActions: true,
                                                totalItems: 1395,
                                                itemsPerPage: 5,
                                                currentPage: 1,
                                                totalPages: 279,
                                                showHeader: true,
                                                headerTitle: 'Overdue Consumers',
                                                height: 330,
                                                onView: (row: any) =>
                                                    console.log(
                                                        'View details for',
                                                        row.uid
                                                    ),
                                                onDelete: (row: any) =>
                                                    console.log(
                                                        'Delete',
                                                        row.uid
                                                    ),
                                                initialRowsPerPage: 5,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
        </Suspense>
    );
};

export default ConsumerDashboard;

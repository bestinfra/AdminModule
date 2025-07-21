import React, { useState } from 'react';
import Page from '@/components/global/PageC';
import { useNavigate } from 'react-router-dom';

// Constants
const METRICS_TYPE_OPTIONS = ['Graph', 'Table'];
const METRICS_VIEW_OPTIONS = ['Daily', 'Monthly', 'Yearly'];
const BILLING_VIEW_OPTIONS = ['Daily', 'Monthly'];

const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)'
};


const BAR_CHART_DATA = [
    10, 100, 200, 220, 230, 225, 225, 250, 270, 260, 230, 230, 230, 280, 270, 260, 230, 230, 230, 280, 270, 260, 230, 230, 230, 180, 170, 170, 170, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200
];

const BAR_CHART_LABELS = [
    '4 May', '5 May', '6 May', '7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul'
];

const METER_STATUS_DATA = [
    { value: 3, name: 'Communicating' },
    { value: 1, name: 'Non-Communicating' },
];

const METER_EVENTS = [
    {
        meterNo: 'A9211433',
        uid: 'BI25GMRA004',
        eventDateTime: '06/05/2025 16:12:00',
        eventDesc: 'Meter Power Fail - Start',
    },
    {
        meterNo: 'A9211433',
        uid: 'BI25GMRA004',
        eventDateTime: '05/05/2025 12:44:00',
        eventDesc: 'Meter Power Fail - End',
    },
    {
        meterNo: 'A9345417',
        uid: 'BI25GMRA002',
        eventDateTime: '06/05/2025 16:47:00',
        eventDesc: 'CT Short - End',
    },
    {
        meterNo: 'A9345418',
        uid: 'BI25GMRA003',
        eventDateTime: '23/05/2025 12:19:00',
        eventDesc: 'R_PH CT Reversed - Start',
    },
];

const METER_EVENT_COLUMNS = [
    { key: 'meterNo', label: 'Meter SI No' },
    { key: 'uid', label: 'UID' },
    { key: 'eventDateTime', label: 'Event Date Time' },
    { key: 'eventDesc', label: 'Event Description' },
];

const Dashboard: React.FC = () => {
    const [billingView, setBillingView] = useState<'Daily' | 'Monthly'>('Daily');
    const [metricsType, setMetricsType] = useState('Graph');
    const [metricsView, setMetricsView] = useState('Daily');
    const navigate = useNavigate();

    const handleTotalConsumersClick = () => navigate('/consumers');
    const handleHighUsageConsumersClick = () => navigate('/consumers/high-usage');
    const handleDownload = (timeRange: string, viewType: string) => console.log(`Download ${timeRange} ${viewType} data`);
    const handleTimeRangeChange = (range: string) => setMetricsView(range);
    const handleViewTypeChange = (viewType: string) => setMetricsType(viewType);

    const generateXAxisLabels = (timeRange: string) => {
        const now = new Date();
        switch (timeRange) {
            case 'Monthly': {
                const labels = [];
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                for (let i = 35; i >= 0; i--) {
                    const date = new Date(currentYear, currentMonth - i, 1);
                    const monthName = date.toLocaleString('default', { month: 'short' });
                    const year = date.getFullYear();
                    labels.push(`${monthName} ${year}`);
                }
                return labels;
            }
            case 'Yearly': {
                const labels = [];
                const currentYear = now.getFullYear();
                for (let i = 19; i >= 0; i--) {
                    labels.push(`${currentYear - i}`);
                }
                return labels;
            }
            default: return BAR_CHART_LABELS;
        }
    };

    const generateChartData = (timeRange: string) => {
        switch (timeRange) {
            case 'Monthly': return Array(36).fill(0).map(() => Math.floor(Math.random() * 300) + 50);
            case 'Yearly': return Array(20).fill(0).map(() => Math.floor(Math.random() * 1000) + 100);
            default: return BAR_CHART_DATA;
        }
    };

    const getDateRange = (timeRange: string) => {
        const now = new Date();
        switch (timeRange) {
            case 'Monthly':
                const startMonth = new Date(now.getFullYear(), now.getMonth() - 35, 1);
                return `${startMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
            case 'Yearly':
                const startYear = now.getFullYear() - 19;
                return `${startYear} - ${now.getFullYear()}`;
            default: return "4 May, 2025 - 5 Jul, 2025";
        }
    };
    return (
        <div className="p-2 min-h-screen">
            <Page
                sections={[
                    {
                        layout: {
                            type: 'grid',
                            columns: 2,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 2,
                                    gridRows: 2,
                                    bg: 'bg-primary-lightest p-4 border border-primary-border dark:border-dark-border rounded-3xl',
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: 'Consumer Statistics',
                                                level: 2,
                                                size: 'md',
                                                variant: 'primary',
                                                weight: 'bold',
                                                align: 'left',
                                            },
                                            span: { col: 2, row: 1 },
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Total Consumers',
                                                value: '3',
                                                icon: '/icons/units.svg',
                                                subtitle1: '3 Active',
                                                subtitle2: '0 In-Active',
                                                iconStyle: ICON_FILTER_STYLE,
                                                onValueClick: handleTotalConsumersClick
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'High-Usage Consumers',
                                                value: '1',
                                                icon: '/icons/heavy-user.svg',
                                                subtitle1: '1112.03 kWh Average Consumption',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE,
                                                onValueClick: handleHighUsageConsumersClick
                                            }
                                        }
                                    ],
                                },
                                {
                                    layout: 'grid',
                                    gridColumns: 2,
                                    gridRows: 2,
                                    bg: 'bg-primary-lightest p-4 border border-primary-border dark:border-dark-border rounded-3xl',
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: 'Consumption & Billing',
                                                level: 2,
                                                size: 'md',
                                                variant: 'primary',
                                                weight: 'bold',
                                                align: 'left',
                                            },
                                            span: { col: 1, row: 1 },
                                        },
                                        {
                                            name: 'TimeRangeSelector',
                                            props: {
                                                availableTimeRanges: BILLING_VIEW_OPTIONS,
                                                selectedTimeRange: billingView,
                                                handleTimeRangeChange: (v: string) => setBillingView(v as 'Daily' | 'Monthly'),
                                            },
                                            span: { col: 1, row: 1 },
                                            align: 'end',
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Electricity Usage (kWh)',
                                                value: '182.39',
                                                icon: '/icons/plug-alt.svg',
                                                subtitle1: '191.85 kWh',
                                                subtitle2: 'Jul 17, 2025',
                                                showTrend: true,
                                                comparisonValue: -4.9,
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Electricity Charges',
                                                value: '₹13,69,439.60',
                                                icon: '/icons/rupee.svg',
                                                subtitle1: '₹13,69,462.31',
                                                subtitle2: 'Jul 17, 2025',
                                                showTrend: true,
                                                comparisonValue: -0.02,
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        }
                                    ],
                                }
                            ]
                        }
                    },
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            className: 'bg-white dark:bg-primary-dark',
                            rows: [
                                {
                                    layout: 'grid',
                                    gap: 'gap-4',
                                    gridColumns: 2,
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: 'Metrics',
                                                level: 2,
                                                size: 'lg',
                                                variant: 'primary',
                                                weight: 'bold',
                                                align: 'left'
                                            }
                                        },
                                        {
                                            name: 'TimeRangeSelector',
                                            props: {
                                                availableTimeRanges: METRICS_TYPE_OPTIONS,
                                                selectedTimeRange: metricsType,
                                                handleTimeRangeChange: handleViewTypeChange
                                            },
                                            align: 'end'
                                        }
                                    ]
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'BarChart',
                                            props: metricsType === 'Graph' ? {
                                                data: generateChartData(metricsView),
                                                xAxisData: generateXAxisLabels(metricsView),
                                                showXAxisLabel: true,
                                                xAxisLabel: "kVAh",
                                                showHeader: true,
                                                headerTitle: "Consumption Metrics",
                                                dateRange: getDateRange(metricsView),
                                                availableTimeRanges: METRICS_VIEW_OPTIONS,
                                                initialTimeRange: metricsView,
                                                onTimeRangeChange: handleTimeRangeChange,
                                                onDownload: handleDownload,
                                                showDownloadButton: true,
                                                timeRange: metricsView as 'Daily' | 'Monthly' | 'Yearly'
                                            } : {
                                                data: [],
                                                xAxisData: [],
                                                title: 'Table view coming soon...'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 3,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'column',
                                    gap: 'gap-4',
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl p-4',
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: 'Meter Communication Status',
                                                level: 2,
                                                size: 'base',
                                                variant: 'primary',
                                                weight: 'regular',
                                                align: 'left'
                                            }
                                        },
                                        {
                                            name: 'PieChart',
                                            props: {
                                                data: METER_STATUS_DATA,
                                                height: 250,
                                                showNoDataMessage: false,
                                                showHeader: false,
                                                title: "",
                                                onClick: (segmentName?: string) => {
                                                    if (segmentName === 'Communicating') navigate('/connect-disconnect/communicating');
                                                    else if (segmentName === 'Non-Communicating') navigate('/connect-disconnect/non-communicating');
                                                    else navigate('/connect-disconnect');
                                                }
                                            }
                                        }
                                    ],
                                    span: 1
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-4',
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl p-4',
                                    columns: [
                                        // {
                                        //     name: 'Heading',
                                        //     props: {
                                        //         text: 'Latest Meter Events',
                                        //         level: 2,
                                        //         size: 'base',
                                        //         variant: 'primary',
                                        //         weight: 'regular',
                                        //         align: 'left'
                                        //     }
                                        // },
                                        {
                                            name: 'Table',
                                            props: {
                                                data: METER_EVENTS,
                                                columns: METER_EVENT_COLUMNS,
                                                loading: false,
                                                searchable: true,
                                                pagination: true,
                                                title: 'Latest Meter Events',
                                                showActions: true,
                                                actions: [{
                                                    label: 'View',
                                                    icon: '/icons/eye.svg',
                                                    onClick: (row: any) => navigate(`/consumers/${row.uid}`)
                                                }]
                                            }
                                        }
                                    ],
                                    span: 2
                                }
                            ]
                        }
                    }
                ]}
            />
        </div>
    );
};

export default Dashboard;

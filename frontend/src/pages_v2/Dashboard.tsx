import React, { useState } from 'react';
import Page from '@/components/global/PageC';
import { useNavigate } from 'react-router-dom';

// Constants
const BILLING_VIEW_OPTIONS = ['Daily', 'Monthly'];

const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)'
};

// const BAR_CHART_DATA = [
//     10, 100, 200, 220, 230, 225, 225, 250, 270, 260, 230, 230, 230, 280, 270, 260, 230, 230, 230, 280, 270, 260, 230, 230, 230, 180, 170, 170, 170, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200
// ];

// const BAR_CHART_LABELS = [
//     '4 May', '5 May', '6 May', '7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul'
// ];

const METER_STATUS_DATA = [
    { value: 284, name: 'Communicating' },
    { value: 8, name: 'Non-Communicating' },
];

const Dashboard: React.FC = () => {
    const [billingView, setBillingView] = useState<'Daily' | 'Monthly'>('Daily');
    const navigate = useNavigate();

    const handleTotalConsumersClick = () => navigate('/consumers');
    const handleHighUsageConsumersClick = () => navigate('/consumers/high-usage');

    // TODO: Unused - consider removing if not needed.
    // const METRICS_TYPE_OPTIONS = ['Graph', 'Table'];
    // TODO: Unused - consider removing if not needed.
    // const METRICS_VIEW_OPTIONS = ['Daily', 'Monthly', 'Yearly'];
    // TODO: Unused - consider removing if not needed.
    // const METER_EVENTS = [
    //     {
    //         meterNo: 'A9211433',
    //         uid: 'BI25GMRA004',
    //         eventDateTime: '06/05/2025 16:12:00',
    //         eventDesc: 'Meter Power Fail - Start',
    //     },
    //     {
    //         meterNo: 'A9211433',
    //         uid: 'BI25GMRA004',
    //         eventDateTime: '05/05/2025 12:44:00',
    //         eventDesc: 'Meter Power Fail - End',
    //     },
    //     {
    //         meterNo: 'A9345417',
    //         uid: 'BI25GMRA002',
    //         eventDateTime: '06/05/2025 16:47:00',
    //         eventDesc: 'CT Short - End',
    //     },
    //     {
    //         meterNo: 'A9345418',
    //         uid: 'BI25GMRA003',
    //         eventDateTime: '23/05/2025 12:19:00',
    //         eventDesc: 'R_PH CT Reversed - Start',
    //     },
    // ];
    // TODO: Unused - consider removing if not needed.
    // const METER_EVENT_COLUMNS = [
    //     { key: 'meterNo', label: 'Meter SI No' },
    //     { key: 'uid', label: 'UID' },
    //     { key: 'eventDateTime', label: 'Event Date Time' },
    //     { key: 'eventDesc', label: 'Event Description' },
    // ];
    // TODO: Unused - consider removing if not needed.
    // const [metricsType, setMetricsType] = useState('Graph');
    // TODO: Unused - consider removing if not needed.
    // const [metricsView, setMetricsView] = useState('Daily');
    // TODO: Unused - consider removing if not needed.
    // const handleDownload = (timeRange: string, viewType: string) => console.log(`Download ${timeRange} ${viewType} data`);
    // TODO: Unused - consider removing if not needed.
    // const handleTimeRangeChange = (range: string) => setMetricsView(range);
    // TODO: Unused - consider removing if not needed.
    // const handleViewTypeChange = (viewType: string) => setMetricsType(viewType);
    // TODO: Unused - consider removing if not needed.
    // const generateXAxisLabels = (timeRange: string) => {
    //     const now = new Date();
    //     switch (timeRange) {
    //         case 'Monthly': {
    //             const labels = [];
    //             const currentMonth = now.getMonth();
    //             const currentYear = now.getFullYear();
    //             for (let i = 35; i >= 0; i--) {
    //                 const date = new Date(currentYear, currentMonth - i, 1);
    //                 const monthName = date.toLocaleString('default', { month: 'short' });
    //                 const year = date.getFullYear();
    //                 labels.push(`${monthName} ${year}`);
    //             }
    //             return labels;
    //         }
    //         case 'Yearly': {
    //             const labels = [];
    //             const currentYear = now.getFullYear();
    //             for (let i = 19; i >= 0; i--) {
    //                 labels.push(`${currentYear - i}`);
    //             }
    //             return labels;
    //         }
    //         default: return BAR_CHART_LABELS;
    //     }
    // };
    // TODO: Unused - consider removing if not needed.
    // const generateChartData = (timeRange: string) => {
    //     switch (timeRange) {
    //         case 'Monthly': return Array(36).fill(0).map(() => Math.floor(Math.random() * 300) + 50);
    //         case 'Yearly': return Array(20).fill(0).map(() => Math.floor(Math.random() * 1000) + 100);
    //         default: return BAR_CHART_DATA;
    //     }
    // };
    // TODO: Unused - consider removing if not needed.
    // const getDateRange = (timeRange: string) => {
    //     const now = new Date();
    //     switch (timeRange) {
    //         case 'Monthly':
    //             const startMonth = new Date(now.getFullYear(), now.getMonth() - 35, 1);
    //             return `${startMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    //         case 'Yearly':
    //             const startYear = now.getFullYear() - 19;
    //             return `${startYear} - ${now.getFullYear()}`;
    //         default: return "4 May, 2025 - 5 Jul, 2025";
    //     }
    // };

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
                                    gridColumns: 3,
                                    gridRows: 2,
                                    bg: 'bg-primary-lightest p-4 border border-primary-border dark:border-dark-border rounded-3xl',
                                    gap: 'gap-4',
                                    className: 'h-fit',
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
                                            span: { col: 3, row: 1 },
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Total Consumers',
                                                value: '292',
                                                icon: '/icons/account.svg',
                                                subtitle1: '284 Active',
                                                subtitle2: '8 In-Active',
                                                iconStyle: ICON_FILTER_STYLE,
                                                onValueClick: handleTotalConsumersClick
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Prepaid Consumers',
                                                value: '2',
                                                icon: '/icons/coins.svg',
                                                subtitle1: '0 Disconnected',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Postpaid Consumers',
                                                value: '290',
                                                icon: '/icons/document.svg',
                                                subtitle1: '11 Disconnected',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Overdue Amount',
                                                value: '2590925.47',
                                                icon: '/icons/bills.svg',
                                                subtitle1: '1395 Overdue Consumers',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Total Outstanding (Rs.)',
                                                value: '2590925.47',
                                                icon: '/icons/bills.svg',
                                                subtitle1: '614.98% of Total Billed Amount',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'High-Usage Consumers',
                                                value: '139',
                                                icon: '/icons/graph-bar.svg',
                                                subtitle1: '140.09 kWh Average Consumption',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE,
                                                onValueClick: handleHighUsageConsumersClick
                                            }
                                        }
                                    ]
                                },
                                {
                                    layout: 'grid',
                                    gridColumns: 2,
                                    gridRows: 2,
                                    bg: 'bg-primary-lightest p-4 border border-primary-border dark:border-dark-border rounded-3xl',
                                    gap: 'gap-4',
                                    className: 'h-fit',
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: 'Consumption & Billing (Jun 2025)',
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
                                                value: '64010.91',
                                                icon: '/icons/plug-alt.svg',
                                                subtitle1: '62506.77 kWh',
                                                subtitle2: 'May 2025',
                                                showTrend: true,
                                                comparisonValue: 2.4,
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Electricity Charges (Rs)',
                                                value: '421302.79',
                                                icon: '/icons/coins.svg',
                                                subtitle1: '515396.81',
                                                subtitle2: 'May 2025',
                                                showTrend: true,
                                                comparisonValue: -18.3,
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Payment Receipts',
                                                value: '281',
                                                icon: '/icons/bills.svg',
                                                subtitle1: '281',
                                                subtitle2: 'May 2025',
                                                showTrend: true,
                                                comparisonValue: 0,
                                                iconStyle: ICON_FILTER_STYLE
                                            }
                                        },
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Service Requests',
                                                value: '0',
                                                icon: '/icons/bills.svg',
                                                subtitle1: '0',
                                                subtitle2: 'May 2025',
                                                showTrend: true,
                                                comparisonValue: 0,
                                                iconStyle: ICON_FILTER_STYLE
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
                                    gap: 'gap-0',
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-1',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'Meter Communication Status',
                                                className: 'border-none rounded-t-3xl'
                                            }
                                        },
                                        {
                                            name: 'PieChart',
                                            props: {
                                                data: METER_STATUS_DATA,
                                                height: 250,
                                                showNoDataMessage: false,
                                                showHeader: false,
                                                className: "p-6",
                                                title: "",
                                                onClick: (segmentName?: string) => {
                                                    if (segmentName === 'Communicating') navigate('/connect-disconnect/communicating');
                                                    else if (segmentName === 'Non-Communicating') navigate('/connect-disconnect/non-communicating');
                                                    else navigate('/connect-disconnect');
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-2',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'Billing vs Collection (Jun 2024 - Jun 2025)',
                                                className: 'border-none rounded-t-3xl'
                                            }
                                        },
                                        {
                                            name: 'BarChart',
                                            props: {
                                                data: [
                                                    [260, 260, 0, 0],    // Jun 2024
                                                    [260, 260, 0, 0],    // Jul 2024
                                                    [255, 255, 0, 0],    // Aug 2024
                                                    [255, 255, 0, 0],    // Sep 2024
                                                    [255, 255, 0, 0],    // Oct 2024
                                                    [255, 255, 0, 0],    // Nov 2024
                                                    [250, 250, 0, 0],    // Dec 2024
                                                    [250, 10, 0, 240],   // Jan 2025
                                                    [240, 0, 0, 240],    // Feb 2025
                                                    [275, 50, 0, 220],   // Mar 2025
                                                    [275, 50, 0, 220],   // Apr 2025
                                                    [275, 40, 0, 230],   // May 2025
                                                    [275, 55, 0, 220]    // Jun 2025
                                                ],
                                                xAxisData: [
                                                    'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024',
                                                    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'
                                                ],
                                                showXAxisLabel: true,
                                                xAxisLabel: "Amount (Rs.)",
                                                showHeader: false,
                                                headerTitle: "",
                                                dateRange: "Jun 2024 - Jun 2025",
                                                availableTimeRanges: ['Daily', 'Monthly', 'Yearly'],
                                                initialTimeRange: 'Monthly',
                                                onTimeRangeChange: () => {},
                                                onDownload: () => {},
                                                showDownloadButton: false,
                                                timeRange: 'Monthly',
                                                stacked: false,
                                                grouped: true,
                                                colors: ['#3B82F6', '#10B981', '#EF4444', '#F97316'],
                                                legend: [
                                                    { label: 'Bills Generated', color: '#3B82F6' },
                                                    { label: 'Paid', color: '#10B981' },
                                                    { label: 'Pending', color: '#EF4444' },
                                                    { label: 'Overdue', color: '#F97316' }
                                                ],
                                                yAxisMax: 300,
                                                yAxisStep: 50
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
                            columns: 2,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'Overdue Consumers',
                                                className: 'border-none rounded-t-3xl'
                                            }
                                        },
                                        {
                                            name: 'Table',
                                            props: {
                                                data: [
                                                    {
                                                        uid: '2025UIDC089',
                                                        consumerName: 'I Lakshmana Rao',
                                                        flatNo: 'C089',
                                                        overdue: '32004.12'
                                                    },
                                                    {
                                                        uid: '2025UIDC088',
                                                        consumerName: 'G Ramaraju',
                                                        flatNo: 'C088',
                                                        overdue: '22613.91'
                                                    },
                                                    {
                                                        uid: '2025UIDC089',
                                                        consumerName: 'I Lakshmana Rao',
                                                        flatNo: 'C089',
                                                        overdue: '21679.76'
                                                    },
                                                    {
                                                        uid: '2025UIDC089',
                                                        consumerName: 'I Lakshmana Rao',
                                                        flatNo: 'C089',
                                                        overdue: '20745.27'
                                                    },
                                                    {
                                                        uid: '2025UIDC089',
                                                        consumerName: 'I Lakshmana Rao',
                                                        flatNo: 'C089',
                                                        overdue: '19731.31'
                                                    }
                                                ],
                                                columns: [
                                                    { key: 'uid', label: 'UID' },
                                                    { key: 'consumerName', label: 'Consumer Name' },
                                                    { key: 'flatNo', label: 'Flat No' },
                                                    { key: 'overdue', label: 'Overdue (Rs.)' }
                                                ],
                                                loading: false,
                                                searchable: true,
                                                pagination: true,
                                                title: 'Overdue Consumers',
                                                showActions: true,
                                                className: "p-4 [&_.relative]:mt-0",
                                                totalItems: 1395,
                                                itemsPerPage: 5,
                                                currentPage: 1,
                                                totalPages: 279,
                                                actions: [
                                                    {
                                                        label: 'Send Notice',
                                                        icon: '/icons/paper-plane.svg',
                                                        onClick: (row: any) => console.log('Send notice to', row.uid)
                                                    },
                                                    {
                                                        label: 'View Details',
                                                        icon: '/icons/document.svg',
                                                        onClick: (row: any) => console.log('View details for', row.uid)
                                                    },
                                                    {
                                                        label: 'Disconnect',
                                                        icon: '/icons/close.svg',
                                                        onClick: (row: any) => console.log('Disconnect', row.uid)
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'Disconnected Consumers',
                                                className: 'border-none rounded-t-3xl'
                                            }
                                        },
                                        {
                                            name: 'Table',
                                            props: {
                                                data: [
                                                    {
                                                        uid: '2025UIDA006',
                                                        consumerName: 'T Vidyasagar',
                                                        flatNo: 'A006',
                                                        overdue: '4339.14'
                                                    },
                                                    {
                                                        uid: '2025UIDA009',
                                                        consumerName: 'Reading Room',
                                                        flatNo: 'A009',
                                                        overdue: '3802.83'
                                                    },
                                                    {
                                                        uid: '2025UIDA008',
                                                        consumerName: 'D Sudhakar Gupta',
                                                        flatNo: 'A008',
                                                        overdue: '2778.76'
                                                    },
                                                    {
                                                        uid: '2025UIDA011',
                                                        consumerName: 'M Nagaphani',
                                                        flatNo: 'A011',
                                                        overdue: '2627.91'
                                                    },
                                                    {
                                                        uid: '2025UIDA010',
                                                        consumerName: 'M Ramakrishna',
                                                        flatNo: 'A010',
                                                        overdue: '2244.91'
                                                    }
                                                ],
                                                columns: [
                                                    { key: 'uid', label: 'UID' },
                                                    { key: 'consumerName', label: 'Consumer Name' },
                                                    { key: 'flatNo', label: 'Flat No' },
                                                    { key: 'overdue', label: 'Overdue (Rs.)' }
                                                ],
                                                loading: false,
                                                searchable: true,
                                                pagination: true,
                                                title: 'Disconnected Consumers',
                                                showActions: true,
                                                className: "p-4 [&_.relative]:mt-0",
                                                totalItems: 11,
                                                itemsPerPage: 5,
                                                currentPage: 1,
                                                totalPages: 3,
                                                actions: [
                                                    {
                                                        label: 'Send Notice',
                                                        icon: '/icons/paper-plane.svg',
                                                        onClick: (row: any) => console.log('Send notice to', row.uid)
                                                    },
                                                    {
                                                        label: 'View Details',
                                                        icon: '/icons/document.svg',
                                                        onClick: (row: any) => console.log('View details for', row.uid)
                                                    },
                                                    {
                                                        label: 'Reconnect',
                                                        icon: '/icons/connect.svg',
                                                        onClick: (row: any) => console.log('Reconnect', row.uid)
                                                    }
                                                ]
                                            }
                                        }
                                    ]
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

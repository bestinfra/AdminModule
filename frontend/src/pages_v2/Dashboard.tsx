import React, { useState } from 'react';
import Page from '@/components/global/PageC';
import { useNavigate } from 'react-router-dom';

// Constants

const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
};



const METER_STATUS_DATA = [
    { value: 284, name: 'Communicating' },
    { value: 8, name: 'Non-Communicating' },
];

const Dashboard: React.FC = () => {
    const [billingView, setBillingView] = useState<'Daily' | 'Monthly'>('Daily');
    const navigate = useNavigate();

    const handleTotalConsumersClick = () => navigate('/consumers');
    const handleHighUsageConsumersClick = () => navigate('/consumers/high-usage');



    const [consumerStatsData] = useState([
        {
            id: 1,
                                                title: 'Total Consumers',
                                                value: '292',
                                                icon: '/icons/account.svg',
                                                subtitle1: '284 Active',
                                                subtitle2: '8 In-Active',
                                                iconStyle: ICON_FILTER_STYLE,
                                                onValueClick: handleTotalConsumersClick
                                        },
                                        {
            id: 2,
                                                title: 'Prepaid Consumers',
                                                value: '2',
                                                icon: '/icons/coins.svg',
                                                subtitle1: '0 Disconnected',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE
                                        },
                                        {
            id: 3,
                                                title: 'Postpaid Consumers',
                                                value: '290',
                                                icon: '/icons/document.svg',
                                                subtitle1: '11 Disconnected',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE
                                        },
                                        {
            id: 4,
                                                title: 'Overdue Amount',
                                                value: '2590925.47',
                                                icon: '/icons/bills.svg',
                                                subtitle1:
                                                    '1395 Overdue Consumers',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE
                                        },
                                        {
            id: 5,
                                                title: 'Total Outstanding (Rs.)',
                                                value: '2590925.47',
                                                icon: '/icons/bills.svg',
                                                subtitle1:
                                                    '614.98% of Total Billed Amount',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE
                                        },
                                        {
            id: 6,
                                                title: 'High-Usage Consumers',
                                                value: '139',
                                                icon: '/icons/graph-bar.svg',
                                                subtitle1:
                                                    '140.09 kWh Average Consumption',
                                                subtitle2: '',
                                                iconStyle: ICON_FILTER_STYLE,
                                                onValueClick: handleHighUsageConsumersClick
                                            }
    ]);

    const [billingData] = useState([
        {
            id: 1,
            title: 'Electricity Usage (kWh)',
            value: '64010.91',
            icon: '/icons/plug-alt.svg',
            subtitle1: '62506.77 kWh',
            subtitle2: 'May 2025',
            showTrend: true,
            comparisonValue: 2.4,
            iconStyle: ICON_FILTER_STYLE
        },
        {
            id: 2,
            title: 'Electricity Charges (Rs)',
            value: '421302.79',
            icon: '/icons/coins.svg',
            subtitle1: '515396.81',
            subtitle2: 'May 2025',
            showTrend: true,
            comparisonValue: -18.3,
            iconStyle: ICON_FILTER_STYLE
        },
        {
            id: 3,
            title: 'Payment Receipts',
            value: '281',
            icon: '/icons/bills.svg',
            subtitle1: '281',
            subtitle2: 'May 2025',
            showTrend: true,
            comparisonValue: 0,
            iconStyle: ICON_FILTER_STYLE
        },
        {
            id: 4,
            title: 'Service Requests',
            value: '0',
            icon: '/icons/bills.svg',
            subtitle1: '0',
            subtitle2: 'May 2025',
            showTrend: true,
            comparisonValue: 0,
            iconStyle: ICON_FILTER_STYLE
        }
    ]);

    const [overdueConsumersData] = useState([
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
    ]);

    const [disconnectedConsumersData] = useState([
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
    ]);

    const [overdueConsumersColumns] = useState([
        { key: 'uid', label: 'UID' },
        { key: 'consumerName', label: 'Consumer Name' },
        { key: 'flatNo', label: 'Flat No' },
        { key: 'overdue', label: 'Overdue (Rs.)' }
    ]);

    const [disconnectedConsumersColumns] = useState([
        { key: 'uid', label: 'UID' },
        { key: 'consumerName', label: 'Consumer Name' },
        { key: 'flatNo', label: 'Flat No' },
        { key: 'overdue', label: 'Overdue (Rs.)' }
    ]);

    const [billingChartData] = useState({
        xAxisData: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        seriesData: [
            {
                name: 'Bills Generated',
                data: [260, 255, 275, 280, 290, 285, 270, 265, 280, 275, 290, 295],
            },
            {
                name: 'Paid',
                data: [240, 235, 250, 255, 260, 250, 245, 240, 255, 250, 265, 270],
            },
            {
                name: 'Pending',
                data: [15, 12, 18, 20, 25, 30, 20, 18, 22, 20, 18, 20],
            },
            {
                name: 'Overdue',
                data: [5, 8, 7, 5, 5, 5, 5, 7, 3, 5, 7, 5],
            },
        ],
        seriesColors: [
            '#3B82F6',  // Blue for Bills Generated
            '#10B981',  // Green for Paid
            '#EF4444',  // Red for Pending
            '#F97316',  // Orange for Overdue
        ],
    });

    return (
        <Page
            sections={[
                {
                    layout: {
                        type: 'grid',
                        gap: 'gap-6',
                        columns: 3,
                        // className: 'items-stretch',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 3,
                                gridRows: 2,
                                bg: 'bg-primary-lightest p-4 border border-primary-border dark:border-dark-border rounded-3xl',
                                gap: 'gap-4',
                                span: { col: 2, row: 1 },
                                // className: 'w-[60%] h-full', // width 70%, take full height
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
                                    ...consumerStatsData.map((stat) => ({
                                        name: 'Card',
                                        props: {
                                            title: stat.title,
                                            value: stat.value,
                                            icon: stat.icon,
                                            subtitle1: stat.subtitle1,
                                            subtitle2: stat.subtitle2,
                                            iconStyle: stat.iconStyle,
                                            onValueClick: stat.onValueClick,
                                        },
                                    })),
                                ],
                                },
                                {
                                    layout: 'grid',
                                    gridColumns: 2,
                                    gridRows: 2,
                                    span: { col: 1, row: 2 },
                                    bg: 'bg-primary-lightest p-4 border border-primary-border dark:border-dark-border rounded-3xl',
                                    gap: 'gap-4',
                                    // className: 'w-[50%] h-full', // width 30%, take full height
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
                                                availableTimeRanges: [
                                                    'Daily',
                                                    'Monthly',
                                                    'Yearly',
                                                ],
                                                selectedTimeRange: billingView,
                                                handleTimeRangeChange: (
                                                    v: string
                                                ) =>
                                                    setBillingView(
                                                        v as 'Daily' | 'Monthly'
                                                    ),
                                            },
                                            span: { col: 1, row: 1 },
                                            align: 'end',
                                        },
                                    ...billingData.map((billing) => ({
                                            name: 'Card',
                                            props: {
                                            title: billing.title,
                                            value: billing.value,
                                            icon: billing.icon,
                                            subtitle1: billing.subtitle1,
                                            subtitle2: billing.subtitle2,
                                            showTrend: billing.showTrend,
                                            comparisonValue: billing.comparisonValue,
                                            iconStyle: billing.iconStyle,
                                        },
                                    })),
                                ],
                            },
                        ],
                    },
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
                                    className:
                                        'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-1',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'Meter Communication Status',
                                                className:
                                                    'border-none rounded-t-3xl',
                                            },
                                        },
                                        {
                                            name: 'PieChart',
                                            props: {
                                                data: METER_STATUS_DATA,
                                                height: 250,
                                                showNoDataMessage: false,
                                                showHeader: false,
                                                className: 'p-6',
                                                title: '',
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
                                            },
                                        },
                                    ],
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    className:
                                        'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-2',
                                    columns: [
                                        {
                                            name: 'BarChart',
                                            props: {
                                                xAxisData: billingChartData.xAxisData,
                                                seriesData: billingChartData.seriesData,
                                                seriesColors: billingChartData.seriesColors,
                                                height: '400px',
                                                showHeader: true,
                                                headerTitle: 'Billing vs Collection',
                                                dateRange: '2024',
                                                showDownloadButton: true,
                                                showViewToggle: true,
                                                viewToggleOptions: ['Graph', 'Table'],
                                                showTableView: true,
                                                ariaLabel: 'Monthly billing statistics chart',
                                                yAxisMax: 300,
                                                yAxisStep: 50,
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
                            rows: [
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    className:
                                        'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'Overdue Consumers',
                                                className:
                                                    'border-none rounded-t-3xl',
                                            },
                                        },
                                        {
                                            name: 'Table',
                                            props: {
                                            data: overdueConsumersData,
                                            columns: overdueConsumersColumns,
                                                loading: false,
                                                searchable: true,
                                                pagination: true,
                                                title: 'Overdue Consumers',
                                                showActions: true,
                                                className:
                                                    'p-4 [&_.relative]:mt-0',
                                                totalItems: 1395,
                                                itemsPerPage: 5,
                                                currentPage: 1,
                                                totalPages: 279,
                                                actions: [
                                                    {
                                                        label: 'Send Notice',
                                                        icon: '/icons/paper-plane.svg',
                                                        onClick: (row: any) =>
                                                            console.log(
                                                                'Send notice to',
                                                                row.uid
                                                            ),
                                                    },
                                                    {
                                                        label: 'View Details',
                                                        icon: '/icons/document.svg',
                                                        onClick: (row: any) =>
                                                            console.log(
                                                                'View details for',
                                                                row.uid
                                                            ),
                                                    },
                                                    {
                                                        label: 'Disconnect',
                                                        icon: '/icons/close.svg',
                                                        onClick: (row: any) =>
                                                            console.log(
                                                                'Disconnect',
                                                                row.uid
                                                            ),
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    className:
                                        'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'Disconnected Consumers',
                                                className:
                                                    'border-none rounded-t-3xl',
                                            },
                                        },
                                        {
                                            name: 'Table',
                                            props: {
                                            data: disconnectedConsumersData,
                                            columns: disconnectedConsumersColumns,
                                                loading: false,
                                                searchable: true,
                                                pagination: true,
                                                title: 'Disconnected Consumers',
                                                showActions: true,
                                                className:
                                                    'p-4 [&_.relative]:mt-0',
                                                totalItems: 11,
                                                itemsPerPage: 5,
                                                currentPage: 1,
                                                totalPages: 3,
                                                actions: [
                                                    {
                                                        label: 'Send Notice',
                                                        icon: '/icons/paper-plane.svg',
                                                        onClick: (row: any) =>
                                                            console.log(
                                                                'Send notice to',
                                                                row.uid
                                                            ),
                                                    },
                                                    {
                                                        label: 'View Details',
                                                        icon: '/icons/document.svg',
                                                        onClick: (row: any) =>
                                                            console.log(
                                                                'View details for',
                                                                row.uid
                                                            ),
                                                    },
                                                    {
                                                        label: 'Reconnect',
                                                        icon: '/icons/connect.svg',
                                                        onClick: (row: any) =>
                                                            console.log(
                                                                'Reconnect',
                                                                row.uid
                                                            ),
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
    );
};

export default Dashboard;

import React, { useState, Suspense } from 'react';
import Page from '@/components/global/PageC';
import { useNavigate } from 'react-router-dom';
import { exportChartData } from '@/utils/excelExport';

// Constants

const METER_STATUS_DATA = [
    { value: 284, name: 'Communicating' },
    { value: 8, name: 'Non-Communicating' },
];

const ConsumerDashboard: React.FC = () => {
    const [billingView, setBillingView] = useState<'Daily' | 'Monthly'>(
        'Daily'
    );
    const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly'>('Daily');
    const navigate = useNavigate();

    const handleTotalConsumersClick = () => navigate('/consumers');

    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range as 'Daily' | 'Monthly');
    };

    const [consumerStatsData] = useState([
        {
            id: 1,
            title: 'Total Consumers',
            value: '292',
            icon: '/icons/account.svg',
            subtitle1: '284 Active',
            subtitle2: '8 In-Active',
            onValueClick: handleTotalConsumersClick,
        },
        {
            id: 2,
            title: 'High-Usage Consumers',
            value: '2',
            icon: '/icons/coins.svg',
            subtitle1: '140.09 kWh Average Consumption',
            subtitle2: '',
        },
    ]);



    const [overdueConsumersData] = useState([
        {
            uid: '2025UIDC089',
            consumerName: 'I Lakshmana Rao',
            flatNo: 'C089',
            overdue: '32004.12',
        },
        {
            uid: '2025UIDC088',
            consumerName: 'G Ramaraju',
            flatNo: 'C088',
            overdue: '22613.91',
        },
        {
            uid: '2025UIDC089',
            consumerName: 'I Lakshmana Rao',
            flatNo: 'C089',
            overdue: '21679.76',
        },
        {
            uid: '2025UIDC089',
            consumerName: 'I Lakshmana Rao',
            flatNo: 'C089',
            overdue: '20745.27',
        },
        {
            uid: '2025UIDC089',
            consumerName: 'I Lakshmana Rao',
            flatNo: 'C089',
            overdue: '19731.31',
        },
    ]);



    const [overdueConsumersColumns] = useState([
        { key: 'uid', label: 'UID' },
        { key: 'consumerName', label: 'Consumer Name' },
        { key: 'flatNo', label: 'Flat No' },
        { key: 'overdue', label: 'Overdue (Rs.)' },
    ]);



    const [billingChartData] = useState({
        xAxisData: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        seriesData: [
            {
                name: 'Bills Generated',
                data: [
                    260, 255, 275, 280, 290, 285, 270, 265, 280, 275, 290, 295,
                ],
            },
            {
                name: 'Paid',
                data: [
                    240, 235, 250, 255, 260, 250, 245, 240, 255, 250, 265, 270,
                ],
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
            '#3B82F6', // Blue for Bills Generated
            '#10B981', // Green for Paid
            '#EF4444', // Red for Pending
            '#F97316', // Orange for Overdue
        ],
    });

    // Chart download handler
    const handleChartDownload = () => {
        exportChartData(billingChartData.xAxisData, billingChartData.seriesData, 'billing-vs-collection-data');
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
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
                                    gridRows: 2,
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
                                            },
                                            span: { col: 1, row: 1 },
                                        }))
                                    ],
                                },
                                {
                                    layout: "grid",
                                    gap: "gap-4",
                                    gridColumns: 2,
                                    gridRows: 2,
                                    span: { col: 2, row: 1 },
                                    className:'border border-primary-border rounded-3xl p-4 bg-background-secondary',
                                    columns: [
                                        {
                                            name: "SectionHeader",
                                            props: {
                                                title: "Latest Alerts",
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
                                            },
                                            span: { col: 1, row: 1 },
                                        }))
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
                                    span:{col:2,row:1},
                                    className:
                                        '',
                                    columns: [
                                        {
                                            name: 'BarChart',
                                            span:{col:1,row:1},
                                            props: {
                                                xAxisData:
                                                    billingChartData.xAxisData,
                                                seriesData:
                                                    billingChartData.seriesData,
                                                seriesColors:
                                                    billingChartData.seriesColors,
                                                height: '400px',
                                                showHeader: true,
                                                headerTitle:
                                                    'Billing vs Collection',
                                                dateRange: '2024',
                                                showDownloadButton: true,
                                                showViewToggle: true,
                                                viewToggleOptions: [
                                                    'Graph',
                                                    'Table',
                                                ],
                                                showTableView: true,
                                                ariaLabel:
                                                    'Monthly billing statistics chart',
                                                yAxisMax: 300,
                                                yAxisStep: 50,
                                                onDownload: handleChartDownload,
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
                                    layout: 'grid',
                                    gridColumns: 2,
                                    gridRows: 1,
                                    span:{col:2,row:1},
                                    gap: 'gap-4',
                                    className:
                                        'pb-4',
                                    columns: [
                                        {
                                            name: 'PieChart',
                                            span:{col:1,row:1},
                                            props: {
                                                data: METER_STATUS_DATA,
                                                height: 250,
                                                title: 'Meter Status',
                                                showLegend: false,
                                                showNoDataMessage: false,
                                                showHeader: false,
                                                className: 'p-6 border border-primary-border rounded-3xl flex flex-col items-center justify-center',
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
                                        {
                                            name: 'Table',
                                            
                                            props: {
                                                data: overdueConsumersData,
                                                columns:
                                                    overdueConsumersColumns,
                                                loading: false,
                                                searchable: true,
                                                pagination: true,
                                                title: 'Overdue Consumers',
                                                showActions: true,

                                                totalItems: 1395,
                                                itemsPerPage: 5,
                                                currentPage: 1,
                                                totalPages: 279,
                                                showHeader: true,
                                                headerTitle: 'Overdue Consumers',
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
                                // {
                                //     layout: 'column',
                                //     gap: 'gap-0',
                                //     className:
                                //         'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-2',
                                //     columns: [
                                       
                                //     ],
                                // },
                            ],
                        },
                    },
                  
                ]}
            />
        </Suspense>
    );
};

export default ConsumerDashboard;

import React, { useState, Suspense, useEffect } from 'react';
import Page from '@/components/global/PageC';
import { useNavigate } from 'react-router-dom';
import { exportChartData } from '@/utils/excelExport';

// Constants
const METER_STATUS_DATA = [
    { value: 284, name: 'Communicating' },
    { value: 8, name: 'Non-Communicating' },
];

interface ConsumerStats {
    totalConsumers: number;
    activeConsumers: number;
    inactiveConsumers: number;
    highUsageConsumers: number;
    averageConsumption: number;
}

interface ConsumptionBillingData {
    daily: {
        totalKwh: string;
        totalKvah: string;
        totalKw: string;
        totalKva: string;
    };
    monthly: {
        totalKwh: string;
        totalKvah: string;
        totalKw: string;
        totalKva: string;
    };
}

interface OverdueConsumer {
    uid: string;
    consumerName: string;
    flatNo: string;
    overdue: string;
}

const ConsumerDashboard: React.FC = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly'>('Daily');
    const navigate = useNavigate();
    
    // State for API data
    const [consumerStats, setConsumerStats] = useState<ConsumerStats>({
        totalConsumers: 0,
        activeConsumers: 0,
        inactiveConsumers: 0,
        highUsageConsumers: 0,
        averageConsumption: 0
    });
    
    const [consumptionBillingData, setConsumptionBillingData] = useState<ConsumptionBillingData>({
        daily: { totalKwh: '0', totalKvah: '0', totalKw: '0', totalKva: '0' },
        monthly: { totalKwh: '0', totalKvah: '0', totalKw: '0', totalKva: '0' }
    });
    
    const [overdueConsumersData, setOverdueConsumersData] = useState<OverdueConsumer[]>([]);
    const [loading, setLoading] = useState(true);

    const handleTotalConsumersClick = () => navigate('/consumers');

    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range as 'Daily' | 'Monthly');
    };

    // Simulate API calls with dummy data
    const fetchConsumerStats = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dummy data matching the structure you provided
        const dummyStats = {
            totalConsumers: 292,
            activeConsumers: 284,
            inactiveConsumers: 8,
            highUsageConsumers: 2,
            averageConsumption: 140.09
        };
        
        setConsumerStats(dummyStats);
    };

<<<<<<< HEAD
    const [consumerStatsData] = useState([
        {
            id: 1,
            title: 'Total Consumers',
            value: '292',
            icon: '/icons/units.svg',
            subtitle1: '284 Active',
            subtitle2: '8 In-Active',
            onValueClick: handleTotalConsumersClick,
        },
        {
            id: 2,
            title: 'High-Usage Consumers',
            value: '2',
            icon: '/icons/heavy-user.svg',
            subtitle1: '140.09 kWh Average Consumption',
            subtitle2: '',
        },
    ]);
    const [consumptionBillingData] = useState([
        {
            id: 1,
            title: 'Electricity Usage (kWh)',
            value: '165.87',
            icon: '/icons/plug-alt.svg',
            subtitle1: '284 Active',
            subtitle2: '8 In-Active',
            onValueClick: handleTotalConsumersClick,
        },
        {
            id: 2,
            title: 'High-Usage Consumers',
            value: '2',
            icon: '/icons/rupee.svg',
            subtitle1: '140.09 kWh Average Consumption',
            subtitle2: '',
        },
    ]);
=======
    const fetchConsumptionBillingData = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Dummy data matching the DTR dashboard structure with different values for daily/monthly
        const dummyData = {
            daily: {
                totalKwh: '16.09',
                totalKvah: '16.50',
                totalKw: '17.40',
                totalKva: '1.86'
            },
            monthly: {
                totalKwh: '4850.25',
                totalKvah: '5020.75',
                totalKw: '32.15',
                totalKva: '3.45'
            }
        };
        
        setConsumptionBillingData(dummyData);
    };

    const fetchOverdueConsumers = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Dummy data for overdue consumers
        const dummyOverdueData = [
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
                uid: '2025UIDC087',
                consumerName: 'S Meenakshi',
                flatNo: 'C087',
                overdue: '18500.00',
            },
            {
                uid: '2025UIDC086',
                consumerName: 'P Srinivas',
                flatNo: 'C086',
                overdue: '17250.50',
            },
            {
                uid: '2025UIDC085',
                consumerName: 'A Kumar',
                flatNo: 'C085',
                overdue: '16000.75',
            },
            {
                uid: '2025UIDC084',
                consumerName: 'R Priya',
                flatNo: 'C084',
                overdue: '15400.00',
            },
            {
                uid: '2025UIDC083',
                consumerName: 'V Ramesh',
                flatNo: 'C083',
                overdue: '14999.99',
            },
            {
                uid: '2025UIDC082',
                consumerName: 'K Suresh',
                flatNo: 'C082',
                overdue: '14000.00',
            },
            {
                uid: '2025UIDC081',
                consumerName: 'M Lakshmi',
                flatNo: 'C081',
                overdue: '13500.00',
            },
            {
                uid: '2025UIDC080',
                consumerName: 'T Anil',
                flatNo: 'C080',
                overdue: '13000.00',
            },
        ];
        
        setOverdueConsumersData(dummyOverdueData);
    };
>>>>>>> ff88ac0ebf65a32c4dbf38d7f8dff6920c92e702

    // Load all data on component mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchConsumerStats(),
                    fetchConsumptionBillingData(),
                    fetchOverdueConsumers()
                ]);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Get current consumption billing data based on selected time range
    const getCurrentConsumptionBillingData = () => {
        const data = selectedTimeRange === 'Daily' ? consumptionBillingData.daily : consumptionBillingData.monthly;
        return [
            {
                id: 1,
                title: 'Electricity Usage (kWh)',
                value: `${data.totalKwh} kWh`,
                icon: '/icons/plug-alt.svg',
                subtitle1: `${consumerStats.activeConsumers} Active Consumption`,
                subtitle2: `${consumerStats.inactiveConsumers} In-Active Consumption`,
                onValueClick: handleTotalConsumersClick,
            },
            {
                id: 2,
                title: 'Electricity Charges',
                value: `₹ ${(parseFloat(data.totalKwh) * 1000).toFixed(2)}`,
                icon: '/icons/rupee.svg',
                subtitle1: `${consumerStats.averageConsumption} kWh Average Billing`,
                subtitle2: '',
            },
        ];
    };

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
        // seriesData: [
        //     {
        //         name: 'Bills Generated',
        //         data: [
        //             260, 255, 275, 280, 290, 285, 270, 265, 280, 275, 290, 295,
        //         ],
        //     },
        //     {
        //         name: 'Paid',
        //         data: [
        //             240, 235, 250, 255, 260, 250, 245, 240, 255, 250, 265, 270,
        //         ],
        //     },
        //     {
        //         name: 'Pending',
        //         data: [15, 12, 18, 20, 25, 30, 20, 18, 22, 20, 18, 20],
        //     },
        //     {
        //         name: 'Overdue',
        //         data: [5, 8, 7, 5, 5, 5, 5, 7, 3, 5, 7, 5],
        //     },
        // ],
        seriesColors: [
            '#3B82F6', // Blue for Bills Generated
            '#10B981', // Green for Paid
            '#EF4444', // Red for Pending
            '#F97316', // Orange for Overdue
        ],
    });

    // Chart download handler
    // const handleChartDownload = () => {
    //     exportChartData(billingChartData.xAxisData, billingChartData.seriesData, 'billing-vs-collection-data');
    // };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    const consumerStatsData = [
        {
            id: 1,
            title: 'Total Consumers',
            value: consumerStats.totalConsumers.toString(),
            icon: '/icons/units.svg',
            subtitle1: `${consumerStats.activeConsumers} Active`,
            subtitle2: `${consumerStats.inactiveConsumers} In-Active`,
            onValueClick: handleTotalConsumersClick,
        },
        {
            id: 2,
            title: 'High-Usage Consumers',
            value: consumerStats.highUsageConsumers.toString(),
            icon: '/icons/heavy-user.svg',
            subtitle1: `${consumerStats.averageConsumption} kWh Average Consumption`,
            subtitle2: '',
        },
    ];

    const currentConsumptionBillingData = getCurrentConsumptionBillingData();

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
                                        })),


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
                                                title: `Consumption & Billing (${selectedTimeRange === 'Daily' ? 'Aug 6, 2025' : 'August 2025'})`,
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
                                        ...currentConsumptionBillingData.map((card) => ({
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
                                            },
                                            span: { col: 1, row: 1 },
                                        }))
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
<<<<<<< HEAD
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-2 p-4',
                                    columns: [
                                        {
                                            name: "Holder",
                                            props: {
                                                title: "Daily Consumption Metrics",
                                                subtitle: "Monthly billing statistics and collection data",
                                                className: "border-none rounded-t-3xl",
                                            },
                                        },
=======
                                    className: '',
                                    columns: [
                                        // {
                                        //     name: "Holder",
                                        //     props: {
                                        //         title: "Billing vs Collection",
                                        //         subtitle: "Monthly billing statistics and collection data",
                                        //         className: "border-none rounded-t-3xl",
                                        //     },
                                        // },
>>>>>>> ff88ac0ebf65a32c4dbf38d7f8dff6920c92e702
                                        {
                                            name: 'BarChart',
                                            props: {
                                                xAxisData:
                                                    billingChartData.xAxisData,
<<<<<<< HEAD
=======
                                                // seriesData:
                                                //     billingChartData.seriesData,
>>>>>>> ff88ac0ebf65a32c4dbf38d7f8dff6920c92e702
                                                seriesColors:
                                                    billingChartData.seriesColors,
                                                height: '400px',
                                                showHeader: true,
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
                                                onDownload: "   ",
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
                                    gap: 'gap-0',
                                    span:{col:1,row:1},
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-1',
                                    columns: [
                                        {
                                            name: "Holder",
                                            props: {
                                                title: "Meter Communication Status",
                                                subtitle: "Distribution of communicating and non-communicating meters",
                                                className: "border-none rounded-t-3xl",
                                            },
                                        },
                                        {
                                            name: 'PieChart',
                                            props: {
                                                data: METER_STATUS_DATA,
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
                                            },
                                        },
                                    ],
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    span:{col:1,row:1},
                                    className: '',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: overdueConsumersData,
                                                columns:
                                                    overdueConsumersColumns,
                                                loading: false,
                                                searchable: true,
                                                pagination: true,
                                                showActions: true,
                                                totalItems: 1395,
                                                itemsPerPage: 5,
                                                currentPage: 1,
                                                totalPages: 279,
                                                showHeader: true,
                                                headerTitle: 'Latest Meter Events',
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

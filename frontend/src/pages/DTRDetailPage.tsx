import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageC from '@/components/global/PageC';
import { exportChartData } from '@/utils/excelExport';
import { FILTER_STYLES } from '@/contexts/FilterStyleContext';

const mockDTRData = {
    name: 'TGNP_DTR-03',
    rating: '15.00 kVA',
    address: 'Prashanth Nagar, Hyderabad, Telangana, India, 500084',
    location: { lat: 17.470268, lng: 78.353907 },
    stats: [
        {
            title: 'Total LT Feeders',
            value: 4,
            icon: '/icons/feeder.svg',
            subtitle1: 'Connected to DTR',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
        },
        {
            title: 'Total kW',
            value: 3.73,
            icon: '/icons/consumption.svg',
            subtitle1: 'Active Power',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
        },
        {
            title: 'Total kVA',
            value: 3.98,
            icon: '/icons/consumption.svg',
            subtitle1: 'Apparent Power',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
        },
        {
            title: 'Total kWh',
            value: 20355.16,
            icon: '/icons/consumption.svg',
            subtitle1: 'Cumulative Active Energy',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
        },
        {
            title: 'Total kVAh',
            value: 20699.25,
            icon: '/icons/consumption.svg',
            subtitle1: 'Cumulative Apparent Energy',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
        },
        {
            title: 'LT Feeders Fuse Blown',
            value: 0,
            icon: '/icons/power_failure.svg',
            subtitle1: 'Requires maintenance',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
        },
        {
            title: 'Unbalanced LT Feeders',
            value: 0,
            icon: '/icons/power_failure.svg',
            subtitle1: 'Requires attention',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
        },
        {
            title: 'Power On',
            value: '00:00:00',
            icon: '/icons/power_failure.svg',
            subtitle1: '',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
        },
        {
            title: 'Power Off',
            value: '00:00:00',
            icon: '/icons/power_failure.svg',
            subtitle1: '',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
            bg: 'bg-[var(--color-danger)]',
            iconStyle: FILTER_STYLES.WHITE,
        },
        {
            title: 'Status',
            value: 'B_PH CT',
            icon: '/icons/units.svg',
            subtitle1: '0000-00-00 00:00:00',
            valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',
            bg: 'bg-[var(--color-secondary)]',
            iconStyle: FILTER_STYLES.WHITE,
        },
    ],
};

const DTRDetailPage = () => {
    const { dtrId } = useParams();
    const navigate = useNavigate();
    
    console.log('DTR Detail Page - DTR ID:', dtrId);
    
    // TODO: Fetch DTR data by dtrId here (using mock for now)
    const dtr = mockDTRData;

    // Daily consumption data for charts
    const [dailyConsumptionData, setDailyConsumptionData] = useState({
        xAxisData: [
            '6 May', '7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul', '5 Jul', '6 Jul',
        ],
        seriesData: [
            {
                name: 'Consumption',
                data: [
                    572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 610, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572,
                ],
            },
        ],
    });



    // Feeders data
    const [feedersData, setFeedersData] = useState([
        {
            sNo: 1,
            feederName: 'D1F1(32500114)',
            loadStatus: 'Underload',
            rating: '25.00 kVA',
            address: 'Waddepally, Warangal, Telangana, India, 506001',
        },
        {
            sNo: 2,
            feederName: 'D1F2(32500115)',
            loadStatus: 'Normal',
            rating: '25.00 kVA',
            address: 'Hanamkonda, Warangal, Telangana, India, 506001',
        },
        {
            sNo: 3,
            feederName: 'D1F3(32500116)',
            loadStatus: 'Overload',
            rating: '25.00 kVA',
            address: 'Kazipet, Warangal, Telangana, India, 506001',
        },
        {
            sNo: 4,
            feederName: 'D1F4(32500117)',
            loadStatus: 'Underload',
            rating: '25.00 kVA',
            address: 'Warangal Fort, Warangal, Telangana, India, 506001',
        },
    ]);

    // Alerts data
    const [alertsData, setAlertsData] = useState([
        {
            alertId: 'ALRT-001',
            type: 'Over Voltage',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-30 21:15:00',
        },
        {
            alertId: 'ALRT-002',
            type: 'Under Voltage',
            feederName: 'D1F2(32500115)',
            occuredOn: '2025-06-29 18:45:00',
        },
        {
            alertId: 'ALRT-003',
            type: 'Power Failure',
            feederName: 'D1F3(32500116)',
            occuredOn: '2025-06-28 14:30:00',
        },
        {
            alertId: 'ALRT-004',
            type: 'Phase Imbalance',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-27 10:20:00',
        },
        {
            alertId: 'ALRT-005',
            type: 'Over Current',
            feederName: 'D1F2(32500115)',
            occuredOn: '2025-06-26 08:10:00',
        },
    ]);

    const lastComm = '30/06/2025 22:31:38';

    // Use setters to avoid unused variable warnings
    useEffect(() => {
        // No-op usage to avoid TS warnings
        setDailyConsumptionData((prev) => prev);
        setFeedersData((prev) => prev);
        setAlertsData((prev) => prev);
    }, []);

    // Handle Excel download for daily consumption chart
    const handleDailyChartDownload = () => {
        exportChartData(dailyConsumptionData.xAxisData, dailyConsumptionData.seriesData, 'dtr-daily-consumption-data');
    };



    // Handle feeders export
    const handleFeedersExport = () => {
        console.log('Exporting feeders...');
        // Add feeders export logic here
    };

    // Handle alerts export

    // Handle feeder row click
    const handleFeederClick = (feederId: string) => {
        // Find the feeder data for the clicked feeder
        const feederData = feedersData.find(feeder => feeder.feederName === feederId);
        if (feederData) {
            navigate(`/feeder/${feederId}`, { 
                state: { 
                    feederData,
                    dtrId: dtrId,
                    dtrName: dtr.name
                } 
            });
        }
    };

    // Handle feeder view action
    const handleFeederView = (row: any) => {
        navigate(`/feeder/${row.feederName}`, { 
            state: { 
                feederData: row,
                dtrId: dtrId,
                dtrName: dtr.name
            } 
        });
    };

    return (
        <PageC
            sections={[
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: 'w-full',
                        rows: [
                            {
                                layout: 'row' as const,
                                className: 'w-full',
                                columns: [
                                    {
                                        name: 'PageHeader',
                                        props: {
                                            title: dtr.name,
                                            onBackClick: () => navigate('/dtr-dashboard'),
                                            backButtonText: 'Back to Dashboard',
                                            buttonsLabel: 'Export Data',
                                            variant: 'primary',
                                            onClick: () => handleDailyChartDownload(),
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 3,
                        className: 'border border-primary-border rounded-3xl bg-white p-4',
                        rows: [
                            {
                                layout: 'row' as const,
                                className: 'justify-between w-full',
                                span: { col: 3, row: 1 },
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: 'DTR Information',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            titleVariant: 'primary',
                                            titleWeight: 'bold',
                                            titleAlign: 'left',
                                            defaultTitleHeight:'0',
                                        },
                                    },
                                ],
                            },
                            {
                                layout: 'row' as const,
                                className: 'justify-between w-full',
                                span: { col: 3, row: 1 },
                                columns: [
                                    {   
                                       name: 'PageInformation',
                                       props: {
                                        gridColumns: 3,
                                        rows: [
                                            {
                                                layout: 'row',
                                                className: 'justify-between w-full',
                                                span: { col: 3, row: 1 },
                                                items: [
                                                    {
                                                        title: 'DTR Name',
                                                        value: dtr.name,
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title: 'Rating',
                                                        value: dtr.rating,
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title: 'Address',
                                                        value: dtr.address,
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title:'Location',
                                                        value:`${dtr.location.lat}, ${dtr.location.lng}`,
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    }
                                                ]
                                            }
                                        ]
                                       }
                                    }
                                ]
                            }
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: 'w-full p-4 border border-primary-border rounded-3xl',
                        rows: [
                            {
                                layout: 'row' as const,
                                className: 'justify-between w-full',
                                span: { col: 1, row: 1 },
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: 'Distribution Transformer (DTR) Statistics',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            titleVariant: 'primary',
                                            titleWeight: 'bold',
                                            titleAlign: 'left',
                                            className:'w-full',
                                            rightComponent: { name: 'LastComm', props: { value: lastComm } },
                                        },
                                        span: { col: 1, row: 1 },
                                    },
                                ],
                            },
                            {
                                layout: 'grid' as const,
                                gridColumns: 5,
                                className: 'w-full gap-4',
                                columns: dtr.stats.map((stat) => ({
                                    name: 'Card',
                                    props: {
                                        title: stat.title,
                                        value: stat.value,
                                        subtitle1: stat.subtitle1,
                                        icon: stat.icon,
                                        bg: stat.bg || 'bg-stat-icon-gradient',
                                        valueFontSize: stat.valueFontSize || 'text-lg lg:text-xl md:text-lg sm:text-base',
                                        iconStyle: stat.iconStyle || FILTER_STYLES.BRAND_GREEN,
                                    },
                                    span: { col: 1, row: 1 },
                                })),
                            },
                        ],
                    },
                },
               
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: '',
                        rows: [
                            {
                                layout: 'grid' as const,
                                gridColumns: 1,
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            columns: [
                                                { key: 'sNo', label: 'S.No' },
                                                { key: 'feederName', label: 'Feeder Name' },
                                                { key: 'loadStatus', label: 'Load Status' },
                                                { key: 'rating', label: 'Rating' },
                                                { key: 'address', label: 'Address' },
                                            ],
                                            data: feedersData,
                                            searchable: true,
                                            pagination: true,
                                            initialRowsPerPage: 10,
                                            rowsPerPageOptions: [5, 10, 15, 20, 25],
                                            emptyMessage: 'No Feeders Found',
                                            showActions: true,
                                            title: 'DTR Feeders',
                                            headerTitle: 'DTR Feeders',
                                            showHeader: true,
                                            showPaginationInfo: true,
                                            showRowsPerPageSelector: true,
                                            className: 'w-full',
                                            onExport: handleFeedersExport,
                                            onRowClick: (row: any) => handleFeederClick(row.feederName),
                                            actions: [
                                                {
                                                    label: 'View',
                                                    icon: '/icons/eye.svg',
                                                    onClick: handleFeederView,
                                                    variant: 'primary',
                                                    size: 'sm'
                                                }
                                            ],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: '',
                        rows: [
                            {
                                layout: 'grid' as const,
                                gridColumns: 1,
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            columns: [
                                                { key: 'alertId', label: 'Alert ID' },
                                                { key: 'type', label: 'Type' },
                                                { key: 'feederName', label: 'Feeder Name' },
                                                { key: 'occuredOn', label: 'Occured On' },
                                            ],
                                            data: alertsData,
                                            searchable: true,
                                            pagination: true,
                                            initialRowsPerPage: 10,
                                            rowsPerPageOptions: [5, 10, 15, 20, 25],
                                            emptyMessage: 'No Alerts Found',
                                            showActions: true,
                                            title: 'DTR Alerts',
                                            headerTitle: 'DTR Alerts',
                                            showHeader: true,
                                            showPaginationInfo: true,
                                            showRowsPerPageSelector: true,
                                            className: 'w-full',
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

export default DTRDetailPage;

import { useState, useEffect } from 'react';
import PageC from '@/components/global/PageC';
// import PageHeader from '@/components/global/PageHeader';
import { exportChartData } from '@/utils/excelExport';

// const stats = [
//     { title: 'R-Phase Voltage', value: '257.686', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8', valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'Y-Phase Voltage', value: '255.089', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'B-Phase Voltage', value: '254.417', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-warning)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'Apparent Power', value: '19.527', icon: '/icons/consumption.svg', subtitle1: 'kVA' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'MD-kVA', value: '52.220', icon: '/icons/consumption.svg', subtitle1: 'kVA' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'R-Phase Current', value: '15.892', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'Y-Phase Current', value: '27.644', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'B-Phase Current', value: '33.984', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-warning)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8',valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base' },
//     { title: 'Neutral Current', value: '12.980', icon: '/icons/consumption.svg', subtitle1: 'Amps' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'Frequency', value: '49.980', icon: '/icons/frequency.svg', subtitle1: 'Hz' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'R-Phase PF', value: '1.000', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'Y-Phase PF', value: '-0.987', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'B-Phase PF', value: '0.998', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-warning)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'Avg PF', value: '-0.999', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
//     { title: 'Cummulative kVAh', value: '77902.296', icon: '/icons/consumption.svg', subtitle1: 'kVAh' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
// ];

const Feeders = () => {
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

    // Monthly consumption data
    const monthlyConsumptionData = {
        xAxisData: [
            'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025',
        ],
        seriesData: [
            {
                name: 'Consumption',
                data: [0, 0, 0, 0, 0, 0, 0, 6000, 14000, 18000, 17000, 16000, 0],
            },
        ],
    };

    // Dummy data for Alerts Table
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
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-29 18:45:00',
        },
        {
            alertId: 'ALRT-003',
            type: 'Power Failure',
            feederName: 'D1F1(32500114)',
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
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-26 08:10:00',
        },
    ]);

    // Replace feederDescriptions and feederInfo with feederData and lastComm   
    const [_feederData, _setFeederData] = useState([
        { title: 'Feeder Name', description: 'D1F1(32500114)' },
        { title: 'Rating', description: '25.00 kVA' },
        { title: 'Address', description: 'Waddepally, Warangal, Telangana, India, 506001' },
    ]);
    // const lastComm = '30/06/2025 22:31:38';

    // Use setters to avoid unused variable warnings
    useEffect(() => {
        // No-op usage to avoid TS warnings
        setDailyConsumptionData((prev) => prev);
        setAlertsData((prev) => prev);
    }, []);

    // Handle Excel download for daily consumption chart
    const handleDailyChartDownload = () => {
        exportChartData(dailyConsumptionData.xAxisData, dailyConsumptionData.seriesData, 'feeder-daily-consumption-data');
    };

    // Handle Excel download for monthly consumption chart
    const handleMonthlyChartDownload = () => {
        exportChartData(monthlyConsumptionData.xAxisData, monthlyConsumptionData.seriesData, 'feeder-monthly-consumption-data');
    };

    // Handle alerts export
    const handleAlertsExport = () => {
        console.log('Exporting alerts...');
        // Add alerts export logic here
    };

    // Handle refresh functionality
    // const handleRefresh = () => {
    //     console.log('Refreshing feeder data...');
    //     // Add refresh logic here
    // };

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
                                            title: 'Feeder Information',
                                            onBackClick: () => window.history.back(),
                                            backButtonText: 'Back to Dashboard',
                                            buttonsLabel: 'Export Data',
                                            variant: 'primary',
                                            onClick: () => handleDailyChartDownload(),
                                            showMenu: true,
                                            showDropdown: true,
                                            menuItems: [
                                                { id: 'export-daily', label: 'Export Daily Data' },
                                                { id: 'export-monthly', label: 'Export Monthly Data' },
                                                { id: 'export-alerts', label: 'Export Alerts' },
                                            ],
                                            onMenuItemClick: (itemId: string) => {
                                                switch (itemId) {
                                                    case 'export-daily':
                                                        handleDailyChartDownload();
                                                        break;
                                                    case 'export-monthly':
                                                        handleMonthlyChartDownload();
                                                        break;
                                                    case 'export-alerts':
                                                        handleAlertsExport();
                                                        break;
                                                }
                                            },

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
                        className: 'border border-primary-border rounded-3xl bg-white p-6',
                        rows: [
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
                                                        title: 'Feeder Name',
                                                        value: 'D1F1(32500114)',
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title: 'Rating',
                                                        value: '25.00 kVA',
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title: 'Address',
                                                        value: 'Waddepally, Warangal, Telangana, India, 506001',
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title:'Location',
                                                        value:'16.353710, 78.059170 ',
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
                        rows: [
                           

                            {
                                layout: 'grid' as const,
                                gridColumns:1,
                                columns: [
                                    {
                                        name: 'BarChart',
                                        props: {
                                            xAxisData: dailyConsumptionData.xAxisData,
                                            seriesData: dailyConsumptionData.seriesData,
                                            height: 320,
                                            ariaLabel: 'Daily Consumption Metrics Bar Chart',
                                            showHeader: true,
                                            handleDownload: handleDailyChartDownload,
                                            headerTitle: 'Daily Consumption Metrics',
                                            className: 'w-full',
                                            dateRange: 'Last 30 days',
                                            availableTimeRanges: ['Daily', 'Monthly'],
                                            initialTimeRange: 'Daily',
                                            onTimeRangeChange: (range: string) => console.log('Time range changed to:', range),
                                            showDownloadButton: true,
                                            onDownload: () => handleDailyChartDownload(),
                                        },
                                        span: { col: 1, row: 1 },
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
                        rows: [
                            
                            {
                                layout: 'grid' as const,
                                className:"w-full",
                                columns: [
                                    {
                                        name: 'BarChart',
                                        props: {
                                            xAxisData: monthlyConsumptionData.xAxisData,
                                            seriesData: monthlyConsumptionData.seriesData,
                                            height: 320,
                                            showHeader: true,  
                                            headerTitle: 'Monthly Consumption Metrics Bar Chart',
                                            className: 'w-full',
                                            dateRange: 'Last 30 days',
                                            showDownloadButton: true,
                                            onDownload: () => handleMonthlyChartDownload(),
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
                        className: 'border border-primary-border rounded-3xl p-6',
                        rows: [
                            {
                                layout: 'row' as const,
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: 'Feeder Location',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            titleVariant: 'primary',
                                            titleWeight: 'bold',
                                            titleAlign: 'left',
                                        },
                                    },
                                ],
                            },
                            // {
                            //     layout: 'row' as const,
                            //     columns: [
                            //         {
                            //             name: 'GoogleMap',
                            //             props: {
                            //                 apiKey: 'AIzaSyDUMMY-KEY-1234567890abcdefg',
                            //                 center: { lat: 17.385044, lng: 78.486671 },
                            //                 markerPosition: { lat: 17.385044, lng: 78.486671 },
                            //                 style: { width: '100%', height: '350px', borderRadius: '16px', overflow: 'hidden' },
                            //                 className: 'w-full',
                            //             },
                                     
                            //         },
                            //     ],
                            // },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: 'mb-8 border border-primary-border rounded-3xl p-6',
                        rows: [
                            {
                                layout: 'row' as const,
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: 'Alerts',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            titleVariant: "colorPrimaryDark",
                                            titleWeight: "medium",
                                            titleAlign: 'left',
                                        },
                                    },
                                ],
                            },
                            {
                                layout: 'row' as const,
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
                                            initialRowsPerPage: 5,
                                            emptyMessage: 'No Alerts Found',
                                            showActions: true,

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

export default Feeders;

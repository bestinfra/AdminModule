import { useState, useEffect } from 'react';
import Page from '@/components/global/PageC';

const stats = [
    { title: 'R-Phase Voltage', value: '257.686', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8', valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'Y-Phase Voltage', value: '255.089', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'B-Phase Voltage', value: '254.417', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-warning)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'Apparent Power', value: '19.527', icon: '/icons/consumption.svg', subtitle1: 'kVA' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'MD-kVA', value: '52.220', icon: '/icons/consumption.svg', subtitle1: 'kVA' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'R-Phase Current', value: '15.892', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'Y-Phase Current', value: '27.644', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'B-Phase Current', value: '33.984', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-warning)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8',valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base' },
    { title: 'Neutral Current', value: '12.980', icon: '/icons/consumption.svg', subtitle1: 'Amps' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'Frequency', value: '49.980', icon: '/icons/frequency.svg', subtitle1: 'Hz' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'R-Phase PF', value: '1.000', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'Y-Phase PF', value: '-0.987', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'B-Phase PF', value: '0.998', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-warning)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'Avg PF', value: '-0.999', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
    { title: 'Cummulative kVAh', value: '77902.296', icon: '/icons/consumption.svg', subtitle1: 'kVAh' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base'},
];

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
    const [feederData, _setFeederData] = useState([
        { title: 'Feeder Name', description: 'D1F1(32500114)' },
        { title: 'Rating', description: '25.00 kVA' },
        { title: 'Address', description: 'Waddepally, Warangal, Telangana, India, 506001' },
    ]);
    const lastComm = '30/06/2025 22:31:38';

    // Use setters to avoid unused variable warnings
    useEffect(() => {
        // No-op usage to avoid TS warnings
        setDailyConsumptionData((prev) => prev);
        setAlertsData((prev) => prev);
    }, []);

    return (
        <Page
            sections={[
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 3,
                        className: 'mb-6 border border-primary-border rounded-3xl bg-white p-8',
                        rows: [
                            {
                                layout: 'row' as const,
                                className: 'justify-between w-full',
                                span: { col: 3, row: 1 },
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: 'Feeder Information',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            className: 'w-full',
                                            titleVariant: 'primary',
                                            titleWeight: 'bold',
                                            titleAlign: 'left',
                                            layout: 'horizontal',
                                            rightComponent: { name: 'LastComm', props: { value: lastComm } },
                                        },
                                    },
                                ],
                            },
                            {
                                layout: 'grid' as const,
                                gridColumns: 3,
                                span: { col: 3, row: 1 },
                                columns: feederData.map((item) => ({
                                    name: 'SectionHeader',
                                    props: {
                                        title: item.title,
                                        value: item.description,
                                        titleLevel: 2,
                                        titleSize: 'md',    
                                        titleVariant: 'primary',
                                        titleWeight: 'bold',
                                        titleAlign: 'left',
                                        layout: 'vertical',
                                        rightComponent: {
                                            name: 'LastComm',
                                            props: { description: item.description },
                                        },
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
                        className: 'mb-6 border border-primary-border rounded-3xl px-6 bg-background-secondary',
                        rows: [
                            {
                                layout: 'row' as const,
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: 'Feeder Statistics',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            titleVariant: 'colorPrimaryDark',
                                            titleWeight: 'medium',
                                            titleAlign: 'left',
                                            className: 'w-full',
                                            rightComponent: { name: 'LastComm', props: { value: lastComm } },
                                            
                                        },
                                        
                                    },
                                

                                ],
                                
                            },
                            {
                                layout: 'grid' as const,
                                gap: 'gap-4',
                                gridColumns: 5,
                                columns: stats.map((stat) => ({ 
                                    name: 'Card', 
                                    props: { ...stat } 
                                })),
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
                                            
                                            headerTitle: 'Daily Consumption Metrics',
                                            className: 'w-full',
                                            dateRange: 'Last 30 days',
                                            availableTimeRanges: ['Daily', 'Monthly'],
                                            initialTimeRange: 'Daily',
                                            onTimeRangeChange: (range: string) => console.log('Time range changed to:', range),
                                            showDownloadButton: true,
                                            onDownload: (timeRange: string, viewType: string) => console.log('Downloading data for:', timeRange, 'in', viewType, 'view'),
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
                                            xAxisData: [
                                                'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025',
                                            ],
                                            seriesData: [
                                                {
                                                    name: 'Consumption',
                                                    data: [0, 0, 0, 0, 0, 0, 0, 6000, 14000, 18000, 17000, 16000, 0],
                                                },
                                            ],
                                            height: 320,
                                            showHeader: true,  
                                            headerTitle: 'Monthly Consumption Metrics Bar Chart',
                                            className: 'w-full',
                                            dateRange: 'Last 30 days',

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
                        className: 'mb-6 border border-primary-border rounded-3xl p-0 mt-4',
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

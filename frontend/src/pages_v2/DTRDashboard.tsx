import React, { useState } from 'react';
import type { TableData } from '@components/global/Table';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';

const DTRDashboard: React.FC = () => {
    const navigate = useNavigate();

    // DTR statistics cards data using useState
    const [dtrStatsCards] = useState([
        {
            title: 'Total DTRs',
            value: 29,
            icon: '/icons/dtr.svg',
            subtitle1: 'Total Transformer Units',
            onValueClick: () => navigate('/dtr-statistics/total-dtrs'),
        },
        {
            title: 'Total LT Feeders',
            value: 33,
            icon: '/icons/feeder.svg',
            subtitle1: 'Connected to DTRs',
            onValueClick: () => navigate('/dtr-statistics/total-lt-feeders'),
        },
        {
            title: 'Total Fuse Blown',
            value: 3,
            icon: '/icons/power_failure.svg',
            subtitle1: '0.10% of Total DTRs',
            onValueClick: () => navigate('/dtr-statistics/total-fuse-blown'),
        },
        {
            title: 'Overloaded Feeders',
            value: 0,
            icon: '/icons/dtr.svg',
            subtitle1: '0.00% of Total Feeders',
            onValueClick: () => navigate('/dtr-statistics/overloaded-feeders'),
        },
        {
            title: 'Underloaded Feeders',
            value: 33,
            icon: '/icons/dtr.svg',
            subtitle1: '100.0% of Total Feeders',
            onValueClick: () => navigate('/dtr-statistics/underloaded-feeders'),
        },
        {
            title: 'LT Side Fuse Blown',
            value: 3,
            icon: '/icons/power_failure.svg',
            subtitle1: '3 Incidents',
            onValueClick: () => navigate('/dtr-statistics/lt-side-fuse-blown'),
        },
        {
            title: 'Unbalanced DTRs',
            value: 0,
            icon: '/icons/dtr.svg',
            subtitle1: '0.00% of Total DTRs',
            onValueClick: () => navigate('/dtr-statistics/unbalanced-dtrs'),
        },
        {
            title: 'Power Failure Feeders',
            value: 0,
            icon: '/icons/power_failure.svg',
            subtitle1: '0.00% of Feeders',
            onValueClick: () =>
                navigate('/dtr-statistics/power-failure-feeders'),
        },
        {
            title: 'HT Side Fuse Blown',
            value: 0,
            icon: '/icons/power_failure.svg',
            subtitle1: '0 Incident',
            onValueClick: () => navigate('/dtr-statistics/ht-side-fuse-blown'),
        },
    ]);

    // DTR Consumption Cards
    const [dtrConsumptionCards] = useState([
        {
            title: 'Total kWh',
            value: '111931.96',
            icon: '/icons/consumption.svg',
            subtitle1: 'Cumulative Active Energy',
        },
        {
            title: 'Total kVAh',
            value: '113369.06',
            icon: '/icons/consumption.svg',
            subtitle1: 'Cumulative Apparent Energy',
        },
        {
            title: 'Total kW',
            value: '6.10',
            icon: '/icons/consumption.svg',
            subtitle1: 'Active Power',
        },
        {
            title: 'Total kVA',
            value: '6.26',
            icon: '/icons/consumption.svg',
            subtitle1: 'Apparent Power',
        },
        {
            title: 'Active DTRs',
            value: 29,
            icon: '/icons/dtr.svg',
            subtitle1: '100.00% of Total DTRs',
        },

        {
            title: 'In-Active DTRs',
            value: 0,
            icon: '/icons/dtr.svg',
            subtitle1: '0.00% of Total DTRs',
        },
    ]);
    // Dummy data for DTRs table
    const dtrTableColumns = [
        { key: 'dtrId', label: 'DTR ID' },
        { key: 'dtrName', label: 'DTR Name' },
        { key: 'feedersCount', label: 'Feeders Count' },
        { key: 'streetName', label: 'Street Name' },
        { key: 'city', label: 'City' },
        { key: 'commStatus', label: 'Comm-Status' },
    ];
    const dtrTableData = [
        {
            dtrId: 'TRANSFORMER-01',
            dtrName: 'TGNP_DTR-01',
            feedersCount: 1,
            streetName: 'Waddepally',
            city: 'Warangal',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-02',
            dtrName: 'TGNP_DTR-02',
            feedersCount: 1,
            streetName: 'Sun city',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-03',
            dtrName: 'TGNP_DTR-03',
            feedersCount: 4,
            streetName: 'Prashanth Nagar',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-04',
            dtrName: 'TGNP_DTR-04',
            feedersCount: 1,
            streetName: 'Prashanth Nagar',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-05',
            dtrName: 'TGNP_DTR-05',
            feedersCount: 1,
            streetName: 'Prashanth Nagar',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-06',
            dtrName: 'TGNP_DTR-06',
            feedersCount: 1,
            streetName: 'Prashanth Nagar',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-07',
            dtrName: 'TGNP_DTR-07',
            feedersCount: 1,
            streetName: 'Hyder Nagar',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-08',
            dtrName: 'TGNP_DTR-08',
            feedersCount: 1,
            streetName: 'Hyder Nagar',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-09',
            dtrName: 'TGNP_DTR-09',
            feedersCount: 1,
            streetName: 'Hyder Nagar',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
        {
            dtrId: 'TRANSFORMER-10',
            dtrName: 'TGNP_DTR-10',
            feedersCount: 1,
            streetName: 'Hyder Nagar',
            city: 'Hyderabad',
            commStatus: 'Active',
        },
    ];
    const dtrTableActions = [
        {
            label: 'View',
            icon: '/icons/eye.svg',
            onClick: (row: TableData) => navigate(`/dtr/${row.dtrId}`),
        },
    ];

    // Dummy data for Latest Alerts table
    const alertsTableColumns = [
        { key: 'alert', label: 'Alert' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
    ];
    const alertsTableData = [
        {
            alert: 'Overload detected',
            date: '2024-07-01 10:00',
            status: 'Active',
        },
        { alert: 'Fuse blown', date: '2024-07-01 09:30', status: 'Resolved' },
        { alert: 'Power failure', date: '2024-07-01 08:45', status: 'Active' },
    ];

    // Dummy data for DTR Alert Statistics
    // TODO: Unused - consider removing if not needed.
    // const [statsRange, setStatsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    const [statsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    const alertTypes = [
        { name: 'LT Fuse Blown (R - Phase)', color: '#e74c3c' },
        { name: 'Unbalanced Load', color: '#f39c12' },
        { name: 'Low PF (R - Phase)', color: '#3498db' },
        { name: 'Power Failure', color: '#9b59b6' },
        { name: 'B_PH Missing', color: '#8e44ad' },
        { name: 'R_PH CT Reversed', color: '#e67e22' },
        { name: 'HT Fuse Blown (B - Phase)', color: '#f1c40f' },
        { name: 'LT Fuse Blown (Y - Phase)', color: '#1abc9c' },
        { name: 'LT Fuse Blown (B - Phase)', color: '#e67e22' },
        { name: 'R-L-P', color: '#9b59b6' },
    ];
    const months = [
        'May 2025',
        'Apr 2025',
        'Mar 2025',
        'Feb 2025',
        'Jan 2025',
        'Dec 2024',
        'Nov 2024',
        'Oct 2024',
        'Sept 2024',
    ];
    const alertSeries = alertTypes.map((type) => ({
        name: type.name,
        data: months.map(() => Math.floor(Math.random() * 350)),
    }));
    const alertColors = alertTypes.map((type) => type.color);

    return (
        <div className="p-2 min-h-screen">
            <Page
                sections={[
                    // Header section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'DTR Dashboard',
                                    onBackClick: () => window.history.back(),
                                    backButtonText: 'Back to Dashboard',
                                    buttonsLabel: 'Add DTR',
                                    variant: 'primary',
                                    onClick: () =>
                                        console.log('Adding new DTR...'),
                                    showMenu: true,
                                    showDropdown: true,
                                    menuItems: [
                                        { id: 'all', label: 'All DTRs' },
                                        { id: 'active', label: 'Active DTRs' },
                                        {
                                            id: 'inactive',
                                            label: 'Inactive DTRs',
                                        },
                                        {
                                            id: 'overloaded',
                                            label: 'Overloaded',
                                        },
                                        {
                                            id: 'underloaded',
                                            label: 'Underloaded',
                                        },
                                        {
                                            id: 'fuse-blown',
                                            label: 'Fuse Blown',
                                        },
                                        {
                                            id: 'unbalanced',
                                            label: 'Unbalanced',
                                        },
                                        {
                                            id: 'power-failure',
                                            label: 'Power Failure',
                                        },
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        console.log(`Filter by: ${itemId}`);
                                    },
                                },
                            },
                        ],
                    },
                    // DTR Statistics section & cards should be here
                    // {
                    //     layout: {
                    //         type: "grid",
                    //         columns: 2,
                    //         gap: "gap-6",
                    //         rows: [
                    //             {
                    //                 layout: "grid",
                    //                 gap: "gap-4",
                    //                 gridColumns: 3,
                    //                 gridRows: 2,
                    //                 columns: [
                    //                   {
                    //                     name: "Heading",
                    //                     props: {
                    //                       text: "Distribution Transformer (DTR) Statistics",
                    //                       level: 2,
                    //                       size: "md",
                    //                       variant: "primary",
                    //                       weight: "bold",
                    //                       align: "left",
                    //                     },
                    //                     span: { col: 3, row: 1 },
                    //                   },

                    //                 ],
                    //               },
                    //             ]
                    //         }

                    // },

                    // DTR Statistics Cards
                    {
                        layout: {
                            type: 'grid',
                            columns: 5,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid',
                                    gap: 'gap-4',
                                    gridColumns: 3,
                                    gridRows: 2,
                                    span: { col: 3, row: 1 },
                                    className:
                                        'border border-primary-border rounded-3xl p-6',
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
                                                layout: 'horizontal',
                                                gap: 'gap-4',
                                            },
                                            span: { col: 3, row: 1 },
                                        },
                                        ...dtrStatsCards.map((stat) => ({
                                            name: 'Card',
                                            props: {
                                                title: stat.title,
                                                value: stat.value,
                                                icon: stat.icon,
                                                subtitle1: stat.subtitle1,
                                                onValueClick: stat.onValueClick,
                                            },
                                            span: { col: 1, row: 1 },
                                        })),
                                    ],
                                },
                                {
                                    layout: 'grid',
                                    gap: 'gap-4',
                                    gridColumns: 2,
                                    gridRows: 2,
                                    span: { col: 2, row: 1 },
                                    className:
                                        'border border-primary-border rounded-3xl p-6',
                                    columns: [
                                        {
                                            name: 'SectionHeader',
                                            props: {
                                                title: 'Latest Alerts',
                                                titleLevel: 2,
                                                titleSize: 'md',
                                                titleVariant: 'primary',
                                                titleWeight: 'bold',
                                                titleAlign: 'left',
                                                rightComponent: {
                                                    name: 'TimeRangeSelector',
                                                    props: {
                                                        availableTimeRanges: [
                                                            'Daily',
                                                            'Monthly',
                                                        ],
                                                        selectedTimeRange:
                                                            'Daily',
                                                        handleTimeRangeChange: (
                                                            range: string
                                                        ) =>
                                                            console.log(
                                                                'Time range changed to:',
                                                                range
                                                            ),
                                                        timeRangeLabels: {},
                                                    },
                                                },
                                                layout: 'horizontal',
                                                gap: 'gap-4',
                                            },
                                            span: { col: 2, row: 1 },
                                        },
                                        ...dtrConsumptionCards.map((card) => ({
                                            name: 'Card',
                                            props: {
                                                title: card.title,
                                                value: card.value,
                                                icon: card.icon,
                                                subtitle1: card.subtitle1,
                                            },
                                            span: { col: 1, row: 1 },
                                        })),
                                    ],
                                },
                            ],
                        },
                    },
                    //   {
                    //     layout: {
                    //       type: "grid" as const,
                    //       columns: 1,
                    //       gap: "gap-4",
                    //       className: "mb-8",
                    //       rows: [
                    //         {
                    //           layout: "grid",
                    //           gap: "gap-4",
                    //           gridColumns: 3,
                    //           gridRows: 2,
                    //           columns: [
                    //             {
                    //               name: "Heading",
                    //               props: {
                    //                 text: "Consumption & Energies",
                    //                 level: 2,
                    //                 size: "md",
                    //                 variant: "primary",
                    //                 weight: "bold",
                    //                 align: "left",
                    //               },
                    //                   span: { col: 3, row: 1 },
                    //             },
                    //             {
                    //                 name: "Heading",
                    //                 props: {
                    //                   text: "Time Range",
                    //                   level: 2,
                    //                   size: "md",
                    //                   variant: "primary",
                    //                   weight: "bold",
                    //                   align: "left",
                    //                 },
                    //                     span: { col:3, row: 1 },
                    //               },
                    //             ...dtrConsumptionCards.map((card) => ({
                    //                 name: 'Card',
                    //                 props: {
                    //                     title: card.title,
                    //                     value: card.value,
                    //                     icon: card.icon,
                    //                     subtitle1: card.subtitle1,
                    //                 },
                    //                 span: { col: 1, row: 1 },
                    //             }))
                    //           ],
                    //         },
                    //       ],
                    //     },
                    //   },
                    // Consumption & Energies section
                    //   {
                    //     layout: {
                    //       type: "grid",
                    //       columns: 2,
                    //       gap: "gap-6",
                    //       rows: [
                    //         {
                    //           layout: "grid",
                    //           gap: "gap-4",
                    //           gridColumns: 3,
                    //           gridRows: 2,
                    //           columns: [
                    //             {
                    //               name: "Heading",
                    //               props: {
                    //                 text: "Consumption & Energies",
                    //                 level: 2,
                    //                 size: "md",
                    //                 variant: "primary",
                    //                 weight: "bold",
                    //                 align: "left",
                    //               },
                    //             },
                    //             {
                    //               name: "TimeRangeSelector",
                    //               props: {
                    //                 availableTimeRanges: ["Daily", "Monthly"],
                    //                 selectedTimeRange: "Daily",
                    //                 handleTimeRangeChange: () => {},
                    //               },
                    //             },
                    //           ],
                    //         },
                    //       ],
                    //     },

                    //   },

                    // Consumption & Energies Cards

                    // DTRs Table section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'DTRs',
                                    level: 2,
                                    className: 'text-lg font-semibold mb-4',
                                },
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
                                    emptyMessage: 'No DTRs found',
                                    onRowClick: (row: TableData) =>
                                        navigate(`/dtr/${row.dtrId}`),
                                },
                            },
                        ],
                    },
                    // Latest Alerts section
                    {
                        layout: {
                            type: 'column' as const,
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Latest Alerts',
                                    level: 2,
                                    className: 'text-lg font-semibold mb-4',
                                },
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
                                    emptyMessage: 'No alerts found',
                                },
                            },
                        ],
                    },
                    // Statistics Chart section
                    {
                        layout: {
                            type: 'column' as const,
                            className:
                                'mb-8 border border-primary-border rounded-3xl p-6',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Statistics',
                                    level: 2,
                                    className: 'text-lg font-semibold mb-4',
                                },
                            },
                            {
                                name: 'BarChart',
                                props: {
                                    xAxisData: months,
                                    seriesData: alertSeries,
                                    seriesColors: alertColors,
                                    height: 300,
                                    showLegendInteractions: true,
                                    timeRange: statsRange,
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default DTRDashboard;

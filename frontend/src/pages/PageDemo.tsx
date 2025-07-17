import React, { useState } from 'react';
import Page from '@/components/global/Page';

const PageDemo: React.FC = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
    const [chartData] = useState({
        xAxisData: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        seriesData: [
            {
                name: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
            },
            {
                name: 'Orders',
                data: [800, 1200, 1000, 1800, 1600, 2200],
            },
        ],
        seriesColors: ['var(--color-primary)', 'var(--color-secondary)'],
    });

    const [pieChartData] = useState([
        { value: 35, name: 'Electronics' },
        { value: 25, name: 'Clothing' },
        { value: 20, name: 'Books' },
        { value: 15, name: 'Home & Garden' },
        { value: 5, name: 'Sports' },
    ]);

    const [tableData] = useState([
        ['Product', 'Category', 'Sales', 'Revenue'],
        ['iPhone 15', 'Electronics', '1,200', '$1,440,000'],
        ['Samsung TV', 'Electronics', '800', '$640,000'],
        ['Nike Shoes', 'Sports', '500', '$250,000'],
        ['Coffee Maker', 'Home & Garden', '300', '$90,000'],
        ['Programming Book', 'Books', '200', '$40,000'],
    ]);
    const [sectionTitle] = useState('Data Analytics');

    const [timeRangeOptions] = useState(['1d', '7d']);
    const [timeRangeLabels] = useState({
        '1d': 'Today',
        '7d': '7 Days',
    });

    const [firstRowData] = useState([
        {
            title: 'Revenue',
            value: '$12,000',
            icon: '/icons/rupee.svg',
            subtitle1: 'This Month',
            subtitle2: 'Last Month',
            showTrend: true,
            comparisonValue: 10,
        },
        {
            title: 'Orders',
            value: '567',
            icon: '/icons/bills.svg',
            subtitle1: 'This Week',
            subtitle2: 'Last Week',
            showTrend: true,
            comparisonValue: 15,
        },
        {
            title: 'Conversion',
            value: '23.5%',
            icon: '/icons/trending-up.svg',
            subtitle1: 'Current Rate',
            subtitle2: 'Target Rate',
            showTrend: true,
            comparisonValue: 8,
        },
        {
            title: 'Growth',
            value: '18.2%',
            icon: '/icons/trending-up.svg',
            subtitle1: 'This Quarter',
            subtitle2: 'Last Quarter',
            showTrend: true,
            comparisonValue: 12,
        },
    ]);

    const [secondRowData] = useState([
        {
            title: 'Users',
            value: '1,234',
            icon: '/icons/user.svg',
            subtitle1: 'Active Users',
            subtitle2: 'Total Users',
            showTrend: true,
            comparisonValue: -5,
        },
        {
            title: 'Engagement',
            value: '2.3M',
            icon: '/icons/users.svg',
            subtitle1: 'Active',
            subtitle2: 'Total',
            showTrend: true,
            comparisonValue: -2,
        },
        {
            title: 'Satisfaction',
            value: '4.8/5',
            icon: '/icons/star.svg',
            subtitle1: 'Rating',
            subtitle2: 'Target',
            showTrend: true,
            comparisonValue: 7,
        },
        {
            title: 'Retention',
            value: '87.3%',
            icon: '/icons/check-circle.svg',
            subtitle1: 'Current',
            subtitle2: 'Target',
            showTrend: true,
            comparisonValue: 5,
        },
    ]);

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
                                    bg: 'bg-primary-lightest p-4 rounded-lg',
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: 'Dashboard Overview',
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
                                                availableTimeRanges:
                                                    timeRangeOptions,
                                                selectedTimeRange:
                                                    selectedTimeRange,
                                                handleTimeRangeChange:
                                                    setSelectedTimeRange,
                                                timeRangeLabels:
                                                    timeRangeLabels,
                                            },
                                            span: { col: 1, row: 1 },
                                            align: 'end',
                                        },
                                        ...firstRowData.map((cardData) => ({
                                            name: 'Card',
                                            props: cardData,
                                        })),
                                    ],
                                },
                                {
                                    layout: 'grid',
                                    gridColumns: 2,
                                    gridRows: 1,
                                    bg: 'bg-primary-lightest p-4 rounded-lg',
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: 'Dashboard Overview',
                                                level: 2,
                                                size: 'md',
                                                variant: 'primary',
                                                weight: 'bold',
                                                align: 'left',
                                            },
                                            span: { col: 2, row: 1 },
                                        },
                                        ...secondRowData.map((cardData) => ({
                                            name: 'Card',
                                            props: cardData,
                                        })),
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid',
                                    gap: 'gap-4',
                                    gridColumns: 2,
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: sectionTitle,
                                                level: 2,
                                                size: 'lg',
                                                variant: 'primary',
                                                weight: 'bold',
                                                align: 'left',
                                            },
                                        },
                                        {
                                            name: 'TimeRangeSelector',
                                            props: {
                                                availableTimeRanges:
                                                    timeRangeOptions,
                                                selectedTimeRange:
                                                    selectedTimeRange,
                                                handleTimeRangeChange:
                                                    setSelectedTimeRange,
                                                timeRangeLabels:
                                                    timeRangeLabels,
                                            },
                                            align: 'end',
                                        },
                                    ],
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'BarChart',
                                            props: {
                                                xAxisData: chartData.xAxisData,
                                                seriesData:
                                                    chartData.seriesData,
                                                seriesColors:
                                                    chartData.seriesColors,
                                                title: 'Monthly Revenue & Orders',
                                                height: 400,
                                                showLegendInteractions: true,
                                                ariaLabel:
                                                    'Monthly revenue and orders bar chart',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        layout: {
                            type: 'row',
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 2,
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'PieChart',
                                            props: {
                                                title: 'Sales by Category',
                                                data: pieChartData,
                                                height: 400,
                                                ariaLabel:
                                                    'Sales distribution by category pie chart',
                                            },
                                        },
                                        {
                                            name: 'Table',
                                            props: {
                                                headers: tableData[0],
                                                data: tableData.slice(1),
                                                title: 'Top Products',
                                                showSearch: true,
                                                showPagination: true,
                                                itemsPerPage: 5,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
        </div>
    );
};

export default PageDemo;

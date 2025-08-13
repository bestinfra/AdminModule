import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';

const cardData = [
    {
        title: 'Cummulative Current Balance',
        value: '-₹55,163.58',
        icon: '/icons/wallet.svg',
        subtitle1: 'Across 4 Consumers',
    },
    {
        title: 'Low Balance Consumers',
        value: '3',
        icon: '/icons/low-balance.svg',
        subtitle1: 'Consumers Below ₹100',
    },
    {
        title: 'Adhoc Credit Issued',
        value: '₹0',
        icon: '/icons/credit-issued.svg',
        subtitle1: '₹0.00 Issued to 12 Consumers',
    },
    {
        title: 'Adhoc Credit Recovered',
        value: '₹0',
        icon: '/icons/credit-recovered.svg',
        subtitle1: '₹0.00 Remaining',
    },
];

const rechargeData = [
    {
        title: 'Total Recharge Collection',
        value: '₹5,250.00',
        icon: '/icons/total-recharge-collection.svg',
        subtitle1: 'vs. ₹4,800.00 Yesterday',
        subtitle2: '15 Recharges Processed',
        showTrend: true,
        comparisonValue: 450, // Positive value for up trend
        previousValue: 'vs. ₹4,800.00 Yesterday',
    },
    {
        title: 'Total Units Consumed',
        value: '181.96 kWh',
        icon: '/icons/units-consumed.svg',
        subtitle1: 'vs. 220.45 kWh Yesterday',
        subtitle2: 'Consumed from 4 Meters',
        showTrend: true,
        comparisonValue: -38.49, // Negative value for down trend
        previousValue: 'vs. 220.45 kWh Yesterday',
    },
    {
        title: 'Total Amount Deducted',
        value: '₹2,201.80',
        icon: '/icons/amount-deducted.svg',
        subtitle1: 'vs. ₹2,449.52 Yesterday',
        subtitle2: 'Deducted from 4 Consumers',
        showTrend: true,
        comparisonValue: -247.72, // Negative value for down trend
        previousValue: 'vs. ₹2,449.52 Yesterday',
    },
    {
        title: 'No.of Transactions',
        value: '12',
        icon: '/icons/transactions.svg',
        subtitle1: 'vs. 8 Yesterday',
        subtitle2: 'Transactions From 12 Consumers',
        showTrend: true,
        comparisonValue: 4, // Positive value for up trend
        previousValue: 'vs. 8 Yesterday',
    },
    {
        title: 'Alerts Triggered',
        value: '3',
        icon: '/icons/alert-triggered.svg',
        subtitle1: 'vs. 1 Yesterday',
        subtitle2: '3 sent Today',
        showTrend: true,
        comparisonValue: 2, // Positive value for up trend
        previousValue: 'vs. 1 Yesterday',
    },
    {
        title: 'Auto Triggered Disconnects',
        value: '2',
        icon: '/icons/disconnect.svg',
        subtitle1: 'vs. 4 Yesterday',
        subtitle2: '2 Consumers Today',
        showTrend: true,
        comparisonValue: -2, // Negative value for down trend
        previousValue: 'vs. 4 Yesterday',
    },
];

const tableData = [
    {
        sNo: 1,
        consumer: 'Airborne General Store',
        transactionId: 'TXN12345',
        amount: '₹1,000.00',
        date: '2025-07-05',
        status: 'Success',
    },
    {
        sNo: 2,
        consumer: 'Neo Travels',
        transactionId: 'TXN12346',
        amount: '₹2,000.00',
        date: '2025-07-05',
        status: 'Success',
    },
    {
        sNo: 3,
        consumer: 'Dormitory',
        transactionId: 'TXN12347',
        amount: '₹500.00',
        date: '2025-07-05',
        status: 'Failed',
    },
    {
        sNo: 4,
        consumer: 'Mobikins',
        transactionId: 'TXN12348',
        amount: '₹1,500.00',
        date: '2025-07-05',
        status: 'Success',
    },
];

const tableColumns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'consumer', label: 'Consumer' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
    {
        key: 'status',
        label: 'Status',
        render: (value: string) => (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'Success'
                        ? 'bg-positive-light text-positive'
                        : 'bg-danger-light text-danger'
                }`}>
                {value}
            </span>
        ),
    },
];

export default function Prepaid() {
    const navigate = useNavigate();
    const [selectedTimeRange, setSelectedTimeRange] = useState('Daily');

    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range);
        console.log('Time range changed to:', range);
    };

    const handleFilterChange = (filter: string) => {
        console.log('Filter changed to:', filter);
    };

    const handleGenerateReport = () => {
        console.log('Generating prepaid report...');
    };

    const handleViewTransaction = (row: any) => {
        console.log('Viewing transaction:', row.transactionId);
    };

    const handleDownloadTransaction = (row: any) => {
        console.log('Downloading transaction:', row.transactionId);
    };

    const handleShareTransaction = (row: any) => {
        console.log('Sharing transaction:', row.transactionId);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Page Header Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row',
                                    columns: [
                                        {
                                            name: 'PageHeader',
                                            props: {
                                                title: 'Prepaid Overview',
                                                onBackClick: () =>
                                                    navigate('/dashboard'),
                                                backButtonText:
                                                    'Back to Dashboard',
                                                buttonsLabel: 'Generate Report',
                                                variant: 'primary',
                                                onClick: handleGenerateReport,
                                                showMenu: false,
                                                showDropdown: true,
                                                menuItems: [
                                                    {
                                                        id: 'all',
                                                        label: 'All Transactions',
                                                    },
                                                    {
                                                        id: 'success',
                                                        label: 'Success',
                                                    },
                                                    {
                                                        id: 'failed',
                                                        label: 'Failed',
                                                    },
                                                    {
                                                        id: 'pending',
                                                        label: 'Pending',
                                                    },
                                                    {
                                                        id: 'low-balance',
                                                        label: 'Low Balance',
                                                    },
                                                    {
                                                        id: 'recharge',
                                                        label: 'Recharge',
                                                    },
                                                    {
                                                        id: 'consumption',
                                                        label: 'Consumption',
                                                    },
                                                ],
                                                onMenuItemClick:
                                                    handleFilterChange,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Overview Cards Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 4,
                                    gap: 'gap-4',
                                    columns: cardData.map((card) => ({
                                        name: 'Card',
                                        props: { ...card, bg: "bg-stat-icon-gradient" },
                                    })),
                                },
                            ],
                        },
                    },
                    // Recharge & Usage Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row',
                                    className: 'items-center justify-between',
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                className:
                                                    'text-lg font-semibold',
                                                children:
                                                    'Recharge & Usage (Today)',
                                            },
                                        },
                                        {
                                            name: 'TimeRangeSelector',
                                            props: {
                                                availableTimeRanges: [
                                                    'Daily',
                                                    'Monthly',
                                                ],
                                                selectedTimeRange:
                                                    selectedTimeRange,
                                                handleTimeRangeChange:
                                                    handleTimeRangeChange,
                                            },
                                        },
                                    ],
                                },
                                {
                                    layout: 'grid',
                                    gridColumns: 4,
                                    gap: 'gap-4',
                                    columns: rechargeData.map((card) => ({
                                        name: 'Card',
                                        props: { ...card, bg: "bg-stat-icon-gradient" },
                                    })),
                                },
                            ],
                        },
                    },
                    //Dropdown and calendar section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row',  
                                    columns: [
                                        {
                                            name: 'Dropdown',
                                            props: {
                                                options: [
                                                    { label: 'Select Amount Range', value: '' },
                                                    { label: '0 – 33.3k', value: '0-33.3k' },
                                                    { label: '33.3k – 66.6k', value: '33.3k-66.6k' },
                                                    { label: '66.6k – 100k', value: '66.6k-100k' },
                                                ],
                                                placeholder: 'Select Amount Range',
                                            },
                                        },
                                        {
                                            name: 'Calendar',
                                            props: {
                                                value: '',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => console.log('Search:', e.target.value),
                                            },
                                        },
                                        {
                                            name: 'Dropdown',
                                            props: {
                                                options: [
                                                    { label: 'Select Payment Status', value: '' },
                                                    { label: 'Paid', value: 'paid' },
                                                    { label: 'Pending', value: 'pending' },
                                                    { label: 'Overdue', value: 'overdue' },
                                                ],
                                                placeholder: 'Select Payment Status',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Search Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row',
                                    columns: [
                                        {
                                            name: 'Search',
                                            props: {
                                                value: '',
                                                onChange: (
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    console.log(
                                                        'Search:',
                                                        e.target.value
                                                    ),
                                                placeholder:
                                                    'Search transactions by consumer name, transaction ID, or amount...',
                                                className: 'w-full',
                                                showShortcut: true,
                                                isLoading: false,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Transactions Table Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',   
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 1,
                                    className:'pb-4',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: tableData,
                                                columns: tableColumns,
                                                actions: [
                                                    {
                                                        label: 'View',
                                                        icon: '/icons/eye.svg',
                                                        onClick:
                                                            handleViewTransaction,
                                                    },
                                                    {
                                                        label: 'Download',
                                                        icon: '/icons/download.svg',
                                                        onClick:
                                                            handleDownloadTransaction,
                                                    },
                                                    {
                                                        label: 'Share',
                                                        icon: '/icons/share.svg',
                                                        onClick:
                                                            handleShareTransaction,
                                                    },
                                                ],
                                                showActions: true,
                                                searchable: true, // Disable table search since we have dedicated search component
                                                pagination: true,
                                                rowsPerPageOptions: [
                                                    5, 10, 15, 25,
                                                ],
                                                initialRowsPerPage: 10,
                                                emptyMessage:
                                                    'No transactions found',
                                                showHeader: true,
                                                headerTitle:
                                                    'Recent Transactions',
                                                dateRange:
                                                    'Jan 2024 - Dec 2024',
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
}

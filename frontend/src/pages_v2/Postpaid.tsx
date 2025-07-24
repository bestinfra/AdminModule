import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@components/global/PageC';

const cardData = [
    {
        title: 'Total Bill Amount',
        value: '₹18,300.00',
        icon: '/icons/total-recharge-collection.svg',
        subtitle2: '4 Total Bills Generated',
    },
    { 
        title: 'Outstanding Amount',
        value: '₹11,000.00',
        icon: '/icons/wallet.svg',
        subtitle2: '2 Pending Bills',
    },
    {
        title: 'Overdue Amount',
        value: '₹3,200.00',
        icon: '/icons/credit-issued.svg',
        subtitle2: '1 Overdue Bills',
    },
    {
        title: 'Total Amount Paid',
        value: '₹7,300.00',
        icon: '/icons/paid.svg',
        subtitle2: '2 Consumer Paid',
    },
    {
        title: 'Realization Rate',
        value: '39.89%',
        icon: '/icons/percentage.svg',
        subtitle2: '2 Consumer Paid',
    },
];

const tableData: any[] = [
    {
        billNo: 'BILL001',
        consumerName: 'Airborne General Store',
        uid: 'BI25GMRA001',
        meterNo: 'A9211434',
        billDate: '2025-01-15',
        units: '150.5',
        billAmount: '₹2,500.00',
        dueDate: '2025-02-15',
        status: 'Paid'
    },
    {
        billNo: 'BILL002',
        consumerName: 'Neo Travels',
        uid: 'BI25GMRA002',
        meterNo: 'A9345417',
        billDate: '2025-01-15',
        units: '450.2',
        billAmount: '₹7,800.00',
        dueDate: '2025-02-15',
        status: 'Unpaid'
    },
    {
        billNo: 'BILL003',
        consumerName: 'Mobikins',
        uid: 'BI25GMRA004',
        meterNo: 'A9211433',
        billDate: '2025-01-15',
        units: '200.0',
        billAmount: '₹3,200.00',
        dueDate: '2025-02-15',
        status: 'Overdue'
    },
    {
        billNo: 'BILL004',
        consumerName: 'Dormitory',
        uid: 'BI25GMRA003',
        meterNo: 'A9345418',
        billDate: '2025-01-15',
        units: '300.8',
        billAmount: '₹4,800.00',
        dueDate: '2025-02-15',
        status: 'Paid'
    }
];

const tableColumns = [
    { key: 'billNo', label: 'Bill No' },
    { key: 'consumerName', label: 'Consumer Name' },
    { key: 'uid', label: 'UID' },
    { key: 'meterNo', label: 'Meter SI No' },
    { key: 'billDate', label: 'Bill Date' },
    { key: 'units', label: 'No. of Units' },
    { key: 'billAmount', label: 'Bill Amount' },
    { key: 'dueDate', label: 'Due Date' },
    { 
        key: 'status', 
        label: 'Status',
        render: (value: string) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Paid' 
                    ? 'bg-positive-light text-positive' 
                    : value === 'Overdue'
                    ? 'bg-danger-light text-danger'
                    : 'bg-warning-light text-warning'
            }`}>
                {value}
            </span>
        )
    },
];

const amountRangeOptions = [
    { value: '', label: 'Select Amount Range' },
    { value: '0-1000', label: '₹0 - ₹1,000' },
    { value: '1000-5000', label: '₹1,000 - ₹5,000' },
    { value: '5000+', label: '₹5,000+' },
];

const paymentStatusOptions = [
    { value: '', label: 'Select Payment Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'overdue', label: 'Overdue' },
];

export default function Postpaid() {
    const navigate = useNavigate();
    const [amountRange, setAmountRange] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredData, setFilteredData] = useState(tableData);

    const handleAddBill = () => {
        console.log('Adding new bill...');
    };

    const handleFilterChange = (itemId: string) => {
        console.log(`Filter by: ${itemId}`);
        // Apply filters based on selection
        if (itemId === 'paid' || itemId === 'unpaid' || itemId === 'overdue') {
            setPaymentStatus(itemId);
        } else if (itemId === 'high-amount') {
            setAmountRange('5000+');
        } else if (itemId === 'low-amount') {
            setAmountRange('0-1000');
        } else if (itemId === 'all') {
            setPaymentStatus('');
            setAmountRange('');
        }
    };

    const handleAmountRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAmountRange(e.target.value);
    };

    const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaymentStatus(e.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
        
        // Filter data based on search
        const filtered = tableData.filter(item => 
            item.consumerName.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.uid.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.billNo.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.meterNo.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    // Initialize filtered data
    useEffect(() => {
        setFilteredData(tableData);
    }, []);

    return (
        <Page
            sections={[
                // Page Header Section
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'row',
                                columns: [
                                    {
                                        name: 'PageHeader',
                                        props: {
                                            title: "Bills Postpaid",
                                            onBackClick: () => navigate('/dashboard'),
                                            backButtonText: "Back to Dashboard",
                                            buttonsLabel: "Add Bill",
                                            variant: "primary",
                                            onClick: handleAddBill,
                                            showMenu: true,
                                            showDropdown: true,
                                            menuItems: [
                                                { id: 'all', label: 'All Bills' },
                                                { id: 'paid', label: 'Paid' },
                                                { id: 'unpaid', label: 'Unpaid' },
                                                { id: 'overdue', label: 'Overdue' },
                                                { id: 'pending', label: 'Pending' },
                                                { id: 'high-amount', label: 'High Amount' },
                                                { id: 'low-amount', label: 'Low Amount' }
                                            ],
                                            onMenuItemClick: handleFilterChange
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                // Overview Cards Section
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 4,
                                gap: 'gap-6',
                                columns: cardData.slice(0, 4).map(card => ({
                                    name: 'Card',
                                    props: card
                                }))
                            }
                        ]
                    }
                },
                // Realization Rate Section
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 4,
                                gap: 'gap-6',
                                columns: [
                                    {
                                        name: 'Card',
                                        props: cardData[4]
                                    }
                                ]
                            }
                        ]
                    }
                },
                // Filters Section
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'row',
                                className: 'flex flex-col md:flex-row md:items-center md:gap-6 gap-4',
                                columns: [
                                    {
                                        name: 'Dropdown',
                                        props: {
                                            name: "amountRange",
                                            value: amountRange,
                                            onChange: handleAmountRangeChange,
                                            options: amountRangeOptions,
                                            className: "w-full md:w-1/3"
                                        }
                                    },
                                    {
                                        name: 'DatePicker',
                                        props: {
                                            value: selectedDate,
                                            onChange: handleDateChange,
                                            placeholder: "Select Date",
                                            className: "w-full md:w-1/3",
                                            // label: "Bill Date"
                                        }
                                    },
                                    {
                                        name: 'Dropdown',
                                        props: {
                                            name: "paymentStatus",
                                            value: paymentStatus,
                                            onChange: handlePaymentStatusChange,
                                            options: paymentStatusOptions,
                                            className: "w-full md:w-1/3"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                // Search Section
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'row',
                                columns: [
                                    {
                                        name: 'Search',
                                        props: {
                                            value: search,
                                            onChange: handleSearchChange,
                                            placeholder: "Search bills by consumer name, UID, or bill number...",
                                            className: "w-full",
                                            showShortcut: true,
                                            isLoading: false,
                                            name: "billSearch"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                // Bills Table Section
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 1,
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            data: filteredData,
                                            columns: tableColumns,
                                            searchable: false,
                                            pagination: true,
                                            rowsPerPageOptions: [5, 10, 15, 25],
                                            initialRowsPerPage: 10,
                                            emptyMessage: search ? "No bills found matching your search" : "No Bills Found",
                                            showHeader: true,
                                            headerTitle: `Bills Management ${search ? `(${filteredData.length} results)` : ''}`,
                                            dateRange: "Jan 2024 - Dec 2024"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]}
        />
    );
} 
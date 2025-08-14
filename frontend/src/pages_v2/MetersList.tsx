import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';
    import BACKEND_URL from '@/config';
const MetersList: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [mapping, setMapping] = useState('');

    // Meter cards data - Using BRAND_GREEN (default) for all cards
    const meterCards = [
        {
            title: 'Total Meters',
            value: 3,
            icon: '/icons/meter.svg',
            subtitle1: '3 Active',
            subtitle2: '0 In-Active',
        },
        {
            title: 'Meter Makes',
            value: 17,
            icon: '/icons/meter-make.svg',
            subtitle1: '1 Used Meter Makes',
            subtitle2: '',
        },
        {
            title: 'Mapped Meters',
            value: 3,
            icon: '/icons/mapped-meter.svg',
            subtitle1: '78 Unmapped',
            subtitle2: '0 Replaced',
        },
        {
            title: 'Connection Type',
            value: 'Prepaid',
            icon: '/icons/connection-type.svg',
            subtitle1: '3 Prepaid',
            subtitle2: '0 Postpaid',
        },
    ];

    // Table data
    const [tableData, setTableData] = useState<TableData[]>([
        
        {
            slNo: 1,
            meterSlNo: 'A9345417',
            modemSlNo: 'RFDCU_DCU101',
            meterType: 'Prepaid',
            meterMake: 'LnT DLMS',
            consumerName: 'Neo Travels',
            location: 'NA',
            installationDate: 'NA',
            status: 'Active',
        },
        {
            slNo: 2,
            meterSlNo: 'A9211433',
            modemSlNo: 'RFDCU_DCU101',
            meterType: 'Prepaid',
            meterMake: 'LnT DLMS',
            consumerName: 'Mobikins',
            location: 'NA',
            installationDate: 'NA',
            status: 'Inactive',
        },
        {
            slNo: 3,
            meterSlNo: 'A9211434',
            modemSlNo: 'RFDCU_DCU101',
            meterType: 'Prepaid',
            meterMake: 'LnT DLMS',
            consumerName: 'Airborne General Store',
            location: 'NA',
            installationDate: 'NA',
            status: 'Active',
        },
    ]);

    // Fetch data from API
    useEffect(() => {
        const fetchAllMeters = async () => {
            try {
                let allMeters: any[] = [];
                let currentPage = 1;
                let hasNextPage = true;
                
                console.log('Fetching all meters from:', `${BACKEND_URL}/meters`);
                
                // Fetch all pages to get all meters
                while (hasNextPage) {
                    const response = await fetch(`${BACKEND_URL}/meters?page=${currentPage}&limit=100`);
                    const data = await response.json();
                    
                    if (data.success) {
                        console.log(`Page ${currentPage} data:`, data.data);
                        allMeters = [...allMeters, ...data.data];
                        
                        // Check if there are more pages
                        hasNextPage = data.pagination?.hasNextPage || false;
                        currentPage++;
                    } else {
                        console.error('Failed to fetch meters:', data.message);
                        break;
                    }
                }
                
                console.log('Total meters fetched:', allMeters.length);
                
                // Process all table data to match existing structure
                const processedData = allMeters.map((meter: any, _index: number) => ({
                    slNo: meter.sNo,
                    meterSlNo: meter.meterSerialNumber,
                    modemSlNo: meter.modemSerialNumber,
                    meterType: meter.meterType,
                    meterMake: meter.meterMake,
                    consumerName: meter.consumerName,
                    location: meter.location,
                    installationDate: meter.installationDate ? new Date(meter.installationDate).toLocaleDateString() : 'NA',
                    status: 'Active', // Set default status since backend doesn't provide it
                }));
                
                console.log('Processed meter data:', processedData);
                setTableData(processedData);
            } catch (error) {
                console.error('Error fetching meters:', error);
            }
        };
        
        fetchAllMeters();
    }, []);


    const tableColumns = [
        { key: 'slNo', label: 'Sl No' },
        { key: 'meterSlNo', label: 'Meter SI No' },
        { key: 'modemSlNo', label: 'Modem SI No' },
        { key: 'meterType', label: 'Meter Type' },
        { key: 'meterMake', label: 'Meter Make' },
        { key: 'consumerName', label: 'Consumer Name' },
        { key: 'location', label: 'Location' },
        { key: 'installationDate', label: 'Installation Date' },
        { 
            key: 'status', 
            label: 'Status',
            statusIndicator: {},
            isActive: (value: string | number | boolean | null | undefined) => String(value).toLowerCase() === 'active'
        },
    ];

    const tableActions = [
        {
            label: 'View',
            icon: '/icons/eye.svg',
            onClick: (row: TableData) => navigate(`/meter-details/${row.meterSlNo}`),
        },
    ];

    // Filter options
    const statusOptions = [
        { value: '', label: 'Filter By Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'In-Active' },
    ];
    const typeOptions = [
        { value: '', label: 'Filter By Meter Types' },
        { value: 'prepaid', label: 'Prepaid' },
        { value: 'postpaid', label: 'Postpaid' },
    ];
    const mappingOptions = [
        { value: '', label: 'Filter By Mapping' },
        { value: 'mapped', label: 'Mapped' },
        { value: 'unmapped', label: 'Unmapped' },
    ];

    const handleFilterChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        if (name === 'status') setStatus(value);
        if (name === 'type') setType(value);
        if (name === 'mapping') setMapping(value);
    };

    return (
        <Page
            sections={[
                // Header section
                {
                    layout: {
                        type: 'row' as const,
                        className: 'mb-6',
                    },
                    components: [
                        {
                            name: 'PageHeader',
                            props: {
                                title: 'Meters List',
                                onBackClick: () => window.history.back(),
                                backButtonText: 'Back to Dashboard',
                                buttonsLabel: '',
                                variant: 'primary',
                                onClick: () => {},
                                showMenu: true,
                                showDropdown: true,
                                menuItems: [
                                    { id: 'all', label: 'All Meters' },
                                    { id: 'active', label: 'Active' },
                                    { id: 'inactive', label: 'Inactive' },
                                    { id: 'prepaid', label: 'Prepaid' },
                                    { id: 'postpaid', label: 'Postpaid' },
                                    { id: 'mapped', label: 'Mapped' },
                                    { id: 'unmapped', label: 'Unmapped' }
                                ],
                                onMenuItemClick: (itemId: string) => {
                                    console.log(`Filter by: ${itemId}`);
                                    if (itemId === 'active' || itemId === 'inactive') {
                                        setStatus(itemId);
                                    } else if (itemId === 'prepaid' || itemId === 'postpaid') {
                                        setType(itemId);
                                    } else if (itemId === 'mapped' || itemId === 'unmapped') {
                                        setMapping(itemId);
                                    } else if (itemId === 'all') {
                                        setStatus('');
                                        setType('');
                                        setMapping('');
                                    }
                                },
                            },
                        },
                    ],
                },
                // Overview Cards section
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 4,
                        gap: 'gap-4',
                        className: 'mb-4',
                    },
                    components: meterCards.map((card) => ({
                        name: 'Card',
                        props: {
                            title: card.title,
                            value: card.value,
                            icon: card.icon,
                            subtitle1: card.subtitle1,
                            subtitle2: card.subtitle2,

                            bg: "bg-stat-icon-gradient",
                        },
                    })),
                },
                // Filters section
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 3,
                        gap: 'gap-4',
                        className: 'mb-4',
                    },
                    components: [
                        {
                            name: 'Dropdown',
                            props: {
                                name: 'status',
                                value: status,
                                onChange: handleFilterChange,
                                options: statusOptions,
                                className: 'w-full',
                            },
                        },
                        {
                            name: 'Dropdown',
                            props: {
                                name: 'type',
                                value: type,
                                onChange: handleFilterChange,
                                options: typeOptions,
                                className: 'w-full',
                            },
                        },
                        {
                            name: 'Dropdown',
                            props: {
                                name: 'mapping',
                                value: mapping,
                                onChange: handleFilterChange,
                                options: mappingOptions,
                                className: 'w-full',
                            },
                        },
                    ],
                },
                // Table section
                {
                    layout: {
                        type: 'column' as const,
                        className: 'w-full',
                    },
                    components: [
                        {
                            name: 'Table',
                            props: {
                                data: tableData,
                                columns: tableColumns,
                                actions: tableActions,
                                showActions: true,
                                searchable: true,
                                pagination: true,
                                initialRowsPerPage: 10,
                                emptyMessage: 'No meters found',
                                className: 'w-full',
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

export default MetersList; 
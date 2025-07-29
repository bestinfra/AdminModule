import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';

// Brand green icon style
const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
};

const MetersList: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [mapping, setMapping] = useState('');

    // Meter cards data
    const meterCards = [
        {
            title: 'Total Meters',
            value: 3,
            icon: '/icons/meter.svg',
            subtitle1: '3 Active',
            subtitle2: '0 In-Active',
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: 'Meter Makes',
            value: 17,
            icon: '/icons/meter-make.svg',
            subtitle1: '1 Used Meter Makes',
            subtitle2: '',
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: 'Mapped Meters',
            value: 3,
            icon: '/icons/mapped-meter.svg',
            subtitle1: '78 Unmapped',
            subtitle2: '0 Replaced',
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: 'Connection Type',
            value: 'Prepaid',
            icon: '/icons/connection-type.svg',
            subtitle1: '3 Prepaid',
            subtitle2: '0 Postpaid',
            iconStyle: ICON_FILTER_STYLE,
        },
    ];

    // Table data
    const tableData = [
        {
            slNo: 1,
            meterSlNo: 'A9345417',
            modemSlNo: 'RFDCU_DCU101',
            meterType: 'Prepaid',
            meterMake: 'LnT DLMS',
            consumerName: 'Neo Travels',
            location: 'NA',
            installationDate: 'NA',
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
        },
    ];

    const tableColumns = [
        { key: 'slNo', label: 'Sl No' },
        { key: 'meterSlNo', label: 'Meter SI No' },
        { key: 'modemSlNo', label: 'Modem SI No' },
        { key: 'meterType', label: 'Meter Type' },
        { key: 'meterMake', label: 'Meter Make' },
        { key: 'consumerName', label: 'Consumer Name' },
        { key: 'location', label: 'Location' },
        { key: 'installationDate', label: 'Installation Date' },
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
                        className: 'mb-6',
                    },
                    components: meterCards.map((card) => ({
                        name: 'Card',
                        props: {
                            title: card.title,
                            value: card.value,
                            icon: card.icon,
                            subtitle1: card.subtitle1,
                            subtitle2: card.subtitle2,
                            iconStyle: card.iconStyle,
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
                        className: 'mb-6',
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
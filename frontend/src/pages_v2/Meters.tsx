import { useState } from 'react';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';

export default function Meters() {
    const [meterData] = useState([
        {
            id: 1,
            title: 'Total Meters',
            value: '1,247',
            icon: 'icons/meter.svg',
            showTrend: true,
            comparisonValue: 12,
            subtitle1: 'Active meters',
            subtitle2: '+12 this month',
        },
        {
            id: 2,
            title: 'Smart Meters',
            value: '892',
            icon: 'icons/meter-bolt.svg',
            showTrend: true,
            comparisonValue: 8,
            subtitle1: 'Connected devices',
            subtitle2: '+8 this week',
        },
        {
            id: 3,
            title: 'Average Consumption',
            value: '245 kWh',
            icon: 'icons/consumption.svg',
            showTrend: false,
            subtitle1: 'Per household',
            subtitle2: 'This month',
        },
        {
            id: 4,
            title: 'Meter Readings',
            value: '98.5%',
            icon: 'icons/current-reading.svg',
            showTrend: true,
            comparisonValue: -2.1,
            subtitle1: 'Accuracy rate',
            subtitle2: 'Last 24 hours',
        },
        {
            id: 5,
            title: 'Maintenance Due',
            value: '23',
            icon: 'icons/maintenance.svg',
            showTrend: true,
            comparisonValue: -5,
            subtitle1: 'Meters requiring',
            subtitle2: 'Service this week',
        },
    ]);

    const [tableData] = useState([
        {
            id: 'MTR-001',
            meterNumber: 'MTR-001',
            customerName: 'John Smith',
            location: '123 Main St, City',
            meterType: 'Smart Meter',
            status: 'Active',
            lastReading: '2024-01-16 14:30:00',
            currentReading: '1,245.67 kWh',
            previousReading: '1,198.32 kWh',
            consumption: '47.35 kWh',
            voltage: '220V',
            current: '15A',
            powerFactor: '0.95',
        },
        {
            id: 'MTR-002',
            meterNumber: 'MTR-002',
            customerName: 'Emily Davis',
            location: '456 Oak Ave, Town',
            meterType: 'Digital Meter',
            status: 'Active',
            lastReading: '2024-01-16 14:29:00',
            currentReading: '892.45 kWh',
            previousReading: '856.78 kWh',
            consumption: '35.67 kWh',
            voltage: '110V',
            current: '8A',
            powerFactor: '0.92',
        },
        {
            id: 'MTR-003',
            meterNumber: 'MTR-003',
            customerName: 'Robert Chen',
            location: '789 Pine Rd, Village',
            meterType: 'Smart Meter',
            status: 'Inactive',
            lastReading: '2024-01-15 10:15:00',
            currentReading: '0.00 kWh',
            previousReading: '0.00 kWh',
            consumption: '0.00 kWh',
            voltage: '0V',
            current: '0A',
            powerFactor: '0.00',
        },
        {
            id: 'MTR-004',
            meterNumber: 'MTR-004',
            customerName: 'Maria Garcia',
            location: '321 Elm St, Borough',
            meterType: 'Smart Meter',
            status: 'Active',
            lastReading: '2024-01-16 14:28:00',
            currentReading: '2,156.89 kWh',
            previousReading: '2,098.45 kWh',
            consumption: '58.44 kWh',
            voltage: '220V',
            current: '22A',
            powerFactor: '0.98',
        },
        {
            id: 'MTR-005',
            meterNumber: 'MTR-005',
            customerName: 'James Wilson',
            location: '654 Maple Dr, District',
            meterType: 'Digital Meter',
            status: 'Maintenance',
            lastReading: '2024-01-16 12:00:00',
            currentReading: '567.23 kWh',
            previousReading: '545.67 kWh',
            consumption: '21.56 kWh',
            voltage: '110V',
            current: '6A',
            powerFactor: '0.89',
        },
        {
            id: 'MTR-006',
            meterNumber: 'MTR-006',
            customerName: 'Anna Thompson',
            location: '987 Cedar Ln, County',
            meterType: 'Smart Meter',
            status: 'Active',
            lastReading: '2024-01-16 14:31:00',
            currentReading: '1,789.34 kWh',
            previousReading: '1,745.12 kWh',
            consumption: '44.22 kWh',
            voltage: '220V',
            current: '18A',
            powerFactor: '0.96',
        },
        {
            id: 'MTR-007',
            meterNumber: 'MTR-007',
            customerName: 'Michael Rodriguez',
            location: '147 Birch Way, Township',
            meterType: 'Smart Meter',
            status: 'Active',
            lastReading: '2024-01-16 14:27:00',
            currentReading: '3,456.78 kWh',
            previousReading: '3,412.45 kWh',
            consumption: '44.33 kWh',
            voltage: '380V',
            current: '25A',
            powerFactor: '0.94',
        },
        {
            id: 'MTR-008',
            meterNumber: 'MTR-008',
            customerName: 'Jennifer White',
            location: '258 Spruce Ct, Municipality',
            meterType: 'Digital Meter',
            status: 'Active',
            lastReading: '2024-01-16 14:32:00',
            currentReading: '678.90 kWh',
            previousReading: '645.23 kWh',
            consumption: '33.67 kWh',
            voltage: '110V',
            current: '9A',
            powerFactor: '0.91',
        },
    ]);

    const [tableColumns] = useState([
        { key: 'meterNumber', label: 'Meter #' },
        { key: 'customerName', label: 'Customer' },
        { key: 'location', label: 'Location' },
        { key: 'meterType', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'lastReading', label: 'Last Reading' },
        { key: 'currentReading', label: 'Current' },
        { key: 'previousReading', label: 'Previous' },
        { key: 'consumption', label: 'Consumption' },
        { key: 'voltage', label: 'Voltage' },
        { key: 'current', label: 'Current' },
        { key: 'powerFactor', label: 'Power Factor' },
    ]);

    const [serverPagination] = useState({
        currentPage: 1,
        totalPages: 4,
        totalCount: 32,
        limit: 8,
        hasNextPage: true,
        hasPrevPage: false,
    });

    const handlePageChange = (page: number, limit: number) => {
        console.log('Page changed:', { page, limit });
    };

    const [filterOptions] = useState({
        statusOptions: [
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'maintenance', label: 'Maintenance' },
        ],
        meterTypeOptions: [
            { value: 'all', label: 'All Types' },
            { value: 'smart', label: 'Smart Meter' },
            { value: 'digital', label: 'Digital Meter' },
            { value: 'analog', label: 'Analog Meter' },
        ],
        locationOptions: [
            { value: 'all', label: 'All Locations' },
            { value: 'city', label: 'City' },
            { value: 'town', label: 'Town' },
            { value: 'village', label: 'Village' },
            { value: 'borough', label: 'Borough' },
            { value: 'district', label: 'District' },
        ],
    });

    const handleStatusChange = (value: string) => {
        console.log('Status filter changed:', value);
    };

    const handleTypeChange = (value: string) => {
        console.log('Meter type filter changed:', value);
    };

    const handleLocationChange = (value: string) => {
        console.log('Location filter changed:', value);
    };

    return (
        <Page
            sections={[
                {
                    layout: {
                        type: 'column',
                        rows: [
                            {
                                layout: 'row',
                                columns: meterData.map((meter) => ({
                                    name: 'Card',
                                    props: {
                                        title: meter.title,
                                        value: meter.value,
                                        icon: meter.icon,
                                        showTrend: meter.showTrend,
                                        comparisonValue: meter.comparisonValue,
                                        subtitle1: meter.subtitle1,
                                        subtitle2: meter.subtitle2,
                                    },
                                })),
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid',
                        columns: 1,
                        gap: 'gap-4',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 3,
                                gap: 'gap-4',
                                columns: [
                                    {
                                        name: 'Dropdown',
                                        props: {
                                            options:
                                                filterOptions.statusOptions,
                                            placeholder: 'Filter by Status',
                                            value: 'all',
                                            onChange: handleStatusChange,
                                            className: 'w-48',
                                        },
                                    },
                                    {
                                        name: 'Dropdown',
                                        props: {
                                            options:
                                                filterOptions.meterTypeOptions,
                                            placeholder: 'Filter by Type',
                                            value: 'all',
                                            onChange: handleTypeChange,
                                            className: 'w-48',
                                        },
                                    },
                                    {
                                        name: 'Dropdown',
                                        props: {
                                            options:
                                                filterOptions.locationOptions,
                                            placeholder: 'Filter by Location',
                                            value: 'all',
                                            onChange: handleLocationChange,
                                            className: 'w-48',
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
                                layout: 'row',
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            data: tableData,
                                            columns: tableColumns,
                                            showHeader: false,
                                            headerTitle: 'Meter Management',
                                            dateRange: 'Real-time data',
                                            searchable: true,
                                            sortable: true,
                                            pagination: true,
                                            showActions: true,
                                            text: 'Meter Management Table',
                                            serverPagination: serverPagination,
                                            onPageChange: handlePageChange,
                                            onEdit: (row: TableData) =>
                                                console.log('Edit:', row),
                                            onDelete: (row: TableData) =>
                                                console.log('Delete:', row),
                                            onView: (row: TableData) =>
                                                console.log('View:', row),
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
}

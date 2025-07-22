import { useState, useEffect } from 'react';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';
import BACKEND_URL from '../config';

export default function Meters() {
    const [meterData, setMeterData] = useState<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
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
    const [serverPagination, setServerPagination] = useState<any>({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 8,
        hasNextPage: false,
        hasPrevPage: false,
    });
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

    useEffect(() => {
        // Fetch meter stats for cards
        fetch(`${BACKEND_URL}/meters/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Example: Map stats to card data structure
                    const stats = data.data;
                    const cards = [
                        {
                            id: 1,
                            title: 'Total Meters',
                            value: stats.totalMeters,
                            icon: 'icons/meter.svg',
                        },
                        ...stats.makes.map((make: any, idx: number) => ({
                            id: 2 + idx,
                            title: `Make: ${make.manufacturer}`,
                            value: make.count,
                            icon: 'icons/meter-make.svg',
                        })),
                        ...stats.types.map((type: any, idx: number) => ({
                            id: 10 + idx,
                            title: `Type: ${type.type}`,
                            value: type.count,
                            icon: 'icons/meter.svg',
                        })),
                    ];
                    setMeterData(cards);
                } else {
                    throw new Error(data.message || 'Failed to fetch meter stats');
                }
            })
            .catch((err) => console.error(err.message || 'Failed to fetch meter stats'));
        // Fetch meter table data
        fetch(`${BACKEND_URL}/meters/table?page=1&limit=8`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTableData(data.data);
                    setServerPagination(data.pagination);
                } else {
                    throw new Error(data.message || 'Failed to fetch meter table');
                }
            })
            .catch((err) => console.error(err.message || 'Failed to fetch meter table'))
            .finally(() => {});
    }, []);

    const handlePageChange = (page: number, limit: number) => {
        // setLoading(true); // Removed
        // setError(null); // Removed
        fetch(`${BACKEND_URL}/meters/table?page=${page}&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTableData(data.data);
                    setServerPagination(data.pagination);
                } else {
                    throw new Error(data.message || 'Failed to fetch meter table');
                }
            })
            .catch((err) => console.error(err.message || 'Failed to fetch meter table'))
            .finally(() => {});
    };

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
                                            options: filterOptions.statusOptions,
                                            placeholder: 'Filter by Status',
                                            value: 'all',
                                            onChange: handleStatusChange,
                                            className: 'w-48',
                                        },
                                    },
                                    {
                                        name: 'Dropdown',
                                        props: {
                                            options: filterOptions.meterTypeOptions,
                                            placeholder: 'Filter by Type',
                                            value: 'all',
                                            onChange: handleTypeChange,
                                            className: 'w-48',
                                        },
                                    },
                                    {
                                        name: 'Dropdown',
                                        props: {
                                            options: filterOptions.locationOptions,
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

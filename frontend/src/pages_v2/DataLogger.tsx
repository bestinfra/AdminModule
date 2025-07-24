import { useState, useEffect } from 'react';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';
import BACKEND_URL from '../config';

export default function DataLogger() {
    const [dataLoggerData, setDataLoggerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data loggers from API
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${BACKEND_URL}/meters/dataloggers`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch data loggers');
                const result = await res.json();
                if (!result.success) throw new Error(result.message || 'Failed to fetch data loggers');
                setDataLoggerData(result.data);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch data loggers');
            })
            .finally(() => setLoading(false));
    }, []);

    const [tableColumns] = useState([
        { key: 'sNo', label: 'Sl No' },
        { key: 'modemSlNo', label: 'DCU / Modem Sl No' },
        { key: 'hwVersion', label: 'Hardware Version' },
        { key: 'fwVersion', label: 'Firmware Version' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'installationDate', label: 'Installation Date' },
    ]);

    const [serverPagination] = useState({
        currentPage: 1,
        totalPages: 5,
        totalCount: 42,
        limit: 8,
        hasNextPage: true,
        hasPrevPage: false,
    });

    const handlePageChange = (page: number, limit: number) => {
        console.log('Page changed:', { page, limit });
    };

    return (
        <Page
            sections={[
                {
                    layout: {
                        type: 'row',
                        className: 'mb-6'
                    },
                    components: [
                        {
                            name: 'PageHeader',
                            props: {
                                title: "Data Logger Management",
                                onBackClick: () => window.history.back(),
                                backButtonText: "Back to Dashboard",
                                buttonsLabel: "Add Data Logger",
                                variant: "primary",
                                onClick: () => console.log('Adding new data logger...'),
                                showMenu: true,
                                showDropdown: true,
                                menuItems: [
                                    { id: 'all', label: 'All Devices' },
                                    { id: 'online', label: 'Online Devices' },
                                    { id: 'offline', label: 'Offline Devices' },
                                    { id: 'standby', label: 'Standby Devices' },
                                    { id: 'maintenance', label: 'Maintenance Required' },
                                    { id: 'low-battery', label: 'Low Battery' }
                                ],
                                onMenuItemClick: (itemId: string) => {
                                    console.log(`Filter by: ${itemId}`);
                                }
                            }
                        }
                    ]
                },
                {
                    layout: {
                        type: 'grid',
                        columns: 1,
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 1,
                                gap: 'gap-6',
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            data: dataLoggerData,
                                            columns: tableColumns,
                                            loading: loading,
                                            showHeader: false,
                                            headerTitle: 'Data Logger Devices',
                                            dateRange: 'Real-time monitoring',
                                            searchable: true,
                                            sortable: true,
                                            pagination: true,
                                            showActions: true,
                                            text: 'Data Logger Management Table',
                                            serverPagination: serverPagination,
                                            onPageChange: handlePageChange,
                                            emptyMessage: loading ? 'Loading data loggers...' : 'No data loggers found',
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

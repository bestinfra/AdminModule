import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';
import BACKEND_URL from '../config';

export default function DataLogger() {
    const navigate = useNavigate();
    const [dataLoggerData, setDataLoggerData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [serverPagination, setServerPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 8,
        hasNextPage: false,
        hasPrevPage: false,
    });

    // Fetch Data Loggers
    useEffect(() => {
        const fetchDataLoggers = async (page = 1, limit = 8) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${BACKEND_URL}/meters/dataloggers?page=${page}&limit=${limit}`);
                if (!res.ok) throw new Error('Failed to fetch data loggers');
                const result = await res.json();
                if (!result.success) throw new Error(result.message || 'Failed to fetch data loggers');
                
                setDataLoggerData(result.data);
                if (result.pagination) {
                    setServerPagination(result.pagination);
                }
            } catch (error) {
                console.error('Failed to fetch data loggers:', error);
                setError('Failed to fetch data loggers. Please try again.');
                setDataLoggerData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDataLoggers();
    }, []);

    const [tableColumns] = useState([
        { key: 'Exp', label: 'Export' },
        { key: 'modemSlNo', label: 'DCU / Modem Sl No' },
        { key: 'installationDate', label: 'Installation Date' },
    ]);

    const handlePageChange = (page: number, limit: number) => {
        // Fetch data for the new page
        const fetchDataLoggers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${BACKEND_URL}/meters/dataloggers?page=${page}&limit=${limit}`);
                if (!res.ok) throw new Error('Failed to fetch data loggers');
                const result = await res.json();
                if (!result.success) throw new Error(result.message || 'Failed to fetch data loggers');
                
                setDataLoggerData(result.data);
                if (result.pagination) {
                    setServerPagination(result.pagination);
                }
            } catch (error) {
                console.error('Failed to fetch data loggers:', error);
                setError('Failed to fetch data loggers. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDataLoggers();
    };

    const handleRetry = () => {
        setError(null);
        window.location.reload();
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Error section
                    ...(error ? [{
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Error',
                                props: {
                                    visibleErrors: [error],
                                    onRetry: handleRetry,
                                    showRetry: true,
                                    maxVisibleErrors: 1,
                                },
                            },
                        ],
                    }] : []),
                    {
                        layout: {
                            type: 'row',
                            className: '',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'Data Logger Management',
                                    onBackClick: () =>{navigate('/superadmin')},
                                    backButtonText: 'Back to Dashboard',
                                    buttonsLabel: 'Add Data Logger',
                                    variant: 'primary',
                                    onClick: () =>
                                        console.log(
                                            'Adding new data logger...'
                                        ),
                                    showMenu: true,
                                    showDropdown: true,
                                    menuItems: [
                                        { id: 'all', label: 'All Devices' },
                                        {
                                            id: 'online',
                                            label: 'Online Devices',
                                        },
                                        {
                                            id: 'offline',
                                            label: 'Offline Devices',
                                        },
                                        {
                                            id: 'standby',
                                            label: 'Standby Devices',
                                        },
                                        {
                                            id: 'maintenance',
                                            label: 'Maintenance Required',
                                        },
                                        {
                                            id: 'low-battery',
                                            label: 'Low Battery',
                                        },
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        console.log(`Filter by: ${itemId}`);    
                                    },
                                },
                            },
                        ],
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 1,
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: dataLoggerData,
                                                columns: tableColumns,
                                                loading: loading,
                                                showHeader: true,
                                                headerTitle: 'Data Logger Devices',
                                                searchable: true,
                                                sortable: true,
                                                pagination: true,
                                                showActions: true,
                                                availableTimeRanges: [],
                                                text: 'Data Logger Management Table',
                                                serverPagination: serverPagination,
                                                onPageChange: handlePageChange,
                                                emptyMessage: 'No data available',
                                                onEdit: (row: TableData) =>
                                                    console.log('Edit:', row),
                                                onDelete: (row: TableData) =>
                                                    console.log('Delete:', row),
                                                onView: (row: TableData) => {
                                                    // Navigate to the data logger dashboard with the row ID
                                                    const dataLoggerId = row.modemSlNo || row.sNo?.toString();
                                                    if (dataLoggerId) {
                                                        navigate(`/data-logger/${dataLoggerId}`);
                                                    }
                                                },
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

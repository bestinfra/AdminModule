import React, { useState, useEffect, Suspense } from 'react';
import type { Column, TableData } from '@/components/global/Table';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Page from '@/components/global/PageC';
import BACKEND_URL from '../config';

const columns: Column[] = [
    { key: 'sNo', label: 'S.No' },
    { key: 'consumerNumber', label: 'UID' },
    { key: 'name', label: 'Consumer Name' },
    { key: 'meter', label: 'Meter SI No' },
    { key: 'reading', label: 'Current Reading' },
];



const Consumers: React.FC = () => {
    const [menuValue, setMenuValue] = useState('');
    const [consumers, setConsumers] = useState<TableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrors] = useState<any[]>([]);
    const [serverPagination, setServerPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 8,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const params = useParams();
    const location = useLocation();

    // Safely get navigate function, fallback to console.log if not available
    let navigate: any;
    try {
        navigate = useNavigate();
    } catch (error) {
        console.warn(
            'useNavigate not available in federated context, using fallback'
        );
        navigate = (path: string) => {
            console.log('Navigation requested to:', path);
            // Try to use window.location as fallback
            if (window.location.pathname !== path) {
                window.location.href = path;
            }
        };
    }

    // Fetch consumers data from API
    const fetchConsumers = (page = 1, limit = 8) => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        
        fetch(`${BACKEND_URL}/consumers?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setConsumers(data.data);
                    setServerPagination({
                        currentPage: page,
                        totalPages: data.pagination?.totalPages || 1,
                        totalCount: data.pagination?.totalCount || data.data.length,
                        limit,
                        hasNextPage: data.pagination?.hasNextPage || false,
                        hasPrevPage: data.pagination?.hasPrevPage || false,
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch consumers');
                }
            })
            .catch((err) => {
                console.error(err.message || 'Failed to fetch consumers');
                // Don't set dummy data - let the table show "No data available"
                setConsumers([]);
                setServerPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0,
                    limit: 8,
                    hasNextPage: false,
                    hasPrevPage: false,
                });
                setErrors(prev => {
                    if (!prev.includes("Failed to fetch consumers")) {
                        const updated = [...prev, "Failed to fetch consumers"];
                        return updated;
                    }
                    return prev;
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchConsumers();
    }, []);

    // Check for filter parameter from route
    useEffect(() => {
        if (location.pathname === '/consumers/high-usage') {
            setMenuValue('high-usage');
        } else if (params.uid && params.uid !== 'high-usage') {
            // This is a regular consumer view, not a filter
        }
    }, [location.pathname, params.uid]);

    const filteredConsumers =
        menuValue === 'high-usage'
            ? consumers.filter(
                  (consumer) => {
                      const reading = consumer.reading;
                      return reading && typeof reading === 'string' && parseFloat(reading) > 1000;
                  }
              )
            : consumers;

    // Remove unused function
    // const handlePageChange = (page: number) => {
    //     console.log('Page changed to:', page);
    // };

    // Clear all error messages
    const clearErrors = () => {
        setErrors([]);
    };

    // Remove a specific error message
    const removeError = (indexToRemove: number) => {
        setErrors(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // Retry all APIs
    const retryAllAPIs = () => {
        clearErrors();
        // Retry all APIs by refreshing the page
        window.location.reload();
    };


    const headerConfig = {
        title: 'Consumers',
        subtitle: '',
        onBackClick: () => navigate('/dashboard'),
        backButtonText: 'Back to Dashboard',
        buttonsLabel: 'Add Consumer',
        variant: 'primary',
        onClick: () => navigate('/consumers/add'),
        showMenu: true,
        showDropdown: true,
        menuItems: [
            { id: 'occupied', label: 'Occupied' },
            { id: 'vacant', label: 'Vacant' },
        ],
        onMenuItemClick: (itemId: string) => {
            setMenuValue(itemId);
        },
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <Page
                    sections={[
                        {
                            layout: {
                                type: 'column',
                                gap: 'gap-4',
                                rows: [
                                    {
                                        layout: 'column',
                                        gap: 'gap-4',
                                        columns: [
                                            {
                                                name: 'Error',
                                                props: {
                                                    visibleErrors: errorMessages,
                                                    onRetry: retryAllAPIs,
                                                    onClose: () => removeError(0), // Remove the top error
                                                    showRetry: true,
                                                    maxVisibleErrors: 3, // Show max 3 errors at once
                                                },
                                            },
                                            {
                                                name: 'PageHeader',
                                                props: headerConfig,
                                            },
                                        ],
                                    },
                                    {
                                        layout: 'column',
                                        gap: 'gap-4',
                                        columns: [
                                            {
                                                name: 'Table',
                                                props: {
                                                    data: filteredConsumers,
                                                    columns: columns,
                                                    loading: loading,
                                                    searchable: true,
                                                    sortable: true,
                                                    pagination: true,
                                                    showActions: true,
                                                    serverPagination: serverPagination,
                                                    // onPageChange: handlePageChange,
                                                    // onEdit: (row: TableData) =>
                                                    //     console.log('Edit:', row),
                                                    onView: (row: TableData) =>
                                                        navigate(`/consumer-detail-view/${row.consumerNumber}`),
                                                    headerTitle: 'Consumer Management',
                                                    dateRange: 'Real-time data',
                                                    text: 'Consumer Management Table',
                                                    className: 'w-full',
                                                    emptyMessage: loading
                                                        ? 'Loading consumers...'
                                                        : 'No consumers found',
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
        </Suspense>
    );
};

export default Consumers;

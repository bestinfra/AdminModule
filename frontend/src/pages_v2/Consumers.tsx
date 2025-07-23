import React, { useState, useEffect } from 'react';
import type { Column } from '@components/global/Table';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Page from '@components/global/PageC';
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
    const [consumers, setConsumers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    // Load dummy data instead of API call
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${BACKEND_URL}/consumers`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch consumers');
                const result = await res.json();
                if (!result.success) throw new Error(result.message || 'Failed to fetch consumers');
                setConsumers(result.data); // Use data as-is
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch consumers');
            })
            .finally(() => setLoading(false));
    }, []);

    // Check for filter parameter from route
    useEffect(() => {
        if (location.pathname === '/consumers/high-usage') {
            setMenuValue('high-usage');
        } else if (params.uid && params.uid !== 'high-usage') {
            // This is a regular consumer view, not a filter
        }
    }, [location.pathname, params.uid]);

    // Filter consumers based on menu value
    const filteredConsumers = menuValue === 'high-usage' 
        ? consumers.filter(consumer => parseFloat(consumer.reading) > 1000)
        : consumers;

    const handleRowClick = (row: any) => {
        navigate(`/consumer-view/${row.consumerNumber}`);
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
            { id: 'high-usage', label: 'High Usage' },
        ],
        onMenuItemClick: (itemId: string) => {
            setMenuValue(itemId);
        }
    };

    return (
        <div className="p-2 min-h-screen">
            {error && (
                <div className="mb-4 p-4 bg-danger-light border border-danger rounded-md text-danger">
                    {error}
                </div>
            )}
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
                                            name: 'PageHeader',
                                            props: headerConfig
                                        }
                                    ]
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
                                                pagination: true,
                                                showActions: true,
                                                actions: [
                                                    {
                                                        label: 'View',
                                                        icon: '/icons/eye.svg',
                                                        onClick: handleRowClick
                                                    }
                                                ],
                                                onRowClick: handleRowClick,
                                                emptyMessage: loading ? 'Loading consumers...' : 'No consumers found'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]}
            />
        </div>
    );
};

export default Consumers;

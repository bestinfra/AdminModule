import React, { useState, useEffect, Suspense } from 'react';
import type { Column } from '@/components/global/Table';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Page from '@/components/global/PageC';

const columns: Column[] = [
    { key: 'sNo', label: 'S.No' },
    { key: 'consumerNumber', label: 'UID' },
    { key: 'name', label: 'Consumer Name' },
    { key: 'meter', label: 'Meter SI No' },
    { key: 'reading', label: 'Current Reading' },
];

const DUMMY_CONSUMERS = [
    {
        id: 1,
        sNo: 1,
        consumerNumber: 'BI25GMRA001',
        name: 'Airborne General Store',
        meter: 'A9211434',
        reading: '177.89',
        email: 'airborne@example.com',
        primaryPhone: '+91 9876543210',
        connectionType: 'COMMERCIAL',
        category: 'COMMERCIAL',
        sanctionedLoad: 10.0,
        status: 'ACTIVE',
    },
    {
        id: 2,
        sNo: 2,
        consumerNumber: 'BI25GMRA002',
        name: 'Neo Travels',
        meter: 'A9345417',
        reading: '12480.54',
        email: 'neo.travels@example.com',
        primaryPhone: '+91 9876543211',
        connectionType: 'COMMERCIAL',
        category: 'COMMERCIAL',
        sanctionedLoad: 25.0,
        status: 'ACTIVE',
    },
    {
        id: 3,
        sNo: 4,
        consumerNumber: 'BI25GMRA004',
        name: 'Mobikins',
        meter: 'A9211433',
        reading: '1559.28',
        email: 'mobikins@example.com',
        primaryPhone: '+91 9876543212',
        connectionType: 'COMMERCIAL',
        category: 'COMMERCIAL',
        sanctionedLoad: 15.0,
        status: 'ACTIVE',
    },
];

const Consumers: React.FC = () => {
    const [menuValue, setMenuValue] = useState('');
    const [consumers, setConsumers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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

        // Simulate API delay
        setTimeout(() => {
            setConsumers(DUMMY_CONSUMERS);
            setLoading(false);
        }, 500);
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
                  (consumer) => parseFloat(consumer.reading) > 1000
              )
            : consumers;

    const handleRowClick = (row: any) => {
        navigate(`/consumers/${row.consumerNumber}`);
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
        },
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="p-2 min-h-screen">
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
                                                    pagination: true,
                                                    showActions: true,
                                                    actions: [
                                                        {
                                                            label: 'View',
                                                            icon: '/icons/eye.svg',
                                                            onClick:
                                                                handleRowClick,
                                                        },
                                                    ],
                                                    onRowClick: handleRowClick,
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

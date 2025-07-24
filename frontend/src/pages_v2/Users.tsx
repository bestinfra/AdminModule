import { useState, useEffect } from 'react';
import Page from '@/components/global/PageC';
import BACKEND_URL from '../config';

const tableColumns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
];

// Card data for user statistics
const cardData = [
    {
        title: 'Total Users',
        value: '8',
        icon: '/icons/users.svg',
        subtitle1: '1 Active Users',
        subtitle2: '7 Inactive Users',
    },
    {
        title: 'Total Admins',
        value: '4',
        icon: '/icons/admin.svg',
        subtitle1: 'This Month',
    },
    {
        title: 'Total Accountants',
        value: '1',
        icon: '/icons/accountant.svg',
        subtitle1: 'This Month',
    },
    {
        title: 'Total Moderators',
        value: '1',
        icon: '/icons/moderator.svg',
        subtitle1: '1 Active Users',
    },
    {
        title: 'Total Roles',
        value: '4',
        icon: '/icons/roles.svg',
        subtitle1: '1 Active Users',
    },
];

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${BACKEND_URL}/users`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch users');
                const result = await res.json();
                if (!result.success) throw new Error(result.message || 'Failed to fetch users');
                setUsers(result.data);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch users');
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            {error && (
                <div className="mb-4 p-4 bg-danger-light border border-danger rounded-md text-danger">
                    {error}
                </div>
            )}
            <Page
                sections={[
                    // Page Header Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'PageHeader',
                                            props: {
                                                title: "User Management",
                                                onBackClick: () => window.history.back(),
                                                backButtonText: "Back to Dashboard",
                                                buttonsLabel: "Add User",
                                                variant: "primary",
                                                onClick: () => console.log('Adding new user...'),
                                                showMenu: true,
                                                showDropdown: true,
                                                menuItems: [
                                                    { id: 'all', label: 'All Users' },
                                                    { id: 'active', label: 'Active Users' },
                                                    { id: 'inactive', label: 'Inactive Users' },
                                                    { id: 'admin', label: 'Administrators' },
                                                    { id: 'moderator', label: 'Moderators' },
                                                    { id: 'user', label: 'Regular Users' }
                                                ],
                                                onMenuItemClick: (itemId: string) => {
                                                    console.log(`Filter by: ${itemId}`);
                                                }
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
                            type: 'column' as const,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid' as const,
                                    gridColumns: 5,
                                    gap: 'gap-6',
                                    columns: cardData.map(card => ({
                                        name: 'Card',
                                        props: card
                                    }))
                                }
                            ]
                        }
                    },
                    // Users Table Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid' as const,
                                    gridColumns: 1,
                                    gap: 'gap-6',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: users,
                                                columns: tableColumns,
                                                loading: loading,
                                                searchable: true,
                                                pagination: true,
                                                showActions: false,
                                                emptyMessage: loading ? 'Loading users...' : 'No users found',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
        </>
    );
}

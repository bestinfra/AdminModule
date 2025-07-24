import { useState, useEffect } from 'react';
import { lazy, Suspense } from 'react';
const Page = lazy(() => import('SuperAdmin/Page'));
import BACKEND_URL from '../config';

const tableColumns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
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
                if (!result.success)
                    throw new Error(result.message || 'Failed to fetch users');
                setUsers(result.data);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch users');
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Suspense fallback={<div>Loading...</div>}>
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
                                type: 'row',
                                className: 'mb-6',
                            },
                            components: [
                                {
                                    name: 'PageHeader',
                                    props: {
                                        title: 'User Management',
                                        onBackClick: () =>
                                            window.history.back(),
                                        backButtonText: 'Back to Dashboard',
                                        buttonsLabel: 'Add User',
                                        variant: 'primary',
                                        onClick: () =>
                                            console.log('Adding new user...'),
                                        showMenu: true,
                                        showDropdown: true,
                                        menuItems: [
                                            { id: 'all', label: 'All Users' },
                                            {
                                                id: 'active',
                                                label: 'Active Users',
                                            },
                                            {
                                                id: 'inactive',
                                                label: 'Inactive Users',
                                            },
                                            {
                                                id: 'admin',
                                                label: 'Administrators',
                                            },
                                            {
                                                id: 'moderator',
                                                label: 'Moderators',
                                            },
                                            {
                                                id: 'user',
                                                label: 'Regular Users',
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
                                type: 'column',
                                rows: [
                                    {
                                        layout: 'column',
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
                                                    emptyMessage: loading
                                                        ? 'Loading users...'
                                                        : 'No users found',
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
}

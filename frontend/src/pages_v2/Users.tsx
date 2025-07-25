import { useState, useEffect, Suspense } from 'react';
import Page from '@/components/global/PageC';
import BACKEND_URL from '../config';

const tableColumns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'role', label: 'Role' },
    { key: 'client', label: 'Client' },
    // { key: 'lastActive', label: 'Last Active' },
    { key: 'createdDate', label: 'Created Date' },
    // Add actions column if you want to show action buttons
];

const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
};

export default function Users() {
    const [users, setUsers] = useState<
        Array<{
            sNo: number;
            name: string;
            email: string;
            phone: string;
            role: string;
            client: string;
            createdDate: string;
        }>
    >([]);
    const [loading, setLoading] = useState(true);
    // User stats state
    const [userStats, setUserStats] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/users`)
            .then(async (res) => {
                // if (!res.ok) throw new Error('Failed to fetch users');
                const result = await res.json();
                console.log(result);
                // if (!result.success)
                //     throw new Error(result.message || 'Failed to fetch users');
                // setUsers(result.data);
            })
            .catch((err) => {
                console.log(err);
                // Demo users fallback
                setUsers([
                    {
                        sNo: 1,
                        name: 'John Doe',
                        email: 'john.doe@email.com',
                        phone: '+1-555-0101',
                        role: 'Admin',
                        client: 'Acme Corp',
                        createdDate: '2024-01-01',
                    },
                    {
                        sNo: 2,
                        name: 'Jane Smith',
                        email: 'jane.smith@email.com',
                        phone: '+1-555-0102',
                        role: 'User',
                        client: 'Beta Inc',
                        createdDate: '2024-02-15',
                    },
                    {
                        sNo: 3,
                        name: 'Alice Brown',
                        email: 'alice.brown@email.com',
                        phone: '+1-555-0103',
                        role: 'Accountant',
                        client: 'Gamma LLC',
                        createdDate: '2024-03-10',
                    },
                    {
                        sNo: 4,
                        name: 'Mike Wilson',
                        email: 'mike.wilson@email.com',
                        phone: '+1-555-0104',
                        role: 'Moderator',
                        client: 'Delta Ltd',
                        createdDate: '2024-04-05',
                    },
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    // Fetch user stats (widgets)
    useEffect(() => {
        setStatsLoading(true);
        fetch(`${BACKEND_URL}/users/stats`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch user stats');
                const result = await res.json();
                if (!result.success)
                    throw new Error(
                        result.message || 'Failed to fetch user stats'
                    );
                setUserStats(result.data);
            })
            .catch(() => {
                // Demo user stats fallback
                setUserStats({
                    totalUsers: 4,
                    activeUsers: 3,
                    inactiveUsers: 1,
                    totalAdmins: 1,
                    totalAccountants: 1,
                    totalModerators: 1,
                    totalRoles: 4,
                });
            })
            .finally(() => {});
    }, []);

    // Widget cards array (same style as meters/tickets)
    const userWidgets = userStats
        ? [
              {
                  title: 'Total Users',
                  value: userStats.totalUsers,
                  icon: '/icons/account.svg',
                  subtitle1: `${userStats.activeUsers} Active Users`,
                  subtitle2: `${userStats.inactiveUsers} Inactive Users`,
                  iconStyle: ICON_FILTER_STYLE,
              },
              {
                  title: 'Total Admins',
                  value: userStats.totalAdmins,
                  icon: '/icons/admin.svg',
                  subtitle1: 'This Month',
                  iconStyle: ICON_FILTER_STYLE,
              },
              {
                  title: 'Total Accountants',
                  value: userStats.totalAccountants,
                  icon: '/icons/accountant.svg',
                  subtitle1: 'This Month',
                  iconStyle: ICON_FILTER_STYLE,
              },
              {
                  title: 'Total Moderators',
                  value: userStats.totalModerators,
                  icon: '/icons/moderator.svg',
                  subtitle1: '1 Active Users', // Adjust if you want to show actual active moderators
                  iconStyle: ICON_FILTER_STYLE,
              },
              {
                  title: 'Total Roles',
                  value: userStats.totalRoles,
                  icon: '/icons/apps-icon.svg',
                  subtitle1: '1 Active Users', // Adjust if you want to show actual active roles
                  iconStyle: ICON_FILTER_STYLE,
              },
          ]
        : [];

    return (
        <Suspense fallback={<div>Loading...</div>}>
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
                                                title: 'User Management',
                                                onBackClick: () =>
                                                    window.history.back(),
                                                backButtonText:
                                                    'Back to Dashboard',
                                                buttonsLabel: 'Add User',
                                                variant: 'primary',
                                                onClick: () =>
                                                    console.log(
                                                        'Adding new user...'
                                                    ),
                                                showMenu: true,
                                                showDropdown: true,
                                                menuItems: [
                                                    {
                                                        id: 'all',
                                                        label: 'All Users',
                                                    },
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
                                                onMenuItemClick: (
                                                    itemId: string
                                                ) => {
                                                    console.log(
                                                        `Filter by: ${itemId}`
                                                    );
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
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
                                    columns: userWidgets.map((card) => ({
                                        name: 'Card',
                                        props: {
                                            ...card,
                                            loading: statsLoading
                                        }
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
        </Suspense>
    );
}

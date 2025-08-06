import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
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



export default function Users() {
    const navigate = useNavigate();
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
    const [serverPagination, setServerPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 8,
        hasNextPage: false,
        hasPrevPage: false,
    });
    // User stats state
    const [userStats, setUserStats] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // Inactive modal state
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const [userToInactive, setUserToInactive] = useState<any>(null);
    const [inactiveFormData, setInactiveFormData] = useState({
        userName: '',
        reason: ''
    });

    // Filter state
    const [filters, setFilters] = useState({
        userTypes: '',
        userStatus: '',
    });

    // Dropdown options
    const userTypesOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'moderator', label: 'Moderator' },
        { value: 'accountant', label: 'Accountant' },
    ];

    const userStatusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    // Filter change handler
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        console.log(`Filter changed: ${name} = ${value}`);
        // Add your filter logic here
    };

    const handlePageChange = (page: number, limit: number) => {
        fetchUsers(page, limit);
    };

    const fetchUsers = (page = 1, limit = 8) => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        
        fetch(`${BACKEND_URL}/users?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUsers(data.data);
                    setServerPagination({
                        currentPage: page,
                        totalPages: data.pagination?.totalPages || 1,
                        totalCount: data.pagination?.totalCount || data.data.length,
                        limit,
                        hasNextPage: data.pagination?.hasNextPage || false,
                        hasPrevPage: data.pagination?.hasPrevPage || false,
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch users');
                }
            })
            .catch((err) => {
                console.error(err.message || 'Failed to fetch users');
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
                setServerPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 4,
                    limit: 4,
                    hasNextPage: false,
                    hasPrevPage: false,
                });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
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
                console.log('User stats:', result.data);
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
            .finally(() => setStatsLoading(false));
    }, []);

    // Widget cards array (same style as meters/tickets)
    const userWidgets = userStats
        ? [
            {
                title: 'Total Users',
                value: userStats.totalUsers,
                icon: '/icons/total-users.svg',
                subtitle1: `${userStats.activeUsers} Active Users`,
                subtitle2: `${userStats.inactiveUsers} Inactive Users`,
            },
            {
                title: 'Total Admins',
                value: userStats.totalAdmins,
                icon: '/icons/admin.svg',
                subtitle1: 'This Month',
            },
            {
                title: 'Total Accountants',
                value: userStats.totalAccountants,
                icon: '/icons/accountant.svg',
                subtitle1: 'This Month',
            },
            {
                title: 'Total Moderators',
                value: userStats.totalModerators,
                icon: '/icons/moderator.svg',
                subtitle1: '1 Active Users', // Adjust if you want to show actual active moderators
            },
            {
                title: 'Total Roles',
                value: userStats.totalRoles,
                icon: '/icons/roles.svg',
                subtitle1: '1 Active Users', // Adjust if you want to show actual active roles
            },
        ]
        : [];




    const handleInactiveClick = (row: any) => {
        setUserToInactive(row);
        setInactiveFormData({
            userName: row.name || '',
            reason: ''
        });
        setShowInactiveModal(true);
    };

    const handleConfirmInactive = async (data: any) => {
        try {
            console.log('Inactivating user:', userToInactive.sNo, data);
            // Here you would make the actual API call to inactive the user
            // const res = await fetch(`${BACKEND_URL}/users/${userToInactive.sNo}/inactive`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ reason: data.reason })
            // });
            
            // For demo purposes, update local state
            setUsers(users.map(user => 
                user.sNo === userToInactive.sNo 
                    ? { ...user, status: 'inactive' }
                    : user
            ));
        } catch (error) {
            console.error('Error inactivating user:', error);
        } finally {
            setShowInactiveModal(false);
            setUserToInactive(null);
            setInactiveFormData({
                userName: '',
                reason: ''
            });
        }
    };

    const handleCancelInactive = () => {
        setShowInactiveModal(false);
        setUserToInactive(null);
        setInactiveFormData({
            userName: '',
            reason: ''
        });
    };

    // Form fields configuration for inactive user
    const inactiveFormFields = [
        {
            type: 'input' as const,
            label: 'User Name',
            name: 'userName',
            value: inactiveFormData.userName,
            placeholder: 'User name',
            required: true,
            onChange: (value: string) => setInactiveFormData(prev => ({ ...prev, userName: value })),
            disabled: true
        },
        {
            type: 'dropdown' as const,
            label: 'Reason for Inactivation',
            name: 'reason',
            searchable: false,
            value: inactiveFormData.reason,
            required: true,
            options: [
                { value: 'account_violation', label: 'Account Violation' },
                { value: 'inactive_usage', label: 'Inactive Usage' },
                { value: 'security_concern', label: 'Security Concern' },
                { value: 'user_request', label: 'User Request' },
                { value: 'other', label: 'Other' }
            ],
            onChange: (value: string) => setInactiveFormData(prev => ({ ...prev, reason: value }))
        }
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Page Header Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'PageHeader',
                                            props: {
                                                title: 'Users',
                                                onBackClick: () =>
                                                    navigate('/superadmin'),
                                                backButtonText:
                                                    'Back to Dashboard',
                                                buttonsLabel: 'Add User',
                                                variant: 'primary',
                                                onClick: () => navigate('/add-user'),
                                                showMenu: true,
                                                showDropdown: true,
                                                menuItems: [
                                                    {
                                                        id: 'RoleManagement',
                                                        label: 'Role Management',
                                                    },  
                                                    {
                                                        id: 'Export',
                                                        label: 'Export ',
                                                    },
                                                  
                                                ],
                                                onMenuItemClick: (
                                                    itemId: string
                                                ) => {
                                                    console.log(
                                                        `Filter by: ${itemId}`
                                                    );
                                                    if (itemId === 'RoleManagement') {
                                                        navigate('/role-management');
                                                    }
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
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'grid' as const,
                                    gridColumns: 5,
                                    gap: 'gap-4',
                                    columns: userWidgets.map((card) => ({
                                        name: 'Card',
                                        props: {
                                            ...card,
                                            loading: statsLoading,
                                            bg: "bg-stat-icon-gradient"
                                        }
                                    }))
                                }
                            ]
                        }
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 2,
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Dropdown',
                                            props: {
                                                name: 'userTypes',
                                                options: userTypesOptions,
                                                placeholder: 'Filter By User Types',
                                                value: filters.userTypes,
                                                onChange: handleFilterChange,
                                                className: 'w-48',
                                                searchable: false,
                                            },
                                        },
                                        {
                                            name: 'Dropdown',
                                            props: {
                                                name: 'userStatus',
                                                options: userStatusOptions,
                                                placeholder: 'Filter By User Status',
                                                value: filters.userStatus,
                                                onChange: handleFilterChange,
                                                className: 'w-48',
                                                searchable:false,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Users Table Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
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
                                                sortable: true,
                                                pagination: true,
                                                showActions: true,
                                                serverPagination: serverPagination,
                                                onPageChange: handlePageChange,
                                                onView: (row: any) => {
                                                    console.log('Users: onView triggered', row);
                                                    console.log('Users: Navigating to', `/user-detail/${row.sNo}`);
                                                    navigate(`/user-detail/${row.sNo}`, {
                                                        state: {
                                                            user: row
                                                        }
                                                    });
                                                },
                                                onEdit: (row: any) => {
                                                    console.log('Edit user:', row);
                                                    // Navigate to edit page or open edit modal
                                                    navigate(`/edit-user/${row.sNo}`, {
                                                        state: {
                                                            user: row
                                                        }
                                                    });
                                                },
                                                onInactive: (row: any) => {
                                                    handleInactiveClick(row);
                                                },
                                                headerTitle: 'User Management',
                                                dateRange: 'Real-time data',
                                                text: 'User Management Table',
                                                className: 'w-full',
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
                    // Inactive User Modal Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'Modal',
                                            props: {
                                                isOpen: showInactiveModal,
                                                onClose: handleCancelInactive,
                                                title: 'Inactivate User',
                                                size: 'md',
                                                showForm: true,
                                                formFields: inactiveFormFields,
                                                onSave: handleConfirmInactive,
                                                saveButtonLabel: 'Inactivate User',
                                                cancelButtonLabel: 'Cancel',
                                                cancelButtonVariant: 'secondary',
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

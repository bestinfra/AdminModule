import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

// Components
import Page from '../components/global/Page';
import PageHeader from '../components/global/PageHeader';
import Table from '../components/global/Table';

// Context

// Types
import type { Section } from '../components/global/Page';
import type { TableData, Column } from '../components/global/Table';

// Interfaces
interface UserStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    total_accountants: number;
    total_moderators: number;
    total_admins: number;
    total_roles: number;
    totalRevenue: number;
    averageRevenue: number;
}

interface User extends TableData {
    USER_ID: number;
    name: string;
    email: string;
    phone: string;
    role_title: string;
    client_name: string;
    last_active: string;
    created_at: string;
    status: string;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}





const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // State
    const [users, setUsers] = useState<User[]>([]);
    const [_totalCount, setTotalCount] = useState(0);
    const [_loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [_statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [_errorType, setErrorType] = useState<string | null>(null);
    const [_errorDetails, setErrorDetails] = useState<string | null>(null);
    
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [_stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        total_accountants: 0,
        total_moderators: 0,
        total_admins: 0,
        total_roles: 0,
        totalRevenue: 0,
        averageRevenue: 0,
    });



    // Utility functions
    const updateUrlParams = (page: number, limit: number) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        navigate(`?${params.toString()}`, { replace: true });
    };

    const handlePageChange = (page: number, limit: number) => {
        updateUrlParams(page, limit);
    };



    const formatDateSlash = (dateString: string): string => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    // Dummy Data
    const dummyUsers: User[] = [
        {
            USER_ID: 1,
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+91-9876543210',
            role_title: 'Super Admin',
            client_name: 'TechCorp Solutions',
            last_active: '2024-01-15T10:30:00Z',
            created_at: '2024-01-01T09:00:00Z',
            status: 'active',
        },
        {
            USER_ID: 2,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+91-9876543211',
            role_title: 'Admin',
            client_name: 'DataFlow Inc',
            last_active: '2024-01-14T15:45:00Z',
            created_at: '2024-01-02T10:15:00Z',
            status: 'active',
        },
        {
            USER_ID: 3,
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            phone: '+91-9876543212',
            role_title: 'Accountant',
            client_name: 'Finance Pro',
            last_active: '2024-01-13T11:20:00Z',
            created_at: '2024-01-03T14:30:00Z',
            status: 'active',
        },
        {
            USER_ID: 4,
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            phone: '+91-9876543213',
            role_title: 'Moderator',
            client_name: 'ModerateIT',
            last_active: '2024-01-12T16:10:00Z',
            created_at: '2024-01-04T11:45:00Z',
            status: 'active',
        },
        {
            USER_ID: 5,
            name: 'David Wilson',
            email: 'david.wilson@example.com',
            phone: '+91-9876543214',
            role_title: 'User',
            client_name: 'UserBase Ltd',
            last_active: '2024-01-11T09:30:00Z',
            created_at: '2024-01-05T13:20:00Z',
            status: 'inactive',
        },
        {
            USER_ID: 6,
            name: 'Lisa Anderson',
            email: 'lisa.anderson@example.com',
            phone: '+91-9876543215',
            role_title: 'Admin',
            client_name: 'AdminSoft',
            last_active: '2024-01-10T12:15:00Z',
            created_at: '2024-01-06T15:10:00Z',
            status: 'active',
        },
        {
            USER_ID: 7,
            name: 'Robert Taylor',
            email: 'robert.taylor@example.com',
            phone: '+91-9876543216',
            role_title: 'Accountant',
            client_name: 'Accounting Plus',
            last_active: '2024-01-09T14:50:00Z',
            created_at: '2024-01-07T10:40:00Z',
            status: 'active',
        },
        {
            USER_ID: 8,
            name: 'Jennifer Martinez',
            email: 'jennifer.martinez@example.com',
            phone: '+91-9876543217',
            role_title: 'Moderator',
            client_name: 'ModControl',
            last_active: '2024-01-08T13:25:00Z',
            created_at: '2024-01-08T12:00:00Z',
            status: 'active',
        },
        {
            USER_ID: 9,
            name: 'William Garcia',
            email: 'william.garcia@example.com',
            phone: '+91-9876543218',
            role_title: 'User',
            client_name: 'EndUser Corp',
            last_active: '2024-01-07T17:40:00Z',
            created_at: '2024-01-09T16:30:00Z',
            status: 'inactive',
        },
        {
            USER_ID: 10,
            name: 'Amanda Rodriguez',
            email: 'amanda.rodriguez@example.com',
            phone: '+91-9876543219',
            role_title: 'Super Admin',
            client_name: 'SuperTech',
            last_active: '2024-01-06T11:15:00Z',
            created_at: '2024-01-10T08:45:00Z',
            status: 'active',
        },
    ];

    const dummyStats: UserStats = {
        totalUsers: 10,
        activeUsers: 8,
        inactiveUsers: 2,
        total_accountants: 2,
        total_moderators: 2,
        total_admins: 3,
        total_roles: 5,
        totalRevenue: 125000,
        averageRevenue: 12500,
    };

    // API Functions (commented out - using dummy data)
    const fetchUsers = useCallback(
        async (page = pagination.currentPage, limit = pagination.limit) => {
            if (tableLoading) return;

            try {
                setTableLoading(true);
                setError(null);
                setErrorType(null);
                setErrorDetails(null);

                // Commented out API call - using dummy data instead
                /*
                const response: ApiResponse<User> = await apiClient.get(
                    `/roles?page=${page}&limit=${limit}`
                );

                if (!response.data) {
                    throw new Error('No data received from server');
                }

                setUsers(response.data || []);
                setTotalCount(response.pagination?.total || 0);
                setPagination({
                    currentPage: response.pagination?.page || 1,
                    limit: response.pagination?.limit || 10,
                    totalPages: response.pagination?.totalPages || 1,
                    totalCount: response.pagination?.total || 0,
                    hasNextPage:
                        (response.pagination?.page || 1) <
                        (response.pagination?.totalPages || 1),
                    hasPrevPage: (response.pagination?.page || 1) > 1,
                });
                */

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Calculate pagination for dummy data
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedUsers = dummyUsers.slice(startIndex, endIndex);
                const totalPages = Math.ceil(dummyUsers.length / limit);

                setUsers(paginatedUsers);
                setTotalCount(dummyUsers.length);
                setPagination({
                    currentPage: page,
                    limit: limit,
                    totalPages: totalPages,
                    totalCount: dummyUsers.length,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                });

            } catch (err) {
                setError('Failed to fetch users data');
                setErrorType('fetch_error');
                setErrorDetails(
                    'An error occurred while fetching users data. Please try again later.'
                );
                console.error('Error fetching users:', err);
            } finally {
                setTableLoading(false);
            }
        },
        [tableLoading, pagination.currentPage, pagination.limit]
    );

    const fetchStats = async () => {
        try {
            setStatsLoading(true);
            
            // Commented out API call - using dummy data instead
            /*
            const response = await apiClient.get('/usersStats');
            const data = response.data;

            setStats({
                totalUsers: data.total_users || 0,
                activeUsers: data.active_users || 0,
                inactiveUsers: data.inactive_users || 0,
                total_accountants: data.total_accountants || 0,
                total_moderators: data.total_moderators || 0,
                total_admins: data.total_admins || 0,
                total_roles: data.total_roles || 0,
                totalRevenue: data.total_revenue || 0,
                averageRevenue: data.average_revenue || 0,
            });
            */

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Use dummy stats data
            setStats(dummyStats);

        } catch (err) {
            setError('Error fetching stats');
            console.error('Error fetching stats:', err);
        } finally {
            setStatsLoading(false);
        }
    };

    // Event Handlers
    const handleEdit = (user: User) => {
        navigate('/admin/users/add', { state: { user, isEdit: true } });
    };

    const handleDelete = async (user: User) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                setLoading(true);
                
                // Commented out API call - using dummy data instead
                /*
                await apiClient.delete(`/users/${user.USER_ID}`);
                */
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Remove user from dummy data
                setUsers((prev) =>
                    prev.filter((u) => u.USER_ID !== user.USER_ID)
                );
                alert('User deleted successfully');
            } catch (err) {
                setError('Failed to delete user');
                console.error('Error deleting user:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleView = (user: User, tab = 'basic') => {
        navigate(`/admin/users/${user.USER_ID}`, { state: { user, tab } });
    };

    // Effects
    useEffect(() => {
        fetchStats();
    }, [searchParams]);

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const controller = new AbortController();
        fetchUsers(page, limit);

        return () => {
            controller.abort();
        };
    }, [searchParams, fetchUsers]);

    // Table columns
    const columns: Column[] = [
        {
            key: 'name',
            label: 'Full Name',
            render: (value: string | number | boolean | null | undefined) => (value as string) || '-',
        },
        {
            key: 'email',
            label: 'Email Address',
            render: (value: string | number | boolean | null | undefined) => (value as string) || '-',
        },
        {
            key: 'phone',
            label: 'Phone Number',
            render: (value: string | number | boolean | null | undefined) => (value as string) || '-',
        },
        {
            key: 'role_title',
            label: 'Role',
            render: (value: string | number | boolean | null | undefined) => (value as string) || '-',
        },
        {
            key: 'client_name',
            label: 'Client',
            render: (value: string | number | boolean | null | undefined) => (value as string) || '-',
        },
        {
            key: 'last_active',
            label: 'Last Active',
            render: (value: string | number | boolean | null | undefined) => 
                value ? formatDateSlash(value as string) : '-',
        },
        {
            key: 'created_at',
            label: 'Created Date',
            render: (value: string | number | boolean | null | undefined) => 
                value ? formatDateSlash(value as string) : '-',
        },
    ];

    // Error component


    // Loading skeleton for stats


    // Header component
    const headerComponent = (
        <PageHeader
            title="User Management"
            onBackClick={() => navigate('/admin')}
            backButtonText="Back"
            buttonsLabel="Add User"
            variant="primary"
            onClick={() => navigate('/admin/users/add')}
        />
    );

    // Page sections (commented out)
    const sections: Section[] = [
        // {
        //     id: 'header',
        //     component: (
        //         <div className="flex items-center justify-between mb-6">
        //             <div>
        //                 <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        //                 <p className="text-gray-600 mt-1">Manage and monitor all users in the system</p>
        //             </div>
        //             <div className="flex items-center gap-2">
        //                 <Button
        //                     label="Add User"
        //                     onClick={() => navigate('/admin/users/add')}
        //                     variant="primary"
        //                 />
        //                 <Button
        //                     label="Back"
        //                     onClick={() => navigate('/admin')}
        //                     variant="outline"
        //                 />
        //             </div>
        //         </div>
        //     ),
        // },
        // {
        //     id: 'error',
        //     component: error ? (
        //         <ErrorDisplay
        //             error={error}
        //             title={error}
        //             message={errorDetails}
        //             onClose={() => {
        //                 setError(null);
        //                 setErrorType(null);
        //                 setErrorDetails(null);
        //             }}
        //             type={errorType || 'fetch'}
        //         />
        //     ) : null,
        // },
        // {
        //     id: 'stats',
        //     component: (
        //         <div className="mb-6">
        //             {statsLoading ? (
        //                 <StatsSkeleton />
        //             ) : (
        //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        //                     <Card
        //                         title="Total Users"
        //                         value={stats.totalUsers.toString()}
        //                         icon="/icons/total-users.svg"
        //                         showTrend={false}
        //                         subtitle1={`${stats.activeUsers} Active Users`}
        //                         subtitle2={`${stats.inactiveUsers} Inactive Users`}
        //                     />
        //                     <Card
        //                         title="Total Admins"
        //                         value={stats.total_admins.toString()}
        //                         icon="/icons/admin.svg"
        //                         showTrend={false}
        //                         subtitle1="This Month"
        //                         subtitle2=""
        //                     />
        //                     <Card
        //                         title="Total Accountants"
        //                         value={stats.total_accountants.toString()}
        //                         icon="/icons/accountant.svg"
        //                         showTrend={false}
        //                         subtitle1="This Month"
        //                         subtitle2=""
        //                     />
        //                     <Card
        //                         title="Total Moderators"
        //                         value={stats.total_moderators.toString()}
        //                         icon="/icons/moderator.svg"
        //                         showTrend={false}
        //                         subtitle1={`${stats.activeUsers} Active Users`}
        //                         subtitle2=""
        //                     />
        //                     <Card
        //                         title="Total Roles"
        //                         value={stats.total_roles.toString()}
        //                         icon="/icons/roles.svg"
        //                         showTrend={false}
        //                         subtitle1={`${stats.activeUsers} Active Users`}
        //                         subtitle2=""
        //                     />
        //                 </div>
        //             )}
        //         </div>
        //     ),
        // },
        {
            id: 'table',
            component: (
                <div className="bg-white rounded-2xl shadow-sm">
                    <Table
                        data={users}
                        columns={columns}
                        sortable={true}
                        searchable={true}
                        loading={tableLoading}
                        emptyMessage={
                            error ? 'Error loading users' : 'No users found'
                        }
                        onView={(row: TableData) => handleView(row as User)}
                        onEdit={(row: TableData) => handleEdit(row as User)}
                        onDelete={(row: TableData) => handleDelete(row as User)}
                        pagination={true}
                        rowsPerPageOptions={[5, 10, 50]}
                        initialRowsPerPage={10}
                        serverPagination={pagination}
                        onPageChange={handlePageChange}
                        text="User"
                    />
                </div>
            ),
        },
    ];

    return (
        <Page
            layout="single-column"
            sections={sections.filter(section => section.component !== null)}
            header={headerComponent}
            className="p-4"
        />
    );
};

export default UserManagement;

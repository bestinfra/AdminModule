import React, { useState } from 'react';
import Card from '@components/global/Card';
import TimeRangeSelector from '@components/global/TimeRangeSelector';
import Table from '@components/global/Table';
import type { TableData } from '@components/global/Table';
import BarChart from '@graphs/BarChart';
import { useNavigate } from 'react-router-dom';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import { 
    createHeaderComponent, 
    createActionsComponent, 
    createFooterComponent
} from '@components/global/PageComponents';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<'Daily' | 'Monthly'>('Daily');
    
    const userStats = [
        { title: 'Total Users', value: 156, icon: '/icons/users.svg', subtitle1: 'Registered Users' },
        { title: 'Active Users', value: 142, icon: '/icons/active-users.svg', subtitle1: '91.03% of Total Users' },
        { title: 'Inactive Users', value: 14, icon: '/icons/inactive-users.svg', subtitle1: '8.97% of Total Users' },
        { title: 'Admin Users', value: 8, icon: '/icons/admin-users.svg', subtitle1: '5.13% of Total Users' },
        { title: 'Regular Users', value: 148, icon: '/icons/regular-users.svg', subtitle1: '94.87% of Total Users' },
        { title: 'Users with Roles', value: 145, icon: '/icons/users-with-roles.svg', subtitle1: '92.95% of Total Users' },
        { title: 'Users without Roles', value: 11, icon: '/icons/users-without-roles.svg', subtitle1: '7.05% of Total Users' },
        { title: 'Last 30 Days', value: 23, icon: '/icons/recent-users.svg', subtitle1: 'New Registrations' },
    ];

    const userActivityStats = [
        { title: 'Online Users', value: '67', icon: '/icons/online-users.svg', subtitle1: 'Currently Active' },
        { title: 'Offline Users', value: '89', icon: '/icons/offline-users.svg', subtitle1: 'Not Active' },
        { title: 'Suspended Users', value: '3', icon: '/icons/suspended-users.svg', subtitle1: 'Temporarily Disabled' },
        { title: 'Pending Approval', value: '5', icon: '/icons/pending-users.svg', subtitle1: 'Awaiting Review' },
        { title: 'Verified Users', value: '151', icon: '/icons/verified-users.svg', subtitle1: 'Email Verified' },
        { title: 'Unverified Users', value: '5', icon: '/icons/unverified-users.svg', subtitle1: 'Email Not Verified' },
    ];

    // Dummy data for Users table
    const usersTableColumns = [
        { key: 'userId', label: 'User ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
        { key: 'lastLogin', label: 'Last Login' },
        { key: 'createdAt', label: 'Created At' },
    ];
    
    const usersTableData = [
        { userId: 'USR-001', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15 10:30', createdAt: '2024-01-01' },
        { userId: 'USR-002', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-14 15:45', createdAt: '2024-01-02' },
        { userId: 'USR-003', name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-13 09:20', createdAt: '2024-01-03' },
        { userId: 'USR-004', name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'User', status: 'Inactive', lastLogin: '2024-01-10 14:15', createdAt: '2024-01-04' },
        { userId: 'USR-005', name: 'David Brown', email: 'david.brown@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-15 11:00', createdAt: '2024-01-05' },
        { userId: 'USR-006', name: 'Lisa Davis', email: 'lisa.davis@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-14 16:30', createdAt: '2024-01-06' },
        { userId: 'USR-007', name: 'Tom Wilson', email: 'tom.wilson@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15 08:45', createdAt: '2024-01-07' },
        { userId: 'USR-008', name: 'Emma Taylor', email: 'emma.taylor@example.com', role: 'User', status: 'Suspended', lastLogin: '2024-01-12 13:20', createdAt: '2024-01-08' },
        { userId: 'USR-009', name: 'Chris Anderson', email: 'chris.anderson@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-14 12:10', createdAt: '2024-01-09' },
        { userId: 'USR-010', name: 'Amy Martinez', email: 'amy.martinez@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-15 09:30', createdAt: '2024-01-10' },
    ];
    
    const usersTableActions = [
        {
            label: 'View',
            icon: '/icons/eye.svg',
            onClick: (row: TableData) => navigate(`/user-management/users/${row.userId}`),
        },
        {
            label: 'Edit',
            icon: '/icons/edit.svg',
            onClick: (row: TableData) => navigate(`/user-management/users/${row.userId}/edit`),
        },
    ];

    // Dummy data for Recent Activities table
    const activitiesTableColumns = [
        { key: 'activity', label: 'Activity' },
        { key: 'user', label: 'User' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
    ];
    
    const activitiesTableData = [
        { activity: 'User Login', user: 'John Doe', date: '2024-01-15 10:30', status: 'Success' },
        { activity: 'Role Updated', user: 'Jane Smith', date: '2024-01-15 09:15', status: 'Completed' },
        { activity: 'User Created', user: 'New User', date: '2024-01-15 08:45', status: 'Pending' },
        { activity: 'Password Reset', user: 'Mike Johnson', date: '2024-01-14 16:20', status: 'Success' },
        { activity: 'Account Suspended', user: 'Emma Taylor', date: '2024-01-14 14:30', status: 'Completed' },
    ];

    // Dummy data for User Registration Statistics
    const [statsRange, setStatsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    const userTypes = [
        { name: 'Admin Users', color: '#e74c3c' },
        { name: 'Manager Users', color: '#f39c12' },
        { name: 'Regular Users', color: '#3498db' },
        { name: 'Guest Users', color: '#9b59b6' },
    ];
    
    const months = ['Jan 2024', 'Dec 2023', 'Nov 2023', 'Oct 2023', 'Sep 2023', 'Aug 2023', 'Jul 2023', 'Jun 2023', 'May 2023'];
    const userSeries = userTypes.map((type) => ({
        name: type.name,
        data: months.map(() => Math.floor(Math.random() * 50)),
    }));
    const userColors = userTypes.map(type => type.color);

    // Header component
    const headerComponent = createHeaderComponent(
        'User Management',
        'Manage users, roles, and permissions',
        `Total: ${userStats[0].value} Users`
    );

    // Actions component
    const actionsComponent = createActionsComponent([
        { label: 'Export Users', onClick: () => console.log('Exporting users...'), variant: 'outline' },
        { label: 'Add User', onClick: () => navigate('/user-management/add-user'), variant: 'primary' },
        { label: 'Bulk Actions', onClick: () => console.log('Bulk actions...'), variant: 'outline' }
    ]);

    // Footer component
    const footerComponent = createFooterComponent({
        id: 'User Management ID: USR-001',
        version: '2.1.0',
        supportLink: '#'
    });

    // User Statistics Section
    const userStatsSection: Section = {
        id: 'user-stats',
        component: (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* User Statistics */}
                <div className="bg-primary-lightest dark:bg-primary-dark p-6 flex flex-col gap-4 md:col-span-3 col-span-1 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold m-0">User Statistics</h2>
                        <div className="flex items-center gap-2" style={{ opacity: 0, pointerEvents: 'none' }}>
                            <TimeRangeSelector
                                availableTimeRanges={['Daily', 'Monthly']}
                                selectedTimeRange={view}
                                handleTimeRangeChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {userStats.map((card, idx) => (
                            <Card
                                key={idx}
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                subtitle1={card.subtitle1}
                                onValueClick={() => {
                                    switch (card.title) {
                                        case 'Total Users':
                                            navigate('/user-management/statistics/total-users');
                                            break;
                                        case 'Active Users':
                                            navigate('/user-management/statistics/active-users');
                                            break;
                                        case 'Inactive Users':
                                            navigate('/user-management/statistics/inactive-users');
                                            break;
                                        case 'Admin Users':
                                            navigate('/user-management/statistics/admin-users');
                                            break;
                                        case 'Regular Users':
                                            navigate('/user-management/statistics/regular-users');
                                            break;
                                        case 'Users with Roles':
                                            navigate('/user-management/statistics/users-with-roles');
                                            break;
                                        case 'Users without Roles':
                                            navigate('/user-management/statistics/users-without-roles');
                                            break;
                                        case 'Last 30 Days':
                                            navigate('/user-management/statistics/recent-users');
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* User Activity */}
                <div className="bg-primary-lightest dark:bg-primary-dark p-6 flex flex-col gap-4 md:col-span-2 col-span-1 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">User Activity</h2>
                        <TimeRangeSelector
                            availableTimeRanges={['Daily', 'Monthly']}
                            selectedTimeRange={view}
                            handleTimeRangeChange={(v) => setView(v as 'Daily' | 'Monthly')}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userActivityStats.map((card, idx) => (
                            <Card
                                key={idx}
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                subtitle1={card.subtitle1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    };

    // Users Table Section
    const usersTableSection: Section = {
        id: 'users-table',
        component: (
            <div className="mt-8">
                <div className="flex items-center justify-between px-0 pt-0 pb-2">
                    <h2 className="text-lg font-semibold mb-0">Users</h2>
                   
                </div>
                <div className="px-0 pb-6">
                    <Table
                        data={usersTableData}
                        columns={usersTableColumns}
                        actions={usersTableActions}
                        showActions={true}
                        searchable={true}
                        pagination={true}
                        initialRowsPerPage={10}
                        emptyMessage="No users found"
                        onRowClick={(row) => navigate(`/user-management/users/${row.userId}`)}
                    />
                </div>
            </div>
        )
    };

    // Recent Activities Section
    const recentActivitiesSection: Section = {
        id: 'recent-activities',
        component: (
            <div className="mt-8">
                <div className="flex items-center justify-between px-0 pt-0 pb-2">
                    <h2 className="text-lg font-semibold mb-0">Recent Activities</h2>
                </div>
                <div className="px-0 pb-6">
                    <Table
                        data={activitiesTableData}
                        columns={activitiesTableColumns}
                        showActions={false}
                        searchable={true}
                        pagination={true}
                        initialRowsPerPage={10}
                        emptyMessage="No activities found"
                    />
                </div>
            </div>
        )
    };

    // User Registration Statistics Chart Section
    const userRegistrationStatsSection: Section = {
        id: 'user-registration-stats',
        component: (
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Statistics</h2>
                <div className="gap-2 bg-primary-lightest p-4 rounded-2xl flex items-center justify-between">
                    <div className="font-semibold">User Registration Statistics <span className="text-sm font-normal">(Last 12 Months)</span></div>
                    <div className="flex items-center gap-2">
                        <TimeRangeSelector
                            availableTimeRanges={['Monthly', 'Yearly']}
                            selectedTimeRange={statsRange}
                            handleTimeRangeChange={v => setStatsRange(v as 'Monthly' | 'Yearly')}
                        />
                        <img src="/icons/download-app.svg" alt="Download" className="w-6 h-6 cursor-pointer" />
                    </div>
                </div>
                <BarChart
                    xAxisData={months}
                    seriesData={userSeries}
                    seriesColors={userColors}
                    height={300}
                    showLegendInteractions={true}
                    timeRange={statsRange}
                />
            </div>
        )
    };

    return (
        <Page
            layout="single-column"
            sections={[userStatsSection, usersTableSection, recentActivitiesSection, userRegistrationStatsSection]}
            header={headerComponent}
            actions={actionsComponent}
            footer={footerComponent}
            className="space-y-6 bg-surface p-2"
            sectionClassName=""
        />
    );
};

export default Users; 
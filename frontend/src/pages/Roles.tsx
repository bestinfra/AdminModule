import React, { useState } from 'react';
import Card from '@components/global/Card';
import TimeRangeSelector from '@components/global/TimeRangeSelector';
import Table from '@components/global/Table';
import type { TableData } from '@components/global/Table';
import BarChart from '../graphs/BarChart';
import { useNavigate } from 'react-router-dom';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import { 
    createHeaderComponent, 
    createActionsComponent, 
    createFooterComponent
} from '@components/global/PageComponents';

const Roles: React.FC = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<'Daily' | 'Monthly'>('Daily');
    
    const roleStats = [
        { title: 'Total Roles', value: 12, icon: '/icons/roles.svg', subtitle1: 'Defined Roles' },
        { title: 'Active Roles', value: 10, icon: '/icons/active-roles.svg', subtitle1: '83.33% of Total Roles' },
        { title: 'Inactive Roles', value: 2, icon: '/icons/inactive-roles.svg', subtitle1: '16.67% of Total Roles' },
        { title: 'System Roles', value: 4, icon: '/icons/system-roles.svg', subtitle1: '33.33% of Total Roles' },
        { title: 'Custom Roles', value: 8, icon: '/icons/custom-roles.svg', subtitle1: '66.67% of Total Roles' },
        { title: 'Roles with Users', value: 9, icon: '/icons/roles-with-users.svg', subtitle1: '75.00% of Total Roles' },
        { title: 'Empty Roles', value: 3, icon: '/icons/empty-roles.svg', subtitle1: '25.00% of Total Roles' },
        { title: 'Last 30 Days', value: 2, icon: '/icons/recent-roles.svg', subtitle1: 'New Roles Created' },
    ];

    const permissionStats = [
        { title: 'Total Permissions', value: '156', icon: '/icons/permissions.svg', subtitle1: 'Available Permissions' },
        { title: 'Assigned Permissions', value: '142', icon: '/icons/assigned-permissions.svg', subtitle1: '91.03% Assigned' },
        { title: 'Unassigned Permissions', value: '14', icon: '/icons/unassigned-permissions.svg', subtitle1: '8.97% Unassigned' },
        { title: 'Read Permissions', value: '89', icon: '/icons/read-permissions.svg', subtitle1: '57.05% of Total' },
        { title: 'Write Permissions', value: '67', icon: '/icons/write-permissions.svg', subtitle1: '42.95% of Total' },
        { title: 'Admin Permissions', value: '23', icon: '/icons/admin-permissions.svg', subtitle1: '14.74% of Total' },
    ];

    // Dummy data for Roles table
    const rolesTableColumns = [
        { key: 'roleId', label: 'Role ID' },
        { key: 'name', label: 'Role Name' },
        { key: 'description', label: 'Description' },
        { key: 'usersCount', label: 'Users Count' },
        { key: 'permissionsCount', label: 'Permissions' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Created At' },
    ];
    
    const rolesTableData = [
        { roleId: 'ROLE-001', name: 'Super Admin', description: 'Full system access and control', usersCount: 2, permissionsCount: 156, status: 'Active', createdAt: '2024-01-01' },
        { roleId: 'ROLE-002', name: 'Admin', description: 'Administrative access with limited control', usersCount: 6, permissionsCount: 142, status: 'Active', createdAt: '2024-01-02' },
        { roleId: 'ROLE-003', name: 'Manager', description: 'Department management and oversight', usersCount: 15, permissionsCount: 89, status: 'Active', createdAt: '2024-01-03' },
        { roleId: 'ROLE-004', name: 'User', description: 'Standard user access', usersCount: 125, permissionsCount: 45, status: 'Active', createdAt: '2024-01-04' },
        { roleId: 'ROLE-005', name: 'Guest', description: 'Limited read-only access', usersCount: 8, permissionsCount: 12, status: 'Active', createdAt: '2024-01-05' },
        { roleId: 'ROLE-006', name: 'Analyst', description: 'Data analysis and reporting access', usersCount: 12, permissionsCount: 67, status: 'Active', createdAt: '2024-01-06' },
        { roleId: 'ROLE-007', name: 'Support', description: 'Customer support access', usersCount: 5, permissionsCount: 34, status: 'Active', createdAt: '2024-01-07' },
        { roleId: 'ROLE-008', name: 'Auditor', description: 'Audit and compliance access', usersCount: 3, permissionsCount: 78, status: 'Active', createdAt: '2024-01-08' },
        { roleId: 'ROLE-009', name: 'Developer', description: 'Development and testing access', usersCount: 0, permissionsCount: 23, status: 'Inactive', createdAt: '2024-01-09' },
        { roleId: 'ROLE-010', name: 'Tester', description: 'Testing and quality assurance access', usersCount: 0, permissionsCount: 18, status: 'Inactive', createdAt: '2024-01-10' },
    ];
    
    const rolesTableActions = [
        {
            label: 'View',
            icon: '/icons/eye.svg',
            onClick: (row: TableData) => navigate(`/user-management/roles/${row.roleId}`),
        },
        {
            label: 'Edit',
            icon: '/icons/edit.svg',
            onClick: (row: TableData) => navigate(`/user-management/roles/${row.roleId}/edit`),
        },
        {
            label: 'Permissions',
            icon: '/icons/permissions.svg',
            onClick: (row: TableData) => navigate(`/user-management/roles/${row.roleId}/permissions`),
        },
    ];

    // Dummy data for Role Assignments table
    const assignmentsTableColumns = [
        { key: 'role', label: 'Role' },
        { key: 'user', label: 'User' },
        { key: 'assignedBy', label: 'Assigned By' },
        { key: 'assignedAt', label: 'Assigned At' },
        { key: 'status', label: 'Status' },
    ];
    
    const assignmentsTableData = [
        { role: 'Super Admin', user: 'John Doe', assignedBy: 'System', assignedAt: '2024-01-01 10:00', status: 'Active' },
        { role: 'Admin', user: 'Jane Smith', assignedBy: 'John Doe', assignedAt: '2024-01-02 14:30', status: 'Active' },
        { role: 'Manager', user: 'Mike Johnson', assignedBy: 'Jane Smith', assignedAt: '2024-01-03 09:15', status: 'Active' },
        { role: 'User', user: 'Sarah Wilson', assignedBy: 'Mike Johnson', assignedAt: '2024-01-04 16:45', status: 'Active' },
        { role: 'Analyst', user: 'David Brown', assignedBy: 'Jane Smith', assignedAt: '2024-01-05 11:20', status: 'Active' },
    ];

    // Dummy data for Role Usage Statistics
    const [statsRange, setStatsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    const roleTypes = [
        { name: 'Super Admin', color: '#e74c3c' },
        { name: 'Admin', color: '#f39c12' },
        { name: 'Manager', color: '#3498db' },
        { name: 'User', color: '#9b59b6' },
        { name: 'Guest', color: '#1abc9c' },
    ];
    
    const months = ['Jan 2024', 'Dec 2023', 'Nov 2023', 'Oct 2023', 'Sep 2023', 'Aug 2023', 'Jul 2023', 'Jun 2023', 'May 2023'];
    const roleSeries = roleTypes.map((type) => ({
        name: type.name,
        data: months.map(() => Math.floor(Math.random() * 30)),
    }));
    const roleColors = roleTypes.map(type => type.color);

    // Header component
    const headerComponent = createHeaderComponent(
        'Role Management',
        'Manage user roles and permissions',
        `Total: ${roleStats[0].value} Roles`
    );

    // Actions component
    const actionsComponent = createActionsComponent([
        { label: 'Export Roles', onClick: () => console.log('Exporting roles...'), variant: 'outline' },
        { label: 'Add Role', onClick: () => navigate('/user-management/add-role'), variant: 'primary' },
        { label: 'Bulk Actions', onClick: () => console.log('Bulk actions...'), variant: 'outline' }
    ]);

    // Footer component
    const footerComponent = createFooterComponent({
        id: 'Role Management ID: ROLE-001',
        version: '2.1.0',
        supportLink: '#'
    });

    // Role Statistics Section
    const roleStatsSection: Section = {
        id: 'role-stats',
        component: (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Role Statistics */}
                <div className="bg-[var(--color-primary-lightest)] dark:bg-primary-dark p-6 flex flex-col gap-4 md:col-span-3 col-span-1 rounded-[var(--radius-2xl)]">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold m-0">Role Statistics</h2>
                        <div className="flex items-center gap-2" style={{ opacity: 0, pointerEvents: 'none' }}>
                            <TimeRangeSelector
                                availableTimeRanges={['Daily', 'Monthly']}
                                selectedTimeRange={view}
                                handleTimeRangeChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {roleStats.map((card, idx) => (
                            <Card
                                key={idx}
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                subtitle1={card.subtitle1}
                                onValueClick={() => {
                                    switch (card.title) {
                                        case 'Total Roles':
                                            navigate('/user-management/statistics/total-roles');
                                            break;
                                        case 'Active Roles':
                                            navigate('/user-management/statistics/active-roles');
                                            break;
                                        case 'Inactive Roles':
                                            navigate('/user-management/statistics/inactive-roles');
                                            break;
                                        case 'System Roles':
                                            navigate('/user-management/statistics/system-roles');
                                            break;
                                        case 'Custom Roles':
                                            navigate('/user-management/statistics/custom-roles');
                                            break;
                                        case 'Roles with Users':
                                            navigate('/user-management/statistics/roles-with-users');
                                            break;
                                        case 'Empty Roles':
                                            navigate('/user-management/statistics/empty-roles');
                                            break;
                                        case 'Last 30 Days':
                                            navigate('/user-management/statistics/recent-roles');
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* Permission Statistics */}
                <div className="bg-[var(--color-primary-lightest)] dark:bg-primary-dark p-6 flex flex-col gap-4 md:col-span-2 col-span-1 rounded-[var(--radius-2xl)]">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Permission Statistics</h2>
                        <TimeRangeSelector
                            availableTimeRanges={['Daily', 'Monthly']}
                            selectedTimeRange={view}
                            handleTimeRangeChange={(v) => setView(v as 'Daily' | 'Monthly')}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {permissionStats.map((card, idx) => (
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

    // Roles Table Section
    const rolesTableSection: Section = {
        id: 'roles-table',
        component: (
            <div className="mt-8">
                <div className="flex items-center justify-between px-0 pt-0 pb-2">
                    <h2 className="text-lg font-semibold mb-0">Roles</h2>
                </div>
                <div className="px-0 pb-6">
                    <Table
                        data={rolesTableData}
                        columns={rolesTableColumns}
                        actions={rolesTableActions}
                        showActions={true}
                        searchable={true}
                        pagination={true}
                        initialRowsPerPage={10}
                        emptyMessage="No roles found"
                        onRowClick={(row) => navigate(`/user-management/roles/${row.roleId}`)}
                    />
                </div>
            </div>
        )
    };

    // Role Assignments Section
    const roleAssignmentsSection: Section = {
        id: 'role-assignments',
        component: (
            <div className="mt-8">
                <div className="flex items-center justify-between px-0 pt-0 pb-2">
                    <h2 className="text-lg font-semibold mb-0">Recent Role Assignments</h2>
                </div>
                <div className="px-0 pb-6">
                    <Table
                        data={assignmentsTableData}
                        columns={assignmentsTableColumns}
                        showActions={false}
                        searchable={true}
                        pagination={true}
                        initialRowsPerPage={10}
                        emptyMessage="No assignments found"
                    />
                </div>
            </div>
        )
    };

    // Role Usage Statistics Chart Section
    const roleUsageStatsSection: Section = {
        id: 'role-usage-stats',
        component: (
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Statistics</h2>
                <div className="gap-2 bg-[var(--color-primary-lightest)] p-4 rounded-[var(--radius-2xl)] flex items-center justify-between">
                    <div className="font-semibold">Role Usage Statistics <span className="text-sm font-normal">(Last 12 Months)</span></div>
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
                    seriesData={roleSeries}
                    seriesColors={roleColors}
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
            sections={[roleStatsSection, rolesTableSection, roleAssignmentsSection, roleUsageStatsSection]}
            header={headerComponent}
            actions={actionsComponent}
            footer={footerComponent}
            className="space-y-6 bg-[var(--color-surface)] p-2"
            sectionClassName=""
        />
    );
};

export default Roles; 
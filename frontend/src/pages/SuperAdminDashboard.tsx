import React, { useState } from 'react';
import { PieChart, LineChart } from '../graphs';
import Card from '@components/global/Card';
import Table from '@components/global/Table';
import TimeRangeSelector from '@components/global/TimeRangeSelector';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';
import type { TableData, Column } from '@components/global/Table';

interface TableAction {
    label: string;
    onClick: (row: TableData) => void;
    icon: string;
}

const SuperAdminDashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState('Monthly');
    const [projectsView, setProjectsView] = useState('All');

    
    const timeRangeOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const projectsViewOptions = ['All', 'Active', 'Inactive', 'Maintenance'];

    // Host Projects Statistics
    const projectStats = [
        {
            title: 'Total Host Projects',
            value: '24',
            icon: '/icons/apps-icon.svg',
            subtitle1: '18 Active',
            subtitle2: '6 Inactive',
            showTrend: true,
            comparisonValue: 12.5,
        },
        {
            title: 'Active Users',
            value: '1,847',
            icon: '/icons/total-users.svg',
            subtitle1: '1,234 Online',
            subtitle2: '613 Offline',
            showTrend: true,
            comparisonValue: 8.3,
        },
        {
            title: 'System Health',
            value: '98.7%',
            icon: '/icons/server.svg',
            subtitle1: 'All systems operational',
            subtitle2: '99.2% uptime',
            showTrend: true,
            comparisonValue: 0.5,
        },
        {
            title: 'Revenue',
            value: '₹15,67,890',
            icon: '/icons/total-revenue.svg',
            subtitle1: '₹45,230 Today',
            subtitle2: '12.8% growth',
            showTrend: true,
            comparisonValue: 15.2,
        },
    ];

    // Host Projects List
    const hostProjects = [
        {
            id: 'PROJ-001',
            name: 'Smart Energy Portal',
            domain: 'energy.example.com',
            status: 'Active',
            users: 234,
            lastActivity: '2 mins ago',
            version: '2.1.0',
            uptime: '99.9%',
        },
        {
            id: 'PROJ-002',
            name: 'Water Management System',
            domain: 'water.example.com',
            status: 'Active',
            users: 156,
            lastActivity: '5 mins ago',
            version: '1.8.3',
            uptime: '99.5%',
        },
        {
            id: 'PROJ-003',
            name: 'Billing Management',
            domain: 'billing.example.com',
            status: 'Maintenance',
            users: 89,
            lastActivity: '1 hour ago',
            version: '2.0.1',
            uptime: '95.2%',
        },
        {
            id: 'PROJ-004',
            name: 'Customer Portal',
            domain: 'customer.example.com',
            status: 'Active',
            users: 445,
            lastActivity: '1 min ago',
            version: '3.2.1',
            uptime: '99.8%',
        },
        {
            id: 'PROJ-005',
            name: 'Analytics Dashboard',
            domain: 'analytics.example.com',
            status: 'Inactive',
            users: 0,
            lastActivity: '2 days ago',
            version: '1.5.0',
            uptime: '0%',
        },
    ];

    const projectColumns: Column[] = [
        { key: 'name', label: 'Project Name' },
        { key: 'domain', label: 'Domain' },
        { 
            key: 'status', 
            label: 'Status',
            render: (value: string | number | boolean | null | undefined | number | boolean | null | undefined) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'Active' ? 'bg-secondary-light text-secondary' :
                    value === 'Maintenance' ? 'bg-warning-alt text-warning' :
                    'bg-danger-light text-danger'
                }`}>
                    {String(value)}
                </span>
            )
        },
        { key: 'users', label: 'Users' },
        { key: 'lastActivity', label: 'Last Activity' },
        { key: 'version', label: 'Version' },
        { key: 'uptime', label: 'Uptime' },
    ];

    // System Performance Data
    const performanceData = [
        { value: 18, name: 'Active' },
        { value: 3, name: 'Maintenance' },
        { value: 3, name: 'Inactive' },
    ];

    // User Activity Chart Data
    const userActivityData = [
        1240, 1350, 1180, 1420, 1580, 1320, 1450, 1380, 1520, 1610, 1480, 1550,
        1680, 1720, 1590, 1650, 1780, 1820, 1750, 1900, 1850, 1920, 1980, 2100,
        2050, 2180, 2120, 2200, 2250, 2180
    ];
    const userActivityLabels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);

    // Recent System Events
    const systemEvents = [
        {
            id: 'EVT-001',
            type: 'Deploy',
            project: 'Smart Energy Portal',
            message: 'Version 2.1.0 deployed successfully',
            timestamp: '2 mins ago',
            severity: 'Success',
        },
        {
            id: 'EVT-002',
            type: 'Alert',
            project: 'Water Management System',
            message: 'High memory usage detected',
            timestamp: '15 mins ago',
            severity: 'Warning',
        },
        {
            id: 'EVT-003',
            type: 'Maintenance',
            project: 'Billing Management',
            message: 'Scheduled maintenance started',
            timestamp: '1 hour ago',
            severity: 'Info',
        },
        {
            id: 'EVT-004',
            type: 'Error',
            project: 'Analytics Dashboard',
            message: 'Database connection failed',
            timestamp: '2 hours ago',
            severity: 'Error',
        },
    ];

    const eventColumns: Column[] = [
        { key: 'type', label: 'Type' },
        { key: 'project', label: 'Project' },
        { key: 'message', label: 'Message' },
        { key: 'timestamp', label: 'Time' },
        { 
            key: 'severity', 
            label: 'Severity',
            render: (value: string | number | boolean | null | undefined | number | boolean | null | undefined) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'Success' ? 'bg-secondary-light text-secondary' :
                    value === 'Warning' ? 'bg-warning-alt text-warning' :
                    value === 'Info' ? 'bg-accent-light text-accent' :
                    'bg-danger-light text-danger'
                }`}>
                    {String(value)}
                </span>
            )
        },
    ];

    const tableActions: TableAction[] = [
        { label: 'Edit', onClick: (row: TableData) => console.log('Edit:', row), icon: '/icons/edit.svg' },
        { label: 'View', onClick: (row: TableData) => console.log('View:', row), icon: '/icons/view.svg' },
        { label: 'Settings', onClick: (row: TableData) => console.log('Settings:', row), icon: '/icons/settings.svg' },
    ];

    // Header component
    const headerComponent = (
        <PageHeader
            title="Super Admin Dashboard"
            onBackClick={() => window.history.back()}
            backButtonText="Back to Dashboard"
            buttonsLabel="Add Project"
            variant="primary"
            onClick={() => console.log('Adding new project...')}
            showMenu={true}
            showDropdown={true}
            menuItems={[
                { id: 'create-project', label: 'Create Project', link: '/apps'}
            ]}
            onMenuItemClick={(itemId) => {
                console.log(`Filter by: ${itemId}`);
                // Apply filters based on selection
                if (itemId === 'active' || itemId === 'inactive' || itemId === 'maintenance' || itemId === 'all') {
                    setProjectsView(itemId === 'all' ? 'All' : itemId.charAt(0).toUpperCase() + itemId.slice(1));
                }
                // TODO: Implement filtering logic for other menu items
            }}
        />
    );

    // Overview Statistics Section
    const overviewSection: Section = {
        id: 'overview-stats',
        component: (
            <div className="bg-white dark:bg-primary-dark dark:border-dark-border rounded-xl">
                {/* <div className="flex justify-between items-center gap-2 mb-6">
                    <h2 className="text-lg font-semibold">System Overview</h2>
                    <TimeRangeSelector
                        availableTimeRanges={timeRangeOptions}
                        selectedTimeRange={timeRange}
                        handleTimeRangeChange={setTimeRange}
                    />
                </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {projectStats.map((card, idx) => (
                        <Card
                            key={idx}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}    
                            subtitle1={card.subtitle1}
                            subtitle2={card.subtitle2}
                            showTrend={card.showTrend}
                            comparisonValue={card.comparisonValue}
                        />
                    ))}
                </div>
            </div>
        )
    };

    // Host Projects Section
    const hostProjectsSection: Section = {
        id: 'host-projects',
        component: (
            <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl">
                <div className="flex justify-between items-center gap-2 bg-primary-lightest dark:bg-primary-dark-light rounded-t-xl px-6 py-4">
                    <h2 className="text-lg font-semibold">Host Projects</h2>
                    <div className="flex items-center gap-2">
                        <TimeRangeSelector
                            availableTimeRanges={projectsViewOptions}
                            selectedTimeRange={projectsView}
                            handleTimeRangeChange={setProjectsView}
                        />
                    </div>
                </div>
                <div className="p-6">
                    <Table
                        data={hostProjects}
                        columns={projectColumns}
                        loading={false}
                        searchable={true}
                        pagination={true}
                        showActions={true}
                        actions={tableActions}
                    />
                </div>
            </div>
        )
    };

    // Analytics Section
    const analyticsSection: Section = {
        id: 'analytics',
        component: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Status Distribution */}
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl">
                    <div className="bg-primary-lightest dark:bg-primary-dark-light rounded-t-xl px-6 py-4">
                        <h2 className="text-lg font-semibold">Project Status Distribution</h2>
                    </div>
                    <div className="p-6">
                        <PieChart
                            data={performanceData}
                            height={250}
                            showNoDataMessage={false}
                            title=""
                        />
                    </div>
                </div>

                {/* User Activity Trends */}
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl">
                    <div className="bg-primary-lightest dark:bg-primary-dark-light rounded-t-xl px-6 py-4">
                        <h2 className="text-lg font-semibold">User Activity Trends</h2>
                    </div>
                    <div className="p-6" style={{ height: '250px' }}>
                        <LineChart
                            data={userActivityData}
                            xAxisData={userActivityLabels}
                            showXAxisLabel={false}
                        />
                    </div>
                </div>
            </div>
        )
    };
    // System Events Section
    const systemEventsSection: Section = {
        id: 'system-events',
        component: (
            <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl">
                <div className="bg-primary-lightest dark:bg-primary-dark-light rounded-t-xl px-6 py-4">
                    <h2 className="text-lg font-semibold">Recent System Events</h2>
                </div>
                <div className="p-6">
                    <Table
                        data={systemEvents}
                        columns={eventColumns}
                        loading={false}
                        searchable={true}
                        pagination={false}
                        showActions={false}
                        actions={[
                            { label: 'View', onClick: (row) => console.log('View:', row), icon: '/icons/view.svg' },
                            { label: 'Details', onClick: (row) => console.log('Details:', row), icon: '/icons/info.svg' },
                        ]}
                    />
                </div>
            </div>
        )
    };

    return (
        <Page
            layout="single-column"
            sections={[overviewSection, hostProjectsSection, analyticsSection, systemEventsSection]}
            header={headerComponent}
            className=""
        />
    );
};

export default SuperAdminDashboard; 
import React from 'react';
import { LineChart, BarChart, PieChart, RadarChart } from '../graphs';
import Card from '../components/global/Card';
import Table from '../components/global/Table';
import RecentActivities from '../components/global/RecentActivities';
import Page from '../components/global/Page';
import { createHeaderComponent, createActionsComponent } from '../components/global/PageComponents';

const Dashboard: React.FC = () => {
    // Sample data for summary cards
    const summaryCards = [
        {
            title: 'Total Tickets',
            value: '2,847',
            icon: '/icons/support-tickets.svg',
            showTrend: true,
            comparisonValue: 12.5,
            subtitle1: 'This month',
            subtitle2: '+12.5% from last month'
        },
        {
            title: 'Active Users',
            value: '1,234',
            icon: '/icons/active-users.svg',
            showTrend: true,
            comparisonValue: 8.2,
            subtitle1: 'Currently online',
            subtitle2: '+8.2% from yesterday'
        },
        {
            title: 'Revenue',
            value: '$45,678',
            icon: '/icons/total-revenue.svg',
            showTrend: true,
            comparisonValue: -3.1,
            subtitle1: 'This month',
            subtitle2: '-3.1% from last month'
        },
        {
            title: 'System Health',
            value: '98.5%',
            icon: '/icons/server.svg',
            showTrend: false,
            subtitle1: 'Uptime',
            subtitle2: 'Last 30 days'
        }
    ];

    // Sample data for recent activities
    const recentActivities = [
        {
            icon: '/icons/support-tickets.svg',
            description: 'New ticket #TKT-2024-001 created by John Doe',
            timestamp: '2 minutes ago'
        },
        {
            icon: '/icons/check-circle.svg',
            description: 'Ticket #TKT-2024-000 resolved by Admin User',
            timestamp: '15 minutes ago'
        },
        {
            icon: '/icons/user-add.svg',
            description: 'New user account created for Jane Smith',
            timestamp: '1 hour ago'
        },
        {
            icon: '/icons/payment.svg',
            description: 'Payment received for invoice #INV-2024-005',
            timestamp: '2 hours ago'
        },
        {
            icon: '/icons/alert-triggered.svg',
            description: 'System alert: High CPU usage detected',
            timestamp: '3 hours ago'
        },
        {
            icon: '/icons/update.svg',
            description: 'System update completed successfully',
            timestamp: '4 hours ago'
        }
    ];

    // Sample data for recent tickets table
    const recentTickets = [
        {
            id: 'TKT-2024-001',
            title: 'Login Issue',
            status: 'Open',
            priority: 'High',
            assignedTo: 'John Admin',
            createdAt: '2024-01-15 10:30',
            category: 'Technical'
        },
        {
            id: 'TKT-2024-002',
            title: 'Payment Processing Error',
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'Sarah Tech',
            createdAt: '2024-01-15 09:15',
            category: 'Billing'
        },
        {
            id: 'TKT-2024-003',
            title: 'Feature Request',
            status: 'Pending',
            priority: 'Low',
            assignedTo: 'Mike Dev',
            createdAt: '2024-01-15 08:45',
            category: 'Enhancement'
        },
        {
            id: 'TKT-2024-004',
            title: 'Database Connection Issue',
            status: 'Resolved',
            priority: 'High',
            assignedTo: 'John Admin',
            createdAt: '2024-01-14 16:20',
            category: 'Technical'
        },
        {
            id: 'TKT-2024-005',
            title: 'User Account Locked',
            status: 'Closed',
            priority: 'Medium',
            assignedTo: 'Sarah Tech',
            createdAt: '2024-01-14 14:10',
            category: 'Account'
        }
    ];

    // Table columns configuration
    const ticketColumns = [
        { key: 'id', label: 'Ticket ID' },
        { key: 'title', label: 'Title' },
        { 
            key: 'status', 
            label: 'Status',
            render: (value: string | number | boolean | null | undefined) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'Open' ? 'bg-warning text-white' :
                    value === 'In Progress' ? 'bg-accent text-white' :
                    value === 'Resolved' ? 'bg-secondary text-white' :
                    value === 'Closed' ? 'bg-neutral text-white' :
                    'bg-neutral-light text-neutral-darker'
                }`}>
                    {String(value)}
                </span>
            )
        },
        { 
            key: 'priority', 
            label: 'Priority',
            render: (value: string | number | boolean | null | undefined) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'High' ? 'bg-danger text-white' :
                    value === 'Medium' ? 'bg-warning text-white' :
                    'bg-secondary text-white'
                }`}>
                    {String(value)}
                </span>
            )
        },
        { key: 'assignedTo', label: 'Assigned To' },
        { key: 'category', label: 'Category' },
        { key: 'createdAt', label: 'Created' }
    ];

    // Create dashboard sections
    const dashboardSections = [
        {
            id: 'summary-cards',
            component: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaryCards.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            showTrend={card.showTrend}
                            comparisonValue={card.comparisonValue}
                            subtitle1={card.subtitle1}
                            subtitle2={card.subtitle2}
                        />
                    ))}
                </div>
            )
        },
        {
            id: 'ticket-trends-chart',
            component: (
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6">
                    <LineChart
                        title="Ticket Trends (Last 7 Days)"
                        data={[150, 230, 224, 218, 135, 147, 260]}
                        xAxisData={[
                            'Mon',
                            'Tue',
                            'Wed',
                            'Thu',
                            'Fri',
                            'Sat',
                            'Sun',
                        ]}
                    />
                </div>
            )
        },
        {
            id: 'ticket-distribution-chart',
            component: (
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6">
                    <BarChart
                        data={[120, 200, 150, 80, 70, 110, 130]}
                        xAxisData={[
                            'Technical',
                            'Billing',
                            'Account',
                            'Feature',
                            'Bug',
                            'Support',
                            'Other',
                        ]}
                    />
                </div>
            )
        },
        {
            id: 'ticket-status-chart',
            component: (
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6">
                    <PieChart
                        title="Ticket Status Distribution"
                        data={[
                            { value: 1048, name: 'Open' },
                            { value: 735, name: 'In Progress' },
                            { value: 580, name: 'Resolved' },
                            { value: 484, name: 'Closed' },
                            { value: 300, name: 'On Hold' },
                        ]}
                    />
                </div>
            )
        },
        {
            id: 'performance-metrics-chart',
            component: (
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6">
                    <RadarChart
                        title="Support Performance Metrics"
                        indicator={[
                            { name: 'Response Time', max: 100 },
                            { name: 'Resolution Time', max: 100 },
                            { name: 'Customer Satisfaction', max: 100 },
                            { name: 'First Contact Resolution', max: 100 },
                            { name: 'Ticket Volume', max: 100 },
                            { name: 'Knowledge Base Usage', max: 100 },
                        ]}
                        data={[
                            {
                                value: [85, 75, 90, 80, 70, 65],
                                name: 'Current Performance',
                            },
                            {
                                value: [90, 85, 85, 85, 75, 70],
                                name: 'Target Performance',
                            },
                        ]}
                    />
                </div>
            )
        },
        {
            id: 'recent-activities',
            component: <RecentActivities activities={recentActivities} />
        },
        {
            id: 'recent-tickets',
            component: (
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold dark:text-white mb-4">Recent Tickets</h2>
                    <Table
                        data={recentTickets}
                        columns={ticketColumns}
                        searchable={true}
                        pagination={false}
                        showActions={false}
                        emptyMessage="No recent tickets found"
                    />
                </div>
            )
        }
    ];

    return (
        <Page
            layout="single-column"
            sections={dashboardSections}
            header={createHeaderComponent(
                'Dashboard',
                'Overview of system performance and recent activities',
                'Last updated: 2 minutes ago'
            )}
            actions={createActionsComponent([
                { label: 'Create Ticket', onClick: () => console.log('Creating ticket...'), variant: 'primary' },
                { label: 'Export Data', onClick: () => console.log('Exporting data...'), variant: 'outline' },
                { label: 'Generate Report', onClick: () => console.log('Generating report...'), variant: 'outline' }
            ])}
            className="space-y-6"
            sectionClassName="mb-4"
        />
    );
};

export default Dashboard;

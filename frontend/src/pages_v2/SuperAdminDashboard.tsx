import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageC from '@components/global/PageC';

// Brand green icon style
const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
};

const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    
    // State for time range toggle
    const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly'>('Daily');

    // KPI Cards Data
    const kpiCards = [
        {
            title: 'Total Sub-Apps',
            value: '12',
            icon: '/icons/apps-icon.svg',
            showTrend: true,
            comparisonValue: 12.5,
            subtitle1: '3 created this month',
            subtitle2: '12.5% from last month',
            onValueClick: () => navigate("/sub-apps"),
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'Active Users',
            value: '490',
            icon: '/icons/active-users.svg',
            showTrend: true,
            comparisonValue: 8.2,
            subtitle1: 'Across all applications',
            subtitle2: '8.2% from last month',
            onValueClick: () => navigate("/active-users"),
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'Daily Logins',
            value: '1,890',
            icon: '/icons/secure-logins.svg',
            showTrend: true,
            comparisonValue: 15.3,
            subtitle1: 'Last 24 hours',
            subtitle2: '15.3% from last month',
            onValueClick: () => navigate("/daily-logins"),
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'Issues',
            value: '1',
            icon: '/icons/alert-triggered.svg',
            showTrend: true,
            comparisonValue: -5,
            subtitle1: 'Needs attention',
            subtitle2: '5% from last month',
            onValueClick: () => navigate("/issues"),
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        }
    ];

    // App Usage Data - Daily
    const dailyAppUsageCards = [
        {
            title: 'Login Trends',
            value: '1,890',
            icon: '/icons/dashboard.svg',
            subtitle1: 'Today\'s total logins',
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'Active Sessions',
            value: '245',
            icon: '/icons/active-users.svg',
            subtitle1: 'Current active sessions',
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'New Users',
            value: '12',
            icon: '/icons/active-users.svg',
            subtitle1: 'Registered today',
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'App Deployments',
            value: '3',
            icon: '/icons/apps-icon.svg',
            subtitle1: 'Deployed this week',
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        }
    ];

    // App Usage Data - Monthly
    const monthlyAppUsageCards = [
        {
            title: 'Monthly Logins',
            value: '45,230',
            icon: '/icons/dashboard.svg',
            subtitle1: 'Total logins this month',
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'Avg Daily Users',
            value: '1,507',
            icon: '/icons/active-users.svg',
            subtitle1: 'Average daily active users',
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'New Registrations',
            value: '89',
            icon: '/icons/active-users.svg',
            subtitle1: 'New users this month',
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        },
        {
            title: 'App Updates',
            value: '15',
            icon: '/icons/apps-icon.svg',
            subtitle1: 'Updates deployed',
            iconStyle: ICON_FILTER_STYLE,
            bg: "bg-stat-icon-gradient",
        }
    ];

    // Get current app usage cards based on selected time range
    const getCurrentAppUsageCards = () => {
        return selectedTimeRange === 'Daily' ? dailyAppUsageCards : monthlyAppUsageCards;
    };

    // Function to handle time range change
    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range as 'Daily' | 'Monthly');
    };

    // Sub-Apps Table Data
    const subAppsTableColumns = [
        { key: 'appId', label: 'App ID' },
        { key: 'appName', label: 'App Name' },
        { key: 'status', label: 'Status' },
        { key: 'users', label: 'Active Users' },
        { key: 'lastDeployed', label: 'Last Deployed' },
        { key: 'version', label: 'Version' },
    ];

    const subAppsTableData = [
        {
            appId: 'APP-001',
            appName: 'Consumer Management',
            status: 'Active',
            users: 156,
            lastDeployed: '2024-07-25',
            version: 'v2.1.0',
        },
        {
            appId: 'APP-002',
            appName: 'Billing System',
            status: 'Active',
            users: 89,
            lastDeployed: '2024-07-24',
            version: 'v1.8.2',
        },
        {
            appId: 'APP-003',
            appName: 'DTR Monitoring',
            status: 'Active',
            users: 234,
            lastDeployed: '2024-07-23',
            version: 'v3.0.1',
        },
        {
            appId: 'APP-004',
            appName: 'Asset Management',
            status: 'Maintenance',
            users: 45,
            lastDeployed: '2024-07-22',
            version: 'v1.5.3',
        },
        {
            appId: 'APP-005',
            appName: 'Ticket System',
            status: 'Active',
            users: 67,
            lastDeployed: '2024-07-21',
            version: 'v2.0.0',
        },
    ];

    const subAppsTableActions = [
        {
            label: 'View',
            icon: '/icons/eye.svg',
            onClick: (row: any) => navigate(`/sub-app/${row.appId}`),
        },
    ];

    // Recent Activities Data
    const recentActivitiesColumns = [
        { key: 'activity', label: 'Activity' },
        { key: 'app', label: 'Application' },
        { key: 'user', label: 'User' },
        { key: 'timestamp', label: 'Timestamp' },
    ];

    const recentActivitiesData = [
        {
            activity: 'New user registered',
            app: 'Consumer Management',
            user: 'john.doe@example.com',
            timestamp: '2024-07-25 14:30',
        },
        {
            activity: 'App deployed',
            app: 'Billing System',
            user: 'admin@system.com',
            timestamp: '2024-07-25 13:15',
        },
        {
            activity: 'Configuration updated',
            app: 'DTR Monitoring',
            user: 'tech.support@example.com',
            timestamp: '2024-07-25 12:45',
        },
        {
            activity: 'Issue resolved',
            app: 'Ticket System',
            user: 'support@example.com',
            timestamp: '2024-07-25 11:20',
        },
        {
            activity: 'Backup completed',
            app: 'Asset Management',    
            user: 'system@example.com',
            timestamp: '2024-07-25 10:30',
        },
    ];

    return (
        <div className="p-2 min-h-screen">
            <PageC
                sections={[
                    // Main Statistics Cards
                    {
                        layout: {
                            type: "grid",
                            columns: 4,
                            gap: "gap-6",
                            className: '',
                        },
                        components: [
                            ...kpiCards.map((card) => ({
                                name: "Card",
                                props: {
                                    title: card.title,
                                    value: card.value,
                                    icon: card.icon,
                                    subtitle1: card.subtitle1,
                                    subtitle2: card.subtitle2,
                                    showTrend: card.showTrend,
                                    comparisonValue: card.comparisonValue,
                                    onValueClick: card.onValueClick,
                                    iconStyle: card.iconStyle,
                                    bg: card.bg,
                                },
                            })),
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default SuperAdminDashboard;

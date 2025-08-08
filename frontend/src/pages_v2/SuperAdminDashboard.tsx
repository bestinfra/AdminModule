
import { useNavigate } from 'react-router-dom';
import PageC from '@/components/global/PageC';
// import { FILTER_STYLES } from '@/contexts/FilterStyleContext';

const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    
    // KPI Cards Data - Using BRAND_GREEN (default) for all cards
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
            onValueClick: () => navigate("/Consumers"),
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
            onValueClick: () => navigate("/consumers"),
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
            onValueClick: () => navigate("consumers"),
            bg: "bg-stat-icon-gradient",
        }
    ];

    // Daily Login Trends Data for Pie Chart
    const dailyLoginTrendsData = [
        { value: 45, name: 'TGNPDCL' },
        { value: 25, name: 'GMR' },
        { value: 20, name: 'Railway' },
        { value: 10, name: 'Lkea' },
        { value: 10, name: 'NTPC' },
    ];

    // App Usage Distribution Data for Bar Chart
    const appUsageData = {
        xAxisData: [
            'TGNPDCL',
            'GMR',
            'Railway',
            'Lkea',
            'NTPC'
        ],
        seriesData: [
            {
                name: 'Active Users',
                data: [320, 180, 150, 120, 95, 80],
            },
            {
                name: 'Sessions',
                data: [450, 280, 220, 180, 140, 120],
            },
        ],
        seriesColors: [
            '#3B82F6', // Blue for Active Users
            '#10B981', // Green for Sessions
        ],
    };

    // Sample SubApp Data
    const sampleSubApp = {
        appIcon: '/images/gmr-logo.png',
        appName: 'TGNPDCL Application',
        appId: 'app_2024_001',
        subdomain: 'store.techcorp.com',
        health: 'Live' as const,
        status: 'Active' as const,
        created: '1/15/2024',
        updated: '7/28/2024',
        company: 'TechCorp Solutions',
        website: 'techcorp.com',
        category: 'Power Distribution',
        modules: [
            { name: 'DTR Dashboard', icon: '/icons/inventory.svg' },
            { name: 'Meter Details', icon: '/icons/payments.svg' },
            { name: 'Feeder Details', icon: '/icons/analytics.svg' }
        ],
        connectedApis: [
            { name: 'Payment Gateway', status: 'connected' as const },
            { name: 'Inventory System', status: 'error' as const },
            { name: 'Analytics API', status: 'connected' as const }
        ],
        meters: {
            total: 1250,
            active: 1180,
            inactive: 70
        },
        tickets: {
            count: 12,
            icon: '/icons/tickets.svg'
        }
    };
    
    return (
        <div className="">
            <PageC
                sections={[
                    // Header section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: '',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'Super Admin Dashboard',
                                    buttonsLabel: 'Create New App',
                                    variant: 'primary',
                                    onClick: () => navigate("/apps"),
                                    showMenu: true,
                                    showDropdown: true,
                                    menuItems: [
                                        { id: 'create-project', label: 'Create Project' },
                                        { id: 'export', label: 'Export Report' },
                                        { id: 'settings', label: 'Dashboard Settings' }
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        switch (itemId) {
                                            case 'create-project':
                                                navigate("/apps");
                                                break;
                                            case 'refresh':
                                                console.log('Refreshing dashboard data');
                                                break;
                                            case 'export':
                                                console.log('Exporting dashboard report');
                                                break;
                                            case 'settings':
                                                navigate("/dashboard-settings");
                                                break;
                                        }
                                    },
                                },
                            },
                        ],
                    },
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

                                    bg: card.bg,
                                },
                            })),
                        ],
                    },
                    // Charts Section - Daily Login Trends and App Usage Distribution
                    {
                        layout: {
                            type: "grid",
                            columns: 2,
                            gap: "gap-6",
                            className: 'w-full',
                            rows: [
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-1',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'Daily Login Trends',
                                                subtitle: 'User login activity across all sub-applications',
                                                className: 'border-none rounded-t-3xl',
                                            },
                                        },
                                        {
                                            name: 'PieChart',
                                            props: {
                                                data: dailyLoginTrendsData,
                                                height: 300,
                                                showNoDataMessage: false,
                                                showHeader: false,
                                                className: 'p-6',
                                                title: '',
                                                onClick: (segmentName?: string) => {
                                                    console.log('Clicked on:', segmentName);
                                                    // Navigate to specific app dashboard
                                                    if (segmentName) {
                                                        navigate(`/sub-apps/${segmentName.toLowerCase().replace(/\s+/g, '-')}`);
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-0',
                                    className: 'bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-1',
                                    columns: [
                                        {
                                            name: 'Holder',
                                            props: {
                                                title: 'App Usage Distribution',
                                                subtitle: 'Active users and sessions by sub-application',
                                                className: 'border-none rounded-t-3xl',
                                            },
                                        },
                                        {
                                            name: 'BarChart',
                                            props: {
                                                xAxisData: appUsageData.xAxisData,
                                                seriesData: appUsageData.seriesData,
                                                seriesColors: appUsageData.seriesColors,
                                                height: '350px',
                                                showHeader: false,
                                                showDownloadButton: true,
                                                showViewToggle: true,
                                                viewToggleOptions: ['Graph', 'Table'],
                                                showTableView: true,
                                                ariaLabel: 'App usage distribution chart',
                                                yAxisMax: 500,
                                                yAxisStep: 100,
                                                onDownload: () => {
                                                    console.log('Downloading app usage data');
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // SubApp Panel Section
                    {
                        layout: {
                            type: "grid",
                            columns: 2,
                            gap: "gap-6",
                            className: 'w-full',
                            rows: [
                                {
                                    layout: "grid",
                                    gap: "gap-6",
                                    gridColumns: 2,
                                    gridRows: 1,
                                    span: { col: 2, row: 1 },
                                    columns: [
                                        {
                                            name: "SubappPanel",
                                            props: sampleSubApp,
                                        },
                                        {
                                            name: "SubappPanel",
                                            props: sampleSubApp,
                                        }
                                    ]
                                }
                            ]
                        },
                    },
                ]}
            />
        </div>
    );
};

export default SuperAdminDashboard;

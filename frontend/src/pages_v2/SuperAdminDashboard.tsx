
import { useNavigate } from 'react-router-dom';
import PageC from '@/components/global/PageC';

// Brand green icon style
const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
};

const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    
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

    // Sample SubApp Data
    const sampleSubApp = {
        appIcon: '/icons/app.svg',
        appName: 'E-Commerce Platform',
        appId: 'app_2024_001',
        subdomain: 'store.techcorp.com',
        health: 'Live' as const,
        status: 'Active' as const,
        created: '1/15/2024',
        updated: '7/28/2024',
        company: 'TechCorp Solutions',
        website: 'techcorp.com',
        category: 'E-Commerce',
        modules: [
            { name: 'Inventory', icon: '/icons/inventory.svg' },
            { name: 'Payments', icon: '/icons/payments.svg' },
            { name: 'Analytics', icon: '/icons/analytics.svg' }
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
                    // SubApp Panel Section
                    {
                        layout: {
                            type: "grid",
                            columns:2,
                            gap: "gap-6",
                            className:'w-full mt-6',
                            rows: [
                                {
                                  layout:"grid",
                                  gap:"gap-6",
                                  gridColumns:2,
                                  gridRows:1,
                                  span:{col:2,row:1},
                                  columns:[{
                                    name:"SubappPanel",
                                    props:sampleSubApp,
                                  },
                                  {
                                    name:"SubappPanel",
                                    props:sampleSubApp,
                                  }
                                ]
                                }
                            ]
                        },
                       
                        // components: [
                        //     {
                        //         name: "SubappPanel",
                        //         props: sampleSubApp,
                        //         align: "center"
                        //     }
                        // ],
                    },
                ]}
            />
        </div>
    );
};

export default SuperAdminDashboard;

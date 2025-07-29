import React from 'react';
import Page from '@components/global/PageC';
import { LineChart, BarChart } from '@/graphs';
import { exportChartData } from '@/utils/excelExport';

const SuperAdminDashboard: React.FC = () => {
    // KPI Cards Data
    const kpiCards = [
        {
            title: 'Total Sub-Apps',
            value: '12',
            icon: '/icons/apps-icon.svg',
            showTrend: true,
            comparisonValue: 12.5,
            subtitle1: '3 created this month',
            subtitle2: '12.5% from last month'
        },
        {
            title: 'Active Users',
            value: '490',
            icon: '/icons/active-users.svg',
            showTrend: true,
            comparisonValue: 8.2,
            subtitle1: 'Across all applications',
            subtitle2: '8.2% from last month'
        },
        {
            title: 'Daily Logins',
            value: '1,890',
            icon: '/icons/dashboard.svg',
            showTrend: true,
            comparisonValue: 15.3,
            subtitle1: 'Last 24 hours',
            subtitle2: '15.3% from last month'
        },
        {
            title: 'Issues',
            value: '1',
            icon: '/icons/alert-triggered.svg',
            showTrend: true,
            comparisonValue: -5,
            subtitle1: 'Needs attention',
            subtitle2: '5% from last month'
        }
    ];

    // Daily Login Trends Data
    const dailyLoginData = [
        { name: 'Primary Logins', data: [1150, 1350, 1600, 1900] },
        { name: 'Secondary Logins', data: [50, 100, 120, 150] }
    ];

    const dailyLoginDates = ['Jan 26', 'Jan 27', 'Jan 28', 'Jan 29'];

    // App Usage Distribution Data
    const appUsageData = [
        { name: 'Active Users', data: [250, 190, 140] }
    ];

    const appNames = ['madhu-app', 'les-dashboard', 'nalytics-portal'];

    // Chart download handler
    const handleAppUsageDownload = () => {
        exportChartData(appNames, appUsageData, 'app-usage-distribution-data');
    };

    const sections = [
        // Top Row - KPI Cards
        {
            layout: {
                type: 'grid' as const,
                columns: 4,
                gap: 'gap-6',
                className: 'mb-8'
            },
            components: kpiCards.map((card) => ({
                name: 'Card',
                props: {
                    title: card.title,
                    value: card.value,
                    icon: card.icon,
                    showTrend: card.showTrend,
                    comparisonValue: card.comparisonValue,
                    subtitle1: card.subtitle1,
                    subtitle2: card.subtitle2
                }
            }))
        },
        // Bottom Row - Charts
        {
            layout: {
                type: 'grid' as const,
                columns: 2,
                gap: 'gap-6',
                className: 'mb-8'
            },
            components: [
                {
                    name: 'Card',
                    props: {
                        title: 'Daily Login Trends',
                        subtitle1: 'User login activity across all sub-applications',
                        bg: 'bg-white',
                        className: 'p-6'
                    },
                    span: 1
                },
                {
                    name: 'Card',
                    props: {
                        title: 'App Usage Distribution',
                        subtitle1: 'Active users and sessions by sub-application',
                        bg: 'bg-white',
                        className: 'p-6'
                    },
                    span: 1
                }
            ]
        }
    ];

    return (
        <div className="w-full h-full p-6 bg-background-secondary">
            <Page 
                sections={sections}
                sectionWrapperClassName=""
                style={{ height: '100%' }}
            />
            
            {/* Custom Chart Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Daily Login Trends Chart */}
                <div className="absolute top-1/2 left-1/4 w-1/2 h-1/3 transform -translate-y-1/2">
                    <LineChart
                        title=""
                        data={dailyLoginData[0].data}
                        xAxisData={dailyLoginDates}
                        showXAxisLabel={true}
                    />
                </div>
                
                {/* App Usage Distribution Chart */}
                <div className="absolute top-1/2 right-1/4 w-1/2 h-1/3 transform -translate-y-1/2">
                    <BarChart
                        xAxisData={appNames}
                        seriesData={appUsageData}
                        seriesColors={['var(--color-primary)']}
                        height={200}
                        showLegendInteractions={false}
                        showXAxisLabel={true}
                        title=""
                        showDownloadButton={true}
                        onDownload={handleAppUsageDownload}
                    />
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;

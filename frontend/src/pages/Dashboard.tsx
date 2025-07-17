import React, { useState } from 'react';
import { BarChart, PieChart } from '../graphs';
import Card from '@components/global/Card';
import Table from '@components/global/Table';
import TimeRangeSelector from '@components/global/TimeRangeSelector';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import { useNavigate } from 'react-router-dom';

// Constants
const METRICS_TYPE_OPTIONS = ['Graph', 'Table'];
const METRICS_VIEW_OPTIONS = ['Daily', 'Monthly', 'Yearly'];
const BILLING_VIEW_OPTIONS = ['Daily', 'Monthly'];

const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)'
};

// Dummy Data
const CONSUMER_STATS = [
    {
        title: 'Total Consumers',
        value: '4',
        icon: '/icons/units.svg',
        subtitle1: '3 Active',
        subtitle2: '1 In-Active',
    },
    {
        title: 'High-Usage Consumers',
        value: '1',
        icon: '/icons/heavy-user.svg',
        subtitle1: '189.11 kWh Average Consumption',
        subtitle2: '',
    },
];

const BILLING_STATS = [
    {
        title: 'Electricity Usage (kWh)',
        value: '181.96',
        icon: '/icons/plug-alt.svg',
        subtitle1: '175.78 kWh',
        subtitle2: 'Jul 3, 2025',
        showTrend: true,
        comparisonValue: 3.5,
    },
    {
        title: 'Electricity Charges',
        value: '₹13,69,438.66',
        icon: '/icons/rupee.svg',
        subtitle1: '₹13,69,324.66',
        subtitle2: 'Jul 3, 2025',
        showTrend: true,
        comparisonValue: 0.8,
    },
];

const BAR_CHART_DATA = [
    10, 100, 200, 220, 230, 225, 225, 250, 270, 260, 230, 230, 230, 280, 270, 260, 230, 230, 230, 280, 270, 260, 230, 230, 230, 180, 170, 170, 170, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200
];

const BAR_CHART_LABELS = [
    '4 May', '5 May', '6 May', '7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul'
];

const METER_STATUS_DATA = [
    { value: 3, name: 'Communicating' },
    { value: 1, name: 'Non-Communicating' },
];

const METER_EVENTS = [
    {
        meterNo: 'A9211433',
        uid: 'BI25GMRA004',
        eventDateTime: '06/05/2025 16:12:00',
        eventDesc: 'Meter Power Fail - Start',
    },
    {
        meterNo: 'A9211433',
        uid: 'BI25GMRA004',
        eventDateTime: '05/05/2025 12:44:00',
        eventDesc: 'Meter Power Fail - End',
    },
    {
        meterNo: 'A9345417',
        uid: 'BI25GMRA002',
        eventDateTime: '06/05/2025 16:47:00',
        eventDesc: 'CT Short - End',
    },
    {
        meterNo: 'A9345418',
        uid: 'BI25GMRA003',
        eventDateTime: '23/05/2025 12:19:00',
        eventDesc: 'R_PH CT Reversed - Start',
    },
];

const METER_EVENT_COLUMNS = [
    { key: 'meterNo', label: 'Meter SI No' },
    { key: 'uid', label: 'UID' },
    { key: 'eventDateTime', label: 'Event Date Time' },
    { key: 'eventDesc', label: 'Event Description' },
];

const Dashboard: React.FC = () => {
    // State management
    const [billingView, setBillingView] = useState<'Daily' | 'Monthly'>('Daily');
    const [metricsType, setMetricsType] = useState('Graph');
    const [metricsView, setMetricsView] = useState('Daily');
    const navigate = useNavigate();

    // Navigation handlers for cards
    const handleTotalConsumersClick = () => {
        navigate('/consumers');
    };

    const handleHighUsageConsumersClick = () => {
        navigate('/consumers/high-usage');
    };

    // Helper functions to generate data based on time range
    const generateXAxisLabels = (timeRange: string) => {
        const now = new Date();
        
        switch (timeRange) {
            case 'Monthly': {
                const labels = [];
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                // Generate last 36 months including current month
                for (let i = 35; i >= 0; i--) {
                    const date = new Date(currentYear, currentMonth - i, 1);
                    const monthName = date.toLocaleString('default', { month: 'short' });
                    const year = date.getFullYear();
                    labels.push(`${monthName} ${year}`);
                }
                return labels;
            }
            
            case 'Yearly': {
                const labels = [];
                const currentYear = now.getFullYear();
                
                // Generate last 20 years including current year
                for (let i = 19; i >= 0; i--) {
                    labels.push(`${currentYear - i}`);
                }
                return labels;
            }
            
            case 'Daily':
            default:
                return BAR_CHART_LABELS; // Use existing daily labels
        }
    };

    const generateChartData = (timeRange: string) => {
        switch (timeRange) {
            case 'Monthly':
                // Generate 36 months of data
                return Array(36).fill(0).map(() => Math.floor(Math.random() * 300) + 50);
            case 'Yearly':
                // Generate 20 years of data
                return Array(20).fill(0).map(() => Math.floor(Math.random() * 1000) + 100);
            case 'Daily':
            default:
                return BAR_CHART_DATA; // Use existing daily data
        }
    };

    const getDateRange = (timeRange: string) => {
        const now = new Date();
        switch (timeRange) {
            case 'Monthly':
                const startMonth = new Date(now.getFullYear(), now.getMonth() - 35, 1);
                return `${startMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
            case 'Yearly':
                const startYear = now.getFullYear() - 19;
                return `${startYear} - ${now.getFullYear()}`;
            case 'Daily':
            default:
                return "4 May, 2025 - 5 Jul, 2025";
        }
    };

    // Helper functions
    const handleDownload = (timeRange: string, viewType: string) => {
        console.log(`Download ${timeRange} ${viewType} data`);
        // Add actual download logic here
    };

    const handleTimeRangeChange = (range: string) => {
        setMetricsView(range);
        console.log(`Time range changed to: ${range}`);
    };

    const handleViewTypeChange = (viewType: string) => {
        setMetricsType(viewType);
        console.log(`View type changed to: ${viewType}`);
    };

    // Section Components
    const renderConsumerStatistics = () => (
        <div className="bg-primary-lightest dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl px-5 py-4 flex flex-col gap-1">
            <div className="flex justify-between items-center gap-2">
                <h2 className="text-base font-regular m-0">Consumer Statistics</h2>
                <div style={{ opacity: 0, pointerEvents: 'none' }}>
                    <TimeRangeSelector
                        availableTimeRanges={BILLING_VIEW_OPTIONS}
                        selectedTimeRange={billingView}
                        handleTimeRangeChange={() => {}}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONSUMER_STATS.map((card, idx) => (
                    <Card
                        key={idx}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        subtitle1={card.subtitle1}
                        subtitle2={card.subtitle2}
                        iconStyle={ICON_FILTER_STYLE}
                        onValueClick={idx === 0 ? handleTotalConsumersClick : handleHighUsageConsumersClick}
                    />
                ))}
            </div>
        </div>
    );

    const renderConsumptionBilling = () => (
        <div className="bg-primary-lightest dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl px-5 py-4 flex flex-col gap-1">
            <div className="flex justify-between items-center gap-2">
                <h2 className="text-base font-regular">
                    Consumption & Billing <span className="text-base font-regular">(Jul 4, 2025)</span>
                </h2>
                <TimeRangeSelector
                    availableTimeRanges={BILLING_VIEW_OPTIONS}
                    selectedTimeRange={billingView}
                    handleTimeRangeChange={(v) => setBillingView(v as 'Daily' | 'Monthly')}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BILLING_STATS.map((card, idx) => (
                    <Card
                        key={idx}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        subtitle1={card.subtitle1}
                        subtitle2={card.subtitle2}
                        showTrend={card.showTrend}
                        comparisonValue={card.comparisonValue}
                        iconStyle={ICON_FILTER_STYLE}
                    />
                ))}
            </div>
        </div>
    );

    const renderMetricsHeader = () => (
        <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold mb-0">Metrics</h2>
            <TimeRangeSelector
                availableTimeRanges={METRICS_TYPE_OPTIONS}
                selectedTimeRange={metricsType}
                handleTimeRangeChange={handleViewTypeChange}
            />
        </div>
    );

    const renderMetricsGraph = () => (
        <BarChart
            data={generateChartData(metricsView)}
            xAxisData={generateXAxisLabels(metricsView)}
            showXAxisLabel={true}
            xAxisLabel="kVAh"
            showHeader={true}
            headerTitle="Consumption Metrics"
            dateRange={getDateRange(metricsView)}
            availableTimeRanges={METRICS_VIEW_OPTIONS}
            initialTimeRange={metricsView}
            onTimeRangeChange={handleTimeRangeChange}
            onDownload={handleDownload}
            showDownloadButton={true}
            timeRange={metricsView as 'Daily' | 'Monthly' | 'Yearly'}
        />
    );

    const renderMetricsTable = () => (
        <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl">
            <div className="flex justify-between items-center gap-4 bg-primary-lightest dark:bg-primary-dark-light rounded-t-3xl p-4">
                <div className="font-medium text-neutral-darker dark:text-surface">
                    {metricsView} Consumption Metrics
                    <span className="text-xs font-normal text-neutral-dark dark:text-surface ml-1">
                        (4 May, 2025 - 5 Jul, 2025)
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <TimeRangeSelector
                        availableTimeRanges={METRICS_VIEW_OPTIONS}
                        selectedTimeRange={metricsView}
                        handleTimeRangeChange={handleTimeRangeChange}
                    />
                    <span 
                        className="cursor-pointer w-8 h-8 rounded-full bg-white dark:bg-primary-dark flex justify-center items-center border border-primary-border dark:border-dark-border hover:bg-neutral-light dark:hover:bg-primary-dark-light transition-colors"
                        onClick={() => handleDownload(metricsView, metricsType)}
                        role="button"
                        aria-label="Download chart"
                    >
                        <img
                            alt="Download chart"
                            src="/icons/download-icon.svg"
                            className="w-4 h-4 [filter:var(--icon-color)]"
                        />
                    </span>
                </div>
            </div>
            <div className="px-6 py-10">
                <div className="text-center text-neutral-darker dark:text-surface">
                    Table view coming soon...
                </div>
            </div>
        </div>
    );

    const renderMeterCommunicationStatus = () => (
        <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl">
            <div className="flex justify-between items-center gap-2 bg-primary-lightest rounded-tl-3xl rounded-tr-3xl px-4 py-4">
                <h2 className="text-base font-normal">Meter Communication Status</h2>
                <span className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border">
                    <img
                        alt="Download chart"
                        src="icons/download-icon.svg"
                        className="w-4 h-4 [filter:var(--icon-color)]"
                    />
                </span>
            </div>
            <div className="p-6">
                <PieChart
                    data={METER_STATUS_DATA}
                    height={200}
                    showNoDataMessage={false}
                    title={''}
                    onClick={(segmentName?: string) => {
                        if (segmentName === 'Communicating') {
                            navigate('/connect-disconnect/communicating');
                        } else if (segmentName === 'Non-Communicating') {
                            navigate('/connect-disconnect/non-communicating');
                        } else {
                            navigate('/connect-disconnect');
                        }
                    }}
                />
            </div>
        </div>
    );

    const renderLatestMeterEvents = () => (
        <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl">
            <div className="flex justify-between items-center gap-2 bg-primary-lightest rounded-t-3xl rounded-tr-3xl p-4">
                <h2 className="text-lg font-semibold">Latest Meter Events</h2>
            </div>
            <div className="p-4">
                <Table
                    data={METER_EVENTS}
                    columns={METER_EVENT_COLUMNS}
                    loading={false}
                    searchable={true}
                    pagination={false}
                    showActions={true}
                    actions={[{
                        label: 'View',
                        icon: '/icons/eye.svg',
                        onClick: (row: any) => {
                            navigate(`/consumers/${row.uid}`);
                        }
                    }]}
                />
            </div>
        </div>
    );

    // Page Sections - Organized by layout
    const topRowSection: Section = {
        id: 'top-row',
        component: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>{renderConsumerStatistics()}</div>
                <div>{renderConsumptionBilling()}</div>
            </div>
        )
    };

    const metricsSection: Section = {
        id: 'metrics-section',
        component: (
            <div className="space-y-4">
                {renderMetricsHeader()}
                {metricsType === 'Graph' ? renderMetricsGraph() : renderMetricsTable()}
            </div>
        )
    };

    const bottomRowSection: Section = {
        id: 'bottom-row',
        component: (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="col-span-1">{renderMeterCommunicationStatus()}</div>
                <div className="col-span-1 lg:col-span-3">{renderLatestMeterEvents()}</div>
            </div>
        )
    };

    return (
        <Page
            layout="single-column"
            sections={[
                topRowSection,
                metricsSection,
                bottomRowSection
            ]}
            className="bg-[var(--color-surface)]"
            containerClassName="space-y-4"
            sectionClassName=""
        />
    );
};

export default Dashboard;

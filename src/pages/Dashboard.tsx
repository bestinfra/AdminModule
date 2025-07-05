import React, { useState } from 'react';
import { BarChart, PieChart } from '../graphs';
import Card from '../components/global/Card';
import Page from '../components/global/Page';
import { createHeaderComponent } from '../components/global/PageComponents';
import Table from '../components/global/Table';
import TimeRangeSelector from '../components/global/TimeRangeSelector';

const Dashboard: React.FC = () => {
    // State for toggles (UI only, no real interactivity)
    const [billingView, setBillingView] = useState<'Daily' | 'Monthly'>('Daily');
    const [metricsType, setMetricsType] = useState('Graph');
    const [metricsView, setMetricsView] = useState('Daily');
    const metricsTypeOptions = ['Graph', 'Table'];
    const metricsViewOptions = ['Daily', 'Monthly', 'Yearly'];
    const billingViewOptions = ['Daily', 'Monthly'];

    // Dummy data for cards
    const consumerStats = [
        {
            title: 'Total Consumers',
            value: '4',
            icon: '/icons/consumers.svg',
            subtitle1: '3 Active',
            subtitle2: '1 In-Active',
        },
        {
            title: 'High-Usage Consumers',
            value: '1',
            icon: '/icons/high-usage.svg',
            subtitle1: '189.11 kWh Average Consumption',
            subtitle2: '',
        },
    ];
    const billingStats = [
        {
            title: 'Electricity Usage (kWh)',
            value: '181.96',
            icon: '/icons/usage.svg',
            subtitle1: '175.78 kWh',
            subtitle2: 'Jul 3, 2025',
            showTrend: true,
            comparisonValue: 3.5,
        },
        {
            title: 'Electricity Charges',
            value: '₹13,69,438.66',
            icon: '/icons/charges.svg',
            subtitle1: '₹13,69,324.66',
            subtitle2: 'Jul 3, 2025',
            showTrend: true,
            comparisonValue: 0.8,
        },
    ];

    // Dummy data for bar chart (daily consumption)
    const barData = [
        10, 100, 200, 220, 230, 225, 225, 250, 270, 260, 230, 230, 230, 280, 270, 260, 230, 230, 230, 280, 270, 260, 230, 230, 230, 180, 170, 170, 170, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200, 210, 200, 190, 200
    ];
    const barLabels = [
        '4 May', '5 May', '6 May', '7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul'
    ];

    // Dummy data for Meter Communication Status
    const meterStatusData = [
        { value: 3, name: 'Communicating' },
        { value: 1, name: 'Non-Communicating' },
    ];
    // Dummy data for Latest Meter Events
    const meterEvents = [
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
    const meterEventColumns = [
        { key: 'meterNo', label: 'Meter SI No' },
        { key: 'uid', label: 'UID' },
        { key: 'eventDateTime', label: 'Event Date Time' },
        { key: 'eventDesc', label: 'Event Description' },
    ];

    return (
        <Page
            layout="single-column"
            className="space-y-6 bg-[var(--color-surface)]"
            sectionClassName="mb-4"
            sections={[
                {
                    id: 'consumer-billing-stats',
            component: (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Consumer Statistics */}
                            <div className="bg-[var(--color-primary-lightest)] dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6 flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-semibold m-0">Consumer Statistics</h2>
                                    <div style={{ opacity: 0, pointerEvents: 'none' }}>
                                        <TimeRangeSelector
                                            availableTimeRanges={billingViewOptions}
                                            selectedTimeRange={billingView}
                                            handleTimeRangeChange={() => {}}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {consumerStats.map((card, idx) => (
                        <Card
                                            key={idx}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            subtitle1={card.subtitle1}
                            subtitle2={card.subtitle2}
                        />
                    ))}
                </div>
                            </div>
                            {/* Consumption & Billing */}
                            <div className="bg-[var(--color-primary-lightest)] dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6 flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-semibold">Consumption & Billing <span className="text-xs font-normal">(Jul 4, 2025)</span></h2>
                                    <TimeRangeSelector
                                        availableTimeRanges={billingViewOptions}
                                        selectedTimeRange={billingView}
                                        handleTimeRangeChange={(v) => setBillingView(v as 'Daily' | 'Monthly')}
                    />
                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {billingStats.map((card, idx) => (
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
                </div>
            )
        },
        {
                    id: 'metrics',
            component: (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold mb-0">Metrics</h2>
                                <TimeRangeSelector
                                    availableTimeRanges={metricsTypeOptions}
                                    selectedTimeRange={metricsType}
                                    handleTimeRangeChange={setMetricsType}
                    />
                </div>
                            {/* CARD CONTAINER */}
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4 bg-[var(--color-primary-lightest)] rounded-lg px-4 py-2">
                                    <div className="font-medium">Daily Consumption Metrics <span className="text-xs font-normal">(4 May, 2025 - 5 Jul, 2025)</span></div>
                                    {/* INNER TOGGLE (Daily/Monthly/Yearly) + REFRESH ICON */}
                                    <div className="flex items-center gap-2">
                                        <TimeRangeSelector
                                            availableTimeRanges={metricsViewOptions}
                                            selectedTimeRange={metricsView}
                                            handleTimeRangeChange={setMetricsView}
                                        />
                                        
                                    </div>
                                </div>
                                {metricsType === 'Graph' ? (
                                    <BarChart
                                        data={barData}
                                        xAxisData={barLabels}
                                        showXAxisLabel={true}
                                        xAxisLabel="kVAh"
                                    />
                                ) : (
                                    <div className="text-center text-neutral-darker py-10">Table view coming soon...</div>
                                )}
                            </div>
                </div>
            )
        },
        {
                    id: 'meter-communication-events',
            component: (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Meter Communication Status */}
                            <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-3 flex flex-col">
                                <div className="flex justify-between items-center mb-2 bg-[var(--color-primary-lightest)] rounded-lg px-4 py-2">
                                    <h2 className="text-lg font-semibold">Meter Communication Status</h2>
                                    <span className="bg-primary-lightest dark:bg-primary-dark rounded-full p-2">
                                        <img src="/icons/refresh.svg" alt="refresh" className="w-5 h-5" />
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <PieChart
                                        data={meterStatusData}
                                        title=""
                                    />
                                    
                                </div>
                            </div>
                            {/* Latest Meter Events */}
                            <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6 flex flex-col">
                                <div className="bg-[var(--color-primary-lightest)] rounded-lg px-4 py-2 mb-2">
                                    <h2 className="text-lg font-semibold mb-0">Latest Meter Events</h2>
                                </div>
                    <Table
                                    data={meterEvents}
                                    columns={meterEventColumns}
                        searchable={true}
                                    pagination={true}
                                    initialRowsPerPage={10}
                                    showActions={true}
                                    actions={[{
                                        label: 'View',
                                        icon: '/icons/eye.svg',
                                        onClick: () => {},
                                    }]}
                                    emptyMessage="No meter events found"
                                />
                            </div>
                </div>
            )
                },
            ]}
        />
    );
};

export default Dashboard;

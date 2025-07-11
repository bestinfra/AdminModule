import React, { useState } from 'react';
import { BarChart, PieChart } from '../graphs';
import Card from '../components/global/Card';
import Table from '../components/global/Table';
import TimeRangeSelector from '../components/global/TimeRangeSelector';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import { 
    createHeaderComponent, 
     createFooterComponent
} from '../components/global/PageComponents';

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
    const billingStats = [
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

    // Header component
    const headerComponent = createHeaderComponent(
        'Dashboard',
        'Monitor system performance and key metrics',
        'Last updated: 2 minutes ago'
    );    

    // Footer component
    const footerComponent = createFooterComponent({
        id: 'Dashboard ID: DASH-001',
        version: '2.1.0',
        supportLink: '#'
    });

    // Combined Consumer Statistics and Consumption & Billing Section
    const combinedStatsSection: Section = {
        id: 'combined-stats',
        component: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Consumer Statistics */}
                <div className="bg-[var(--color-primary-lightest)] dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl px-5 py-4 flex flex-col gap-1">
                    <div className="flex justify-between items-center gap-2">
                        <h2 className="text-base font-regular m-0">Consumer Statistics</h2>
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
                                iconStyle={{ filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)'
 }}
                            />
                        ))}
                    </div>
                </div>

                {/* Consumption & Billing */}
                <div className="bg-[var(--color-primary-lightest)] dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl px-5 py-4 flex flex-col gap-1">
                    <div className="flex justify-between items-center gap-2">
                        <h2 className="text-base font-regular">Consumption & Billing <span className="text-base font-regular">(Jul 4, 2025)</span></h2>
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
                                iconStyle={{ filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    };

    // Metrics Section
    const metricsSection: Section = {
        id: 'metrics',
        component: (
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold mb-0">Metrics</h2>
                    <TimeRangeSelector
                        availableTimeRanges={metricsTypeOptions}
                        selectedTimeRange={metricsType}
                        handleTimeRangeChange={setMetricsType}
                    />
                </div>
                <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl">
                    <div className="flex justify-between items-center gap-4 bg-[var(--color-primary-lightest)] rounded-tl-3xl rounded-tr-3xl px-4 py-3">
                        <div className="text-base">Daily Consumption Metrics <span className="text-sm font-normal" style={{ color: 'var(--color-neutral)' }}>(4 May, 2025 - 5 Jul, 2025)</span></div>
                        <div className="flex items-center gap-2">
                            <TimeRangeSelector
                                availableTimeRanges={metricsViewOptions}
                                selectedTimeRange={metricsView}
                                handleTimeRangeChange={setMetricsView}
                            />
                    <span className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border">
                        <img
                            alt="Download chart"
                            src="icons/download-icon.svg"
                            className="w-4 h-4 [filter:var(--icon-color)]"
                        />
                    </span>
                    </div>
                    

                    </div>
                    <div className="px-6">
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
            </div>
        )
    };

    // Meter Communication and Events Section
    const meterCommunicationSection: Section = {
        id: 'meter-communication',
        component: (
            <div className="grid grid-cols-10 gap-6">
                {/* Meter Communication Status - 30% */}
                <div className="col-span-3 bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl">
                    <div className="flex justify-between items-center gap-2 bg-[var(--color-primary-lightest)] rounded-tl-3xl rounded-tr-3xl px-4 py-4">
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
                            data={meterStatusData}
                            height={200}
                            showNoDataMessage={false}
                            title={''}
                        />
                    </div>
                </div>

                {/* Latest Meter Events */}
                <div className="col-span-7 bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl">
                    <div className="flex justify-between items-center gap-2 bg-[var(--color-primary-lightest)] rounded-tl-3xl rounded-tr-3xl px-4 py-5">
                        <h2 className="text-base font-normal">Latest Meter Events</h2>
                    </div>
                    <div className="p-4">
                        <Table
                            data={meterEvents}
                            columns={meterEventColumns}
                            loading={false}
                            searchable={false}
                            pagination={false}
                            showActions={false}
                        />
                    </div>
                </div>
            </div>
        )
    };

    return (
        <Page
            layout="single-column"
            sections={[combinedStatsSection, metricsSection, meterCommunicationSection]}
            header={headerComponent}
            footer={footerComponent}
            sidebarPosition="right"
            className="space-y-6 bg-[var(--color-surface)] p-4"
            sectionClassName=""

        />
    );
};

export default Dashboard;

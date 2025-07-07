import React, { useState } from 'react';
import Card from '../components/global/Card';
import TimeRangeSelector from '../components/global/TimeRangeSelector';
import Table from '../components/global/Table';
import type { TableData } from '../components/global/Table';
import BarChart from '../graphs/BarChart';
import { useNavigate } from 'react-router-dom';

const DTRDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<'Daily' | 'Monthly'>('Daily');
    const dtrStats = [
        { title: 'Total DTRs', value: 29, icon: '/icons/dtr.svg', subtitle1: 'Total Transformer Units' },
        { title: 'Total LT Feeders', value: 33, icon: '/icons/feeder.svg', subtitle1: 'Connected to DTRs' },
        { title: 'Total Fuse Blown', value: 3, icon: '/icons/power_failure.svg', subtitle1: '0.10% of Total DTRs' },
        { title: 'Overloaded Feeders', value: 0, icon: '/icons/dtr.svg', subtitle1: '0.00% of Total Feeders' },
        { title: 'Underloaded Feeders', value: 33, icon: '/icons/dtr.svg', subtitle1: '100.0% of Total Feeders' },
        { title: 'LT Side Fuse Blown', value: 3, icon: '/icons/power_failure.svg', subtitle1: '3 Incidents' },
        { title: 'Unbalanced DTRs', value: 0, icon: '/icons/dtr.svg', subtitle1: '0.00% of Total DTRs' },
        { title: 'Power Failure Feeders', value: 0, icon: '/icons/power_failure.svg', subtitle1: '0.00% of Feeders' },
        { title: 'HT Side Fuse Blown', value: 0, icon: '/icons/power_failure.svg', subtitle1: '0 Incident' },
    ];
    const consumptionStats = [
        { title: 'Total kWh', value: '107618.42', icon: '/icons/consumption.svg', subtitle1: 'Cumulative Active Energy' },
        { title: 'Total kVAh', value: '109022.43', icon: '/icons/consumption.svg', subtitle1: 'Cumulative Apparent Energy' },
        { title: 'Total kW', value: '7.62', icon: '/icons/consumption.svg', subtitle1: 'Active Power' },
        { title: 'Total kVA', value: '7.89', icon: '/icons/consumption.svg', subtitle1: 'Apparent Power' },
        { title: 'Active DTRs', value: 29, icon: '/icons/dtr.svg', subtitle1: '100.00% of Total DTRs', iconColor: 'green' },
        { title: 'In-Active DTRs', value: 0, icon: '/icons/dtr.svg', subtitle1: '0.00% of Total DTRs', iconColor: 'red' },
    ];

    // Dummy data for DTRs table
    const dtrTableColumns = [
        { key: 'dtrId', label: 'DTR ID' },
        { key: 'dtrName', label: 'DTR Name' },
        { key: 'feedersCount', label: 'Feeders Count' },
        { key: 'streetName', label: 'Street Name' },
        { key: 'city', label: 'City' },
        { key: 'commStatus', label: 'Comm-Status' },
    ];
    const dtrTableData = [
        { dtrId: 'TRANSFORMER-01', dtrName: 'TGNP_DTR-01', feedersCount: 1, streetName: 'Waddepally', city: 'Warangal', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-02', dtrName: 'TGNP_DTR-02', feedersCount: 1, streetName: 'Sun city', city: 'Hyderabad', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-03', dtrName: 'TGNP_DTR-03', feedersCount: 4, streetName: 'Prashanth Nagar', city: 'Hyderabad', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-04', dtrName: 'TGNP_DTR-04', feedersCount: 1, streetName: 'Prashanth Nagar', city: 'Hyderabad', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-05', dtrName: 'TGNP_DTR-05', feedersCount: 1, streetName: 'Prashanth Nagar', city: 'Hyderabad', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-06', dtrName: 'TGNP_DTR-06', feedersCount: 1, streetName: 'Prashanth Nagar', city: 'Hyderabad', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-07', dtrName: 'TGNP_DTR-07', feedersCount: 1, streetName: 'Hyder Nagar', city: 'Hyderabad', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-08', dtrName: 'TGNP_DTR-08', feedersCount: 1, streetName: 'Hyder Nagar', city: 'Hyderabad', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-09', dtrName: 'TGNP_DTR-09', feedersCount: 1, streetName: 'Hyder Nagar', city: 'Hyderabad', commStatus: 'Active' },
        { dtrId: 'TRANSFORMER-10', dtrName: 'TGNP_DTR-10', feedersCount: 1, streetName: 'Hyder Nagar', city: 'Hyderabad', commStatus: 'Active' },
    ];
    const dtrTableActions = [
        {
            label: 'View',
            icon: '/icons/eye.svg',
            onClick: (row: TableData) => navigate(`/dtr/${row.dtrId}`),
        },
    ];

    // Dummy data for Latest Alerts table
    const alertsTableColumns = [
        { key: 'alert', label: 'Alert' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
    ];
    const alertsTableData = [
        { alert: 'Overload detected', date: '2024-07-01 10:00', status: 'Active' },
        { alert: 'Fuse blown', date: '2024-07-01 09:30', status: 'Resolved' },
        { alert: 'Power failure', date: '2024-07-01 08:45', status: 'Active' },
    ];

    // Dummy data for DTR Alert Statistics
    const [statsRange, setStatsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    const alertTypes = [
        { name: 'LT Fuse Blown (R - Phase)', color: '#e74c3c' },
        { name: 'Unbalanced Load', color: '#f39c12' },
        { name: 'Low PF (R - Phase)', color: '#3498db' },
        { name: 'Power Failure', color: '#9b59b6' },
        { name: 'B_PH Missing', color: '#8e44ad' },
        { name: 'R_PH CT Reversed', color: '#e67e22' },
        { name: 'HT Fuse Blown (B - Phase)', color: '#f1c40f' },
        { name: 'LT Fuse Blown (Y - Phase)', color: '#1abc9c' },
        { name: 'LT Fuse Blown (B - Phase)', color: '#e67e22' },
        { name: 'R-L-P', color: '#9b59b6' },
    ];
    const months = ['May 2025', 'Apr 2025', 'Mar 2025', 'Feb 2025', 'Jan 2025', 'Dec 2024', 'Nov 2024', 'Oct 2024', 'Sept 2024'];
    const alertSeries = alertTypes.map((type, idx) => ({
        name: type.name,
        data: months.map(() => Math.floor(Math.random() * 350)),
    }));
    const alertColors = alertTypes.map(type => type.color);

    return (
        <div className="space-y-6 bg-[var(--color-surface)] p-2">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* DTR Statistics */}
                <div className="bg-[var(--color-primary-lightest)] dark:bg-primary-dark p-6 flex flex-col gap-4 md:col-span-3 col-span-1 rounded-[var(--radius-2xl)]">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold m-0">Distribution Transformer (DTR) Statistics</h2>
                        <div className="flex items-center gap-2" style={{ opacity: 0, pointerEvents: 'none' }}>
                            <TimeRangeSelector
                                availableTimeRanges={['Daily', 'Monthly']}
                                selectedTimeRange={view}
                                handleTimeRangeChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dtrStats.map((card, idx) => (
                            <Card
                                key={idx}
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                subtitle1={card.subtitle1}
                                onValueClick={() => {
                                    switch (card.title) {
                                        case 'Total DTRs':
                                            navigate('/dtr-statistics/total-dtrs');
                                            break;
                                        case 'Total LT Feeders':
                                            navigate('/dtr-statistics/total-lt-feeders');
                                            break;
                                        case 'Total Fuse Blown':
                                            navigate('/dtr-statistics/total-fuse-blown');
                                            break;
                                        case 'Overloaded Feeders':
                                            navigate('/dtr-statistics/overloaded-feeders');
                                            break;
                                        case 'Underloaded Feeders':
                                            navigate('/dtr-statistics/underloaded-feeders');
                                            break;
                                        case 'LT Side Fuse Blown':
                                            navigate('/dtr-statistics/lt-side-fuse-blown');
                                            break;
                                        case 'Unbalanced DTRs':
                                            navigate('/dtr-statistics/unbalanced-dtrs');
                                            break;
                                        case 'Power Failure Feeders':
                                            navigate('/dtr-statistics/power-failure-feeders');
                                            break;
                                        case 'HT Side Fuse Blown':
                                            navigate('/dtr-statistics/ht-side-fuse-blown');
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* Consumption & Energies */}
                <div className="bg-[var(--color-primary-lightest)] dark:bg-primary-dark p-6 flex flex-col gap-4 md:col-span-2 col-span-1 rounded-[var(--radius-2xl)]">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Consumption & Energies</h2>
                        <TimeRangeSelector
                            availableTimeRanges={['Daily', 'Monthly']}
                            selectedTimeRange={view}
                            handleTimeRangeChange={(v) => setView(v as 'Daily' | 'Monthly')}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {consumptionStats.map((card, idx) => (
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
            {/* DTRs Table */}
            <div className="mt-8">
                <div className="flex items-center justify-between px-0 pt-0 pb-2">
                    <h2 className="text-lg font-semibold mb-0">DTRs</h2>
                </div>
                <div className="px-0 pb-6">
                    <Table
                        data={dtrTableData}
                        columns={dtrTableColumns}
                        actions={dtrTableActions}
                        showActions={true}
                        searchable={true}
                        pagination={true}
                        initialRowsPerPage={10}
                        emptyMessage="No DTRs found"
                        onRowClick={(row) => navigate(`/dtr/${row.dtrId}`)}
                    />
                </div>
            </div>
            {/* Latest Alerts Table */}
            <div className="mt-8">
                <div className="flex items-center justify-between px-0 pt-0 pb-2">
                    <h2 className="text-lg font-semibold mb-0">Latest Alerts</h2>
                </div>
                <div className="px-0 pb-6">
                    <Table
                        data={alertsTableData}
                        columns={alertsTableColumns}
                        showActions={false}
                        searchable={true}
                        pagination={true}
                        initialRowsPerPage={10}
                        emptyMessage="No alerts found"
                    />
                </div>
            </div>
            {/* Statistics Bar Chart */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Statistics</h2>
                <div className="gap-2 bg-[var(--color-primary-lightest)] p-4 rounded-[var(--radius-2xl)] flex items-center justify-between">
                    <div className="font-semibold">DTR Alert Statistics <span className="text-sm font-normal">(Last 12 Months)</span></div>
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
                    seriesData={alertSeries}
                    seriesColors={alertColors}
                    height={300}
                    showLegendInteractions={true}
                    timeRange={statsRange}
                />
            </div>
        </div>
    );
};

export default DTRDashboard; 
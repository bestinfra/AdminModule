import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '@/components/global/PageC';
import { exportChartData } from '@/utils/excelExport';

// Interface for ActivityLogEntry
interface ActivityLogEntry {
    id: string | number;
    description: string;
    timestamp: string;
    status?: string;
    subText?: string;
    author?: string;
}

const DgDetailView: React.FC = () => {
    const navigate = useNavigate();
    const { dgId } = useParams<{ dgId: string }>();

    // Activity log state with dummy data
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([
        {
            id: 1,
            description: "DG Set started successfully",
            timestamp: "2025-08-10T08:00:00",
            status: "Completed",
            author: "System Operator"
        },
        {
            id: 2,
            description: "Load increased to 71%",
            timestamp: "2025-08-10T08:15:00",
            status: "In Progress",
            author: "Auto System"
        },
        {
            id: 3,
            description: "Fuel level alert - 60% remaining",
            timestamp: "2025-08-10T09:30:00",
            status: "Warning",
            author: "Monitoring System"
        },
        {
            id: 4,
            description: "Power factor optimized to 0.90",
            timestamp: "2025-08-10T10:00:00",
            status: "Completed",
            author: "Auto System"
        },
        {
            id: 5,
            description: "Maintenance schedule reminder",
            timestamp: "2025-08-10T11:00:00",
            status: "Pending",
            author: "Maintenance System",
            subText: "Next maintenance due in 50 hours"
        },
        {
            id: 6,
            description: "Voltage imbalance detected - 0.7%",
            timestamp: "2025-08-10T12:00:00",
            status: "Monitoring",
            author: "Power Quality Monitor"
        },
        {
            id: 7,
            description: "Running hours updated - 1250:45 total",
            timestamp: "2025-08-10T12:30:00",
            status: "Completed",
            author: "Hour Meter"
        },
        {
            id: 8,
            description: "Emergency stop test completed",
            timestamp: "2025-08-10T13:00:00",
            status: "Completed",
            author: "Safety System"
        }
    ]);

    // Handle Excel export
    const handleExportData = () => {
        import('xlsx').then((XLSX) => {
            const workbook = XLSX.utils.book_new();
            
            // Prepare DG Overview data
            const dgOverviewData = [
                { 'Metric': 'DG Set', 'Value': `DG Set ${dgId} – Plant A` },
                { 'Metric': 'Location', 'Value': 'Plant A • 40.7128° N, 74.0060° W' },
                { 'Metric': 'Status', 'Value': 'Fault' },
                { 'Metric': 'Running Hours Today', 'Value': '05:41' },
                { 'Metric': 'Total Running Hours', 'Value': '1250:45' },
                { 'Metric': 'Load', 'Value': '71%' },
                { 'Metric': 'Fuel Level', 'Value': '60% (1200 L)' },
                { 'Metric': 'Power Factor Average', 'Value': '0.90' },
                { 'Metric': 'Frequency', 'Value': '50.1 Hz' },
                { 'Metric': 'Voltage Imbalance', 'Value': '0.7%' },
            ];

            // Prepare Electrical Parameters data
            const electricalParamsData = [
                { 'Parameter': 'Voltage (V)', 'R': 230, 'Y': 232, 'B': 229, 'Avg': 230 },
                { 'Parameter': 'Current (A)', 'R': 100, 'Y': 98, 'B': 102, 'Avg': 100 },
                { 'Parameter': 'Active Power (kW)', 'R': 50, 'Y': 48, 'B': 49, 'Avg': 147 },
                { 'Parameter': 'Reactive Power (kVAR)', 'R': 10, 'Y': 9, 'B': 11, 'Avg': 30 },
            ];

            // Convert data to worksheets
            const overviewSheet = XLSX.utils.json_to_sheet(dgOverviewData);
            const electricalSheet = XLSX.utils.json_to_sheet(electricalParamsData);

            // Add worksheets to workbook
            XLSX.utils.book_append_sheet(workbook, overviewSheet, 'DG Overview');
            XLSX.utils.book_append_sheet(workbook, electricalSheet, 'Electrical Parameters');

            // Generate Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Create blob and download
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dg-${dgId}-detail-view-data.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <div className="">
            <Page
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
                                    title: `DG Set ${dgId} – Plant A`,
                                    onBackClick: () => navigate('/dg-dashboard'),
                                    backButtonText: 'Back to DG Dashboard',
                                    buttonsLabel: 'Export',
                                    variant: 'primary',
                                    onClick: () => handleExportData(),
                                    showMenu: true,
                                    showDropdown: true,
                                    menuItems: [
                                        { id: 'export', label: 'Export Data' },
                                        { id: 'settings', label: 'Settings' },
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        console.log(`Menu item clicked: ${itemId}`);
                                    },
                                },
                            },
                        ],
                    },
                    // DG Overview Section
                    // {
                    //     layout: {
                    //         type: 'grid' as const,
                    //         columns: 1,
                    //         className: 'mb-6',
                    //     },
                    //     components: [
                    //         {
                    //             name: 'SectionHeader',
                    //             props: {
                    //                 title: `DG Set ${dgId} Overview`,
                    //                 titleLevel: 2,
                    //                 titleSize: 'lg',
                    //                 titleVariant: 'colorPrimaryDark',
                    //                 titleWeight: 'semibold',
                    //                 titleAlign: 'left',
                    //                 layout: 'horizontal',
                    //                 gap: 'gap-4',
                    //             },
                    //         },
                    //     ],
                    // },
                    // DG Status Cards
                    {
                        layout: {
                            type: 'grid',
                            columns: 4,
                            gap: 'gap-4',
                            className: '',
                        },
                        components: [
                            {
                                name: 'Card',
                                props: {
                                    title: 'Location',
                                    value: 'Plant A • 40.7128° N, 74.0060° W',
                                    icon: '/icons/location.svg',
                                    subtitle1: 'Geographic coordinates',
                                    bg: 'bg-blue-50',
                                },
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Running Hours Today',
                                    value: '05:41',
                                    icon: '/icons/clock.svg',
                                    subtitle1: 'Current day operation',
                                    bg: 'bg-green-50',
                                },
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Total Running Hours',
                                    value: '1250:45',
                                    icon: '/icons/timer.svg',
                                    subtitle1: 'Lifetime operation',
                                    bg: 'bg-purple-50',
                                },
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Status',
                                    value: 'Fault',
                                    icon: '/icons/alert-triangle.svg',
                                    subtitle1: 'Last update: 10/8/2025, 12:24:43 IST',
                                    bg: 'bg-red-50',
                                },
                            },
                        ],
                    },
                    // Progress Bars and Metrics
                    {
                        layout: {
                            type: 'grid',
                            columns: 3,
                            gap: 'gap-6',
                            className: '',
                        },
                        components: [
                            {
                                name: 'Card',
                                props: {
                                    title: 'Load & Fuel Status',
                                    value: '71% / 60%',
                                    icon: '/icons/gauge.svg',
                                    subtitle1: 'Current operational metrics',
                                    bg: 'bg-gray-50',
                                },
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Power Quality',
                                    value: '0.90 PF',
                                    icon: '/icons/lightning.svg',
                                    subtitle1: 'Electrical performance metrics',
                                    bg: 'bg-gray-50',
                                },
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Quick Actions',
                                    value: '3 Controls',
                                    icon: '/icons/settings.svg',
                                    subtitle1: 'Operational controls',
                                    bg: 'bg-gray-50',
                                },
                            },
                        ],
                    },
                    // Main Dashboard Grid - Custom JSX sections
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            className: '',
                        },
                        components: [
                            {
                                name: 'SectionHeader',
                                props: {
                                    title: 'Detailed Monitoring',
                                    titleLevel: 3,
                                    titleSize: 'md',
                                    titleVariant: 'colorPrimaryDark',
                                    titleWeight: 'medium',
                                    titleAlign: 'left',
                                    layout: 'horizontal',
                                    gap: 'gap-4',
                                    rightComponent:{
                                        name:'timeranger',
                                    }
                                },
                            },
                        ],
                    },
                    // Custom Progress Bars Section
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            className: '',
                        },
                        components: [
                            {
                                name: 'Card',
                                props: {
                                    title: 'Operational Metrics',
                                    value: 'Real-time Status',
                                    icon: '/icons/activity.svg',
                                    subtitle1: 'Load and fuel monitoring',
                                    bg: 'bg-blue-50',
                                },
                            },
                        ],
                    },
                    // Custom Electrical Parameters Section
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            className: '',
                        },
                        components: [
                            {
                                name: 'Card',
                                props: {
                                    title: 'Electrical Parameters',
                                    value: '3-Phase System',
                                    icon: '/icons/lightning.svg',
                                    subtitle1: 'R, Y, B phase measurements',
                                    bg: 'bg-green-50',
                                },
                            },
                        ],
                    },
                    // Custom Fuel & Efficiency Section
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            className: '',
                        },
                        components: [
                            {
                                name: 'Card',
                                props: {
                                    title: 'Fuel & Efficiency',
                                    value: '60% Level',
                                    icon: '/icons/fuel.svg',
                                    subtitle1: 'Current fuel status and efficiency metrics',
                                    bg: 'bg-orange-50',
                                },
                            },
                        ],
                    },
                    // Custom Alerts Section
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            className: '',
                        },
                        components: [
                            {
                                name: 'ActivityLog',
                                span: { col: 2, row: 1 },
                                props: {
                                    entries: activityLog,   
                                    maxHeight: 'h-96',
                                },
                            },
                        ],
                    },
                    // Additional Metrics Section
                    {
                        layout: {
                            type: 'grid',
                            columns: 2,
                            gap: 'gap-6',
                                className: '',
                        },
                        components: [
                            {
                                name: 'Card',
                                props: {
                                    title: 'Maintenance Schedule',
                                    value: 'Next: 2025-09-15',
                                    icon: '/icons/calendar.svg',
                                    subtitle1: 'Due in 50 hours',
                                    bg: 'bg-orange-50',
                                },
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Performance Trend',
                                    value: 'Stable',
                                    icon: '/icons/trending-up.svg',
                                    subtitle1: 'Last 30 days',
                                    bg: 'bg-green-50',
                                },
                            },
                        ],
                    },
                ]}
            />
            
            {/* Custom Progress Bars Section */}
            <div className="">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Load & Fuel Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Load Progress Bar */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Load</span>
                                <span className="font-medium text-gray-900">71%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: '71%' }}
                                />
                            </div>
                        </div>
                        
                        {/* Fuel Progress Bar */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Fuel</span>
                                <span className="font-medium text-gray-900">60% (1200 L)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: '60%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Electrical Parameters Table */}
            <div className="">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Electrical Parameters</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Parameter</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">R</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Y</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">B</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Avg</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">Voltage (V)</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">230</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">232</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">229</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center font-semibold">230</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">Current (A)</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">100</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">98</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">102</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center font-semibold">100</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">Active Power (kW)</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">50</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">48</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">49</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center font-semibold">147</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">Reactive Power (kVAR)</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">10</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">9</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">11</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center font-semibold">30</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">Apparent Power (kVA)</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">51</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">49</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">50</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center font-semibold">150</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">Power Factor</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">0.98</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">0.98</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center">0.98</td>
                                    <td className="py-3 px-4 text-sm text-gray-900 text-center font-semibold">0.98</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Custom Fuel & Efficiency Cards */}
            <div className="">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel & Efficiency</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Fuel Level</span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
                                </div>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">60%</div>
                            <div className="text-sm text-gray-500">1200 L</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                            <span className="text-sm font-medium text-gray-700">Fuel Today</span>
                            <div className="text-lg font-semibold text-gray-900">150 L</div>
                            <div className="text-sm text-gray-500">Consumed today</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                            <span className="text-sm font-medium text-gray-700">Fuel Total</span>
                            <div className="text-lg font-semibold text-gray-900">10,500 L</div>
                            <div className="text-sm text-gray-500">Total consumption</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                            <span className="text-sm font-medium text-gray-700">Efficiency</span>
                            <div className="text-lg font-semibold text-gray-900">3.5 kWh/L</div>
                            <div className="text-sm text-gray-500">Current efficiency</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                            <span className="text-sm font-medium text-gray-700">Last Refill</span>
                            <div className="text-lg font-semibold text-gray-900">2025-08-01</div>
                            <div className="text-sm text-gray-500">1000 L</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                            <span className="text-sm font-medium text-gray-700">Fuel Theft Alert</span>
                            <div className="text-lg font-semibold text-gray-900">None</div>
                            <div className="text-sm text-gray-500">No theft detected</div>
                        </div>
                    </div>
                    <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        View Refill History
                    </button>
                </div>
            </div>

            {/* Custom Alerts & Faults */}
            <div className="">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Faults</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Low Fuel Alert', status: 'None', variant: 'success' },
                            { name: 'Overload Alert', status: 'None', variant: 'success' },
                            { name: 'Low Oil Pressure', status: 'None', variant: 'success' },
                            { name: 'Over Temperature', status: 'None', variant: 'success' },
                            { name: 'Battery Low', status: 'None', variant: 'success' },
                            { name: 'Start Failure', status: 'None', variant: 'success' },
                            { name: 'Emergency Stop', status: 'None', variant: 'success' },
                            { name: 'Maintenance Due', status: 'Due in 50 hours', variant: 'warning' },
                        ].map((alert, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">{alert.name}</span>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    alert.variant === 'success' 
                                        ? 'bg-green-100 text-green-800 border-green-200' 
                                        : 'bg-orange-100 text-orange-800 border-orange-200'
                                }`}>
                                    {alert.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Power Quality Metrics */}
            <div className="">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Power Quality Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">PF Avg</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">0.90</span>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Freq</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">50.1 Hz</span>
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">V Imbalance</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900">0.7%</span>
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                            Start DG
                        </button>
                        <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium">
                            Stop DG
                        </button>
                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Emergency Stop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DgDetailView;

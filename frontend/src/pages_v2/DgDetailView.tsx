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

    // Engine Health data for StatusCard
    const engineHealthMetrics = [
        {
            icon: '/icons/shield.svg',
            label: 'Oil Pressure',
            value: '4.5 bar'
        },
        {
            icon: '/icons/gear.svg',
            label: 'Engine Temp',
            value: '85°C'
        },
        {
            icon: '/icons/thermometer.svg',
            label: 'Coolant Temp',
            value: '90°C'
        },
        {
            icon: '/icons/battery.svg',
            label: 'Battery Voltage',
            value: '12.8 V'
        },
        {
            icon: '/icons/power.svg',
            label: 'Start Attempts',
            value: '3'
        },
        {
            icon: '/icons/power.svg',
            label: 'Successful Starts',
            value: '2'
        }
    ];

    // Additional DG operational data
    const dgOperationalData = {
        performance: {
            efficiency: '85.2%',
            fuelConsumption: '12.5 L/hour',
            powerOutput: '625 kW',
            reactivePower: '30 kVAR',
            apparentPower: '626 kVA'
        },
        maintenance: {
            lastService: '2025-07-15',
            nextService: '2025-09-15',
            serviceInterval: '500 hours',
            remainingHours: '50 hours',
            totalServices: '8',
            lastTechnician: 'John Smith'
        },
        alerts: {
            critical: 1,
            warning: 2,
            info: 3,
            resolved: 15
        },
        fuel: {
            currentLevel: '60%',
            currentVolume: '1200 L',
            consumptionToday: '150 L',
            consumptionThisMonth: '4500 L',
            lastRefill: '2025-08-01',
            refillAmount: '1000 L',
            theftAlerts: 0
        }
    };

    // DG performance history data
    const performanceHistory = [
        { date: '2025-08-01', load: '65%', efficiency: '87.1%', fuelConsumption: '11.8 L/h' },
        { date: '2025-08-02', load: '72%', efficiency: '85.9%', fuelConsumption: '12.9 L/h' },
        { date: '2025-08-03', load: '68%', efficiency: '86.5%', fuelConsumption: '12.2 L/h' },
        { date: '2025-08-04', load: '75%', efficiency: '84.8%', fuelConsumption: '13.1 L/h' },
        { date: '2025-08-05', load: '71%', efficiency: '85.2%', fuelConsumption: '12.5 L/h' },
        { date: '2025-08-06', load: '69%', efficiency: '86.8%', fuelConsumption: '12.0 L/h' },
        { date: '2025-08-07', load: '73%', efficiency: '85.6%', fuelConsumption: '12.7 L/h' },
        { date: '2025-08-08', load: '67%', efficiency: '87.3%', fuelConsumption: '11.9 L/h' },
        { date: '2025-08-09', load: '74%', efficiency: '84.9%', fuelConsumption: '13.0 L/h' },
        { date: '2025-08-10', load: '71%', efficiency: '85.2%', fuelConsumption: '12.5 L/h' }
    ];

    // DG maintenance history
    const maintenanceHistory = [
        { id: 1, date: '2025-07-15', type: 'Scheduled Service', technician: 'John Smith', hours: '1200', cost: '$2,500', status: 'Completed' },
        { id: 2, date: '2025-06-15', type: 'Oil Change', technician: 'Mike Johnson', hours: '1150', cost: '$800', status: 'Completed' },
        { id: 3, date: '2025-05-15', type: 'Filter Replacement', technician: 'Sarah Wilson', hours: '1100', cost: '$1,200', status: 'Completed' },
        { id: 4, date: '2025-04-15', type: 'Scheduled Service', technician: 'John Smith', hours: '1050', cost: '$2,300', status: 'Completed' },
        { id: 5, date: '2025-03-15', type: 'Emergency Repair', technician: 'Mike Johnson', hours: '1000', cost: '$3,500', status: 'Completed' }
    ];

    // DG alert history
    const alertHistory = [
        { id: 1, timestamp: '2025-08-10T12:00:00', type: 'Warning', message: 'Fuel level below 70%', status: 'Active' },
        { id: 2, timestamp: '2025-08-10T10:30:00', type: 'Info', message: 'Power factor optimization completed', status: 'Resolved' },
        { id: 3, timestamp: '2025-08-10T09:15:00', type: 'Warning', message: 'Engine temperature approaching limit', status: 'Resolved' },
        { id: 4, timestamp: '2025-08-10T08:45:00', type: 'Critical', message: 'Voltage imbalance detected', status: 'Active' },
        { id: 5, timestamp: '2025-08-10T08:00:00', type: 'Info', message: 'DG Set started successfully', status: 'Resolved' }
    ];

    const rpmChartData = {
        label: 'RPM (last hour)',
        value: '1557 RPM',
        icon: '/icons/heartbeat.svg',
        data: [45, 67, 89, 76, 54, 78, 92, 85, 67, 89, 76, 54]
    };

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
                    // DG Overview Section with SummaryInfo
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'SummaryInfo',
                                props: {
                                    title: `DG Set ${dgId} Overview`,
                                    status: {
                                        text: 'Fault',
                                        variant: 'error'
                                    },
                                    rightStatus: {
                                        text: 'Plant A',
                                        variant: 'info',
                                        onClick: () => console.log('Plant A clicked')
                                    },
                                    data: {
                                        leftColumn: [
                                            { label: 'DG Set ID', value: `DG Set ${dgId}` },
                                            { label: 'Location', value: 'Plant A • 40.7128° N, 74.0060° W' },
                                            { label: 'Installation Date', value: '2024-01-15' },
                                            { label: 'Manufacturer', value: 'Cummins Power Generation' },
                                            { label: 'Model', value: 'C1100D5' },
                                            { label: 'Serial Number', value: 'SN-2024-001234' },
                                            { label: 'Rated Power', value: '1100 kVA / 880 kW' },
                                            { label: 'Engine Type', value: '4-Stroke Diesel' },
                                            { label: 'Fuel Type', value: 'Diesel (HSD)' },
                                            { label: 'Fuel Tank Capacity', value: '2000 L' }
                                        ],
                                        rightColumn: [
                                            { label: 'Current Status', value: 'Fault' },
                                            { label: 'Running Hours Today', value: '05:41' },
                                            { label: 'Total Running Hours', value: '1250:45' },
                                            { label: 'Current Load', value: '71%' },
                                            { label: 'Fuel Level', value: '60% (1200 L)' },
                                            { label: 'Power Factor', value: '0.90' },
                                            { label: 'Frequency', value: '50.1 Hz' },
                                            { label: 'Voltage Imbalance', value: '0.7%' },
                                            { label: 'Last Maintenance', value: '2025-07-15' },
                                            { label: 'Next Maintenance', value: '2025-09-15 (in 50 hours)' }
                                        ]
                                    },
                                    buttons: [
                                        {
                                            label: 'Ping Device',
                                            variant: 'primary',
                                            onClick: () => {
                                                console.log('Ping Device clicked');
                                                // Add ping device logic here
                                            }
                                        },
                                        {
                                            label: 'Restart',
                                            variant: 'warning',
                                            onClick: () => {
                                                console.log('Restart clicked');
                                                // Add restart logic here
                                            }
                                        }
                                    ],
                                    className: 'bg-white border border-gray-200',
                                    titleClassName: 'text-xl font-bold text-gray-900'
                                },
                            },
                        ],
                    },
                    // Performance Metrics Section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'SummaryInfo',
                                props: {
                                    title: 'Performance Metrics',
                                    status: {
                                        text: 'Good',
                                        variant: 'success'
                                    },
                                    rightStatus: {
                                        text: 'Last 24h',
                                        variant: 'info',
                                        onClick: () => console.log('Time range clicked')
                                    },
                                    data: {
                                        leftColumn: [
                                            { label: 'Efficiency', value: dgOperationalData.performance.efficiency },
                                            { label: 'Fuel Consumption', value: dgOperationalData.performance.fuelConsumption },
                                            { label: 'Power Output', value: dgOperationalData.performance.powerOutput },
                                            { label: 'Reactive Power', value: dgOperationalData.performance.reactivePower },
                                            { label: 'Apparent Power', value: dgOperationalData.performance.apparentPower }
                                        ],
                                        rightColumn: [
                                            { label: 'Load Factor', value: '71%' },
                                            { label: 'Power Factor', value: '0.90' },
                                            { label: 'Frequency', value: '50.1 Hz' },
                                            { label: 'Voltage Imbalance', value: '0.7%' },
                                            { label: 'THD', value: '2.1%' }
                                        ]
                                    },
                                    buttons: [
                                        {
                                            label: 'Ping Device',
                                            variant: 'primary',
                                            onClick: () => {
                                                console.log('Ping Device clicked');
                                                // Add ping device logic here
                                            }
                                        },
                                        {
                                            label: 'Restart',
                                            variant: 'warning',
                                            onClick: () => {
                                                console.log('Restart clicked');
                                                // Add restart logic here
                                            }
                                        }
                                    ],
                                    className: 'bg-white border border-gray-200',
                                    titleClassName: 'text-lg font-semibold text-gray-900'
                                },
                            },
                        ],
                    },
                    // Maintenance & Alerts Section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'SummaryInfo',
                                props: {
                                    title: 'Maintenance & Alerts',
                                    status: {
                                        text: `${dgOperationalData.alerts.critical} Critical`,
                                        variant: dgOperationalData.alerts.critical > 0 ? 'error' : 'success'
                                    },
                                    rightStatus: {
                                        text: `${dgOperationalData.maintenance.remainingHours} remaining`,
                                        variant: 'warning',
                                        onClick: () => console.log('Maintenance schedule clicked')
                                    },
                                    data: {
                                        leftColumn: [
                                            { label: 'Last Service', value: dgOperationalData.maintenance.lastService },
                                            { label: 'Next Service', value: dgOperationalData.maintenance.nextService },
                                            { label: 'Service Interval', value: dgOperationalData.maintenance.serviceInterval },
                                            { label: 'Total Services', value: dgOperationalData.maintenance.totalServices },
                                            { label: 'Last Technician', value: dgOperationalData.maintenance.lastTechnician }
                                        ],
                                        rightColumn: [
                                            { label: 'Critical Alerts', value: dgOperationalData.alerts.critical.toString() },
                                            { label: 'Warning Alerts', value: dgOperationalData.alerts.warning.toString() },
                                            { label: 'Info Alerts', value: dgOperationalData.alerts.info.toString() },
                                            { label: 'Resolved Alerts', value: dgOperationalData.alerts.resolved.toString() },
                                            { label: 'Response Time', value: '< 5 min' }
                                        ]
                                    },
                                    className: 'bg-white border border-gray-200',
                                    titleClassName: 'text-lg font-semibold text-gray-900'
                                },
                            },
                        ],
                    },
                    // Fuel Management Section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'SummaryInfo',
                                props: {
                                    title: 'Fuel Management',
                                    status: {
                                        text: 'Normal',
                                        variant: 'success'
                                    },
                                    rightStatus: {
                                        text: 'Last Refill: 2025-08-01',
                                        variant: 'info',
                                        onClick: () => console.log('Refill history clicked')
                                    },
                                    data: {
                                        leftColumn: [
                                            { label: 'Current Level', value: dgOperationalData.fuel.currentLevel },
                                            { label: 'Current Volume', value: dgOperationalData.fuel.currentVolume },
                                            { label: 'Consumption Today', value: dgOperationalData.fuel.consumptionToday },
                                            { label: 'Consumption This Month', value: dgOperationalData.fuel.consumptionThisMonth },
                                            { label: 'Tank Capacity', value: '2000 L' }
                                        ],
                                        rightColumn: [
                                            { label: 'Last Refill Amount', value: dgOperationalData.fuel.refillAmount },
                                            { label: 'Fuel Efficiency', value: '3.5 kWh/L' },
                                            { label: 'Cost per Liter', value: '$1.25' },
                                            { label: 'Monthly Fuel Cost', value: '$5,625' },
                                            { label: 'Theft Alerts', value: dgOperationalData.fuel.theftAlerts.toString() }
                                        ]
                                    },
                                    className: 'bg-white border border-gray-200',
                                    titleClassName: 'text-lg font-semibold text-gray-900'
                                },
                            },
                        ],
                    },
                    // Communication & Device Section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'SummaryInfo',
                                props: {
                                    title: 'Communication & Device',
                                    status: {
                                        text: 'Online',
                                        variant: 'success'
                                    },
                                    rightStatus: {
                                        text: '120 hours',
                                        variant: 'info',
                                        onClick: () => console.log('Uptime details clicked')
                                    },
                                    data: {
                                        leftColumn: [
                                            { label: 'Device ID', value: 'DGX-12345' },
                                            { label: 'Firmware', value: 'v2.3.1' },
                                            { label: 'Comm Status', value: 'Online' },
                                            { label: 'Last Comm Time', value: '10/8/2025, 17:11:56 IST' }
                                        ],
                                        rightColumn: [
                                            { label: 'Signal', value: '-55 dBm' },
                                            { label: 'Uptime', value: '120 hours' },
                                            { label: 'Protocol', value: 'Modbus TCP' },
                                            { label: 'IP Address', value: '192.168.1.100' }
                                        ]
                                    },
                                    buttons: [
                                        {
                                            label: 'Ping Device',
                                            variant: 'primary',
                                            onClick: () => {
                                                console.log('Ping Device clicked');
                                                // Add ping device logic here
                                            }
                                        },
                                        {
                                            label: 'Restart',
                                            variant: 'warning',
                                            onClick: () => {
                                                console.log('Restart clicked');
                                                // Add restart logic here
                                            }
                                        }
                                    ],
                                    className: 'bg-white border border-gray-200',
                                    titleClassName: 'text-lg font-semibold text-gray-900'
                                },
                            },
                        ],
                    },
                    // Performance History Table Section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'SectionHeader',
                                props: {
                                    title: 'Performance History (Last 10 Days)',
                                    titleLevel: 3,
                                    titleSize: 'md',
                                    titleVariant: 'colorPrimaryDark',
                                    titleWeight: 'medium',
                                    titleAlign: 'left',
                                    layout: 'horizontal',
                                    gap: 'gap-4',
                                },
                            },
                            {
                                name: 'Table',
                                props: {
                                    data: performanceHistory,
                                    columns: [
                                        { key: 'date', label: 'Date' },
                                        { key: 'load', label: 'Load (%)' },
                                        { key: 'efficiency', label: 'Efficiency (%)' },
                                        { key: 'fuelConsumption', label: 'Fuel Consumption (L/h)' }
                                    ],
                                    loading: false,
                                    searchable: true,
                                    pagination: true,
                                    showActions: false,
                                    showHeader: true,
                                    headerTitle: 'Daily Performance Metrics',
                                    height: 300,
                                    className: 'w-full'
                                }
                            }
                        ],
                    },
                    // Maintenance History Table Section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'SectionHeader',
                                props: {
                                    title: 'Maintenance History',
                                    titleLevel: 3,
                                    titleSize: 'md',
                                    titleVariant: 'colorPrimaryDark',
                                    titleWeight: 'medium',
                                    titleAlign: 'left',
                                    layout: 'horizontal',
                                    gap: 'gap-4',
                                },
                            },
                            {
                                name: 'Table',
                                props: {
                                    data: maintenanceHistory,
                                    columns: [
                                        { key: 'date', label: 'Date' },
                                        { key: 'type', label: 'Service Type' },
                                        { key: 'technician', label: 'Technician' },
                                        { key: 'hours', label: 'Running Hours' },
                                        { key: 'cost', label: 'Cost' },
                                        { key: 'status', label: 'Status' }
                                    ],
                                    loading: false,
                                    searchable: true,
                                    pagination: true,
                                    showActions: false,
                                    showHeader: true,
                                    headerTitle: 'Service Records',
                                    height: 300,
                                    className: 'w-full'
                                }
                            }
                        ],
                    },
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
                                    rightComponent: {
                                        name: "TimeRangeSelector",
                                        props: {
                                            availableTimeRanges: ["Daily", "Monthly"],
                                            selectedTimeRange: "Daily",
                                            handleTimeRangeChange: () => {},
                                            timeRangeLabels: {},
                                        },
                                    },
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
                    // Engine Health StatusCard Section
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'StatusCard',
                                props: {
                                    title: 'Engine Health',
                                    metrics: engineHealthMetrics,
                                    chartData: rpmChartData,
                                    className: 'bg-white border border-gray-200',
                                    buttons: [
                                        {
                                            label: 'Start DG',
                                            variant: 'success',
                                            onClick: () => console.log('Start DG clicked')
                                        },
                                        {
                                            label: 'Stop DG',
                                            variant: 'danger',
                                            onClick: () => console.log('Stop DG clicked')
                                        },
                                        {
                                            label: 'Emergency Stop',
                                            variant: 'warning',
                                            onClick: () => console.log('Emergency Stop clicked')
                                        }
                                    ]
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

            {/* Fuel & Efficiency Section using PageC and Cards */}
            <Page
                sections={[
                    {
                        layout: {
                            type: 'column',
                            className: 'bg-white rounded-lg border border-gray-200 p-6'
                        },
                        components: [
                            {
                                name: 'SectionHeader',
                                props: {
                                    title: 'Fuel & Efficiency',
                                    className: 'mb-4'
                                }
                            }
                        ]
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 3,
                            gap: 'gap-4',
                            className: 'grid-cols-2 md:grid-cols-3'
                        },
                        components: [
                            {
                                name: 'Card',
                                props: {
                                    title: 'Fuel Level',
                                    value: '60%',
                                    icon: 'icons/fuel-level.svg',
                                    subtitle1: '1200 L',
                                    subtitle2: 'Current level'
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Fuel Today',
                                    value: '150 L',
                                    icon: 'icons/fuel-consumption.svg',
                                    subtitle1: 'Consumed today',
                                    subtitle2: 'Daily usage'
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Fuel Total',
                                    value: '10,500 L',
                                    icon: 'icons/fuel-total.svg',
                                    subtitle1: 'Total consumption',
                                    subtitle2: 'Lifetime usage'
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Efficiency',
                                    value: '3.5 kWh/L',
                                    icon: 'icons/efficiency.svg',
                                    subtitle1: 'Current efficiency',
                                    subtitle2: 'Performance metric'
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Last Refill',
                                    value: '2025-08-01',
                                    icon: 'icons/refill.svg',
                                    subtitle1: '1000 L',
                                    subtitle2: 'Refill amount'
                                }
                            },
                            {
                                name: 'Card',
                                props: {
                                    title: 'Fuel Theft Alert',
                                    value: 'None',
                                    icon: 'icons/security.svg',
                                    subtitle1: 'No theft detected',
                                    subtitle2: 'Security status'
                                }
                            }
                        ]
                    },
                    {
                        layout: {
                            type: 'row',
                            className: 'mt-4'
                        },
                        components: [
                            {
                                name: 'Button',
                                props: {
                                    label: 'View Refill History',
                                    className: 'w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
                                }
                            }
                        ]
                    }
                ]}
            />

         

            {/* Power Quality Metrics using PageC and Table */}
            <Page
                sections={[
                    {
                        layout: {
                            type: 'column',
                            className: 'bg-white rounded-lg border border-gray-200 p-6'
                        },
                        components: [
                            {
                                name: 'SectionHeader',
                                props: {
                                    title: 'Power Quality Metrics',
                                    className: 'mb-4'
                                }
                            },
                            {
                                name: 'Table',
                                props: {
                                    data: [
                                        {
                                            parameter: 'DG Set',
                                            r: 'DG Set 001',
                                            y: 'Plant A',
                                            b: '40.7128° N',
                                            avg: '74.0060° W'
                                        },
                                        {
                                            parameter: 'Status',
                                            r: 'Fault',
                                            y: 'Running Hours Today',
                                            b: '05:41',
                                            avg: 'Total: 1250:45'
                                        },
                                        {
                                            parameter: 'Load & Fuel',
                                            r: '71% Load',
                                            y: '60% Fuel',
                                            b: '1200 L',
                                            avg: 'Current Status'
                                        },
                                        {
                                            parameter: 'Power Factor',
                                            r: '0.90 PF',
                                            y: '50.1 Hz',
                                            b: '0.7%',
                                            avg: 'Voltage Imbalance'
                                        },
                                        {
                                            parameter: 'Voltage (V)',
                                            r: '230 V',
                                            y: '232 V',
                                            b: '229 V',
                                            avg: '230 V'
                                        },
                                        {
                                            parameter: 'Current (A)',
                                            r: '100 A',
                                            y: '98 A',
                                            b: '102 A',
                                            avg: '100 A'
                                        },
                                        {
                                            parameter: 'Active Power (kW)',
                                            r: '50 kW',
                                            y: '48 kW',
                                            b: '49 kW',
                                            avg: '147 kW'
                                        },
                                        {
                                            parameter: 'Reactive Power (kVAR)',
                                            r: '10 kVAR',
                                            y: '9 kVAR',
                                            b: '11 kVAR',
                                            avg: '30 kVAR'
                                        }
                                    ],
                                    columns: [
                                        { key: 'parameter', label: 'Parameter' },
                                        { key: 'r', label: 'R' },
                                        { key: 'y', label: 'Y' },
                                        { key: 'b', label: 'B' },
                                        { key: 'avg', label: 'Avg' }
                                    ],
                                    loading: false,
                                    searchable: false,
                                    pagination: false,
                                    showActions: false,
                                    showHeader: true,
                                    headerTitle: 'Power Quality Metrics',
                                    height: 330,
                                    className: 'w-full'
                                }
                            }
                        ]
                    }
                ]}
            />

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

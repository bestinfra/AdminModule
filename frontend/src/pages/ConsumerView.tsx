import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/global/Card';
import PieChart from '../graphs/PieChart';
import BarChart from '../graphs/BarChart';
import Table from '@/components/global/Table';
import Page from '@/components/global/PageC';
import BACKEND_URL from '../config';
import { exportChartData } from '@/utils/excelExport';

const ConsumerView: React.FC = () => {
    const navigate = useNavigate();
    
    // Try to get consumerId from useParams first, then fallback to URL parsing
    const params = useParams<{ consumerId: string }>();

    const uidFromParams = params?.consumerId;

    // Fallback: extract uid from URL path if useParams doesn't work
    const getUidFromUrl = () => {
        const pathSegments = window.location.pathname.split('/');
        const uidIndex =
            pathSegments.findIndex((segment) => segment === 'consumers') + 1;
        return uidIndex > 0 && uidIndex < pathSegments.length
            ? pathSegments[uidIndex]
            : null;
    };

    const uid = uidFromParams || getUidFromUrl();

    // State for consumer data
    const [consumer, setConsumer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Menu items for PageHeader
    const menuItems = [
        { id: 'refresh', label: 'Refresh Data', icon: '/icons/refresh.svg' },
        { id: 'export', label: 'Export Data', icon: '/icons/export.svg' },
        { id: 'settings', label: 'Settings', icon: '/icons/settings.svg' },
    ];

    // Handler functions
    const handleMenuItemClick = (itemId: string) => {
        console.log('Menu item clicked:', itemId);
        // Add your menu item logic here
    };

    const handleBackClick = () => {
        console.log('Back button clicked');
        // Navigate back to consumers list
        navigate('/consumers');
    };

    const handleRefreshClick = () => {
        console.log('Refresh button clicked');
        // Add your refresh logic here
    };

    // Chart download handlers
    const handlePowerMetricsDownload = () => {
        if (consumer?.powerMetrics) {
            const xAxisData = ['kVAh- (i)', 'kWh(i)', 'kWh(E)', 'kVArh-lag(i)', 'kVArh-Ld(i)'];
            const seriesData = [{ name: 'Power', data: consumer.powerMetrics }];
            exportChartData(xAxisData, seriesData, 'consumer-power-metrics-data');
        }
    };

    const handleDailyConsumptionDownload = () => {
        if (consumer?.dailyConsumption) {
            const xAxisData = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
            const seriesData = [{ name: 'Daily Consumption', data: consumer.dailyConsumption }];
            exportChartData(xAxisData, seriesData, 'consumer-daily-consumption-data');
        }
    };

    const handleMonthlyConsumptionDownload = () => {
        if (consumer?.monthlyConsumption) {
            const xAxisData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const seriesData = [{ name: 'Monthly Consumption', data: consumer.monthlyConsumption }];
            exportChartData(xAxisData, seriesData, 'consumer-monthly-consumption-data');
        }
    };

    // Fetch consumer data
    useEffect(() => {
        if (!uid) {
            setError('No consumer ID provided');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Fetch consumer details
        console.log(
            'Fetching consumer data from:',
            `${BACKEND_URL}/consumers/${uid}`
        );
        
        // First try to fetch from API
        fetch(`${BACKEND_URL}/consumers/${uid}`)
            .then(async (res) => {
                console.log('Response status:', res.status);
                
                // Check if response is JSON
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('API returned non-JSON response. Server might be down or endpoint not found.');
                }
                
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Response error:', errorText);
                    throw new Error(
                        `Failed to fetch consumer data: ${res.status} ${res.statusText}`
                    );
                }
                
                const result = await res.json();
                console.log('Response data:', result);
                
                if (!result.success) {
                    throw new Error(
                        result.message || 'Failed to fetch consumer data'
                    );
                }

                // Handle the backend response structure
                const consumerData = {
                    ...result.consumer,
                    meter: result.meter,
                    dailyConsumption: result.dailyConsumption,
                    monthlyConsumption: result.monthlyConsumption,
                    // Map consumer fields to expected UI fields
                    name: result.consumer.name,
                    uid: result.consumer.consumerNumber,
                    consumerNumber: result.consumer.consumerNumber,
                    balance: result.consumer.creditScore || 0,
                    address: result.consumer.location?.address || 'N/A',
                    location: result.consumer.location?.name || 'N/A',
                    mobile: result.consumer.primaryPhone || 'N/A',
                    mobileNumber: result.consumer.primaryPhone || 'N/A',
                    email: result.consumer.email || 'N/A',
                    emailAddress: result.consumer.email || 'N/A',
                    occupancy: 'Occupied',
                    status: 'Active',
                    lastReading: result.meter?.currentReading || 'N/A',
                    voltage: {
                        rPhase: result.meter?.voltageR || '0.0',
                        yPhase: result.meter?.voltageY || '0.0',
                        bPhase: result.meter?.voltageB || '0.0',
                    },
                    current: {
                        rPhase: result.meter?.currentR || '0.0',
                        yPhase: result.meter?.currentY || '0.0',
                        bPhase: result.meter?.currentB || '0.0',
                    },
                    powerAnalysis: {
                        apparentPower: result.meter?.apparentPower || 0.042,
                        activePower: result.meter?.activePower || 0.041,
                        reactivePower: result.meter?.reactivePower || 0,
                    },
                    powerMetrics: [
                        result.meter?.kVAh || 185,
                        result.meter?.kWh || 180,
                        result.meter?.kWhE || 0,
                        result.meter?.kVArhLag || 0,
                        result.meter?.kVArhLd || 30,
                    ],
                };
                console.log('Raw API response:', result);
                console.log('Processed consumer data:', consumerData);
                setConsumer(consumerData);
            })
            .catch((err) => {
                console.error('Error fetching consumer data:', err);
                
                // Use mock data for development/testing
                console.log('Using mock data for consumer:', );
                const mockConsumerData = {
                    name: uid === 'BI25GMRA001' ? 'Airborne General Store' : 
                          uid === 'BI25GMRA002' ? 'Neo Travels' : 
                          uid === 'BI25GMRA004' ? 'Mobikins' : 'Consumer',
                    uid: uid,
                    consumerNumber: uid,
                    balance: 9426.24,
                    address: '123 Main Street, City, State',
                    location: 'Downtown Area',
                    mobile: '+91 9876543210',
                    mobileNumber: '+91 9876543210',
                    email: 'consumer@example.com',
                    emailAddress: 'consumer@example.com',
                    occupancy: 'Occupied',
                    status: 'Active',
                    lastReading: '2025-01-15 10:30:00',
                    meter: 'A9211434',
                    meterNumber: 'A9211434',
                    voltage: {
                        rPhase: '230.5',
                        yPhase: '231.2',
                        bPhase: '229.8',
                    },
                    current: {
                        rPhase: '15.2',
                        yPhase: '14.8',
                        bPhase: '15.5',
                    },
                    powerAnalysis: {
                        apparentPower: 0.042,
                        activePower: 0.041,
                        reactivePower: 0.008,
                    },
                    powerMetrics: [185, 180, 0, 0, 30],
                    dailyConsumption: {
                        dates: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                        values: [45, 52, 38, 61, 47, 55, 42]
                    },
                    monthlyConsumption: {
                        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        values: [1200, 1350, 1100, 1400, 1250, 1300, 1450, 1200, 1350, 1100, 1400, 1250]
                    },
                    unitHistory: [
                        {
                            uid: uid,
                            meter: 'A9211434',
                            company: 'GHASL',
                            unit: uid === 'BI25GMRA001' ? 'Airborne General Store' : 
                                  uid === 'BI25GMRA002' ? 'Neo Travels' : 
                                  uid === 'BI25GMRA004' ? 'Mobikins' : 'Consumer',
                            created: '05/05/2025',
                        }
                    ],
                    transactionHistory: [
                        {
                            id: 'QoZdA2e76ouhhz',
                            credit: '₹1',
                            balance: '₹9426.24',
                            date: '03/07/2025 16:42:16',
                        },
                        {
                            id: 'QeDoCcKBdmwoSJ',
                            credit: '₹1',
                            balance: '₹9425.24',
                            date: '07/06/2025 12:51:25',
                        },
                        {
                            id: 'QZW4ErZPxJdOUD',
                            credit: '₹1',
                            balance: '₹9424.24',
                            date: '26/05/2025 15:28:06',
                        }
                    ],
                    events: Array.from({ length: 10 }, (_, i) => ({
                        sNo: i + 1,
                        description: 'Meter Power Fail',
                        status: i % 2 === 0 ? 'Start' : 'End',
                        date: [
                            '10/07/2025 00:49:00',
                            '10/07/2025 00:44:00',
                            '05/07/2025 13:08:00',
                            '05/07/2025 13:01:00',
                            '05/07/2025 13:00:00',
                            '05/07/2025 12:57:00',
                            '04/07/2025 14:23:00',
                            '04/07/2025 14:08:00',
                            '25/06/2025 07:29:00',
                            '25/06/2025 07:16:00',
                        ][i] || '01/07/2025 12:00:00',
                    })),
                    connectionActivity: [
                        {
                            sNo: 1,
                            action: 'Connect',
                            performedBy: 'Admin',
                            dateTime: '10/07/2025 09:00:00',
                            remarks: 'Routine connection',
                        },
                        {
                            sNo: 2,
                            action: 'Disconnect',
                            performedBy: 'Operator',
                            dateTime: '12/07/2025 14:30:00',
                            remarks: 'Non-payment',
                        },
                        {
                            sNo: 3,
                            action: 'Connect',
                            performedBy: 'Admin',
                            dateTime: '15/07/2025 10:15:00',
                            remarks: 'Payment received',
                        }
                    ]
                };
                
                setConsumer(mockConsumerData);
                setError(null); // Clear any previous errors
            })
            .finally(() => setLoading(false));
    }, [uid]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error && !consumer) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Consumer not found</h1>
                <div className="bg-danger-light border border-danger rounded-lg p-4">
                    <h3 className="font-semibold text-danger mb-2">Error:</h3>
                    <p className="text-sm text-danger mb-2">
                        {error || 'Consumer data not available'}
                    </p>
                    <p className="text-sm text-danger mb-2">
                        UID from URL: <strong>{uid}</strong>
                    </p>
                    <p className="text-sm text-danger">
                        Please check the URL parameter and ensure it matches a
                        valid consumer UID.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Header Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: consumer.name || 'Consumer Details',
                                    menuItems: menuItems,
                                    onMenuItemClick: handleMenuItemClick,
                                    showMenu: true,
                                    showDropdown: true,
                                    buttonsLabel: 'Recharge',
                                    variant: 'primary',
                                    onClick: () => alert('Recharge'),
                                    onBackClick: handleBackClick,
                                    backButtonText: 'Back to Consumers',
                                    onRightImageClick: handleRefreshClick,
                                },
                            },
                        ],
                    },
                    // Consumer Info Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Holder',
                                props: {
                                    title: 'Basic Information',
                                    DateRange: '',
                                    availableTimeRanges: [],
                                    selectedTimeRange: '',
                                    handleTimeRangeChange: () => {},
                                    handleDownload: () => {},
                                    loading: false,
                                    children: (
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <div className="grid grid-cols-4 gap-4 mb-4">
                                                <div>
                                                    <div className="text-xs text-neutral">
                                                        Current Balance (₹)
                                                    </div>
                                                    <div className="text-secondary text-lg font-bold">
                                                        ₹
                                                        {consumer.balance?.toFixed(
                                                            2
                                                        ) || '0.00'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-neutral">
                                                        Unique Identification No
                                                    </div>
                                                    <div className="text-md font-medium">
                                                        {consumer.uid ||
                                                            consumer.consumerNumber}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-neutral">
                                                        Meter Serial Number
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-2 w-2 bg-secondary rounded-full inline-block"></span>
                                                        {consumer.meter ||
                                                            consumer.meterNumber}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-neutral">
                                                        Occupancy Status
                                                    </div>
                                                    <div className="text-md font-medium">
                                                        {consumer.occupancy ||
                                                            consumer.status ||
                                                            'Unknown'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4">
                                                <div>
                                                    <div className="font-semibold">
                                                        Permanent Address
                                                    </div>
                                                    <div className="text-sm text-neutral">
                                                        {consumer.address ||
                                                            consumer.location ||
                                                            'N/A'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold">
                                                        Billing Address
                                                    </div>
                                                    <div className="text-sm text-neutral">
                                                        {consumer.billingAddress ||
                                                            consumer.address ||
                                                            'N/A'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold">
                                                        Mobile No
                                                    </div>
                                                    <div className="text-sm text-neutral">
                                                        {consumer.mobile ||
                                                            consumer.mobileNumber ||
                                                            'N/A'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold">
                                                        Email ID
                                                    </div>
                                                    <div className="text-sm text-neutral">
                                                        {consumer.email ||
                                                            consumer.emailAddress ||
                                                            'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                            },
                        ],
                    },
                    // Instantaneous Data Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Holder',
                                props: {
                                    title: 'Instantaneous Data',
                                    DateRange: consumer.lastReading
                                        ? `Last Comm Date: ${consumer.lastReading}`
                                        : '',
                                    availableTimeRanges: [],
                                    selectedTimeRange: '',
                                    handleTimeRangeChange: () => {},
                                    handleDownload: () => {},
                                    loading: false,
                                    children: (
                                        <div className="bg-primary-lightest rounded-[var(--radius-2xl)] p-6">
                                            <div className="grid grid-cols-3 gap-4">
                                                <Card
                                                    title="R-Phase Voltage"
                                                    value={
                                                        consumer.voltage
                                                            ?.rPhase || '0.0'
                                                    }
                                                    icon=""
                                                    subtitle1="Volts"
                                                />
                                                <Card
                                                    title="Y-Phase Voltage"
                                                    value={
                                                        consumer.voltage
                                                            ?.yPhase || '0.0'
                                                    }
                                                    icon=""
                                                    subtitle1="Volts"
                                                />
                                                <Card
                                                    title="B-Phase Voltage"
                                                    value={
                                                        consumer.voltage
                                                            ?.bPhase || '0.0'
                                                    }
                                                    icon=""
                                                    subtitle1="Volts"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 mt-4">
                                                <Card
                                                    title="R-Phase Current"
                                                    value={
                                                        consumer.current
                                                            ?.rPhase || '0.0'
                                                    }
                                                    icon="/icons/consumption.svg"
                                                    subtitle1="Amps"
                                                />
                                                <Card
                                                    title="Y-Phase Current"
                                                    value={
                                                        consumer.current
                                                            ?.yPhase || '0.0'
                                                    }
                                                    icon="/icons/consumption.svg"
                                                    subtitle1="Amps"
                                                />
                                                <Card
                                                    title="B-Phase Current"
                                                    value={
                                                        consumer.current
                                                            ?.bPhase || '0.0'
                                                    }
                                                    icon="/icons/consumption.svg"
                                                    subtitle1="Amps"
                                                />
                                            </div>
                                        </div>
                                    ),
                                },
                            },
                        ],
                    },
                    // Power Analysis Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Power Analysis',
                                    level: 2,
                                    size: 'lg',
                                    variant: 'primary',
                                    weight: 'bold',
                                    align: 'left',
                                },
                            },
                            {
                                name: 'Holder',
                                props: {
                                    title: 'Power Analysis',
                                    DateRange: '',
                                    availableTimeRanges: [],
                                    selectedTimeRange: '',
                                    handleTimeRangeChange: () => {},
                                    handleDownload: handlePowerMetricsDownload,
                                    loading: false,
                                    children: (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Power Distribution Card */}
                                            <div className="rounded-2xl shadow p-0 flex flex-col h-full">
                                                <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-primary-lightest rounded-t-2xl">
                                                    <div className="font-semibold text-base">
                                                        Power Distribution
                                                    </div>
                                                    <span
                                                        className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border"
                                                        onClick={() =>
                                                            alert(
                                                                'Download Power Distribution'
                                                            )
                                                        }>
                                                        <img
                                                            alt="Download chart"
                                                            src="icons/download-icon.svg"
                                                            className="w-4 h-4 [filter:var(--icon-color)]"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col md:flex-row items-center justify-between px-6 pb-6 pt-2 gap-4">
                                                    <div className="flex flex-col items-center w-full md:w-2/3">
                                                        {/* Legend above chart */}
                                                        <div className="flex items-center gap-4 mb-2">
                                                            <span className="flex items-center gap-1 text-secondary font-medium text-sm">
                                                                <span className="w-3 h-3 rounded-full bg-secondary inline-block"></span>
                                                                Apparent Power
                                                            </span>
                                                            <span className="flex items-center gap-1 text-accent font-medium text-sm">
                                                                <span className="w-3 h-3 rounded-full bg-accent inline-block"></span>
                                                                Active Power
                                                            </span>
                                                            <span className="flex items-center gap-1 text-danger font-medium text-sm">
                                                                <span className="w-3 h-3 rounded-full bg-danger inline-block"></span>
                                                                Reactive Power
                                                            </span>
                                                        </div>
                                                        {consumer?.powerAnalysis && (
                                                            <PieChart
                                                                data={[
                                                                    {
                                                                        value: consumer
                                                                            .powerAnalysis
                                                                            .apparentPower,
                                                                        name: 'Apparent Power',
                                                                    },
                                                                    {
                                                                        value: consumer
                                                                            .powerAnalysis
                                                                            .activePower,
                                                                        name: 'Active Power',
                                                                    },
                                                                    {
                                                                        value: consumer
                                                                            .powerAnalysis
                                                                            .reactivePower,
                                                                        name: 'Reactive Power',
                                                                    },
                                                                ]}
                                                                colors={[
                                                                    '#22c55e',
                                                                    '#3b82f6',
                                                                    '#ef4444',
                                                                ]}
                                                                height={220}
                                                                showNoDataMessage={
                                                                    false
                                                                }
                                                                title={''}
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Value/percentage box to the right of chart */}
                                                    <div className="flex flex-col items-center w-full md:w-1/3 mt-4 md:mt-0">
                                                        <div className="bg-white rounded-xl p-4 shadow flex flex-col items-start w-full max-w-xs">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-2 text-secondary">
                                                                    <span className="w-3 h-3 rounded-full bg-secondary inline-block"></span>
                                                                    {consumer
                                                                        .powerAnalysis
                                                                        ?.apparentPower ||
                                                                        0.109}
                                                                    kVA{' '}
                                                                    <span className="text-neutral">
                                                                        50.0%
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-accent">
                                                                    <span className="w-3 h-3 rounded-full bg-accent inline-block"></span>
                                                                    {consumer
                                                                        .powerAnalysis
                                                                        ?.activePower ||
                                                                        0.109}
                                                                    kVA{' '}
                                                                    <span className="text-neutral">
                                                                        50.0%
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-danger">
                                                                    <span className="w-3 h-3 rounded-full bg-danger inline-block"></span>
                                                                    {consumer
                                                                        .powerAnalysis
                                                                        ?.reactivePower ||
                                                                        0}
                                                                    kVA{' '}
                                                                    <span className="text-neutral">
                                                                        0.0%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Power Metrics Card */}
                                            <div className="rounded-2xl shadow p-0 flex flex-col h-full">
                                                <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-primary-lightest rounded-t-3xl">
                                                    <div className="font-semibold text-base">
                                                        Power Metrics
                                                    </div>
                                                    <span
                                                        className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border"
                                                        onClick={handlePowerMetricsDownload}>
                                                        <img
                                                            alt="Download chart"
                                                            src="icons/download-icon.svg"
                                                            className="w-4 h-4 [filter:var(--icon-color)]"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="w-full h-64 px-6 pb-6 pt-2">
                                                    {consumer?.powerMetrics && (
                                                        <BarChart
                                                            xAxisData={[
                                                                'kVAh- (i)',
                                                                'kWh(i)',
                                                                'kWh(E)',
                                                                'kVArh-lag(i)',
                                                                'kVArh-Ld(i)',
                                                            ]}
                                                            seriesData={[
                                                                {
                                                                    name: 'Power',
                                                                    data: consumer.powerMetrics,
                                                                },
                                                            ]}
                                                            seriesColors={[
                                                                '#1e3a8a',
                                                            ]}
                                                            height={220}
                                                            showLegendInteractions={
                                                                false
                                                            }
                                                            showXAxisLabel={
                                                                false
                                                            }
                                                            title={''}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                            },
                        ],
                    },
                    // Reports Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Reports',
                                    level: 2,
                                    size: 'lg',
                                    variant: 'primary',
                                    weight: 'bold',
                                    align: 'left',
                                },
                            },
                            {
                                name: 'Holder',
                                props: {
                                    title: 'Reports',
                                    DateRange: '',
                                    availableTimeRanges: [],
                                    selectedTimeRange: '',
                                    handleTimeRangeChange: () => {},
                                    handleDownload: handleDailyConsumptionDownload,
                                    loading: false,
                                    children: (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Daily Consumption Card */}
                                            <div className="rounded-2xl shadow p-0 flex flex-col h-full">
                                                <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-primary-lightest rounded-t-2xl">
                                                    <div className="font-semibold text-base">
                                                        Daily Consumption{' '}
                                                        <span className="text-neutral font-normal text-sm">
                                                            (9 May, 2025 - 10
                                                            Jul, 2025)
                                                        </span>
                                                    </div>
                                                    <span
                                                        className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border"
                                                        onClick={handleDailyConsumptionDownload}>
                                                        <img
                                                            alt="Download chart"
                                                            src="icons/download-icon.svg"
                                                            className="w-4 h-4 [filter:var(--icon-color)]"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="w-full h-64 px-6 pb-6 pt-2">
                                                    {consumer?.dailyConsumption && (
                                                        <BarChart
                                                            xAxisData={
                                                                consumer
                                                                    .dailyConsumption
                                                                    .dates
                                                            }
                                                            seriesData={[
                                                                {
                                                                    name: 'Consumption',
                                                                    data: consumer
                                                                        .dailyConsumption
                                                                        .values,
                                                                },
                                                            ]}
                                                            seriesColors={[
                                                                '#1e3a8a',
                                                            ]}
                                                            height={220}
                                                            showLegendInteractions={
                                                                false
                                                            }
                                                            showXAxisLabel={
                                                                false
                                                            }
                                                            title={''}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Monthly Consumption Card */}
                                            <div className="rounded-2xl shadow p-0 flex flex-col h-full">
                                                <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-primary-lightest rounded-t-2xl">
                                                    <div className="font-semibold text-base">
                                                        Monthly Consumption{' '}
                                                        <span className="text-neutral font-normal text-sm">
                                                            (Jul 2024 - Jul
                                                            2025)
                                                        </span>
                                                    </div>
                                                    <span
                                                        className="cursor-pointer w-8 h-8 rounded-full bg-white flex justify-center items-center relative border border-primary-border"
                                                        onClick={handleMonthlyConsumptionDownload}>
                                                        <img
                                                            alt="Download chart"
                                                            src="icons/download-icon.svg"
                                                            className="w-4 h-4 [filter:var(--icon-color)]"
                                                        />
                                                    </span>
                                                </div>
                                                <div className="w-full h-64 px-6 pb-6 pt-2">
                                                    {consumer?.monthlyConsumption && (
                                                        <BarChart
                                                            xAxisData={
                                                                consumer
                                                                    .monthlyConsumption
                                                                    .months
                                                            }
                                                            seriesData={[
                                                                {
                                                                    name: 'Consumption',
                                                                    data: consumer
                                                                        .monthlyConsumption
                                                                        .values,
                                                                },
                                                            ]}
                                                            seriesColors={[
                                                                '#1e3a8a',
                                                            ]}
                                                            height={220}
                                                            showLegendInteractions={
                                                                false
                                                            }
                                                            showXAxisLabel={
                                                                false
                                                            }
                                                            title={''}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                            },
                        ],
                    },
                    // History Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Holder',
                                props: {
                                    title: 'History',
                                    DateRange: '',
                                    availableTimeRanges: [],
                                    selectedTimeRange: '',
                                    handleTimeRangeChange: () => {},
                                    handleDownload: () => {},
                                    loading: false,
                                    children: (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="font-semibold text-base">
                                                    Unit History
                                                </div>
                                                <div className="bg-white rounded-2xl shadow p-0">
                                                    <Table
                                                        data={
                                                            consumer.unitHistory || [
                                                                {
                                                                    uid:
                                                                        consumer.uid ||
                                                                        consumer.consumerNumber,
                                                                    meter:
                                                                        consumer.meter ||
                                                                        consumer.meterNumber,
                                                                    company:
                                                                        'GHASL',
                                                                    unit: consumer.name,
                                                                    created:
                                                                        consumer.createdAt ||
                                                                        '05/05/2025',
                                                                },
                                                            ]
                                                        }
                                                        columns={[
                                                            {
                                                                key: 'uid',
                                                                label: 'UID',
                                                            },
                                                            {
                                                                key: 'meter',
                                                                label: 'Meter Serial No',
                                                            },
                                                            {
                                                                key: 'company',
                                                                label: 'Company Name',
                                                            },
                                                            {
                                                                key: 'unit',
                                                                label: 'Unit Name',
                                                            },
                                                            {
                                                                key: 'created',
                                                                label: 'Created On',
                                                            },
                                                        ]}
                                                        showActions={false}
                                                        pagination
                                                        searchable={false}
                                                        emptyMessage="No unit history found"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="font-semibold text-base">
                                                    Transaction History
                                                </div>
                                                <div className="bg-white rounded-2xl shadow p-0">
                                                    <Table
                                                        data={
                                                            consumer.transactionHistory || [
                                                                {
                                                                    id: 'QoZdA2e76ouhhz',
                                                                    credit: '₹1',
                                                                    balance:
                                                                        '₹9426.24',
                                                                    date: '03/07/2025 16:42:16',
                                                                },
                                                                {
                                                                    id: 'QeDoCcKBdmwoSJ',
                                                                    credit: '₹1',
                                                                    balance:
                                                                        '₹9425.24',
                                                                    date: '07/06/2025 12:51:25',
                                                                },
                                                                {
                                                                    id: 'QZW4ErZPxJdOUD',
                                                                    credit: '₹1',
                                                                    balance:
                                                                        '₹9424.24',
                                                                    date: '26/05/2025 15:28:06',
                                                                },
                                                                {
                                                                    id: 'QYN7jRAKNqDYL',
                                                                    credit: '₹1',
                                                                    balance:
                                                                        '₹9496.53',
                                                                    date: '23/05/2025 18:04:07',
                                                                },
                                                                {
                                                                    id: 'QYHxztpQCUuEa1',
                                                                    credit: '₹1',
                                                                    balance:
                                                                        '₹9495.53',
                                                                    date: '23/05/2025 13:01:27',
                                                                },
                                                                {
                                                                    id: 'QYHWSWlvVUeYiE',
                                                                    credit: '₹1',
                                                                    balance:
                                                                        '₹9494.53',
                                                                    date: '23/05/2025 12:35:22',
                                                                },
                                                                {
                                                                    id: '',
                                                                    credit: '₹10,000',
                                                                    balance:
                                                                        '₹9598.39',
                                                                    date: '19/05/2025 11:06:34',
                                                                },
                                                            ]
                                                        }
                                                        columns={[
                                                            {
                                                                key: 'id',
                                                                label: 'Transaction ID',
                                                            },
                                                            {
                                                                key: 'credit',
                                                                label: 'Credit Amount',
                                                            },
                                                            {
                                                                key: 'balance',
                                                                label: 'Current Balance Amount',
                                                            },
                                                            {
                                                                key: 'date',
                                                                label: 'Payment Date',
                                                            },
                                                        ]}
                                                        showActions={false}
                                                        pagination
                                                        searchable={false}
                                                        emptyMessage="No transaction history found"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                            },
                        ],
                    },
                    // Events Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Events',
                                    level: 2,
                                    size: 'lg',
                                    variant: 'primary',
                                    weight: 'bold',
                                    align: 'left',
                                },
                            },
                            {
                                name: 'Holder',
                                props: {
                                    title: 'Events',
                                    DateRange: '',
                                    availableTimeRanges: [],
                                    selectedTimeRange: '',
                                    handleTimeRangeChange: () => {},
                                    handleDownload: () => {},
                                    loading: false,
                                    children: (
                                        <div className="bg-white rounded-2xl">
                                            <Table
                                                data={
                                                    consumer.events ||
                                                    Array.from(
                                                        { length: 46 },
                                                        (_, i) => ({
                                                            sNo: i + 1,
                                                            description:
                                                                'Meter Power Fail',
                                                            status:
                                                                i % 2 === 0
                                                                    ? 'Start'
                                                                    : 'End',
                                                            date:
                                                                [
                                                                    '10/07/2025 00:49:00',
                                                                    '10/07/2025 00:44:00',
                                                                    '05/07/2025 13:08:00',
                                                                    '05/07/2025 13:01:00',
                                                                    '05/07/2025 13:00:00',
                                                                    '05/07/2025 12:57:00',
                                                                    '04/07/2025 14:23:00',
                                                                    '04/07/2025 14:08:00',
                                                                    '25/06/2025 07:29:00',
                                                                    '25/06/2025 07:16:00',
                                                                ][i % 10] ||
                                                                '01/07/2025 12:00:00',
                                                        })
                                                    )
                                                }
                                                columns={[
                                                    {
                                                        key: 'sNo',
                                                        label: 'S.No',
                                                    },
                                                    {
                                                        key: 'description',
                                                        label: 'Event Description',
                                                    },
                                                    {
                                                        key: 'status',
                                                        label: 'Status',
                                                    },
                                                    {
                                                        key: 'date',
                                                        label: 'Event Date',
                                                    },
                                                ]}
                                                showActions={false}
                                                pagination
                                                searchable={false}
                                                emptyMessage="No events found"
                                            />
                                        </div>
                                    ),
                                },
                            },
                        ],
                    },
                    // Connection Activity History Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Connection Activity History',
                                    level: 2,
                                    size: 'lg',
                                    variant: 'primary',
                                    weight: 'bold',
                                    align: 'left',
                                },
                            },
                            {
                                name: 'Holder',
                                props: {
                                    title: 'Connection Activity History',
                                    DateRange: '',
                                    availableTimeRanges: [],
                                    selectedTimeRange: '',
                                    handleTimeRangeChange: () => {},
                                    handleDownload: () => {},
                                    loading: false,
                                    children: (
                                        <div className="bg-white rounded-2xl shadow">
                                            <Table
                                                data={
                                                    consumer.connectionActivity || [
                                                        {
                                                            sNo: 1,
                                                            action: 'Connect',
                                                            performedBy:
                                                                'Admin',
                                                            dateTime:
                                                                '10/07/2025 09:00:00',
                                                            remarks:
                                                                'Routine connection',
                                                        },
                                                        {
                                                            sNo: 2,
                                                            action: 'Disconnect',
                                                            performedBy:
                                                                'Operator',
                                                            dateTime:
                                                                '12/07/2025 14:30:00',
                                                            remarks:
                                                                'Non-payment',
                                                        },
                                                        {
                                                            sNo: 3,
                                                            action: 'Connect',
                                                            performedBy:
                                                                'Admin',
                                                            dateTime:
                                                                '15/07/2025 10:15:00',
                                                            remarks:
                                                                'Payment received',
                                                        },
                                                    ]
                                                }
                                                columns={[
                                                    {
                                                        key: 'sNo',
                                                        label: 'S.No',
                                                    },
                                                    {
                                                        key: 'action',
                                                        label: 'Action',
                                                    },
                                                    {
                                                        key: 'performedBy',
                                                        label: 'Performed By',
                                                    },
                                                    {
                                                        key: 'dateTime',
                                                        label: 'Date & Time',
                                                    },
                                                    {
                                                        key: 'remarks',
                                                        label: 'Remarks',
                                                    },
                                                ]}
                                                showActions={false}
                                                pagination
                                                searchable={false}
                                                emptyMessage="No connection activity found"
                                            />
                                        </div>
                                    ),
                                },
                            },
                        ],
                    },
                ]}
                sectionWrapperClassName="mb-8"
            />
        </Suspense>
    );
};

export default ConsumerView;

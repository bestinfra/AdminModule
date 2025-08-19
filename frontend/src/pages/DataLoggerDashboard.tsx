import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import BACKEND_URL from '../config';

interface DataLoggerDetails {
    sNo: number;
    modemSlNo: string;
    hwVersion: string;
    fwVersion: string;
    mobile: string;
    installationDate: string;
    status?: string;
    lastCommunication?: string;
    batteryLevel?: number;
    signalStrength?: number;
    location?: string;
    assignedMeters?: number;
    totalReadings?: number;
}

const DataLoggerDashboard: React.FC = () => {
    const { dataLoggerId } = useParams<{ dataLoggerId: string }>();
    const navigate = useNavigate();
    const [dataLogger, setDataLogger] = useState<DataLoggerDetails | null>(null);
    const [loading, setLoading] = useState(true);

    // Demo data for the specific data logger
    const demoDataLogger: DataLoggerDetails = {
        sNo: 1,
        modemSlNo: 'DL-1001',
        hwVersion: 'HW-1.0',
        fwVersion: 'FW-2.1',
        mobile: '+1-555-0101',
        installationDate: '2024-01-01',
        status: 'Online',
        lastCommunication: '2024-01-15T10:30:00Z',
        batteryLevel: 85,
        signalStrength: 92,
        location: 'Main Distribution Center',
        assignedMeters: 12,
        totalReadings: 15420,
    };

    useEffect(() => {
        const fetchDataLoggerDetails = async () => {
            setLoading(true);
            try {
                // Try to fetch from API first
                const response = await fetch(`${BACKEND_URL}/meters/dataloggers/${dataLoggerId}`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setDataLogger(result.data);
                    } else {
                        throw new Error(result.message || 'Failed to fetch data logger details');
                    }
                } else {
                    throw new Error('Failed to fetch data logger details');
                }
            } catch (error) {
                console.error('Error fetching data logger details:', error);
                // Fallback to demo data
                setDataLogger(demoDataLogger);
            } finally {
                setLoading(false);
            }
        };

        fetchDataLoggerDetails();
    }, [dataLoggerId]);

    if (loading) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Page
                    sections={[
                        {
                            layout: {
                                type: 'row',
                                className: '',
                            },
                            components: [
                                {
                                    name: 'PageHeader',
                                    props: {
                                        title: 'Loading Data Logger Details...',
                                        onBackClick: () => navigate('/data-logger'),
                                        backButtonText: 'Back to Data Logger',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </Suspense>
        );
    }

    if (!dataLogger) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Page
                    sections={[
                        {
                            layout: {
                                type: 'row',
                                className: '',
                            },
                            components: [
                                {
                                    name: 'PageHeader',
                                    props: {
                                        title: 'Data Logger Not Found',
                                        onBackClick: () => navigate('/data-logger'),
                                        backButtonText: 'Back to Data Logger',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </Suspense>
        );
    }

    const summaryCards = [
        {
            title: 'Status',
            value: dataLogger.status || 'Unknown',
            icon: '/icons/status.svg',
            subtitle1: dataLogger.lastCommunication 
                ? `Last Communication: ${new Date(dataLogger.lastCommunication).toLocaleString()}`
                : 'No communication data',
            subtitle2: '',
        },
        {
            title: 'Battery Level',
            value: `${dataLogger.batteryLevel || 0}%`,
            icon: '/icons/battery.svg',
            subtitle1: dataLogger.batteryLevel && dataLogger.batteryLevel < 20 
                ? 'Low Battery Warning' 
                : 'Battery OK',
            subtitle2: '',
        },
        {
            title: 'Signal Strength',
            value: `${dataLogger.signalStrength || 0}%`,
            icon: '/icons/signal.svg',
            subtitle1: dataLogger.signalStrength && dataLogger.signalStrength > 80 
                ? 'Excellent Signal' 
                : 'Signal OK',
            subtitle2: '',
        },
        {
            title: 'Assigned Meters',
            value: dataLogger.assignedMeters?.toString() || '0',
            icon: '/icons/meter.svg',
            subtitle1: `Total Readings: ${dataLogger.totalReadings?.toLocaleString() || '0'}`,
            subtitle2: '',
        },
    ];

    // const dataLoggerInfo = [
    //     { title: 'DCU/Modem Serial No.', value: dataLogger.modemSlNo },
    //     { title: 'Hardware Version', value: dataLogger.hwVersion },
    //     { title: 'Firmware Version', value: dataLogger.fwVersion },
    //     { title: 'Mobile Number', value: dataLogger.mobile },
    //     { title: 'Installation Date', value: dataLogger.installationDate },
    //     { title: 'Location', value: dataLogger.location || 'Not specified' },
    // ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    {
                        layout: {
                            type: 'row',
                            className: '',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: `Data Logger: ${dataLogger.modemSlNo}`,
                                    onBackClick: () => navigate('/data-logger'),
                                    backButtonText: 'Back to Data Logger',
                                    buttonsLabel: 'Edit Data Logger',
                                    variant: 'primary',
                                    onClick: () => console.log('Edit data logger:', dataLogger),
                                    showMenu: true,
                                    showDropdown: true,
                                    menuItems: [
                                        { id: 'configure', label: 'Configure' },
                                        { id: 'restart', label: 'Restart Device' },
                                        { id: 'firmware', label: 'Update Firmware' },
                                        { id: 'maintenance', label: 'Schedule Maintenance' },
                                        { id: 'export', label: 'Export Data' },
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        console.log(`Action: ${itemId} for data logger ${dataLogger.modemSlNo}`);
                                    },
                                },
                            },
                        ],
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 4,
                            gap: 'gap-4',
                            className: '',
                        },
                        components: summaryCards.map((card, index) => ({
                            name: 'Card',
                            props: {
                                ...card,
                                key: index,
                            },
                        })),
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 1,
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: [
                                                    {
                                                        meterSlNo: 'A9345417',
                                                        consumerName: 'John Doe',
                                                        lastReading: '150.5 kWh',
                                                        readingDate: '2024-01-15 10:30:00',
                                                        status: 'Active',
                                                    },
                                                    {
                                                        meterSlNo: 'A9345418',
                                                        consumerName: 'Jane Smith',
                                                        lastReading: '89.2 kWh',
                                                        readingDate: '2024-01-15 10:29:00',
                                                        status: 'Active',
                                                    },
                                                    {
                                                        meterSlNo: 'A9345419',
                                                        consumerName: 'Bob Johnson',
                                                        lastReading: '234.1 kWh',
                                                        readingDate: '2024-01-15 10:28:00',
                                                        status: 'Active',
                                                    },
                                                ],
                                                columns: [
                                                    { key: 'meterSlNo', label: 'Meter Serial No.' },
                                                    { key: 'consumerName', label: 'Consumer Name' },
                                                    { key: 'lastReading', label: 'Last Reading' },
                                                    { key: 'readingDate', label: 'Reading Date' },
                                                    { key: 'status', label: 'Status' },
                                                ],
                                                loading: false,
                                                showHeader: false,
                                                headerTitle: 'Connected Meters',
                                                dateRange: 'Real-time data',
                                                searchable: true,
                                                sortable: true,
                                                pagination: true,
                                                showActions: true,
                                                text: 'Meters connected to this data logger',
                                                emptyMessage: 'No meters connected to this data logger',
                                                onView: (row: any) => console.log('View meter:', row),
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
        </Suspense>
    );
};

export default DataLoggerDashboard;

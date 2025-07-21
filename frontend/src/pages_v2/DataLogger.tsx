import { useState } from 'react';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';

export default function DataLogger() {
    const [dataLoggerData] = useState([
        {
            id: 'DL-001',
            deviceId: 'DL-001',
            deviceName: 'Main Substation Logger',
            location: 'Main Substation',
            status: 'Online',
            lastReading: '2024-01-16 14:30:00',
            voltage: '220V',
            current: '150A',
            power: '33kW',
            frequency: '50Hz',
            temperature: '45°C',
            batteryLevel: '85%',
        },
        {
            id: 'DL-002',
            deviceId: 'DL-002',
            deviceName: 'Distribution Panel Logger',
            location: 'Building A',
            status: 'Online',
            lastReading: '2024-01-16 14:29:00',
            voltage: '110V',
            current: '75A',
            power: '8.25kW',
            frequency: '50Hz',
            temperature: '38°C',
            batteryLevel: '92%',
        },
        {
            id: 'DL-003',
            deviceId: 'DL-003',
            deviceName: 'Transformer Logger',
            location: 'Transformer Station',
            status: 'Offline',
            lastReading: '2024-01-16 12:15:00',
            voltage: '0V',
            current: '0A',
            power: '0kW',
            frequency: '0Hz',
            temperature: '25°C',
            batteryLevel: '15%',
        },
        {
            id: 'DL-004',
            deviceId: 'DL-004',
            deviceName: 'Metering Logger',
            location: 'Commercial Zone',
            status: 'Online',
            lastReading: '2024-01-16 14:28:00',
            voltage: '220V',
            current: '200A',
            power: '44kW',
            frequency: '50Hz',
            temperature: '42°C',
            batteryLevel: '78%',
        },
        {
            id: 'DL-005',
            deviceId: 'DL-005',
            deviceName: 'Residential Logger',
            location: 'Residential Area',
            status: 'Online',
            lastReading: '2024-01-16 14:31:00',
            voltage: '110V',
            current: '45A',
            power: '4.95kW',
            frequency: '50Hz',
            temperature: '35°C',
            batteryLevel: '88%',
        },
        {
            id: 'DL-006',
            deviceId: 'DL-006',
            deviceName: 'Industrial Logger',
            location: 'Industrial Zone',
            status: 'Online',
            lastReading: '2024-01-16 14:27:00',
            voltage: '380V',
            current: '300A',
            power: '114kW',
            frequency: '50Hz',
            temperature: '55°C',
            batteryLevel: '65%',
        },
        {
            id: 'DL-007',
            deviceId: 'DL-007',
            deviceName: 'Backup Logger',
            location: 'Emergency Station',
            status: 'Standby',
            lastReading: '2024-01-16 10:00:00',
            voltage: '220V',
            current: '10A',
            power: '2.2kW',
            frequency: '50Hz',
            temperature: '30°C',
            batteryLevel: '95%',
        },
        {
            id: 'DL-008',
            deviceId: 'DL-008',
            deviceName: 'Monitoring Logger',
            location: 'Control Room',
            status: 'Online',
            lastReading: '2024-01-16 14:32:00',
            voltage: '220V',
            current: '120A',
            power: '26.4kW',
            frequency: '50Hz',
            temperature: '40°C',
            batteryLevel: '82%',
        },
    ]);

    const [tableColumns] = useState([
        { key: 'deviceId', label: 'Device ID' },
        { key: 'deviceName', label: 'Device Name' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' },
        { key: 'lastReading', label: 'Last Reading' },
        { key: 'voltage', label: 'Voltage' },
        { key: 'current', label: 'Current' },
        { key: 'power', label: 'Power' },
        { key: 'frequency', label: 'Frequency' },
        { key: 'temperature', label: 'Temperature' },
        { key: 'batteryLevel', label: 'Battery Level' },
    ]);

    const [serverPagination] = useState({
        currentPage: 1,
        totalPages: 5,
        totalCount: 42,
        limit: 8,
        hasNextPage: true,
        hasPrevPage: false,
    });

    const handlePageChange = (page: number, limit: number) => {
        console.log('Page changed:', { page, limit });
    };

    return (
        <Page
            sections={[
                {
                    layout: {
                        type: 'grid',
                        columns: 1,
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 1,
                                gap: 'gap-6',
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            data: dataLoggerData,
                                            columns: tableColumns,
                                            showHeader: false,
                                            headerTitle: 'Data Logger Devices',
                                            dateRange: 'Real-time monitoring',
                                            searchable: true,
                                            sortable: true,
                                            pagination: true,
                                            showActions: true,
                                            text: 'Data Logger Management Table',
                                            serverPagination: serverPagination,
                                            onPageChange: handlePageChange,
                                            onEdit: (row: TableData) =>
                                                console.log('Edit:', row),
                                            onDelete: (row: TableData) =>
                                                console.log('Delete:', row),
                                            onView: (row: TableData) =>
                                                console.log('View:', row),
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ]}
        />
    );
}

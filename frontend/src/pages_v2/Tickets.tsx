import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
// const Page = lazy(() => import('@/components/global/PageC'));
import Page from '../components/global/PageC';
import type { TableData } from '@/components/global/Table';
import BACKEND_URL from '../config';
import { exportChartData } from '@/utils/excelExport';

export default function Tickets() {
    const navigate = useNavigate();
    const [ticketStats, setTicketStats] = useState<any>(null);
    const [ticketTrends, setTicketTrends] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);

    // Dummy data for development
    const dummyTickets = [
        {
            id: 336,
            ticketNumber: '336',
            customerName: 'BI25GMRA001',
            subject: 'Testing',
            priority: 'High',
            status: 'Open',
            assignedTo: 'Support Team',
            createdAt: '2024-01-15T10:30:00Z',
            lastUpdated: '2024-01-16T14:20:00Z',
            category: 'Connection Issue',
            responseTime: '2h 15m',
            meterSerialNo: 'A9211434',
            email: 'customer1@example.com',
            phone: '+91-9876543210',
            description: 'Testing connection issue with meter.',
        },
        {
            id: 335,
            ticketNumber: '335',
            customerName: 'BI25GMRA001',
            subject: 'Issue',
            priority: 'High',
            status: 'Open',
            assignedTo: 'Technical Team',
            createdAt: '2024-01-14T09:15:00Z',
            lastUpdated: '2024-01-16T11:45:00Z',
            category: 'Meter Issue',
            responseTime: '1h 30m',
            meterSerialNo: 'A9211434',
            email: 'customer1@example.com',
            phone: '+91-9876543210',
            description: 'Meter showing connection error.',
        },
        {
            id: 333,
            ticketNumber: '333',
            customerName: 'BI25GMRA001',
            subject: 'Communication Issue',
            priority: 'Medium',
            status: 'Open',
            assignedTo: 'IT Team',
            createdAt: '2024-01-13T16:45:00Z',
            lastUpdated: '2024-01-16T08:30:00Z',
            category: 'Billing',
            responseTime: '45m',
            meterSerialNo: 'A9211434',
            email: 'customer1@example.com',
            phone: '+91-9876543210',
            description: 'Communication issue with billing system.',
        },
        {
            id: 332,
            ticketNumber: '332',
            customerName: 'BI25GMRA002',
            subject: 'MMMM',
            priority: 'Low',
            status: 'Open',
            assignedTo: 'Customer Service',
            createdAt: '2024-01-12T13:20:00Z',
            lastUpdated: '2024-01-15T17:10:00Z',
            category: 'Connection Issue',
            responseTime: '3h 20m',
            meterSerialNo: 'A9345417',
            email: 'customer2@example.com',
            phone: '+91-8765432109',
            description: 'Meter maintenance request.',
        },
        {
            id: 327,
            ticketNumber: '327',
            customerName: 'BI25GMRA002',
            subject: 'MMMM',
            priority: 'Low',
            status: 'Open',
            assignedTo: 'Installation Team',
            createdAt: '2024-01-11T08:00:00Z',
            lastUpdated: '2024-01-16T08:00:00Z',
            category: 'Meter Issue',
            responseTime: '1h 45m',
            meterSerialNo: 'A9345417',
            email: 'customer2@example.com',
            phone: '+91-8765432109',
            description: 'Meter installation verification needed.',
        },
        {
            id: 326,
            ticketNumber: '326',
            customerName: 'BI25GMRA002',
            subject: 'MMMM',
            priority: 'Medium',
            status: 'Open',
            assignedTo: 'Emergency Team',
            createdAt: '2024-01-10T06:30:00Z',
            lastUpdated: '2024-01-16T10:15:00Z',
            category: 'Billing',
            responseTime: '30m',
            meterSerialNo: 'A9345417',
            email: 'customer2@example.com',
            phone: '+91-8765432109',
            description: 'Billing discrepancy report.',
        },
        {
            id: 325,
            ticketNumber: '325',
            customerName: 'BI25GMRA002',
            subject: 'MMMM',
            priority: 'Low',
            status: 'Open',
            assignedTo: 'Support Team',
            createdAt: '2024-01-09T14:20:00Z',
            lastUpdated: '2024-01-16T09:30:00Z',
            category: 'Connection Issue',
            responseTime: '2h 10m',
            meterSerialNo: 'A9345417',
            email: 'customer2@example.com',
            phone: '+91-8765432109',
            description: 'Connection stability issue.',
        },
        {
            id: 324,
            ticketNumber: '324',
            customerName: 'BI25GMRA002',
            subject: 'MMMM',
            priority: 'Medium',
            status: 'Open',
            assignedTo: 'Billing Team',
            createdAt: '2024-01-08T11:00:00Z',
            lastUpdated: '2024-01-16T11:00:00Z',
            category: 'Meter Issue',
            responseTime: '1h 20m',
            meterSerialNo: 'A9345417',
            email: 'customer2@example.com',
            phone: '+91-8765432109',
            description: 'Meter reading accuracy check.',
        },
        {
            id: 323,
            ticketNumber: '323',
            customerName: 'BI25GMRA002',
            subject: 'MMMM',
            priority: 'Medium',
            status: 'Open',
            assignedTo: 'Customer Service',
            createdAt: '2024-01-07T16:45:00Z',
            lastUpdated: '2024-01-16T12:20:00Z',
            category: 'Billing',
            responseTime: '4h 15m',
            meterSerialNo: 'A9345417',
            email: 'customer2@example.com',
            phone: '+91-8765432109',
            description: 'Billing query resolution.',
        },
        {
            id: 322,
            ticketNumber: '322',
            customerName: 'BI25GMRA002',
            subject: 'MMMM',
            priority: 'Medium',
            status: 'Open',
            assignedTo: 'Investigation Team',
            createdAt: '2024-01-06T10:30:00Z',
            lastUpdated: '2024-01-16T07:45:00Z',
            category: 'Connection Issue',
            responseTime: '1h 5m',
            meterSerialNo: 'A9345417',
            email: 'customer2@example.com',
            phone: '+91-8765432109',
            description: 'Connection investigation request.',
        },
        {
            id: 321,
            ticketNumber: '321',
            customerName: 'BI25GMRA003',
            subject: 'Billing Query',
            priority: 'Low',
            status: 'In Progress',
            assignedTo: 'Billing Team',
            createdAt: '2024-01-05T14:15:00Z',
            lastUpdated: '2024-01-16T06:20:00Z',
            category: 'Billing',
            responseTime: '2h 30m',
            meterSerialNo: 'A9456789',
            email: 'customer3@example.com',
            phone: '+91-7654321098',
            description: 'Billing query resolution.',
        },
        {
            id: 320,
            ticketNumber: '320',
            customerName: 'BI25GMRA003',
            subject: 'Meter Reading Issue',
            priority: 'High',
            status: 'Resolved',
            assignedTo: 'Technical Team',
            createdAt: '2024-01-04T09:45:00Z',
            lastUpdated: '2024-01-15T16:30:00Z',
            category: 'Meter Issue',
            responseTime: '1h 15m',
            meterSerialNo: 'A9456789',
            email: 'customer3@example.com',
            phone: '+91-7654321098',
            description: 'Meter reading accuracy issue.',
        },
        {
            id: 319,
            ticketNumber: '319',
            customerName: 'BI25GMRA004',
            subject: 'Connection Problem',
            priority: 'Medium',
            status: 'Closed',
            assignedTo: 'Support Team',
            createdAt: '2024-01-03T11:20:00Z',
            lastUpdated: '2024-01-14T15:45:00Z',
            category: 'Connection Issue',
            responseTime: '3h 45m',
            meterSerialNo: 'A9567890',
            email: 'customer4@example.com',
            phone: '+91-6543210987',
            description: 'Connection stability problem.',
        },
        {
            id: 318,
            ticketNumber: '318',
            customerName: 'BI25GMRA004',
            subject: 'Installation Request',
            priority: 'Low',
            status: 'Open',
            assignedTo: 'Installation Team',
            createdAt: '2024-01-02T08:30:00Z',
            lastUpdated: '2024-01-16T09:15:00Z',
            category: 'Meter Issue',
            responseTime: '4h 20m',
            meterSerialNo: 'A9567890',
            email: 'customer4@example.com',
            phone: '+91-6543210987',
            description: 'New meter installation request.',
        },
        {
            id: 317,
            ticketNumber: '317',
            customerName: 'BI25GMRA005',
            subject: 'Billing Dispute',
            priority: 'High',
            status: 'In Progress',
            assignedTo: 'Billing Team',
            createdAt: '2024-01-01T12:00:00Z',
            lastUpdated: '2024-01-16T08:45:00Z',
            category: 'Billing',
            responseTime: '1h 30m',
            meterSerialNo: 'A9678901',
            email: 'customer5@example.com',
            phone: '+91-5432109876',
            description: 'Billing dispute resolution.',
        },
        {
            id: 316,
            ticketNumber: '316',
            customerName: 'BI25GMRA005',
            subject: 'Meter Reading Error',
            priority: 'Medium',
            status: 'Resolved',
            assignedTo: 'Technical Team',
            createdAt: '2023-12-31T15:30:00Z',
            lastUpdated: '2024-01-15T17:20:00Z',
            category: 'Meter Issue',
            responseTime: '2h 45m',
            meterSerialNo: 'A9678901',
            email: 'customer5@example.com',
            phone: '+91-5432109876',
            description: 'Meter reading accuracy issue.',
        },
        {
            id: 315,
            ticketNumber: '315',
            customerName: 'BI25GMRA006',
            subject: 'Connection Loss',
            priority: 'High',
            status: 'Closed',
            assignedTo: 'Emergency Team',
            createdAt: '2023-12-30T09:15:00Z',
            lastUpdated: '2024-01-14T14:30:00Z',
            category: 'Connection Issue',
            responseTime: '45m',
            meterSerialNo: 'A9789012',
            email: 'customer6@example.com',
            phone: '+91-4321098765',
            description: 'Emergency connection restoration.',
        },
        {
            id: 314,
            ticketNumber: '314',
            customerName: 'BI25GMRA006',
            subject: 'Service Upgrade',
            priority: 'Low',
            status: 'Open',
            assignedTo: 'Customer Service',
            createdAt: '2023-12-29T11:45:00Z',
            lastUpdated: '2024-01-16T10:00:00Z',
            category: 'Meter Issue',
            responseTime: '3h 15m',
            meterSerialNo: 'A9789012',
            email: 'customer6@example.com',
            phone: '+91-4321098765',
            description: 'Service upgrade request.',
        },
    ];



    // Fetch ticket stats
    useEffect(() => {
        fetch(`${BACKEND_URL}/tickets/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTicketStats(data.data);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch ticket stats:', err);
                // Fallback dummy stats
                setTicketStats({
                    total: 156,
                    open: 23,
                    inProgress: 45,
                    resolved: 67,
                    closed: 21
                });
            });
    }, []);

    useEffect(() => {
        fetch(`${BACKEND_URL}/tickets/trends`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTicketTrends(data.data);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch ticket trends:', err);
                // Fallback dummy trends
                setTicketTrends({
                    xAxisData: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    seriesData: [
                        {
                            name: 'Open Tickets',
                            data: [45, 52, 38, 67, 58, 42, 35, 48, 55, 62, 41, 38]
                        },
                        {
                            name: 'In Progress Tickets',
                            data: [28, 35, 25, 42, 38, 28, 22, 32, 38, 45, 28, 25]
                        },
                        {
                            name: 'Resolved Tickets',
                            data: [38, 45, 32, 58, 49, 35, 28, 41, 48, 55, 34, 31]
                        },
                        {
                            name: 'Closed Tickets',
                            data: [12, 15, 8, 22, 18, 11, 7, 14, 16, 19, 10, 9]
                        }
                    ],
                    seriesColors: ['#163b7c', '#55b56c', '#dc272c', '#ed8c22']
                });
            });
    }, []);

    const fetchTicketsTable = () => {
        fetch(`${BACKEND_URL}/tickets/table`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTickets(data.data);
                } else {
                    // Fallback to dummy data
                    setTickets(dummyTickets);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch ticket data:', err);
                // Fallback to dummy data
                setTickets(dummyTickets);
            })
            .finally(() => {});
    };

    useEffect(() => {
        fetchTicketsTable();
    }, []);

    // Handle ticket actions
    const handleViewTicket = (row: TableData) => {
        console.log('Viewing ticket:', row);
        navigate(`/tickets/${row.id}`);
    };

    const handleEditTicket = (row: TableData) => {
        console.log('Editing ticket:', row);
        navigate(`/tickets/${row.id}/edit`);
    };

    const handleDeleteTicket = (row: TableData) => {
        console.log('Deleting ticket:', row);
        if (confirm(`Are you sure you want to delete ticket ${row.ticketNumber}?`)) {
            console.log('Ticket deleted:', row.id);
        }
    };

    // Brand green icon style
    const brandGreenIconStyle = {
        filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
    };

    const [tableColumns] = useState([
        { key: 'ticketNumber', label: 'Ticket ID' },
        { key: 'customerName', label: 'Consumer UID' },
        { key: 'subject', label: 'Subject' },
        { key: 'meterSerialNo', label: 'Meter Serial No' },
        { key: 'category', label: 'Category' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'assignedTo', label: 'Assigned To' },
        { key: 'createdAt', label: 'Created Date' },
    ]);

    const statsArray = [
        { key: 'total', label: 'Total Tickets', icon: 'icons/open-tickets.svg', subtitle1: 'Total active tickets', subtitle2: 'Last 24 hours', iconStyle: brandGreenIconStyle },
        { key: 'open', label: 'Open Tickets', icon: 'icons/check-circle.svg', subtitle1: 'Successfully resolved', subtitle2: 'Today', iconStyle: brandGreenIconStyle },
        { key: 'inProgress', label: 'In Progress Tickets', icon: 'icons/progress.svg', subtitle1: 'Customer satisfaction', subtitle2: 'Target: 4h', iconStyle: brandGreenIconStyle },
        { key: 'resolved', label: 'Resolved Tickets', icon: 'icons/alert-triggered.svg', subtitle1: 'Requires attention', subtitle2: 'High priority', iconStyle: brandGreenIconStyle },
        { key: 'closed', label: 'Closed Tickets', icon: 'icons/closed.svg', subtitle1: 'Based on 156 reviews', subtitle2: 'This month', iconStyle: brandGreenIconStyle },
    ];

    // Chart download handler
    const handleChartDownload = () => {
        if (ticketTrends?.xAxisData && ticketTrends?.seriesData) {
            exportChartData(ticketTrends.xAxisData, ticketTrends.seriesData, 'ticket-statistics-data');
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <Page
            sections={[
                {
                    layout: {
                        type: 'row',
                        className: ''
                    },
                    components: [
                        {
                            name: 'PageHeader',
                            props: {
                                title: "Tickets",
                                onBackClick: () => window.history.back(),
                                backButtonText: "Back to Dashboard",
                                buttonsLabel: "Add Ticket",
                                variant: "primary",
                                onClick: () => navigate('/add-ticket'),
                                onMenuItemClick: (itemId: string) => {
                                    console.log(`Filter by: ${itemId}`);
                                }
                            }
                        }
                    ]
                },
                {
                    layout: {
                        type: 'column',
                        rows: [
                            {
                                layout: 'row',
                                columns: statsArray.map(stat => ({
                                    name: 'Card',
                                    props: {
                                        title: stat.label,
                                        value: ticketStats ? ticketStats[stat.key] : 0,
                                        icon: stat.icon,
                                        subtitle1: stat.subtitle1,
                                        subtitle2: stat.subtitle2,
                                        iconStyle: stat.iconStyle,
                                        bg: "bg-stat-icon-gradient",
                                    },
                                })),
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid',
                        columns: 1,
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 1,
                                columns: [
                                    {
                                        name: 'BarChart',
                                        props: {
                                            xAxisData: ticketTrends?.xAxisData || [],
                                            seriesData: ticketTrends?.seriesData || [],
                                            seriesColors:   
                                                ticketTrends?.seriesColors || [],
                                            height: '400px',
                                            showHeader: true,
                                            headerTitle: 'Ticket Statistics',
                                            dateRange: '2024',
                                            showDownloadButton: true,
                                            headerHeight: 'h-12',
                                            ariaLabel:
                                                'Monthly ticket statistics chart',
                                            onDownload: handleChartDownload,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid',
                        columns: 1,
                        gap: 'gap-6',
                        className: 'pb-5',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 1,
                                gap: 'gap-4',
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            data: tickets,
                                            columns: tableColumns,
                                            showHeader: true,
                                            headerTitle: 'Recent Tickets',
                                            dateRange: 'Last 30 days',
                                            headerClassName: 'h-18',
                                            searchable: true,
                                            sortable: true,
                                            pagination: true,
                                            initialRowsPerPage: 10,
                                            showActions: true,
                                            text: 'Ticket Management Table',
                                            onEdit: handleEditTicket,
                                            onDelete: handleDeleteTicket,
                                            onView: handleViewTicket,
                                            availableTimeRanges: [],
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
}

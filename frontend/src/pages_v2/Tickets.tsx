import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';
import BACKEND_URL from '../config';

export default function Tickets() {
    const navigate = useNavigate();
    const [ticketStats, setTicketStats] = useState<any>(null);
    const [ticketTrends, setTicketTrends] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);

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
    ];

    const dummyPagination = {
        currentPage: 1,
        totalPages: 3,
        totalItems: 24,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: false,
    };

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
                            name: 'Resolved Tickets',
                            data: [38, 45, 32, 58, 49, 35, 28, 41, 48, 55, 34, 31]
                        },
                        {
                            name: 'Escalated Tickets',
                            data: [12, 15, 8, 22, 18, 11, 7, 14, 16, 19, 10, 9]
                        }
                    ],
                    seriesColors: ['#3B82F6', '#10B981', '#F59E0B']
                });
            });
    }, []);

    const fetchTicketsTable = (page: number = 1, limit: number = 10) => {
        fetch(`${BACKEND_URL}/tickets/table?page=${page}&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTickets(data.data);
                    setPagination(data.pagination);
                } else {
                    // Fallback to dummy data
                    setTickets(dummyTickets);
                    setPagination(dummyPagination);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch ticket data:', err);
                // Fallback to dummy data
                setTickets(dummyTickets);
                setPagination(dummyPagination);
            })
            .finally(() => {});
    };

    useEffect(() => {
        fetchTicketsTable();
    }, []);

    const handleTicketPageChange = (page: number, limit: number) => {
        fetchTicketsTable(page, limit);
    };

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
        { key: 'meterSerialNo', label: 'Meter Serial No' },
        { key: 'category', label: 'Category' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
    ]);

    const statsArray = [
        { key: 'total', label: 'Total Tickets', icon: 'icons/open-tickets.svg', subtitle1: 'Total active tickets', subtitle2: 'Last 24 hours', iconStyle: brandGreenIconStyle },
        { key: 'open', label: 'Open Tickets', icon: 'icons/check-circle.svg', subtitle1: 'Successfully resolved', subtitle2: 'Today', iconStyle: brandGreenIconStyle },
        { key: 'inProgress', label: 'In Progress Tickets', icon: 'icons/clock.svg', subtitle1: 'Customer satisfaction', subtitle2: 'Target: 4h', iconStyle: brandGreenIconStyle },
        { key: 'resolved', label: 'Resolved Tickets', icon: 'icons/alert-triggered.svg', subtitle1: 'Requires attention', subtitle2: 'High priority', iconStyle: brandGreenIconStyle },
        { key: 'closed', label: 'Closed Tickets', icon: 'icons/star.svg', subtitle1: 'Based on 156 reviews', subtitle2: 'This month', iconStyle: brandGreenIconStyle },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <Page
            sections={[
                {
                    layout: {
                        type: 'row',
                        className: 'mb-6'
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
                                showMenu: true,
                                showDropdown: true,
                                menuItems: [
                                    { id: 'all', label: 'All Tickets' },
                                    { id: 'open', label: 'Open Tickets' },
                                    { id: 'in-progress', label: 'In Progress' },
                                    { id: 'resolved', label: 'Resolved' },
                                    { id: 'closed', label: 'Closed' },
                                    { id: 'escalated', label: 'Escalated' }
                                ],
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
                                            showViewToggle: true,
                                            viewToggleOptions: [
                                                'Graph',
                                                'Table',
                                            ],
                                            showTableView: true,
                                            ariaLabel:
                                                'Monthly ticket statistics chart',
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
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 1,
                                gap: 'gap-6',
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            data: tickets,
                                            columns: tableColumns,
                                            showHeader: false,
                                            headerTitle: 'Recent Tickets',
                                            dateRange: 'Last 30 days',
                                            searchable: true,
                                            sortable: true,
                                            pagination: true,
                                            showActions: true,
                                            text: 'Ticket Management Table',
                                            serverPagination: pagination,
                                            onPageChange: handleTicketPageChange,
                                             onEdit: handleEditTicket,
                                             onDelete: handleDeleteTicket,
                                             onView: handleViewTicket,
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

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
                }
            })
            .catch((err) => {
                console.error('Failed to fetch ticket data:', err);
                // Fallback dummy data
                const dummyTickets = [
                    {
                        id: 'TICKET-001',
                        ticketNumber: 'TICKET-001',
                        customerName: 'John Smith',
                        subject: 'Power Outage in Downtown Area',
                        priority: 'High',
                        status: 'Open',
                        assignedTo: 'Sarah Johnson',
                        createdAt: '2024-01-15 09:30:00',
                        lastUpdated: '2024-01-16 14:20:00',
                        category: 'Power Outage',
                        responseTime: '2h 15m',
                        description: 'Complete power outage affecting 50+ customers in downtown area. Emergency response required.',
                        location: '123 Main St, Downtown',
                        contactPhone: '+1-555-0123',
                        contactEmail: 'john.smith@email.com'
                    },
                    {
                        id: 'TICKET-002',
                        ticketNumber: 'TICKET-002',
                        customerName: 'Emily Davis',
                        subject: 'Meter Reading Issue',
                        priority: 'Medium',
                        status: 'In Progress',
                        assignedTo: 'Mike Chen',
                        createdAt: '2024-01-14 11:45:00',
                        lastUpdated: '2024-01-16 10:15:00',
                        category: 'Meter Issues',
                        responseTime: '4h 30m',
                        description: 'Customer reports incorrect meter readings. Investigation needed.',
                        location: '456 Oak Ave, Suburb',
                        contactPhone: '+1-555-0456',
                        contactEmail: 'emily.davis@email.com'
                    },
                    {
                        id: 'TICKET-003',
                        ticketNumber: 'TICKET-003',
                        customerName: 'Robert Wilson',
                        subject: 'Billing Dispute',
                        priority: 'Low',
                        status: 'Resolved',
                        assignedTo: 'Lisa Park',
                        createdAt: '2024-01-13 16:20:00',
                        lastUpdated: '2024-01-15 09:45:00',
                        category: 'Billing',
                        responseTime: '1h 45m',
                        description: 'Customer disputing monthly bill amount. Investigation completed.',
                        location: '789 Pine Rd, Village',
                        contactPhone: '+1-555-0789',
                        contactEmail: 'robert.wilson@email.com'
                    },
                    {
                        id: 'TICKET-004',
                        ticketNumber: 'TICKET-004',
                        customerName: 'Maria Garcia',
                        subject: 'Service Connection Request',
                        priority: 'Medium',
                        status: 'Open',
                        assignedTo: 'David Kim',
                        createdAt: '2024-01-16 08:15:00',
                        lastUpdated: '2024-01-16 08:15:00',
                        category: 'New Connection',
                        responseTime: '0h 30m',
                        description: 'New customer requesting service connection for residential property.',
                        location: '321 Elm St, New District',
                        contactPhone: '+1-555-0321',
                        contactEmail: 'maria.garcia@email.com'
                    },
                    {
                        id: 'TICKET-005',
                        ticketNumber: 'TICKET-005',
                        customerName: 'James Brown',
                        subject: 'Equipment Maintenance',
                        priority: 'High',
                        status: 'Escalated',
                        assignedTo: 'Technical Team',
                        createdAt: '2024-01-15 13:00:00',
                        lastUpdated: '2024-01-16 16:30:00',
                        category: 'Equipment',
                        responseTime: '6h 45m',
                        description: 'Critical equipment failure at substation. Immediate attention required.',
                        location: 'Substation Alpha, Industrial Zone',
                        contactPhone: '+1-555-0654',
                        contactEmail: 'james.brown@email.com'
                    }
                ];
                setTickets(dummyTickets);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: dummyTickets.length,
                    itemsPerPage: limit
                });
            })
            .finally(() => {});
    };

    useEffect(() => {
        fetchTicketsTable();
    }, []);

    const handleTicketPageChange = (page: number, limit: number) => {
        fetchTicketsTable(page, limit);
    };

    const [tableColumns] = useState([
        { key: 'ticketNumber', label: 'Ticket ID' },
        { key: 'consumerUid', label: 'Consumer UID' },
        { key: 'subject', label: 'Subject' },
        { key: 'meterSerialNo', label: 'Meter Serial No' },
        { key: 'category', label: 'Category' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
    ]);

    const statsArray = [
        { key: 'total', label: 'Total Tickets', icon: 'icons/open-tickets.svg', subtitle1: 'Total active tickets', subtitle2: 'Last 24 hours' },
        { key: 'open', label: 'Open Tickets', icon: 'icons/check-circle.svg', subtitle1: 'Successfully resolved', subtitle2: 'Today' },
        { key: 'inProgress', label: 'In Progress Tickets', icon: 'icons/progress.svg', subtitle1: 'Customer satisfaction', subtitle2: 'Target: 4h' },
        { key: 'resolved', label: 'Resolved Tickets', icon: 'icons/alert-triggered.svg', subtitle1: 'Requires attention', subtitle2: 'High priority' },
        { key: 'closed', label: 'Closed Tickets', icon: 'icons/closed.svg', subtitle1: 'Based on 156 reviews', subtitle2: 'This month' },
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
                                title: "Ticket Management",
                                onBackClick: () => window.history.back(),
                                backButtonText: "Back to Dashboard",
                                buttonsLabel: "Add Ticket",
                                variant: "primary",
                                onClick: () => console.log('Adding new ticket...'),
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
                                            onEdit: (row: TableData) =>
                                                console.log('Edit:', row),
                                            onDelete: (row: TableData) =>
                                                console.log('Delete:', row),
                                            onView: (row: TableData) =>
                                                navigate(`/tickets/${row.ticketNumber}`),
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

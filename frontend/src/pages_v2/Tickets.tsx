import { useState, useEffect } from 'react';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';
import BACKEND_URL from '../config';

export default function Tickets() {
    const [ticketStats, setTicketStats] = useState<any>(null);
    const [ticketTrends, setTicketTrends] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);

    // Fetch ticket stats
    useEffect(() => {
        fetch(`${BACKEND_URL}/tickets/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTicketStats(data.data);
                }
            });
    }, []);

    // Fetch ticket trends
    useEffect(() => {
        fetch(`${BACKEND_URL}/tickets/trends`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTicketTrends(data.data);
                }
            });
    }, []);

    // Fetch ticket table (with pagination)
    const fetchTicketsTable = (page: number = 1, limit: number = 10) => {
        fetch(`${BACKEND_URL}/tickets/table?page=${page}&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTickets(data.data);
                    setPagination(data.pagination);
                }
            })
            .catch((err) => console.error('Failed to fetch ticket data:', err))
            .finally(() => {});
    };

    useEffect(() => {
        fetchTicketsTable();
    }, []);

    const handleTicketPageChange = (page: number, limit: number) => {
        fetchTicketsTable(page, limit);
    };

    const [tableColumns] = useState([
        { key: 'ticketNumber', label: 'Ticket #' },
        { key: 'customerName', label: 'Customer' },
        { key: 'subject', label: 'Subject' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'assignedTo', label: 'Assigned To' },
        { key: 'raisedBy', label: 'Raised By' },
        { key: 'createdAt', label: 'Created' },
        { key: 'lastUpdated', label: 'Updated' },
        { key: 'category', label: 'Category' },
        { key: 'responseTime', label: 'Response Time' },
        // Add actions column if you want to show action buttons
    ]);

    const statsArray = [
        { key: 'total', label: 'Open Tickets', icon: 'icons/open-tickets.svg', subtitle1: 'Total active tickets', subtitle2: 'Last 24 hours' },
        { key: 'open', label: 'Resolved Today', icon: 'icons/check-circle.svg', subtitle1: 'Successfully resolved', subtitle2: 'Today' },
        { key: 'inProgress', label: 'Average Response Time', icon: 'icons/clock.svg', subtitle1: 'Customer satisfaction', subtitle2: 'Target: 4h' },
        { key: 'resolved', label: 'Pending Escalations', icon: 'icons/alert-triggered.svg', subtitle1: 'Requires attention', subtitle2: 'High priority' },
        { key: 'closed', label: 'Customer Satisfaction', icon: 'icons/star.svg', subtitle1: 'Based on 156 reviews', subtitle2: 'This month' },
    ];

    return (
        <Page
            sections={[
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

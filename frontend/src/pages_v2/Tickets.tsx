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
        { key: 'createdAt', label: 'Created' },
        { key: 'lastUpdated', label: 'Updated' },
        { key: 'category', label: 'Category' },
        { key: 'responseTime', label: 'Response Time' },
    ]);

    return (
        <Page
            sections={[
                {
                    layout: {
                        type: 'column',
                        rows: [
                            {
                                layout: 'row',
                                columns: ticketStats ? ticketStats.map((ticket: any) => ({
                                    name: 'Card',
                                    props: {
                                        title: ticket.title,
                                        value: ticket.value,
                                        icon: ticket.icon,
                                        showTrend: ticket.showTrend,
                                        comparisonValue: ticket.comparisonValue,
                                        subtitle1: ticket.subtitle1,
                                        subtitle2: ticket.subtitle2,
                                    },
                                })) : [],
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

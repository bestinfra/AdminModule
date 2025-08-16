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
    const [serverPagination, setServerPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Dummy data for development
    const dummyTickets = [
        {
            id: 336,
            ticketNumber: 'TCKT-0001',
            dtrNumber: 'DTR-001',
            subject: 'Incorrect Bill',
            priority: 'HIGH',
            status: 'OPEN',
            assignedTo: 'John Doe',
            createdAt: '2024-01-15',
            category: 'BILLING',
            meterSerialNo: 'A9211434',
            description: 'Testing connection issue with meter.',
        },
        {
            id: 335,
            ticketNumber: 'TCKT-0002',
            dtrNumber: 'DTR-002',
            subject: 'Voltage Fluctuation',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            assignedTo: 'Jane Smith',
            createdAt: '2024-01-14',
            category: 'METER',
            meterSerialNo: 'B9345417',
            description: 'Meter showing connection error.',
        },
        {
            id: 333,
            ticketNumber: 'TCKT-0003',
            dtrNumber: 'DTR-003',
            subject: 'Meter Reading Issue',
            priority: 'LOW',
            status: 'RESOLVED',
            assignedTo: 'Alice Brown',
            createdAt: '2024-01-13',
            category: 'METER',
            meterSerialNo: 'C9456789',
            description: 'Communication issue with billing system.',
        }
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

    const fetchTicketsTable = async (page = 1, limit = 10, searchTerm = '') => {
        try {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));
            
            if (searchTerm && searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }
            
            const response = await fetch(`${BACKEND_URL}/tickets/table?${params.toString()}`);
            const data = await response.json();
            
            if (data.success) {
                setTickets(data.data);
                setServerPagination({
                    currentPage: data.pagination?.currentPage || 1,
                    totalPages: data.pagination?.totalPages || 1,
                    totalCount: data.pagination?.totalCount || 0,
                    limit: data.pagination?.limit || 10,
                    hasNextPage: data.pagination?.hasNextPage || false,
                    hasPrevPage: data.pagination?.hasPrevPage || false,
                });
            } else {
                // Fallback to dummy data
                setTickets(dummyTickets);
            }
        } catch (err) {
            console.error('Failed to fetch ticket data:', err);
            // Fallback to dummy data
            setTickets(dummyTickets);
        }
    };

    useEffect(() => {
        fetchTicketsTable();
    }, []);

    // Handle table pagination
    const handlePageChange = (page: number, limit: number) => {
        fetchTicketsTable(page, limit);
    };

    // Handle table search
    const handleSearch = (searchTerm: string) => {
        // Reset to first page when searching
        fetchTicketsTable(1, serverPagination.limit, searchTerm);
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
        { key: 'dtrNumber', label: 'DTR Number' },
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
                                            onPageChange: handlePageChange,
                                            onSearch: handleSearch,
                                            serverPagination: serverPagination,
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

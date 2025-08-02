import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageC from '@components/global/PageC';
import { exportChartData } from '@/utils/excelExport';

// Brand green icon style
const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
};

interface TicketData {
    id: number;
    ticketNumber: string;
    subject: string;
    category: string;
    application: string;
    status: string;
    priority: string;
    assignedTo: string;
    createdAt: string;
    [key: string]: string | number | boolean | null | undefined;
}

type FilterType =
    | 'all'
    | 'high-priority'
    | 'in-progress'
    | 'resolved'
    | 'closed';

// Card data in JSON format
const cardStats = [
    { 
        title: 'Total Tickets', 
        value: '6', 
        icon: 'icons/support-tickets.svg', 
        subtitle1: 'Current Month', 
        subtitle2: '+12% from last month',
        showTrend: true,
        comparisonValue: 12,
        filterType: 'all' as FilterType
    },
    { 
        title: 'High Priority', 
        value: '3', 
        icon: 'icons/warning-icon.svg', 
        subtitle1: 'Urgent tickets', 
        subtitle2: '+2% from last week',
        showTrend: true,
        comparisonValue: 2,
        filterType: 'high-priority' as FilterType
    },
    { 
        title: 'In Progress', 
        value: '1', 
        icon: 'icons/pending-payments.svg', 
        subtitle1: 'Active tickets', 
        subtitle2: '+5% from last week',
        showTrend: true,
        comparisonValue: 5,
        filterType: 'in-progress' as FilterType
    },
    { 
        title: 'Resolved', 
        value: '2', 
        icon: 'icons/resolved.svg', 
        subtitle1: 'This month', 
        subtitle2: '+8% from last month',
        showTrend: true,
        comparisonValue: 8,
        filterType: 'resolved' as FilterType
    },
    { 
        title: 'Closed', 
        value: '1', 
        icon: 'icons/closed.svg', 
        subtitle1: 'This month', 
        subtitle2: '-2% from last month',
        showTrend: true,
        comparisonValue: -2,
        filterType: 'closed' as FilterType
    },
];

// Chart data in JSON format
const ticketTrendsData = {
    xAxisData: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    seriesData: [
        {
            name: 'Total Tickets',
            data: [45, 52, 38, 61, 55, 48, 67, 59, 42, 58, 63, 71],
        },
        {
            name: 'Resolved',
            data: [38, 45, 32, 52, 48, 41, 58, 51, 36, 49, 55, 62],
        },
    ],
};

// Table data in JSON format
const ticketData: TicketData[] = [
        {
            id: 1,
            ticketNumber: 'TICK-001',
            subject: 'System Access Issue (Technical)',
            category: 'Technical',
            application: 'Admin Portal',
            status: 'Open',
            priority: 'High',
            assignedTo: 'John Doe',
        createdAt: '2025-01-15 10:30:00',
        },
        {
            id: 2,
            ticketNumber: 'TICK-002',
            subject: 'Email Configuration (Technical)',
            category: 'Technical',
            application: 'Email System',
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'Jane Smith',
        createdAt: '2025-01-14 14:20:00',
        },
        {
            id: 3,
            ticketNumber: 'TICK-003',
            subject: 'Software Update (Technical)',
            category: 'Technical',
            application: 'Meter Management',
            status: 'Resolved',
            priority: 'Low',
            assignedTo: 'Mike Johnson',
        createdAt: '2025-01-13 09:15:00',
        },
        {
            id: 4,
            ticketNumber: 'TICK-004',
            subject: 'Billing Dispute (Billing)',
            category: 'Billing',
            application: 'Billing System',
            status: 'Closed',
            priority: 'High',
            assignedTo: 'Sarah Wilson',
        createdAt: '2025-01-12 16:45:00',
        },
        {
            id: 5,
            ticketNumber: 'TICK-005',
            subject: 'Network Connectivity (Infrastructure)',
            category: 'Infrastructure',
            application: 'Network System',
            status: 'Open',
            priority: 'High',
            assignedTo: 'Tom Anderson',
        createdAt: '2025-01-11 11:30:00',
        },
        {
            id: 6,
            ticketNumber: 'TICK-006',
            subject: 'Password Reset (Security)',
            category: 'Security',
            application: 'User Management',
            status: 'Resolved',
            priority: 'Medium',
            assignedTo: 'Lisa Chen',
        createdAt: '2025-01-10 13:20:00',
    },
];

// Table columns configuration
const tableColumns = [
    { key: 'ticketNumber', label: 'Ticket ID' },
    { key: 'subject', label: 'Subject & Category' },
    { key: 'application', label: 'Application' },
    { key: 'status', label: 'Status' },
    { 
        key: 'priority', 
        label: 'Priority',
        priorityBadge: true
    },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'createdAt', label: 'Created At' },
];

// Recent activities data in JSON format
const recentActivitiesData = [
    {
        id: '1',
        type: 'ticket_created',
        title: 'Ticket TICK-001 Created',
        description: 'System Access Issue - High Priority',
        timestamp: '2 minutes ago',
        icon: 'icons/tickets.svg',
        bgColor: 'bg-accent-light',
        iconBgColor: 'bg-accent',
    },
    {
        id: '2',
        type: 'ticket_updated',
        title: 'Ticket TICK-002 Updated',
        description: 'Status changed to In Progress',
        timestamp: '15 minutes ago',
        icon: 'icons/clock.svg',
        bgColor: 'bg-warning-alt',
        iconBgColor: 'bg-warning',
    },
    {
        id: '3',
        type: 'ticket_resolved',
        title: 'Ticket TICK-003 Resolved',
        description: 'Software Update completed successfully',
        timestamp: '1 hour ago',
        icon: 'icons/check-circle.svg',
        bgColor: 'bg-secondary-light',
        iconBgColor: 'bg-secondary',
    },
];

const AllTickets: React.FC = () => {
    const navigate = useNavigate();
    const { filter } = useParams<{ filter?: string }>();

    const [selectedTimeRange, setSelectedTimeRange] = useState('Daily');

    // Get filter from URL params, default to 'all'
    const activeFilter = (filter as FilterType) || 'all';

    // Filter tickets based on active filter
    const filteredTickets = useMemo(() => {
        switch (activeFilter) {
            case 'high-priority':
                return ticketData.filter(
                    (ticket) => ticket.priority === 'High'
                );
            case 'in-progress':
                return ticketData.filter(
                    (ticket) => ticket.status === 'In Progress'
                );
            case 'resolved':
                return ticketData.filter(
                    (ticket) => ticket.status === 'Resolved'
                );
            case 'closed':
                return ticketData.filter(
                    (ticket) => ticket.status === 'Closed'
                );
            default:
                return ticketData;
        }
    }, [activeFilter]);

    const handleCardClick = useCallback(
        (filter: FilterType) => {
            navigate(`/tickets/${filter}`);
        },
        [navigate]
    );

    const handleFilterChange = useCallback(
        (filter: FilterType) => {
            navigate(`/tickets/${filter}`);
        },
        [navigate]
    );

    const handleBackToCards = useCallback(() => {
        navigate('/tickets');
    }, [navigate]);

    const getTableTitle = () => {
        switch (activeFilter) {
            case 'high-priority':
                return 'High Priority Tickets';
            case 'in-progress':
                return 'In Progress Tickets';
            case 'resolved':
                return 'Resolved Tickets';
            case 'closed':
                return 'Closed Tickets';
            default:
                return 'All Tickets';
        }
    };

    // Handle Excel download for ticket trends chart
    const handleTicketTrendsDownload = () => {
        exportChartData(ticketTrendsData.xAxisData, ticketTrendsData.seriesData, 'ticket-trends-data');
    };

        return (
        <PageC
            sections={[
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: 'w-full',
                        rows: [
                            {
                                layout: 'row' as const,
                                className: 'w-full',
                                columns: [
                                    {
                                        name: 'PageHeader',
                                        props: {
                                            title: filter ? getTableTitle() : 'Tickets Overview',
                                            onBackClick: filter ? handleBackToCards : () => window.history.back(),
                                            backButtonText: filter ? 'Back to Tickets Overview' : 'Back to Dashboard',
                                            buttonsLabel: 'Create Ticket',
                                            variant: 'primary',
                                            onClick: () => navigate('/create-ticket'),
                                            ...(filter && {
                                                showMenu: true,
                                                showDropdown: true,
                                                menuItems: [
                { id: 'all', label: 'All Tickets' },
                { id: 'high-priority', label: 'High Priority' },
                { id: 'in-progress', label: 'In Progress' },
                { id: 'resolved', label: 'Resolved' },
                { id: 'closed', label: 'Closed' },
                                                ],
                                                onMenuItemClick: (itemId: string) => handleFilterChange(itemId as FilterType),
                                            }),
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                ...(filter ? [] : [
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 5,
                            className: 'w-full gap-4',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    className: 'w-full',
                                    gridColumns: 5,
                                    span: { col: 5, row: 1 },
                                    columns: cardStats.map((card) => ({
                                        name: 'Card',
                                        props: {
                                            title: card.title,
                                            value: card.value,
                                            icon: card.icon,
                                            showTrend: card.showTrend,
                                            comparisonValue: card.comparisonValue,
                                            subtitle1: card.subtitle1,
                                            subtitle2: card.subtitle2,
                                            onValueClick: () => handleCardClick(card.filterType),
                                            iconStyle: ICON_FILTER_STYLE,
                                        },
                                    })),
                                },
                            ],
                        },
                    },
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'w-full',
                            rows: [
                                {
                                    layout: 'grid' as const,
                                    className: 'w-full',
                                    columns: [
                                        {
                                            name: 'BarChart',
                                            props: {
                                                xAxisData: ticketTrendsData.xAxisData,
                                                seriesData: ticketTrendsData.seriesData,
                                                height: 320,
                                                showHeader: true,
                                                headerTitle: 'Ticket Trends',
                                                className: 'w-full',
                                                dateRange: 'Last 12 months',
                                                showDownloadButton: true,
                                                onDownload: () => handleTicketTrendsDownload(),
                                                showXAxisLabel: true,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]),
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        rows: [
                            {
                                layout: 'grid' as const,
                                gridColumns: 1,
                                className: 'pb-5', // add padding-bottom to the grid
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            columns: tableColumns,
                                            data: filter ? filteredTickets : ticketData,
                                            searchable: true,
                                            pagination: true,
                                            initialRowsPerPage: 10,
                                            rowsPerPageOptions: [5, 10, 15, 20, 25],
                                            emptyMessage: 'No Tickets Found',
                                            showActions: true,
                                            showHeader: 'true',
                                            headerTitle: filter ? `${getTableTitle()} (Last 30 days)` : 'All Tickets (Last 30 days)',
                                            showPaginationInfo: true,
                                            showRowsPerPageSelector: true,
                                            className: 'w-full',
                                            availableTimeRanges: ['Daily', 'Weekly', 'Monthly'],
                                            selectedTimeRange: selectedTimeRange,
                                            onTimeRangeChange: setSelectedTimeRange,
                                            onDelete: (row: any) => console.log('Delete ticket:', row),
                                            onView: () => navigate('/ticket-view'),
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                ...(filter ? [
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'w-full',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    className: 'w-full',
                                    columns: [
                                        {
                                            name: 'SectionHeader',
                                            props: {
                                                title: 'Recent Ticket Activity',
                                                titleLevel: 2,
                                                titleSize: 'md',
                                                titleVariant: 'primary',
                                                titleWeight: 'bold',
                                                titleAlign: 'left',
                                            },
                                        },
                                    ],
                                },
                                {
                                    layout: 'row' as const,
                                    className: 'w-full',
                                    columns: [
                                        {
                                            name: 'RecentActivities',
                                            props: {
                                                activities: recentActivitiesData,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ] : []),
            ]}
        />
    );
};

export default AllTickets;

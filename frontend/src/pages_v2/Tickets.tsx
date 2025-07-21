import { useState } from 'react';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';

export default function Tickets() {
    const [ticketData] = useState([
        {
            id: 1,
            title: 'Open Tickets',
            value: '24',
            icon: 'icons/open-tickets.svg',
            showTrend: true,
            comparisonValue: 12,
            subtitle1: 'Total active tickets',
            subtitle2: 'Last 24 hours',
        },
        {
            id: 2,
            title: 'Resolved Today',
            value: '18',
            icon: 'icons/check-circle.svg',
            showTrend: true,
            comparisonValue: 8,
            subtitle1: 'Successfully resolved',
            subtitle2: 'Today',
        },
        {
            id: 3,
            title: 'Average Response Time',
            value: '2.4h',
            icon: 'icons/clock.svg',
            showTrend: false,
            subtitle1: 'Customer satisfaction',
            subtitle2: 'Target: 4h',
        },
        {
            id: 4,
            title: 'Pending Escalations',
            value: '7',
            icon: 'icons/alert-triggered.svg',
            showTrend: true,
            comparisonValue: -3,
            subtitle1: 'Requires attention',
            subtitle2: 'High priority',
        },
        {
            id: 5,
            title: 'Customer Satisfaction',
            value: '4.8/5',
            icon: 'icons/star.svg',
            showTrend: true,
            comparisonValue: 0.2,
            subtitle1: 'Based on 156 reviews',
            subtitle2: 'This month',
        },
    ]);

    const [chartData] = useState({
        xAxisData: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        seriesData: [
            {
                name: 'Open Tickets',
                data: [45, 52, 38, 67, 58, 72, 65, 48, 55, 62, 78, 85],
            },
            {
                name: 'Resolved Tickets',
                data: [42, 48, 35, 64, 55, 68, 62, 45, 52, 59, 75, 82],
            },
            {
                name: 'Escalated Tickets',
                data: [8, 12, 6, 15, 11, 18, 14, 9, 13, 16, 22, 25],
            },
        ],
        seriesColors: [
            'var(--color-primary)',
            'var(--color-secondary)',
            'var(--color-warning)',
        ],
    });

    const [tableData] = useState([
        {
            id: 'TKT-001',
            ticketNumber: 'TKT-001',
            customerName: 'John Smith',
            subject: 'Payment Issue',
            priority: 'High',
            status: 'Open',
            assignedTo: 'Sarah Johnson',
            createdAt: '2024-01-15',
            lastUpdated: '2024-01-16',
            category: 'Billing',
            responseTime: '2.4h',
        },
        {
            id: 'TKT-002',
            ticketNumber: 'TKT-002',
            customerName: 'Emily Davis',
            subject: 'Meter Reading Error',
            priority: 'Medium',
            status: 'In Progress',
            assignedTo: 'Mike Wilson',
            createdAt: '2024-01-14',
            lastUpdated: '2024-01-15',
            category: 'Technical',
            responseTime: '4.1h',
        },
        {
            id: 'TKT-003',
            ticketNumber: 'TKT-003',
            customerName: 'Robert Chen',
            subject: 'Service Disconnection',
            priority: 'High',
            status: 'Resolved',
            assignedTo: 'Lisa Brown',
            createdAt: '2024-01-13',
            lastUpdated: '2024-01-14',
            category: 'Service',
            responseTime: '1.8h',
        },
        {
            id: 'TKT-004',
            ticketNumber: 'TKT-004',
            customerName: 'Maria Garcia',
            subject: 'Account Update Request',
            priority: 'Low',
            status: 'Open',
            assignedTo: 'David Lee',
            createdAt: '2024-01-12',
            lastUpdated: '2024-01-12',
            category: 'Account',
            responseTime: '6.2h',
        },
        {
            id: 'TKT-005',
            ticketNumber: 'TKT-005',
            customerName: 'James Wilson',
            subject: 'Billing Dispute',
            priority: 'High',
            status: 'Escalated',
            assignedTo: 'Manager',
            createdAt: '2024-01-11',
            lastUpdated: '2024-01-15',
            category: 'Billing',
            responseTime: '8.5h',
        },
        {
            id: 'TKT-006',
            ticketNumber: 'TKT-006',
            customerName: 'Anna Thompson',
            subject: 'New Connection Request',
            priority: 'Medium',
            status: 'In Progress',
            assignedTo: 'Sarah Johnson',
            createdAt: '2024-01-10',
            lastUpdated: '2024-01-13',
            category: 'Service',
            responseTime: '3.7h',
        },
        {
            id: 'TKT-007',
            ticketNumber: 'TKT-007',
            customerName: 'Michael Rodriguez',
            subject: 'Meter Installation',
            priority: 'Medium',
            status: 'Resolved',
            assignedTo: 'Mike Wilson',
            createdAt: '2024-01-09',
            lastUpdated: '2024-01-11',
            category: 'Technical',
            responseTime: '2.9h',
        },
        {
            id: 'TKT-008',
            ticketNumber: 'TKT-008',
            customerName: 'Jennifer White',
            subject: 'Payment Gateway Issue',
            priority: 'High',
            status: 'Open',
            assignedTo: 'David Lee',
            createdAt: '2024-01-08',
            lastUpdated: '2024-01-09',
            category: 'Technical',
            responseTime: '5.3h',
        },
    ]);

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

    const [serverPagination] = useState({
        currentPage: 1,
        totalPages: 3,
        totalCount: 24,
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
                        type: 'column',
                        rows: [
                            {
                                layout: 'row',
                                columns: ticketData.map((ticket) => ({
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
                                            xAxisData: chartData.xAxisData,
                                            seriesData: chartData.seriesData,
                                            seriesColors:
                                                chartData.seriesColors,
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
                                            data: tableData,
                                            columns: tableColumns,
                                            showHeader: false,
                                            headerTitle: 'Recent Tickets',
                                            dateRange: 'Last 30 days',
                                            searchable: true,
                                            sortable: true,
                                            pagination: true,
                                            showActions: true,
                                            text: 'Ticket Management Table',
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

import { useState } from 'react';
import Page from '@/components/global/PageC';
import type { TableData } from '@/components/global/Table';

export default function Users() {
    const [userData] = useState([
        {
            id: 1,
            title: 'Total Users',
            value: '2,847',
            icon: 'icons/users.svg',
            showTrend: true,
            comparisonValue: 23,
            subtitle1: 'Registered users',
            subtitle2: '+23 this month',
        },
        {
            id: 2,
            title: 'Active Users',
            value: '2,156',
            icon: 'icons/active-users.svg',
            showTrend: true,
            comparisonValue: 15,
            subtitle1: 'Online today',
            subtitle2: '+15 this week',
        },
        {
            id: 3,
            title: 'New Registrations',
            value: '89',
            icon: 'icons/user-plus.svg',
            showTrend: true,
            comparisonValue: 12,
            subtitle1: 'This week',
            subtitle2: '+12 vs last week',
        },
        {
            id: 4,
            title: 'Premium Users',
            value: '456',
            icon: 'icons/star.svg',
            showTrend: true,
            comparisonValue: 8,
            subtitle1: 'Paid subscriptions',
            subtitle2: '+8 this month',
        },
        {
            id: 5,
            title: 'User Satisfaction',
            value: '4.7/5',
            icon: 'icons/check-circle.svg',
            showTrend: true,
            comparisonValue: 0.2,
            subtitle1: 'Average rating',
            subtitle2: '+0.2 this quarter',
        },
    ]);

    const [tableData] = useState([
        {
            id: 'USR-001',
            userId: 'USR-001',
            fullName: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1-555-0123',
            role: 'Customer',
            status: 'Active',
            lastLogin: '2024-01-16 14:30:00',
            registrationDate: '2023-03-15',
            subscription: 'Premium',
            location: 'New York, NY',
            accountBalance: '$125.50',
        },
        {
            id: 'USR-002',
            userId: 'USR-002',
            fullName: 'Emily Davis',
            email: 'emily.davis@email.com',
            phone: '+1-555-0124',
            role: 'Customer',
            status: 'Active',
            lastLogin: '2024-01-16 13:45:00',
            registrationDate: '2023-05-22',
            subscription: 'Basic',
            location: 'Los Angeles, CA',
            accountBalance: '$45.20',
        },
        {
            id: 'USR-003',
            userId: 'USR-003',
            fullName: 'Robert Chen',
            email: 'robert.chen@email.com',
            phone: '+1-555-0125',
            role: 'Admin',
            status: 'Active',
            lastLogin: '2024-01-16 12:15:00',
            registrationDate: '2022-11-08',
            subscription: 'Enterprise',
            location: 'Chicago, IL',
            accountBalance: '$0.00',
        },
        {
            id: 'USR-004',
            userId: 'USR-004',
            fullName: 'Maria Garcia',
            email: 'maria.garcia@email.com',
            phone: '+1-555-0126',
            role: 'Customer',
            status: 'Inactive',
            lastLogin: '2024-01-10 09:20:00',
            registrationDate: '2023-07-14',
            subscription: 'Basic',
            location: 'Miami, FL',
            accountBalance: '$12.75',
        },
        {
            id: 'USR-005',
            userId: 'USR-005',
            fullName: 'James Wilson',
            email: 'james.wilson@email.com',
            phone: '+1-555-0127',
            role: 'Moderator',
            status: 'Active',
            lastLogin: '2024-01-16 11:30:00',
            registrationDate: '2023-01-30',
            subscription: 'Premium',
            location: 'Seattle, WA',
            accountBalance: '$89.90',
        },
        {
            id: 'USR-006',
            userId: 'USR-006',
            fullName: 'Anna Thompson',
            email: 'anna.thompson@email.com',
            phone: '+1-555-0128',
            role: 'Customer',
            status: 'Active',
            lastLogin: '2024-01-16 14:15:00',
            registrationDate: '2023-09-05',
            subscription: 'Premium',
            location: 'Boston, MA',
            accountBalance: '$156.30',
        },
        {
            id: 'USR-007',
            userId: 'USR-007',
            fullName: 'Michael Rodriguez',
            email: 'michael.rodriguez@email.com',
            phone: '+1-555-0129',
            role: 'Customer',
            status: 'Suspended',
            lastLogin: '2024-01-08 16:45:00',
            registrationDate: '2023-04-12',
            subscription: 'Basic',
            location: 'Denver, CO',
            accountBalance: '$0.00',
        },
        {
            id: 'USR-008',
            userId: 'USR-008',
            fullName: 'Jennifer White',
            email: 'jennifer.white@email.com',
            phone: '+1-555-0130',
            role: 'Customer',
            status: 'Active',
            lastLogin: '2024-01-16 13:20:00',
            registrationDate: '2023-06-18',
            subscription: 'Basic',
            location: 'Austin, TX',
            accountBalance: '$67.80',
        },
    ]);

    const [tableColumns] = useState([
        { key: 'userId', label: 'User ID' },
        { key: 'fullName', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
        { key: 'lastLogin', label: 'Last Login' },
        { key: 'registrationDate', label: 'Registration' },
        { key: 'subscription', label: 'Subscription' },
        { key: 'location', label: 'Location' },
        { key: 'accountBalance', label: 'Balance' },
    ]);

    const [serverPagination] = useState({
        currentPage: 1,
        totalPages: 6,
        totalCount: 48,
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
                                columns: userData.map((user) => ({
                                    name: 'Card',
                                    props: {
                                        title: user.title,
                                        value: user.value,
                                        icon: user.icon,
                                        showTrend: user.showTrend,
                                        comparisonValue: user.comparisonValue,
                                        subtitle1: user.subtitle1,
                                        subtitle2: user.subtitle2,
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
                                            headerTitle: 'User Management',
                                            dateRange: 'Active users',
                                            searchable: true,
                                            sortable: true,
                                            pagination: true,
                                            showActions: true,
                                            text: 'User Management Table',
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

import { useState, useEffect } from 'react';
import Page from '@/components/global/PageC';

const tableColumns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
];

// Dummy users data for table
const dummyUsers = [
    {
        sNo: 1,
        userId: 'USR001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Administrator'
    },
    {
        sNo: 2,
        userId: 'USR002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Accountant'
    },
    {
        sNo: 3,
        userId: 'USR003',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        role: 'Moderator'
    },
    {
        sNo: 4,
        userId: 'USR004',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        role: 'Administrator'
    },
    {
        sNo: 5,
        userId: 'USR005',
        name: 'David Brown',
        email: 'david.brown@example.com',
        role: 'Accountant'
    },
    {
        sNo: 6,
        userId: 'USR006',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'Moderator'
    },
    {
        sNo: 7,
        userId: 'USR007',
        name: 'Robert Miller',
        email: 'robert.miller@example.com',
        role: 'Administrator'
    },
    {
        sNo: 8,
        userId: 'USR008',
        name: 'Lisa Garcia',
        email: 'lisa.garcia@example.com',
        role: 'Accountant'
    },
    {
        sNo: 9,
        userId: 'USR009',
        name: 'James Taylor',
        email: 'james.taylor@example.com',
        role: 'Moderator'
    },
    {
        sNo: 10,
        userId: 'USR010',
        name: 'Amanda Anderson',
        email: 'amanda.anderson@example.com',
        role: 'Administrator'
    },
    {
        sNo: 11,
        userId: 'USR011',
        name: 'Christopher Martinez',
        email: 'christopher.martinez@example.com',
        role: 'Accountant'
    },
    {
        sNo: 12,
        userId: 'USR012',
        name: 'Jessica Rodriguez',
        email: 'jessica.rodriguez@example.com',
        role: 'Moderator'
    },
    {
        sNo: 13,
        userId: 'USR013',
        name: 'Daniel Thompson',
        email: 'daniel.thompson@example.com',
        role: 'Administrator'
    },
    {
        sNo: 14,
        userId: 'USR014',
        name: 'Nicole White',
        email: 'nicole.white@example.com',
        role: 'Accountant'
    },
    {
        sNo: 15,
        userId: 'USR015',
        name: 'Kevin Lee',
        email: 'kevin.lee@example.com',
        role: 'Moderator'
    },
    {
        sNo: 16,
        userId: 'USR016',
        name: 'Rachel Green',
        email: 'rachel.green@example.com',
        role: 'User'
    },
    {
        sNo: 17,
        userId: 'USR017',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        role: 'User'
    },
    {
        sNo: 18,
        userId: 'USR018',
        name: 'Sophie Turner',
        email: 'sophie.turner@example.com',
        role: 'User'
    },
    {
        sNo: 19,
        userId: 'USR019',
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@example.com',
        role: 'User'
    },
    {
        sNo: 20,
        userId: 'USR020',
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        role: 'User'
    },
    {
        sNo: 21,
        userId: 'USR021',
        name: 'Thomas Anderson',
        email: 'thomas.anderson@example.com',
        role: 'User'
    },
    {
        sNo: 22,
        userId: 'USR022',
        name: 'Olivia Johnson',
        email: 'olivia.johnson@example.com',
        role: 'User'
    },
    {
        sNo: 23,
        userId: 'USR023',
        name: 'William Davis',
        email: 'william.davis@example.com',
        role: 'User'
    },
    {
        sNo: 24,
        userId: 'USR024',
        name: 'Isabella Wilson',
        email: 'isabella.wilson@example.com',
        role: 'User'
    },
    {
        sNo: 25,
        userId: 'USR025',
        name: 'Ethan Brown',
        email: 'ethan.brown@example.com',
        role: 'User'
    }
];

// Card data for user statistics
const cardData = [
    {
        title: 'Total Users',
        value: '25',
        icon: '/icons/users.svg',
        subtitle1: '20 Active Users',
        subtitle2: '5 Inactive Users',
    },
    {
        title: 'Total Admins',
        value: '5',
        icon: '/icons/admin.svg',
        subtitle1: 'This Month',
    },
    {
        title: 'Total Accountants',
        value: '5',
        icon: '/icons/accountant.svg',
        subtitle1: 'This Month',
    },
    {
        title: 'Total Moderators',
        value: '5',
        icon: '/icons/moderator.svg',
        subtitle1: '5 Active Users',
    },
    {
        title: 'Total Users',
        value: '10',
        icon: '/icons/user.svg',
        subtitle1: '10 Regular Users',
    },
];

export default function Users() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        // Simulate API delay with dummy data
        setTimeout(() => {
            setUsers(dummyUsers);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <>
            {error && (
                <div className="mb-4 p-4 bg-danger-light border border-danger rounded-md text-danger">
                    {error}
                </div>
            )}
            <Page
                sections={[
                    // Page Header Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'PageHeader',
                                            props: {
                                                title: "User Management",
                                                onBackClick: () => window.history.back(),
                                                backButtonText: "Back to Dashboard",
                                                buttonsLabel: "Add User",
                                                variant: "primary",
                                                onClick: () => console.log('Adding new user...'),
                                                showMenu: true,
                                                showDropdown: true,
                                                menuItems: [
                                                    { id: 'all', label: 'All Users' },
                                                    { id: 'active', label: 'Active Users' },
                                                    { id: 'inactive', label: 'Inactive Users' },
                                                    { id: 'admin', label: 'Administrators' },
                                                    { id: 'moderator', label: 'Moderators' },
                                                    { id: 'user', label: 'Regular Users' }
                                                ],
                                                onMenuItemClick: (itemId: string) => {
                                                    console.log(`Filter by: ${itemId}`);
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    // Overview Cards Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid' as const,
                                    gridColumns: 5,
                                    gap: 'gap-6',
                                    columns: cardData.map(card => ({
                                        name: 'Card',
                                        props: card
                                    }))
                                }
                            ]
                        }
                    },
                    // Users Table Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid' as const,
                                    gridColumns: 1,
                                    gap: 'gap-6',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: users,
                                                columns: tableColumns,
                                                loading: loading,
                                                searchable: true,
                                                pagination: true,
                                                showActions: false,
                                                emptyMessage: loading ? 'Loading users...' : 'No users found',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
        </>
    );
}

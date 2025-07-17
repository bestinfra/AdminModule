import React, { useState, useEffect } from 'react';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';
import Table from '@components/global/Table';
import Holder from '@components/global/Holder';
import PageHeader from '@components/global/PageHeader';
import type { Column } from '@components/global/Table';

interface TicketData {
    id: number;
    ticketNumber: string;
    subject: string;
    status: string;
    priority: string;
    assignedTo: string;
    createdAt: string;
    category?: string;
    department?: string;
    [key: string]: string | number | boolean | null | undefined;
}

const TicketsFilteredView: React.FC = () => {
    const [loading] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState('Daily');
    const [filteredData, setFilteredData] = useState<TicketData[]>([]);
    const [pageTitle, setPageTitle] = useState('All Tickets');

    // Sample ticket data - in a real app, this would come from props or API
    const ticketData: TicketData[] = [
        {
            id: 1,
            ticketNumber: 'TICK-001',
            subject: 'System Access Issue',
            status: 'Open',
            priority: 'High',
            assignedTo: 'John Doe',
            createdAt: '2024-03-20',
            category: 'Technical',
            department: 'IT'
        },
        {
            id: 2,
            ticketNumber: 'TICK-002',
            subject: 'Email Configuration',
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'Jane Smith',
            createdAt: '2024-03-19',
            category: 'Technical',
            department: 'IT'
        },
        {
            id: 3,
            ticketNumber: 'TICK-003',
            subject: 'Software Update',
            status: 'Resolved',
            priority: 'Low',
            assignedTo: 'Mike Johnson',
            createdAt: '2024-03-18',
            category: 'Technical',
            department: 'IT'
        },
        {
            id: 4,
            ticketNumber: 'TICK-004',
            subject: 'Network Connectivity',
            status: 'Open',
            priority: 'High',
            assignedTo: 'Sarah Wilson',
            createdAt: '2024-03-17',
            category: 'Infrastructure',
            department: 'IT'
        },
        {
            id: 5,
            ticketNumber: 'TICK-005',
            subject: 'Password Reset',
            status: 'Resolved',
            priority: 'Medium',
            assignedTo: 'David Brown',
            createdAt: '2024-03-16',
            category: 'Support',
            department: 'Help Desk'
        },
        {
            id: 6,
            ticketNumber: 'TICK-006',
            subject: 'Server Down',
            status: 'Open',
            priority: 'High',
            assignedTo: 'Alex Johnson',
            createdAt: '2024-03-15',
            category: 'Infrastructure',
            department: 'IT'
        },
        {
            id: 7,
            ticketNumber: 'TICK-007',
            subject: 'Database Backup',
            status: 'In Progress',
            priority: 'High',
            assignedTo: 'Sarah Wilson',
            createdAt: '2024-03-14',
            category: 'Database',
            department: 'IT'
        },
        {
            id: 8,
            ticketNumber: 'TICK-008',
            subject: 'User Access Request',
            status: 'Closed',
            priority: 'Low',
            assignedTo: 'Mike Johnson',
            createdAt: '2024-03-13',
            category: 'Access Control',
            department: 'Security'
        },
        {
            id: 9,
            ticketNumber: 'TICK-009',
            subject: 'Network Slow',
            status: 'Open',
            priority: 'Medium',
            assignedTo: 'John Doe',
            createdAt: '2024-03-12',
            category: 'Network',
            department: 'IT'
        },
        {
            id: 10,
            ticketNumber: 'TICK-010',
            subject: 'Software License',
            status: 'Resolved',
            priority: 'Medium',
            assignedTo: 'Jane Smith',
            createdAt: '2024-03-11',
            category: 'Licensing',
            department: 'IT'
        }
    ];
    

    // Filter data based on URL parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter') || 'all';

        let filtered: TicketData[];
        let title: string;

        switch (filterParam) {
            case 'high-priority':
                filtered = ticketData.filter(ticket => ticket.priority === 'High');
                title = 'High Priority Tickets';
                break;
            case 'open':
                filtered = ticketData.filter(ticket => ticket.status === 'Open');
                title = 'Open Tickets';
                break;
            case 'in-progress':
                filtered = ticketData.filter(ticket => ticket.status === 'In Progress');
                title = 'In Progress Tickets';
                break;
            case 'closed':
                filtered = ticketData.filter(ticket => ticket.status === 'Resolved' || ticket.status === 'Closed');
                title = 'Closed Tickets';
                break;
            default:
                filtered = ticketData;
                title = 'All Tickets';
        }

        setFilteredData(filtered);
        setPageTitle(title);
    }, []);

    const columns: Column[] = [
        { key: 'ticketNumber', label: 'Ticket Number' },
        { key: 'subject', label: 'Subject' },
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priority' },
        { key: 'assignedTo', label: 'Assigned To' },
        { key: 'createdAt', label: 'Created At' },
        { key: 'category', label: 'Category' },
        { key: 'department', label: 'Department' }
    ];

    const headerComponent = (
        <PageHeader
            title={pageTitle}
            onBackClick={() => window.history.back()}
            backButtonText="Back to Dashboard"
            buttonsLabel="Create Ticket"
            variant="primary"
            onClick={() => console.log('Creating new ticket...')}
            showMenu={true}
            showDropdown={true}
            menuItems={[
                { id: 'all', label: 'All Tickets' },
                { id: 'open', label: 'Open' },
                { id: 'in-progress', label: 'In Progress' },
                { id: 'resolved', label: 'Resolved' },
                { id: 'closed', label: 'Closed' },
                { id: 'high-priority', label: 'High Priority' },
                { id: 'medium-priority', label: 'Medium Priority' },
                { id: 'low-priority', label: 'Low Priority' }
            ]}
            onMenuItemClick={(itemId) => {
                console.log(`Filter by: ${itemId}`);
                // TODO: Implement filtering logic based on selection
            }}
        />
    );

    const ticketsTableSection: Section = {
        id: 'tickets-table',
        component: (
            <Holder
                title={pageTitle}
                DateRange="(Last 30 days)"
                availableTimeRanges={['Daily', 'Weekly', 'Monthly']}
                selectedTimeRange={selectedTimeRange}
                handleTimeRangeChange={setSelectedTimeRange}
                handleDownload={() => console.log('Downloading tickets...')}
                loading={loading}
            >
                <Table
                    data={filteredData}
                    columns={columns}
                    loading={loading}
                    searchable={true}
                    pagination={true}
                    showActions={true}
                    onEdit={(row) => console.log('Edit ticket:', row)}
                    onDelete={(row) => console.log('Delete ticket:', row)}
                    onView={(row) => console.log('View ticket:', row)}
                />
            </Holder>
        )
    };

    // Summary section showing filtered ticket count
    const summarySection: Section = {
        id: 'summary',
        component: (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                            {pageTitle}
                        </h3>
                        <p className="text-sm text-text-secondary">
                            Showing {filteredData.length} of {ticketData.length} total tickets
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                            {filteredData.length}
                        </p>
                        <p className="text-sm text-neutral">tickets</p>
                    </div>
                </div>
            </div>
        )
    };

    const sections: Section[] = [
        summarySection,
        ticketsTableSection
    ];

    return (
        <Page 
            layout="single-column" 
            sections={sections}
            header={headerComponent}
            loading={loading}
            className=""
            containerClassName="space-y-6"
            sectionClassName=""
        />
    );
};

export default TicketsFilteredView; 
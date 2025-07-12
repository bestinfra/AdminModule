import React, { useState } from 'react';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import Card from '../components/global/Card';
import Table from '../components/global/Table';
import Holder from '../components/global/Holder';
import PageHeader from '../components/global/PageHeader';
import type { Column } from '../components/global/Table';

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

const AllTickets: React.FC = () => {
    const [loading] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState('Daily');


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
        }
    ];

    const columns: Column[] = [
        { key: 'ticketNumber', label: 'Ticket Number' },
        { key: 'subject', label: 'Subject' },
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priority' },
        { key: 'assignedTo', label: 'Assigned To' },
        { key: 'createdAt', label: 'Created At' }
    ];

    const totalTickets = ticketData.length;
    const resolvedTickets = ticketData.filter(ticket => ticket.status === 'Resolved').length;

    const headerComponent = (
        <PageHeader
            title="All Tickets"
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

    

    const overviewSection: Section = {
        id: 'overview',
        component: (
            <div className="">
                <div className="flex justify-between gap-4">
                    <Card
                        title="Total Tickets"
                        value={totalTickets.toString()}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={12}
                        subtitle1="All time"
                        subtitle2="+12% from last month"
                    />
                    <Card
                        title="High Priority"
                        value={ticketData.filter(t => t.priority === 'High').length.toString()}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={2}
                        subtitle1="Urgent tickets"
                        subtitle2="+2% from last week"
                    />
                    <Card
                        title="Resolution Rate"
                        value={`${Math.round((resolvedTickets / totalTickets) * 100)}%`}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={8}
                        subtitle1="This month"
                        subtitle2="+8% from last month"
                    />
                     <Card
                        title="Resolution Rate"
                        value={`${Math.round((resolvedTickets / totalTickets) * 100)}%`}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={8}
                        subtitle1="This month"
                        subtitle2="+8% from last month"
                    /> 
                    <Card
                        title="Resolution Rate"
                        value={`${Math.round((resolvedTickets / totalTickets) * 100)}%`}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={8}
                        subtitle1="This month"
                        subtitle2="+8% from last month"
                    /> 
                </div>
            </div>
        )
    };

    const ticketsTableSection: Section = {
        id: 'tickets-table',
        component: (
            <Holder
                title="All Tickets"
                DateRange="(Last 30 days)"
                availableTimeRanges={['Daily', 'Weekly', 'Monthly']}
                selectedTimeRange={selectedTimeRange}
                handleTimeRangeChange={setSelectedTimeRange}
                handleDownload={() => console.log('Downloading tickets...')}
                loading={loading}
            >
                <Table
                    data={ticketData}
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

    const sections: Section[] = [
        overviewSection,
        ticketsTableSection
    ];

    return (
        <Page 
            layout="single-column" 
            sections={sections}
            header={headerComponent}
            sidebarPosition="right"
            loading={loading}
            className=""
            containerClassName="space-y-6"
            sectionClassName=""
        />
    );
};

export default AllTickets; 
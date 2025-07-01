import React, { useState } from 'react';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import Button from '../components/global/Button';
import Card from '../components/global/Card';
import Table from '../components/global/Table';
import Holder from '../components/global/Holder';
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
    const [loading, setLoading] = useState(false);
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
    const openTickets = ticketData.filter(ticket => ticket.status === 'Open').length;
    const inProgressTickets = ticketData.filter(ticket => ticket.status === 'In Progress').length;
    const resolvedTickets = ticketData.filter(ticket => ticket.status === 'Resolved').length;

    const headerComponent = (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">All Tickets</h1>
                <p className="text-gray-600 mt-2">Manage and track all support tickets</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Total: {totalTickets} tickets</span>
            </div>
        </div>
    );

    const actionsComponent = (
        <div className="flex items-center gap-2">
            <Button
                label="Create New Ticket"
                onClick={() => console.log('Creating new ticket...')}
                variant="primary"
            />
            <Button
                label="Export Tickets"
                onClick={() => console.log('Exporting tickets...')}
                variant="outline"
            />
        </div>
    );

    const sidebarComponent = (
        <div className="space-y-4">
            <Card
                title="Open Tickets"
                value={openTickets.toString()}
                icon="icons/units.svg"
                showTrend={true}
                comparisonValue={5}
                subtitle1="Active tickets"
                subtitle2="+5% from last week"
            />
            <Card
                title="In Progress"
                value={inProgressTickets.toString()}
                icon="icons/units.svg"
                showTrend={true}
                comparisonValue={3}
                subtitle1="Being worked on"
                subtitle2="+3% from last week"
            />
            <Card
                title="Resolved"
                value={resolvedTickets.toString()}
                icon="icons/units.svg"
                showTrend={true}
                comparisonValue={8}
                subtitle1="This month"
                subtitle2="+8% from last month"
            />
        </div>
    );

    const overviewSection: Section = {
        id: 'overview',
        component: (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Ticket Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            actions={actionsComponent}
            sidebar={sidebarComponent}
            sidebarPosition="right"
            loading={loading}
            className="max-w-7xl mx-auto p-6"
            containerClassName="space-y-6"
            sectionClassName="border rounded-lg p-6 bg-white shadow-sm"
        />
    );
};

export default AllTickets; 
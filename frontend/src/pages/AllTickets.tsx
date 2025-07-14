import React, { useState, useEffect } from 'react';
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

    // Ensure layout is properly initialized
    useEffect(() => {
        // Force a reflow to ensure grid layout is properly applied
        const gridElement = document.querySelector('.grid');
        if (gridElement) {
            gridElement.scrollTop = gridElement.scrollTop;
        }
    }, []);

    // Handler for Total Tickets card click
    const handleTotalTicketsClick = () => {
        console.log('Total Tickets clicked!');
        window.location.href = '/tickets-filtered?filter=all';
    };

    // Handler for High Priority tickets card click
    const handleHighPriorityClick = () => {
        console.log('High Priority clicked!');
        window.location.href = '/tickets-filtered?filter=high-priority';
    };

    // Handler for Open tickets card click
    const handleOpenTicketsClick = () => {
        console.log('Open Tickets clicked!');
        window.location.href = '/tickets-filtered?filter=open';
    };

    // Handler for In Progress tickets card click
    const handleInProgressClick = () => {
        console.log('In Progress clicked!');
        window.location.href = '/tickets-filtered?filter=in-progress';
    };

    // Handler for Closed tickets card click
    const handleClosedTicketsClick = () => {
        console.log('Closed Tickets clicked!');
        window.location.href = '/tickets-filtered?filter=closed';
    };


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
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 min-h-0 w-full auto-rows-fr" style={{ gridTemplateRows: '1fr' }}>
                    <Card
                        title="Total Tickets"
                        value={totalTickets.toString()}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={12}
                        subtitle1="All time"
                        subtitle2="+12% from last month"
                        onValueClick={handleTotalTicketsClick}
                    />
                    <Card
                        title="High Priority"
                        value={ticketData.filter(t => t.priority === 'High').length.toString()}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={2}
                        subtitle1="Urgent tickets"
                        subtitle2="+2% from last week"
                        onValueClick={handleHighPriorityClick}
                    />
                    <Card
                        title="Open Tickets"
                        value={ticketData.filter(t => t.status === 'Open').length.toString()}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={8}
                        subtitle1="This month"
                        subtitle2="+8% from last month"
                        onValueClick={handleOpenTicketsClick}
                    />
                    <Card
                        title="In Progress Tickets"
                        value={ticketData.filter(t => t.status === 'In Progress').length.toString()}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={8}
                        subtitle1="This month"
                        subtitle2="+8% from last month"
                        onValueClick={handleInProgressClick}
                    />
                    <Card
                        title="Closed Tickets"
                        value={ticketData.filter(t => t.status === 'Resolved' || t.status === 'Closed').length.toString()}
                        icon="icons/units.svg"
                        showTrend={true}
                        comparisonValue={8}
                        subtitle1="This month"
                        subtitle2="+8% from last month"
                        onValueClick={handleClosedTicketsClick}
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

    const recentActivitySection: Section = {
        id: 'recent-activity',
        component: (
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Ticket Activity
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Latest Operations</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Last 24 hours</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <img src="/icons/tickets.svg" alt="" className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900 dark:text-white">Ticket TICK-001 Created</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">System Access Issue - High Priority</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <div className="p-2 bg-yellow-500 rounded-lg">
                                    <img src="/icons/clock.svg" alt="" className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900 dark:text-white">Ticket TICK-002 Updated</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Status changed to In Progress</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <img src="/icons/check-circle.svg" alt="" className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900 dark:text-white">Ticket TICK-003 Resolved</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Software Update completed successfully</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    const sections: Section[] = [
        overviewSection,
        ticketsTableSection,
        recentActivitySection
    ];

    return (
        <Page 
            layout="single-column" 
            sections={sections}
            header={headerComponent}
            sidebarPosition="right"
            loading={loading}
            className="w-full"
            containerClassName="space-y-6 w-full"
            sectionClassName="w-full"
        />
    );
};

export default AllTickets; 
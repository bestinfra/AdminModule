import { Suspense } from 'react';
import PageC from '@/components/global/PageC';

interface Ticket {
    id: number;
    ticketNumber: string;
    subject: string;
    status: string;
    customerName: string;
    category: string;
    priority: string;
    assignedTo: string;
    createdAt: string;
    lastUpdated: string;
    description: string;
}

interface ActivityLogEntry {
    id: string | number;
    description: string;
    timestamp: string;
    status?: string;
    subText?: string;
    author?: string;
}

interface TicketInformationPannelProps {
    ticket: Ticket;
    activityLog?: ActivityLogEntry[];
    rightStatus?: {
        text: string;
        variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
        onClick?: () => void;
    };
}

export default function TicketInformationPannel({ 
    ticket, 
    activityLog = [], 
    rightStatus 
}: TicketInformationPannelProps) {
    // Component is now purely presentational - all data comes from props
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageC
                sections={[
                    // Page Header Section
                    {
                        layout: {
                            type: 'column',
                            className: 'w-full h-[760px] overflow-y-auto scrollbar-hide'
                        },
                        components: [
                            {
                                name: 'SummaryInfo',
                                span: { col: 2, row: 1 },
                           
                                props: {
                                    title: 'Ticket Details',
                                    className:'bg-background-secondary',
                                    data: {
                                        leftColumn: [
                                            {
                                                label: 'Ticket ID',
                                                value: `#${ticket.ticketNumber}`,
                                            },
                                            {
                                                label: 'Subject',
                                                value: ticket.subject,
                                            },
                                            {
                                                label: 'Created On',
                                                value: new Date(ticket.createdAt).toLocaleString(),
                                            },
                                            {
                                                label: 'Assigned To',
                                                value: ticket.assignedTo,
                                            },
                                        ],
                                        rightColumn: [
                                            {
                                                label: 'Ticket Type',
                                                value: ticket.category,
                                            },
                                            {
                                                label: 'Created By',
                                                value: ticket.customerName,
                                            },
                                            {
                                                label: 'Last Updated',
                                                value: new Date(ticket.lastUpdated).toLocaleString(),
                                            },
                                        ],
                                    },
                                    rightStatus: rightStatus || {
                                        text: ticket.status,
                                        variant: "default",
                                    }
                                },
                            },
                            {
                                name: 'SummaryInfo',
                                span: { col: 2, row: 1 },
                                props: {
                                    title: 'Issue Description',
                                    className:"bg-background-secondary",
                                    data: {
                                        leftColumn: [
                                            {
                                                label: 'Priority',
                                                value: ticket.priority,
                                            },
                                            {
                                                label: 'Category',
                                                value: ticket.category,
                                            },
                                            {
                                                label: 'Customer',
                                                value: ticket.customerName,
                                            },
                                        ],
                                        rightColumn: [
                                            {
                                                label: 'Description',
                                                value: ticket.description,
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                name: 'ActivityLog',
                                span: { col: 2, row: 1 },
                                props: {
                                    title: 'Activity Log',
                                    entries: activityLog,
                                    maxHeight: 'h-96',
                                },
                            }
                        ]
                    }
                ]}
            />
        </Suspense>
    );
} 
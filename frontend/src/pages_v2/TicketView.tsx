import React, { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageC from '@/components/global/PageC';

// Interfaces
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

const TicketView: React.FC = () => {
    const navigate = useNavigate();

    // Hardcoded demo values (disable useAuth logic)
    const isAdmin = false;
    const basePath = '/user/tickets';
    const userDashboardPath = '/tickets';

    // Dummy ticket data
    const [ticket] = useState<Ticket>({
        id: 336,
        ticketNumber: '336',
        subject: 'Connection Issue with Meter',
        status: 'Open',
        customerName: 'Airborne General Store',
        category: 'Connection Issue',
        priority: 'High',
        assignedTo: 'BI - Tech Team',
        createdAt: '2025-07-14T17:24:00',
        lastUpdated: '2025-07-14T17:24:00',
        description: 'Customer reported connection issue with meter A9211434. The meter shows connection error on the display and is not communicating with the system.'
    });

    // Dummy activity log data
    const [activityLog] = useState<ActivityLogEntry[]>([
        {
            id: 1,
            description: "Ticket created",
            timestamp: "2025-07-14T17:24:00",
            status: "Open"
        },
        {
            id: 2,
            description: "Ticket assigned to support team",
            timestamp: "2025-07-14T17:24:00"
        },
        {
            id: 3,
            description: "Initial description provided",
            timestamp: "2025-07-14T17:24:00",
            subText: "Connection issue with meter A9211434"
        },
        {
            id: 4,
            description: "Status updated to In Progress",
            timestamp: "2025-07-15T17:24:00",
            status: "In Progress"
        },
        {
            id: 5,
            description: "Support team responded",
            timestamp: "2025-07-15T18:30:00",
            author: "John Doe",
            subText: "We are investigating the connection issue. Please provide additional details about when this started occurring."
        },
        {
            id: 6,
            description: "Customer provided additional information",
            timestamp: "2025-07-16T09:15:00",
            author: "Customer",
            subText: "The issue started yesterday morning around 9 AM. The meter shows connection error on the display."
        }
    ]);

    const handleOpenTicket = () => {
        // Handle opening the ticket
        console.log('Opening ticket #336');
        // Add your ticket opening logic here
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
                <PageC
                    sections={[
                        {   
                            layout: {
                                type: 'column',
                                gap: 'gap-4',
                                
                            },
                            components: [
                                {
                                    name: 'PageHeader',
                                    props: {
                                        title: 'Ticket Details',
                                        onBackClick: () => {
                                            if (isAdmin) {
                                                navigate(basePath);
                                            } else {
                                                navigate(userDashboardPath);
                                            }
                                        },
                                        backButtonText: isAdmin
                                            ? 'Back to Tickets'
                                            : 'Back to Dashboard',
                                    },
                                },
                            ],
                        },
                        {
                            layout: {
                                type: 'grid',
                                columns: 5,
                                gap: 'gap-4',
                                rows:[
                                    {
                                        layout: "grid",
                                        gap: "gap-4",
                                        gridColumns: 5,
                                        gridRows: 2,
                                        span: { col: 5, row: 1 },
                                        className:'',
                                        columns: [
                                            {
                                                name: 'TicketConversationPanel',
                                                span: { col: 3, row: 1 },
                                                props: {
                                                    title: 'Issue Details',
                                                    data: {
                                                        leftColumn: [
                                                            {
                                                                label: 'Ticket ID',
                                                                value: `#${ticket.ticketNumber}`,
                                                            },
                                                        ],
                                                    },
                                                },
                                            },
                                            {
                                                name: 'TicketInformationPannel',
                                                span: { col: 2, row: 1 },
                                                props: {
                                                    ticket: ticket,
                                                    activityLog: activityLog,
                                                    rightStatus: {
                                                        text: ticket.status,
                                                        variant: "default",
                                                        onClick: () => handleOpenTicket()
                                                    }
                                                },
                                            },
                                           
                                        ]
                                    },
                                    
                                ]
                            },
                               
                        }
                    ]}
                />
        </Suspense>
    );
};

export default TicketView;

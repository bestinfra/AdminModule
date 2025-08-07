import { useState,useEffect,Suspense } from 'react';
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
    UID: string;
    location: string;
    email:string;
    unitNumber:string;
    meterId:string;
    mobile:string;
    connectionType:string;


}

interface ActivityLogEntry {
    id: string | number;
    description: string;
    timestamp: string;
    status?: string;
    subText?: string;
    author?: string;
}


// interface TicketInformationPannelProps {
//     ticket: Ticket;
//     activityLog?: ActivityLogEntry[];
//     rightStatus?: {
//         text: string;
//         variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
//         onClick?: () => void;
//     };
// }

export default function TicketInformationPannel() {

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

    useEffect(() => {
        const fetchedTicket: Ticket = {
            id: 1,
            ticketNumber: '336',
            subject: 'Connection Issue with Meter',
            status: 'Open',
            customerName: 'Airborne General Store',
            category: 'Connection Issue',
            priority: 'High',
            assignedTo: 'BI - Tech Team',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            description: 'Issue with meter connection.',
            UID: '#56B0000',
            location: 'Hydrabad',
            email: 'ravin1109@gmail.com',
            unitNumber: 'N/A',
            meterId: 'A9211434',
            mobile: '9989923312',
            connectionType: 'NA',
        };

        const fetchedActivity: ActivityLogEntry[] = [
            {
                id: 1,
                description: 'Ticket created',
                timestamp: new Date().toISOString(),
                status: 'Open',
                author: 'System',
            },
            {
                id: 2,
                description: 'Assigned to Technician A',
                timestamp: new Date().toISOString(),
                status: 'In Progress',
                author: 'Admin',
            },
        ];

        setTicket(fetchedTicket);
        setActivityLog(fetchedActivity);
    }, []);

    if (!ticket) {
        return <div>Loading Ticket Info...</div>;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageC
                sections={[
                    {
                        layout: {
                            type: 'column',
                            className: 'w-full h-[760px] overflow-y-auto scrollbar-hide',
                        },
                        components: [
                            {
                                name: 'SummaryInfo',
                                span: { col: 2, row: 1 },
                                props: {
                                    title: 'Ticket Details',
                                    className: 'bg-background-secondary',
                                    data: {
                                        leftColumn: [
                                            { label: 'Ticket ID', value: `#${ticket.ticketNumber}` },
                                            { label: 'Subject', value: ticket.subject },
                                            { label: 'Created On', value: new Date(ticket.createdAt).toLocaleString() },
                                            { label: 'Assigned To', value: ticket.assignedTo },
                                        ],
                                        rightColumn: [
                                            { label: 'Ticket Type', value: ticket.category },
                                            { label: 'Created By', value: ticket.customerName },
                                            { label: 'Last Updated', value: new Date(ticket.lastUpdated).toLocaleString() },
                                        ],
                                    },
                                    rightStatus: {
                                        text: ticket.status,
                                        variant: 'default',
                                    },
                                },
                            },
                            {
                                name: 'SummaryInfo',
                                span: { col: 2, row: 1 },
                                props: {
                                    title: 'Unit Details',
                                    className: 'bg-background-secondary',
                                    data: {
                                        leftColumn: [
                                            { label: 'Unit Name', value: ticket.customerName },
                                            { label: 'UID', value: ticket.UID },
                                            { label: 'Location', value: ticket.location },
                                            { label: 'Email', value: ticket.email },
                                        ],
                                        rightColumn: [
                                            { label: 'Unit Number', value: ticket.unitNumber },
                                            { label: 'Meter ID', value: ticket.meterId },
                                            { label: 'Connection Type', value: ticket.connectionType },
                                            { label: 'Mobile', value: ticket.mobile },
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
                            },
                        ],
                    },
                ]}
            />
        </Suspense>
    );
}
 // export default function TicketInformationPannel({ 
//     ticket, 
//     activityLog = [], 
//     rightStatus 
// }: TicketInformationPannelProps) {
//     // Component is now purely presentational - all data comes from props
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
// 
//         </Suspense>
//     );
// } 
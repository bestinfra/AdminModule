import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import PageC from '@components/global/PageC';

// Context
import { useAuth } from '@context/AuthContext';

// Interfaces
interface Ticket {
    id: string;
    ticket_id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    created_at: string;
    updated_at: string;
    assigned_to?: string;
    resolution_notes?: string;
    resolution_date?: string;
    closed_date?: string;
    uid?: string;
    UnitName?: string;
    Email_Id?: string;
    MobileNumber?: string;
    meter_no?: string;
    hierarchy_name?: string;
    connection_type?: string;
    UnityId?: string;
    conversation?: ChatMessage[];
    attachments?: FileAttachment[];
}

interface ChatMessage {
    sender_type: 'user' | 'admin';
    sender_name: string;
    message: string;
    timestamp: string;
    attachments?: FileAttachment[];
    metadata?: {
        role: string;
        department: string;
        isInternal: boolean;
    };
}

interface FileAttachment {
    name: string;
    size: number;
    type: string;
    url?: string;
    file?: File;
    path?: string;
}

interface Activity {
    id: number;
    type: 'status' | 'assignment' | 'note' | 'attachment' | 'response';
    description: string;
    timestamp: string;
    author: string;
    status?: string;
    assignee?: string;
    note?: string;
    attachment?: string;
}

const TicketView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role?.toLowerCase().includes('admin');
    const basePath = isAdmin ? '/admin/tickets' : '/user/tickets';
    const userDashboardPath = '/user';

    // Dummy ticket data
    const ticket: Ticket = {
        id: id || '12345',
        ticket_id: `TKT-${id || '12345'}`,
        title: 'Billing Issue - Incorrect Meter Reading',
        status: 'Open',
        priority: 'High',
        category: 'Billing',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T14:20:00Z',
        assigned_to: 'Support Team',
        resolution_notes: '',
        resolution_date: '',
        closed_date: '',
        uid: 'UID123456789',
        UnitName: 'John Doe',
        Email_Id: 'john.doe@example.com',
        MobileNumber: '+91-9876543210',
        meter_no: 'MTR-789456123',
        hierarchy_name: 'Building A, Floor 3, Unit 301',
        connection_type: 'Residential',
        UnityId: 'UNIT-301-A3',
        conversation: [
            {
                sender_type: 'user',
                sender_name: 'John Doe',
                message: 'Hello, I have an issue with my electricity bill. The reading seems to be much higher than usual.',
                timestamp: '2024-01-15T10:30:00Z',
                metadata: {
                    role: 'consumer',
                    department: 'billing',
                    isInternal: false,
                },
            },
            {
                sender_type: 'admin',
                sender_name: 'Support Agent',
                message: 'Thank you for contacting us. I understand your concern about the high meter reading. Let me check your consumption history and schedule a meter verification.',
                timestamp: '2024-01-15T11:15:00Z',
                metadata: {
                    role: 'support',
                    department: 'customer_service',
                    isInternal: false,
                },
            },
            {
                sender_type: 'user',
                sender_name: 'John Doe',
                message: 'Thank you for the quick response. When can I expect the meter verification to be completed?',
                timestamp: '2024-01-15T11:30:00Z',
                metadata: {
                    role: 'consumer',
                    department: 'billing',
                    isInternal: false,
                },
            },
            {
                sender_type: 'admin',
                sender_name: 'Technical Team',
                message: 'We have scheduled a meter reading verification for tomorrow between 10 AM - 2 PM. Our technician will visit your premises and conduct a thorough check.',
                timestamp: '2024-01-16T09:00:00Z',
                metadata: {
                    role: 'technician',
                    department: 'technical',
                    isInternal: false,
                },
            },
        ],
        attachments: [
            {
                name: 'electricity_bill_december.pdf',
                size: 245760,
                type: 'application/pdf',
                url: '/attachments/electricity_bill_december.pdf',
            },
            {
                name: 'meter_photo.jpg',
                size: 1024000,
                type: 'image/jpeg',
                url: '/attachments/meter_photo.jpg',
            },
        ],
        description: ''
    };

    const activities: Activity[] = [
        {
            id: 1,
            type: 'status',
            description: 'Ticket created',
            timestamp: '2024-01-15T10:30:00Z',
            author: 'John Doe',
            status: 'Open',
        },
        {
            id: 2,
            type: 'assignment',
            description: 'Ticket assigned to support team',
            timestamp: '2024-01-15T10:35:00Z',
            author: 'System',
            assignee: 'Support Team',
        },
        {
            id: 3,
            type: 'note',
            description: 'Initial complaint registered',
            timestamp: '2024-01-15T10:30:00Z',
            author: 'John Doe',
            note: 'Customer reported unusually high electricity consumption reading on the latest bill.',
        },
        {
            id: 4,
            type: 'response',
            description: 'Support team responded',
            timestamp: '2024-01-15T11:15:00Z',
            author: 'Support Agent',
        },
        {
            id: 5,
            type: 'assignment',
            description: 'Escalated to technical team',
            timestamp: '2024-01-16T09:00:00Z',
            author: 'Support Agent',
            assignee: 'Technical Team',
        },
        {
            id: 6,
            type: 'note',
            description: 'Meter verification scheduled',
            timestamp: '2024-01-16T09:05:00Z',
            author: 'Technical Team',
            note: 'Scheduled meter reading verification for January 17, 2024, between 10 AM - 2 PM.',
        },
    ];

    // Chat state
    const [chatMessage, setChatMessage] = useState('');
    const [chatAttachments, setChatAttachments] = useState<File[]>([]);
    const [isSubmittingResponse] = useState(false);

    // Handle chat message sending
    const handleSendMessage = () => {
        if (!chatMessage.trim() && chatAttachments.length === 0) return;

        setChatMessage('');
        setChatAttachments([]);
    };

    // Ticket overview cards data
    const ticketOverviewCards = [
        {
            title: 'Ticket Status',
            value: ticket.status,
            icon: '/icons/ticket.svg',
            subtitle2: 'Current Status',
        },
        {
            title: 'Priority Level',
            value: ticket.priority,
            icon: '/icons/priority.svg',
            subtitle2: 'Issue Priority',
        },
        {
            title: 'Category',
            value: ticket.category,
            icon: '/icons/category.svg',
            subtitle2: 'Ticket Category',
        },
        {
            title: 'Assigned To',
            value: ticket.assigned_to || 'Unassigned',
            icon: '/icons/assigned.svg',
            subtitle2: 'Current Assignee',
        },
    ];

    // Brand green icon style
    const brandGreenIconStyle = {
        filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
    };

    return (
        <PageC
            sections={[
                // Page Header Section
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'row',
                                columns: [
                                    {
                                        name: 'PageHeader',
                                        props: {
                                            title: `Ticket Details`,
                                            subtitle: ticket.title,
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                // Main Content Section - Issue Details and Ticket Info
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 2,
                                gap: 'gap-6',
                                columns: [
                                    {
                                        name: 'IssueCardDetails',
                                        props: {
                                            ticket: ticket,
                                        },
                                    },
                                    {
                                        name: 'TicketInfoCard',
                                        props: {
                                            ticket: ticket,
                                        },
                                    }
                                ]
                            }
                        ]
                    }
                },
                // Chat and Unit Details Section
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'grid',
                                gridColumns: 2,
                                gap: 'gap-6',
                                columns: [
                                    {
                                        name: 'ChatInput',
                                        props: {
                                            chatMessage: chatMessage,
                                            setChatMessage: setChatMessage,
                                            handleSendMessage: handleSendMessage,
                                            isSubmittingResponse: isSubmittingResponse,
                                            chatAttachments: chatAttachments,
                                            setChatAttachments: setChatAttachments,
                                        },
                                    },
                                    {
                                        name: 'UnitDetailsCard',
                                        props: {
                                            ticket: ticket,
                                        },
                                    },
                                ]
                            }
                        ]
                    }
                },
                // Activity Log Section - Right Aligned
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'row',
                                columns: [
                                    {
                                        name: 'ActivityLogCard',
                                        props: {
                                            activities: activities,
                                        },
                                        align: 'end',
                                        
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]}
        />
    );
};

export default TicketView;

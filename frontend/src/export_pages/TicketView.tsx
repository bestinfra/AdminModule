import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { lazy, Suspense } from 'react';
const Page = lazy(() => import('SuperAdmin/Page'));

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

// Custom Components for Ticket Sections
const IssueDetailsCard: React.FC<{ ticket: Ticket | null }> = ({ ticket }) => {
    const getPriorityBadgeClasses = (priority: string): string => {
        switch (priority?.toLowerCase()) {
            case 'low':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-light text-secondary';
            case 'medium':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-alt text-warning';
            case 'high':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-danger-light text-danger';
            case 'critical':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-danger text-white font-semibold';
            default:
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-light text-neutral';
        }
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 h-fit">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-darker mb-2">Issue Details</h2>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-neutral">Priority:</span>
                    <span className={getPriorityBadgeClasses(ticket?.priority || '')}>
                        {ticket?.priority || 'N/A'}
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-medium text-neutral-darker mb-3">Issue</h3>
                <div className="bg-accent-light border border-accent rounded-lg p-3 inline-block">
                    <span className="text-accent text-sm font-medium">{ticket?.category || 'Meter Issue'}</span>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-medium text-neutral-darker">
                    {ticket?.title || 'No Subject'}
                </h4>
                <div className="prose prose-sm max-w-none">
                    <p className="text-neutral leading-relaxed">
                        {ticket?.description || 'No description provided.'}
                    </p>
                </div>
            </div>

            {/* Message bubble */}
            <div className="mt-6 bg-primary-lightest rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-neutral-light rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-neutral" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-neutral-darker">{ticket?.UnitName || 'Airborne General Store'}</p>
                        <p className="text-xs text-neutral">{formatDate(ticket?.created_at || '2024-01-15T10:30:00Z')}</p>
                    </div>
                </div>
                <p className="text-sm text-neutral">Issue</p>
            </div>
        </div>
    );
};

// Chat Input Component (separate from message bubble)
const ChatInput: React.FC<{ 
    chatMessage: string; 
    setChatMessage: (message: string) => void;
    handleSendMessage: () => void;
    isSubmittingResponse: boolean;
}> = ({ chatMessage, setChatMessage, handleSendMessage, isSubmittingResponse }) => {
    return (
        <div className="bg-accent rounded-lg p-4">
            <div className="flex items-center space-x-2">
                <button className="p-2 text-white hover:bg-accent-light rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-neutral-darker placeholder-neutral"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    disabled={isSubmittingResponse}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() || isSubmittingResponse}
                    className="px-4 py-3 bg-accent-light text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

const TicketInfoCard: React.FC<{ ticket: Ticket | null }> = ({ ticket }) => {
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getStatusBadgeClasses = (status: string): string => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-alt text-warning';
            case 'in progress':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-light text-accent';
            case 'resolved':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-light text-secondary';
            case 'closed':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-light text-neutral';
            default:
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-light text-neutral';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 h-fit">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-neutral-darker">Ticket Information</h2>
                <span className={getStatusBadgeClasses(ticket?.status || '')}>
                    {ticket?.status || 'N/A'}
                </span>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                        <span className="text-neutral">Ticket ID</span>
                        <p className="font-medium text-neutral-darker">#{ticket?.ticket_id || 'N/A'}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Ticket Type</span>
                        <p className="font-medium text-neutral-darker">{ticket?.category || 'Meter Issue'}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Source</span>
                        <p className="font-medium text-neutral-darker">N/A</p>
                    </div>
                    <div>
                        <span className="text-neutral">Created By</span>
                        <p className="font-medium text-neutral-darker">{ticket?.UnitName || 'N/A'}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Created On</span>
                        <p className="font-medium text-neutral-darker">{formatDate(ticket?.created_at || '')}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Last Updated</span>
                        <p className="font-medium text-neutral-darker">{formatDate(ticket?.updated_at || '')}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Assigned To</span>
                        <p className="font-medium text-neutral-darker">{ticket?.assigned_to || 'BI - Tech Team'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UnitDetailsCard: React.FC<{ ticket: Ticket | null }> = ({ ticket }) => {
    const toCamelCase = (str: string): string => {
        if (!str) return 'N/A';
        return str
            .split(' ')
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-semibold text-neutral-darker mb-6">Unit Details</h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                        <span className="text-neutral">Unit Name</span>
                        <p className="font-medium text-neutral-darker">{toCamelCase(ticket?.UnitName || 'N/A')}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Unit Number</span>
                        <p className="font-medium text-neutral-darker">N/A</p>
                    </div>
                    <div>
                        <span className="text-neutral">UID</span>
                        <p className="font-medium text-neutral-darker font-mono text-xs">{ticket?.uid || 'BI25GMRA001'}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Meter ID</span>
                        <p className="font-medium text-neutral-darker font-mono text-xs">{ticket?.meter_no || 'A9211434'}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Location</span>
                        <p className="font-medium text-neutral-darker">{ticket?.hierarchy_name || 'GMR'}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Connection Type</span>
                        <p className="font-medium text-neutral-darker">{ticket?.connection_type || 'NA'}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Email</span>
                        <p className="font-medium text-accent">{ticket?.Email_Id || 'ravin1109@gmail.com'}</p>
                    </div>
                    <div>
                        <span className="text-neutral">Mobile</span>
                        <p className="font-medium text-neutral-darker">{ticket?.MobileNumber || '9989923312'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityLogCard: React.FC<{ activities: Activity[] }> = ({ activities }) => {
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-semibold text-neutral-darker mb-6">Activity Log</h2>
            
            <div className="relative h-64 overflow-y-auto">
                {!activities || activities.length === 0 ? (
                    <div className="text-center py-4 text-neutral">
                        <p className="text-sm">No activity recorded yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4 pr-2">
                        {activities
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map((activity) => (
                                <div key={`activity-${activity.id}`} className="flex items-start justify-between py-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-neutral-darker mb-1">
                                            {activity.description}
                                        </p>
                                        {activity.status && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-neutral">Status:</span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    activity.status.toLowerCase() === 'open' ? 'bg-warning-alt text-warning' :
                                                    'bg-neutral-light text-neutral'
                                                }`}>
                                                    {activity.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right text-xs text-neutral">
                                        {formatDate(activity.timestamp)}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

const TicketView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { user } = useAuth();
    const isAdmin = user?.role?.toLowerCase().includes('admin');
    const basePath = isAdmin ? '/admin/tickets' : '/user/tickets';
    const userDashboardPath = '/user';

    // Dummy data
    const dummyTicket: Ticket = {
        id: id || '12345',
        ticket_id: `TKT-${id || '12345'}`,
        title: 'Billing Issue - Incorrect Meter Reading',
        description: 'I have noticed that my last month electricity bill shows an unusually high consumption reading. The meter reading seems to be incorrect as my usage pattern has not changed significantly. I would like to request a manual meter reading verification and correction of the billing amount if necessary.',
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
    };

    const dummyActivities: Activity[] = [
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

    // State
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Chat state
    const [chatMessage, setChatMessage] = useState('');
    const [chatAttachments, setChatAttachments] = useState<File[]>([]);
    const [isSubmittingResponse] = useState(false);

    // Fetch ticket data
    useEffect(() => {
            const fetchTicketDetails = async () => {
            if (!id) return;
            
                try {
                    setIsLoading(true);
                    setError(null);

                // API call to fetch ticket details
                const response = await fetch(`/api/tickets/${id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket details');
                }

                const ticketData = await response.json();
                
                if (ticketData.status === 'success') {
                    const ticket = ticketData.data;
                        setTicket({
                        ...ticket,
                        conversation: ticket.conversation || [],
                        });

                    // Generate activity log from ticket data
                        const activityLog: Activity[] = [
                            {
                                id: 1,
                            type: 'status' as const,
                                description: 'Ticket created',
                            timestamp: ticket.created_at,
                            author: ticket.UnitName || 'N/A',
                                status: 'Open',
                            },
                        // Add more activities based on ticket updates
                        ...(ticket.updated_at !== ticket.created_at ? [{
                            id: 2,
                            type: 'status' as const,
                            description: 'Ticket updated',
                            timestamp: ticket.updated_at,
                            author: 'System',
                            status: ticket.status,
                        }] : []),
                        ];

                        setActivities(activityLog);
                    } else {
                    throw new Error(ticketData.message || 'Failed to fetch ticket details');
                    }
                } catch (err) {
                    console.error('Error fetching ticket details:', err);
                    setError(err instanceof Error ? err.message : 'Failed to fetch ticket details');
                
                // Fallback to dummy data for development
                setTicket(dummyTicket);
                setActivities(dummyActivities);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchTicketDetails();
    }, [id]);

    // Handle chat message sending
    const handleSendMessage = () => {
        if (!chatMessage.trim() && chatAttachments.length === 0) return;
        if (!ticket) return;

        const newMessage: ChatMessage = {
            sender_type: isAdmin ? 'admin' : 'user',
            sender_name: isAdmin ? 'Support Agent' : ticket?.UnitName || user?.username || 'You',
            message: chatMessage.trim(),
            timestamp: new Date().toISOString(),
            attachments: chatAttachments.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                file,
            })),
            metadata: {
                role: isAdmin ? 'support' : 'consumer',
                department: isAdmin ? 'customer_service' : 'billing',
                isInternal: false,
            },
        };

        // Add message to conversation
        setTicket((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                conversation: [...(prev.conversation || []), newMessage],
                updated_at: new Date().toISOString(),
            };
        });

        // Add activity log entry
        const newActivity: Activity = {
            id: activities.length + 1,
            type: 'response',
            description: isAdmin ? 'Support team responded' : 'Customer responded',
            timestamp: new Date().toISOString(),
            author: isAdmin ? 'Support Agent' : ticket?.UnitName || user?.username || 'You',
        };

        setActivities(prev => [...prev, newActivity]);

        setChatMessage('');
        setChatAttachments([]);
    };

    // Error handling
    if (error) {
        return (
            <div className="p-4">
            <Page
                sections={[
                    {
                            layout: {
                                type: 'column',
                                gap: 'gap-6',
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
                                        backButtonText: isAdmin ? "Back to Tickets" : "Back to Dashboard",
                                    },
                                },
                                {
                                    name: 'Card',
                                    props: {
                                        title: 'Error Loading Ticket',
                                        value: error,
                                        icon: '/icons/error-mark.svg',
                                        subtitle1: 'Please try again or contact support',
                                        subtitle2: 'Error occurred while loading ticket details',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="p-4">
            <Page
                sections={[
                    {
                            layout: {
                                type: 'column',
                                gap: 'gap-6',
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
                                        backButtonText: isAdmin ? "Back to Tickets" : "Back to Dashboard",
                                    },
                                },
                                {
                                    name: 'Card',
                                    props: {
                                        title: 'Loading...',
                                        value: 'Please wait while we load the ticket details',
                                        icon: '/icons/loading.svg',
                                        subtitle1: 'Fetching ticket information',
                                        subtitle2: 'This may take a few moments',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </div>
        );
    }

    // No ticket found
    if (!ticket) {
        return (
            <div className="p-4">
                <Page
                    sections={[
                        {
                            layout: {
                                type: 'column',
                                gap: 'gap-6',
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
                                        backButtonText: isAdmin ? "Back to Tickets" : "Back to Dashboard",
                                    },
                                },
                                {
                                    name: 'Card',
                                    props: {
                                        title: 'Ticket Not Found',
                                        value: 'The ticket you\'re looking for doesn\'t exist or may have been removed.',
                                        icon: '/icons/error-mark.svg',
                                        subtitle1: 'Please check the ticket ID and try again',
                                        subtitle2: 'Or return to the tickets list',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </div>
        );
    }

    // Main render using PageC structure with custom components
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div className="p-4">
            <Page
                sections={[
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-6',
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
                                    backButtonText: isAdmin ? "Back to Tickets" : "Back to Dashboard",
                                },
                            },
                        ],
                    },
                ]}
            />
            
            {/* Custom detailed layout to match the image exactly */}
            <div className="mt-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column */}
                    <div className="col-span-8 flex flex-col min-h-[calc(100vh-200px)]">
                        {/* Issue Details */}
                        <div className="flex-1">
                            <IssueDetailsCard ticket={ticket} />
                        </div>
                        
                        {/* Chat Input - Fixed at bottom */}
                        <div className="mt-6">
                            <ChatInput 
                                chatMessage={chatMessage}
                                setChatMessage={setChatMessage}
                                handleSendMessage={handleSendMessage}
                                isSubmittingResponse={isSubmittingResponse}
                            />
                        </div>
                    </div>
                    
                    {/* Right Column - Scrollable */}
                    <div 
                        className="col-span-4 h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        <div className="space-y-6">
                            {/* Ticket Information */}
                            <TicketInfoCard ticket={ticket} />
                            
                            {/* Unit Details */}
                            <UnitDetailsCard ticket={ticket} />
                            
                            {/* Activity Log */}
                            <ActivityLogCard activities={activities} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Suspense>
    );
};

export default TicketView;

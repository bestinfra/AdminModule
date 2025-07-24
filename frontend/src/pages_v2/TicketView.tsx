import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Page from '@/components/global/PageC';

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
                    <h2 className="text-xl font-semibold text-neutral-darker mb-2">
                        Issue Details
                    </h2>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-neutral">Priority:</span>
                    <span
                        className={getPriorityBadgeClasses(
                            ticket?.priority || ''
                        )}>
                        {ticket?.priority || 'N/A'}
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-medium text-neutral-darker mb-3">
                    Issue
                </h3>
                <div className="bg-accent-light border border-accent rounded-lg p-3 inline-block">
                    <span className="text-accent text-sm font-medium">
                        {ticket?.category || 'Meter Issue'}
                    </span>
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
                        <svg
                            className="w-4 h-4 text-neutral"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-neutral-darker">
                            {ticket?.UnitName || 'Airborne General Store'}
                        </p>
                        <p className="text-xs text-neutral">
                            {formatDate(
                                ticket?.created_at || '2024-01-15T10:30:00Z'
                            )}
                        </p>
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
}> = ({
    chatMessage,
    setChatMessage,
    handleSendMessage,
    isSubmittingResponse,
}) => {
    return (
        <div className="bg-accent rounded-lg p-4">
            <div className="flex items-center space-x-2">
                <button className="p-2 text-white hover:bg-accent-light rounded-lg">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
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
                    className="px-4 py-3 bg-accent-light text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed font-medium">
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
                <h2 className="text-xl font-semibold text-neutral-darker">
                    Ticket Information
                </h2>
                <span className={getStatusBadgeClasses(ticket?.status || '')}>
                    {ticket?.status || 'N/A'}
                </span>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                        <span className="text-neutral">Ticket ID</span>
                        <p className="font-medium text-neutral-darker">
                            #{ticket?.ticket_id || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Ticket Type</span>
                        <p className="font-medium text-neutral-darker">
                            {ticket?.category || 'Meter Issue'}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Source</span>
                        <p className="font-medium text-neutral-darker">N/A</p>
                    </div>
                    <div>
                        <span className="text-neutral">Created By</span>
                        <p className="font-medium text-neutral-darker">
                            {ticket?.UnitName || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Created On</span>
                        <p className="font-medium text-neutral-darker">
                            {formatDate(ticket?.created_at || '')}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Last Updated</span>
                        <p className="font-medium text-neutral-darker">
                            {formatDate(ticket?.updated_at || '')}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Assigned To</span>
                        <p className="font-medium text-neutral-darker">
                            {ticket?.assigned_to || 'BI - Tech Team'}
                        </p>
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
            <h2 className="text-xl font-semibold text-neutral-darker mb-6">
                Unit Details
            </h2>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                        <span className="text-neutral">Unit Name</span>
                        <p className="font-medium text-neutral-darker">
                            {toCamelCase(ticket?.UnitName || 'N/A')}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Unit Number</span>
                        <p className="font-medium text-neutral-darker">N/A</p>
                    </div>
                    <div>
                        <span className="text-neutral">UID</span>
                        <p className="font-medium text-neutral-darker font-mono text-xs">
                            {ticket?.uid || 'BI25GMRA001'}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Meter ID</span>
                        <p className="font-medium text-neutral-darker font-mono text-xs">
                            {ticket?.meter_no || 'A9211434'}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Location</span>
                        <p className="font-medium text-neutral-darker">
                            {ticket?.hierarchy_name || 'GMR'}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Connection Type</span>
                        <p className="font-medium text-neutral-darker">
                            {ticket?.connection_type || 'NA'}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Email</span>
                        <p className="font-medium text-accent">
                            {ticket?.Email_Id || 'ravin1109@gmail.com'}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral">Mobile</span>
                        <p className="font-medium text-neutral-darker">
                            {ticket?.MobileNumber || '9989923312'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityLogCard: React.FC<{ activities: Activity[] }> = ({
    activities,
}) => {
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
            <h2 className="text-xl font-semibold text-neutral-darker mb-6">
                Activity Log
            </h2>

            <div className="relative h-64 overflow-y-auto">
                {!activities || activities.length === 0 ? (
                    <div className="text-center py-4 text-neutral">
                        <p className="text-sm">No activity recorded yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4 pr-2">
                        {activities
                            .sort(
                                (a, b) =>
                                    new Date(b.timestamp).getTime() -
                                    new Date(a.timestamp).getTime()
                            )
                            .map((activity) => (
                                <div
                                    key={`activity-${activity.id}`}
                                    className="flex items-start justify-between py-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-neutral-darker mb-1">
                                            {activity.description}
                                        </p>
                                        {activity.status && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-neutral">
                                                    Status:
                                                </span>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        activity.status.toLowerCase() ===
                                                        'open'
                                                            ? 'bg-warning-alt text-warning'
                                                            : 'bg-neutral-light text-neutral'
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
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const TicketView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Safe auth usage for federated environments
    let user = null;
    let isAdmin = false;
    let basePath = '/tickets';
    let userDashboardPath = '/';

    try {
        const authResult = useAuth();
        user = authResult?.user;
        isAdmin = user?.role?.toLowerCase().includes('admin') || false;
        basePath = isAdmin ? '/admin/tickets' : '/user/tickets';
        userDashboardPath = '/user';
    } catch (error) {
        // Fallback for federated environments where AuthProvider might not be available
        console.log('Auth context not available, using fallback values');
    }

    // Generate dummy data based on ticket ID
    const generateDummyTicket = (ticketId: string): Ticket => {
        const ticketData = {
            'TICKET-001': {
                title: 'Power Outage in Downtown Area',
                description:
                    'Complete power outage affecting 50+ customers in downtown area. Emergency response required. Multiple businesses and residential units affected.',
                status: 'Open',
                priority: 'High',
                category: 'Power Outage',
                assigned_to: 'Sarah Johnson',
                UnitName: 'John Smith',
                Email_Id: 'john.smith@email.com',
                MobileNumber: '+1-555-0123',
                meter_no: 'MTR-001',
                hierarchy_name: 'Downtown District, Building 1',
                connection_type: 'Commercial',
                UnityId: 'UNIT-DT-001',
                conversation: [
                    {
                        sender_type: 'user' as const,
                        sender_name: 'John Smith',
                        message:
                            'There is a complete power outage in the downtown area. Multiple businesses are affected.',
                        timestamp: '2024-01-15T09:30:00Z',
                        metadata: {
                            role: 'consumer',
                            department: 'emergency',
                            isInternal: false,
                        },
                    },
                    {
                        sender_type: 'admin' as const,
                        sender_name: 'Sarah Johnson',
                        message:
                            'Thank you for reporting this. We have dispatched our emergency response team. ETA is 30 minutes.',
                        timestamp: '2024-01-15T09:45:00Z',
                        metadata: {
                            role: 'support',
                            department: 'emergency',
                            isInternal: false,
                        },
                    },
                ] as ChatMessage[],
                attachments: [
                    {
                        name: 'outage_location_map.pdf',
                        size: 512000,
                        type: 'application/pdf',
                        url: '/attachments/outage_location_map.pdf',
                    },
                ],
            },
            'TICKET-002': {
                title: 'Meter Reading Issue',
                description:
                    'Customer reports incorrect meter readings. Investigation needed to verify the accuracy of the meter data.',
                status: 'In Progress',
                priority: 'Medium',
                category: 'Meter Issues',
                assigned_to: 'Mike Chen',
                UnitName: 'Emily Davis',
                Email_Id: 'emily.davis@email.com',
                MobileNumber: '+1-555-0456',
                meter_no: 'MTR-002',
                hierarchy_name: 'Suburb Area, House 456',
                connection_type: 'Residential',
                UnityId: 'UNIT-SUB-002',
                conversation: [
                    {
                        sender_type: 'user' as const,
                        sender_name: 'Emily Davis',
                        message:
                            'My meter readings seem to be incorrect this month. The consumption is much higher than usual.',
                        timestamp: '2024-01-14T11:45:00Z',
                        metadata: {
                            role: 'consumer',
                            department: 'billing',
                            isInternal: false,
                        },
                    },
                    {
                        sender_type: 'admin' as const,
                        sender_name: 'Mike Chen',
                        message:
                            'I will investigate this issue. Let me check your meter history and schedule a verification.',
                        timestamp: '2024-01-14T12:15:00Z',
                        metadata: {
                            role: 'support',
                            department: 'technical',
                            isInternal: false,
                        },
                    },
                ] as ChatMessage[],
                attachments: [
                    {
                        name: 'meter_reading_report.pdf',
                        size: 256000,
                        type: 'application/pdf',
                        url: '/attachments/meter_reading_report.pdf',
                    },
                ],
            },
            'TICKET-003': {
                title: 'Billing Dispute',
                description:
                    'Customer disputing monthly bill amount. Investigation completed and resolution provided.',
                status: 'Resolved',
                priority: 'Low',
                category: 'Billing',
                assigned_to: 'Lisa Park',
                UnitName: 'Robert Wilson',
                Email_Id: 'robert.wilson@email.com',
                MobileNumber: '+1-555-0789',
                meter_no: 'MTR-003',
                hierarchy_name: 'Village Area, Unit 789',
                connection_type: 'Residential',
                UnityId: 'UNIT-VIL-003',
                conversation: [
                    {
                        sender_type: 'user' as const,
                        sender_name: 'Robert Wilson',
                        message:
                            'I believe there is an error in my monthly bill. The amount seems incorrect.',
                        timestamp: '2024-01-13T16:20:00Z',
                        metadata: {
                            role: 'consumer',
                            department: 'billing',
                            isInternal: false,
                        },
                    },
                    {
                        sender_type: 'admin' as const,
                        sender_name: 'Lisa Park',
                        message:
                            'I have reviewed your bill and found the discrepancy. A credit has been applied to your account.',
                        timestamp: '2024-01-15T09:45:00Z',
                        metadata: {
                            role: 'support',
                            department: 'billing',
                            isInternal: false,
                        },
                    },
                ] as ChatMessage[],
                attachments: [
                    {
                        name: 'billing_correction.pdf',
                        size: 128000,
                        type: 'application/pdf',
                        url: '/attachments/billing_correction.pdf',
                    },
                ],
            },
            'TICKET-004': {
                title: 'Service Connection Request',
                description:
                    'New customer requesting service connection for residential property.',
                status: 'Open',
                priority: 'Medium',
                category: 'New Connection',
                assigned_to: 'David Kim',
                UnitName: 'Maria Garcia',
                Email_Id: 'maria.garcia@email.com',
                MobileNumber: '+1-555-0321',
                meter_no: 'MTR-004',
                hierarchy_name: 'New District, Building 321',
                connection_type: 'Residential',
                UnityId: 'UNIT-NEW-004',
                conversation: [
                    {
                        sender_type: 'user' as const,
                        sender_name: 'Maria Garcia',
                        message:
                            'I would like to request a new service connection for my residential property.',
                        timestamp: '2024-01-16T08:15:00Z',
                        metadata: {
                            role: 'consumer',
                            department: 'connections',
                            isInternal: false,
                        },
                    },
                    {
                        sender_type: 'admin' as const,
                        sender_name: 'David Kim',
                        message:
                            'Thank you for your request. I will process your application and contact you within 24 hours.',
                        timestamp: '2024-01-16T08:30:00Z',
                        metadata: {
                            role: 'support',
                            department: 'connections',
                            isInternal: false,
                        },
                    },
                ] as ChatMessage[],
                attachments: [
                    {
                        name: 'property_documents.pdf',
                        size: 1024000,
                        type: 'application/pdf',
                        url: '/attachments/property_documents.pdf',
                    },
                ],
            },
            'TICKET-005': {
                title: 'Equipment Maintenance',
                description:
                    'Critical equipment failure at substation. Immediate attention required.',
                status: 'Escalated',
                priority: 'High',
                category: 'Equipment',
                assigned_to: 'Technical Team',
                UnitName: 'James Brown',
                Email_Id: 'james.brown@email.com',
                MobileNumber: '+1-555-0654',
                meter_no: 'MTR-005',
                hierarchy_name: 'Industrial Zone, Substation Alpha',
                connection_type: 'Industrial',
                UnityId: 'UNIT-IND-005',
                conversation: [
                    {
                        sender_type: 'user' as const,
                        sender_name: 'James Brown',
                        message:
                            'There is a critical equipment failure at Substation Alpha. Immediate attention required.',
                        timestamp: '2024-01-15T13:00:00Z',
                        metadata: {
                            role: 'consumer',
                            department: 'emergency',
                            isInternal: false,
                        },
                    },
                    {
                        sender_type: 'admin' as const,
                        sender_name: 'Technical Team',
                        message:
                            'Emergency response team dispatched. ETA is 15 minutes. Safety protocols activated.',
                        timestamp: '2024-01-15T13:15:00Z',
                        metadata: {
                            role: 'technician',
                            department: 'emergency',
                            isInternal: false,
                        },
                    },
                ] as ChatMessage[],
                attachments: [
                    {
                        name: 'equipment_failure_report.pdf',
                        size: 2048000,
                        type: 'application/pdf',
                        url: '/attachments/equipment_failure_report.pdf',
                    },
                ],
            },
        };

        const ticketInfo =
            ticketData[ticketId as keyof typeof ticketData] ||
            ticketData['TICKET-001'];

        return {
            id: ticketId,
            ticket_id: ticketId,
            title: ticketInfo.title,
            description: ticketInfo.description,
            status: ticketInfo.status,
            priority: ticketInfo.priority,
            category: ticketInfo.category,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-16T14:20:00Z',
            assigned_to: ticketInfo.assigned_to,
            resolution_notes: '',
            resolution_date: '',
            closed_date: '',
            uid: `UID${ticketId.replace('TICKET-', '')}`,
            UnitName: ticketInfo.UnitName,
            Email_Id: ticketInfo.Email_Id,
            MobileNumber: ticketInfo.MobileNumber,
            meter_no: ticketInfo.meter_no,
            hierarchy_name: ticketInfo.hierarchy_name,
            connection_type: ticketInfo.connection_type,
            UnityId: ticketInfo.UnityId,
            conversation: ticketInfo.conversation,
            attachments: ticketInfo.attachments,
        };
    };

    // State
    const [ticket, setTicket] = useState<Ticket | null>(
        generateDummyTicket(id || 'TICKET-001')
    );
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Chat state
    const [chatMessage, setChatMessage] = useState('');
    const [chatAttachments, setChatAttachments] = useState<File[]>([]);

    // Dummy data for fallback
    const dummyTicket = generateDummyTicket(id || 'TICKET-001');
    const dummyActivities: Activity[] = [
        {
            id: 1,
            type: 'status',
            description: 'Ticket created',
            timestamp: '2024-01-15T10:30:00Z',
            author: 'John Smith',
            status: 'Open',
        },
        {
            id: 2,
            type: 'note',
            description:
                'Scheduled meter reading verification for January 17, 2024, between 10 AM - 2 PM.',
            timestamp: '2024-01-16T09:05:00Z',
            author: 'Technical Team',
            note: 'Scheduled meter reading verification for January 17, 2024, between 10 AM - 2 PM.',
        },
    ];

    // Set activities immediately for development
    useEffect(() => {
        const fetchTicketDetails = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                // setError(null); // Removed: error state
                // API call to fetch ticket details
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL || ''}/tickets/${id}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket details');
                }
                const ticketData = await response.json();
                if (ticketData.success) {
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
                        ...(ticket.updated_at !== ticket.created_at
                            ? [
                                  {
                                      id: 2,
                                      type: 'status' as const,
                                      description: 'Ticket updated',
                                      timestamp: ticket.updated_at,
                                      author: 'System',
                                      status: ticket.status,
                                  },
                              ]
                            : []),
                    ];
                    setActivities(activityLog);
                } else {
                    throw new Error(
                        ticketData.message || 'Failed to fetch ticket details'
                    );
                }
            } catch (err) {
                console.error('Error fetching ticket details:', err);
                // setError(err instanceof Error ? err.message : 'Failed to fetch ticket details'); // Removed: error state
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
            sender_name: isAdmin
                ? 'Support Agent'
                : ticket?.UnitName || user?.username || 'Customer',
            message: chatMessage.trim(),
            timestamp: new Date().toISOString(),
            attachments: chatAttachments.map((file) => ({
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
            description: isAdmin
                ? 'Support team responded'
                : 'Customer responded',
            timestamp: new Date().toISOString(),
            author: isAdmin
                ? 'Support Agent'
                : ticket?.UnitName || user?.username || 'Customer',
        };

        setActivities((prev) => [...prev, newActivity]);

        setChatMessage('');
        setChatAttachments([]);
    };

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
                                        backButtonText: isAdmin
                                            ? 'Back to Tickets'
                                            : 'Back to Dashboard',
                                    },
                                },
                                {
                                    name: 'Card',
                                    props: {
                                        title: 'Loading...',
                                        value: 'Please wait while we load the ticket details',
                                        icon: '/icons/loading.svg',
                                        subtitle1:
                                            'Fetching ticket information',
                                        subtitle2:
                                            'This may take a few moments',
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
                                        backButtonText: isAdmin
                                            ? 'Back to Tickets'
                                            : 'Back to Dashboard',
                                    },
                                },
                                {
                                    name: 'Card',
                                    props: {
                                        title: 'Ticket Not Found',
                                        value: "The ticket you're looking for doesn't exist or may have been removed.",
                                        icon: '/icons/error-mark.svg',
                                        subtitle1:
                                            'Please check the ticket ID and try again',
                                        subtitle2:
                                            'Or return to the tickets list',
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
                                        backButtonText: isAdmin
                                            ? 'Back to Tickets'
                                            : 'Back to Dashboard',
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
                                    isSubmittingResponse={false} // Removed: isSubmittingResponse state
                                />
                            </div>
                        </div>

                        {/* Right Column - Scrollable */}
                        <div
                            className="col-span-4 h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}>
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

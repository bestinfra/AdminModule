import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Page from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';
import Button from '@components/global/Button';

// Context
import { useAuth } from '../context/AuthContext';

// Types
import type { Section } from '@components/global/Page';

// API Base URL

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
    const [ticket, setTicket] = useState<Ticket | null>(dummyTicket);
    const [activities, setActivities] = useState<Activity[]>(dummyActivities);
    const [isLoading] = useState(false);
    const [error] = useState<string | null>(null);

    // Chat state
    const [chatMessage, setChatMessage] = useState('');
    const [chatAttachments, setChatAttachments] = useState<File[]>([]);
    const [isSubmittingResponse] = useState(false);

    // Utility functions
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

    const getStatusBadgeClasses = (status: string): string => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800';
            case 'in progress':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800';
            case 'resolved':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
            case 'closed':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800';
            default:
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800';
        }
    };

    const getPriorityBadgeClasses = (priority: string): string => {
        switch (priority?.toLowerCase()) {
            case 'low':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800';
            case 'medium':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800';
            case 'high':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800';
            case 'critical':
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-200 text-red-900 font-semibold';
            default:
                return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800';
        }
    };

    // Initialize with dummy data (commented out API call for now)
    useEffect(() => {
        if (id) {
            // Using dummy data instead of API call to avoid glitches
            // Uncomment below code when API is ready
            /*
            const fetchTicketDetails = async () => {
                try {
                    setIsLoading(true);
                    setError(null);

                    const response = await apiClient.get(`/tickets/${id}`);
                    
                    if (response.status === 'success') {
                        const ticketData = response.data;
                        setTicket({
                            ...ticketData,
                            conversation: ticketData.conversation || [],
                        });

                        const activityLog: Activity[] = [
                            {
                                id: 1,
                                type: 'status',
                                description: 'Ticket created',
                                timestamp: ticketData.created_at,
                                author: ticketData.UnitName || 'N/A',
                                status: 'Open',
                            },
                        ];

                        setActivities(activityLog);
                    } else {
                        throw new Error(response.message || 'Failed to fetch ticket details');
                    }
                } catch (err) {
                    console.error('Error fetching ticket details:', err);
                    setError(err instanceof Error ? err.message : 'Failed to fetch ticket details');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchTicketDetails();
            */
            
            // For now, just ensure dummy data is loaded
            console.log('Ticket view loaded with dummy data for ID:', id);
        }
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



    // Header component
    const headerComponent = (
        <PageHeader
            title="Ticket Details"
            onBackClick={() => {
                if (isAdmin) {
                    navigate(basePath);
                } else {
                    navigate(userDashboardPath);
                }
            }}
            backButtonText={isAdmin ? "Back to Tickets" : "Back to Dashboard"}
        />
    );

    // Issue Details Section
    const issueDetailsSection: Section = {
        id: 'issue-details',
        component: (
            <div className="bg-white rounded-lg shadow p-6 h-fit">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Issue Details</h2>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">Priority:</span>
                            <span className={getPriorityBadgeClasses(ticket?.priority || '')}>
                                {ticket?.priority || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Issue</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block">
                        <span className="text-blue-700 text-sm font-medium">{ticket?.category || 'Meter Issue'}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">
                        {ticket?.title || 'No Subject'}
                    </h4>
                    <div className="prose prose-sm max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                            {ticket?.description || 'No description provided.'}
                        </p>
                    </div>
                </div>
            </div>
        ),
    };

    // Ticket Information Section
    const ticketInfoSection: Section = {
        id: 'ticket-info',
        component: (
            <div className="bg-white rounded-lg shadow p-6 h-fit">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Ticket Information</h2>
                    <span className={getStatusBadgeClasses(ticket?.status || '')}>
                        {ticket?.status || 'N/A'}
                    </span>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div>
                            <span className="text-gray-500">Ticket ID</span>
                            <p className="font-medium text-gray-900">#{ticket?.ticket_id || id || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Ticket Type</span>
                            <p className="font-medium text-gray-900">{ticket?.category || 'Meter Issue'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Source</span>
                            <p className="font-medium text-gray-900">N/A</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Created By</span>
                            <p className="font-medium text-gray-900">{ticket?.UnitName || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Created On</span>
                            <p className="font-medium text-gray-900">{formatDate(ticket?.created_at || '')}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Last Updated</span>
                            <p className="font-medium text-gray-900">{formatDate(ticket?.updated_at || '')}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Assigned To</span>
                            <p className="font-medium text-gray-900">{ticket?.assigned_to || 'BI - Tech Team'}</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
    };

    // Unit Details Section
    const unitDetailsSection: Section = {
        id: 'unit-details',
        component: (
            <div className="bg-white rounded-lg shadow p-6 h-fit">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Unit Details</h2>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div>
                            <span className="text-gray-500">Unit Name</span>
                            <p className="font-medium text-gray-900">{toCamelCase(ticket?.UnitName || 'N/A')}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Unit Number</span>
                            <p className="font-medium text-gray-900">N/A</p>
                        </div>
                        <div>
                            <span className="text-gray-500">UID</span>
                            <p className="font-medium text-gray-900 font-mono text-xs">{ticket?.uid || 'BI25GMRA001'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Meter ID</span>
                            <p className="font-medium text-gray-900 font-mono text-xs">{ticket?.meter_no || 'A9211434'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Location</span>
                            <p className="font-medium text-gray-900">{ticket?.hierarchy_name || 'GMR'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Connection Type</span>
                            <p className="font-medium text-gray-900">{ticket?.connection_type || 'NA'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Email</span>
                            <p className="font-medium text-blue-600">{ticket?.Email_Id || 'ravin1109@gmail.com'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Mobile</span>
                            <p className="font-medium text-gray-900">{ticket?.MobileNumber || '9989923312'}</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
    };

    // Activity Log Section
    const activityLogSection: Section = {
        id: 'activity-log',
        component: (
            <div className="bg-white rounded-lg shadow p-6 h-fit">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Log</h2>
                
                <div className="relative h-64 overflow-y-auto">
                    {!activities || activities.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No activity recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pr-2">
                            {activities
                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                .map((activity) => (
                                    <div key={`activity-${activity.id}`} className="flex items-start justify-between py-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                {activity.description}
                                            </p>
                                            {activity.status && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">Status:</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        activity.status.toLowerCase() === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {activity.status}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-gray-500">
                                            {formatDate(activity.timestamp)}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        ),
    };

    const conversationSection: Section = {
        id: 'conversation',
        component: (
            <div className="bg-white rounded-lg shadow p-6 h-fit">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{ticket?.UnitName || 'Airborne General Store'}</p>
                            <p className="text-xs text-gray-500">{formatDate(ticket?.created_at || '2024-01-15T10:30:00Z')}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">Issue</p>
                </div>
                
                {/* Chat input */}
                <div className="bg-blue-600 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-white hover:bg-blue-700 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="flex-1 px-4 py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900 placeholder-gray-500"
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
                            className="px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        ),
    };



    // Error handling
    if (error) {
        return (
            <Page
                layout="single-column"
                sections={[
                    {
                        id: 'error',
                        component: (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Error Loading Ticket</h3>
                                        <p className="text-sm text-red-700 mt-1">{error}</p>
                                        <div className="mt-4">
                                            <Button
                                                label="Go Back"
                                                onClick={() => navigate(basePath)}
                                                variant="outline"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ]}
                header={headerComponent}
                className=""
            />
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <Page
                layout="single-column"
                sections={[
                    {
                        id: 'loading',
                        component: (
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        ),
                    },
                ]}
                header={headerComponent}
                className="p-4"
            />
        );
    }

    // No ticket found
    if (!ticket) {
        return (
            <Page
                layout="single-column"
                sections={[
                    {
                        id: 'not-found',
                        component: (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Ticket Not Found</h3>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            The ticket you're looking for doesn't exist or may have been removed.
                                        </p>
                                        <div className="mt-4">
                                            <Button
                                                label="Back to Tickets"
                                                onClick={() => navigate(basePath)}
                                                variant="outline"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ]}
                header={headerComponent}
                className=""
            />
        );
    }

    // Main render - Custom layout to match the exact design
    return (
        <div className=" flex flex-col gap-6">
            {headerComponent}
            <div className="">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column */}
                    <div className="col-span-8 space-y-6 gap-6 h-full justify-between flex flex-col"> 
                        {issueDetailsSection.component}
                        {conversationSection.component}
                    </div>
                    
                    {/* Right Column */}
                    <div className="col-span-4 space-y-6">
                        {ticketInfoSection.component}
                        {unitDetailsSection.component}
                        {activityLogSection.component}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketView;

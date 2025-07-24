import React from 'react';

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

interface TicketInfoCardProps {
    ticket: Ticket | null;
    className?: string;
}

const TicketInfoCard: React.FC<TicketInfoCardProps> = ({ ticket, className = '' }) => {
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
        <div className={`bg-white rounded-lg shadow p-6 h-fit ${className}`}>
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

export default TicketInfoCard; 
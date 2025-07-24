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

interface IssueDetailsCardProps {
    ticket: Ticket | null;
    className?: string;
}

const IssueDetailsCard: React.FC<IssueDetailsCardProps> = ({ ticket, className = '' }) => {
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
        <div className={`bg-white rounded-lg shadow p-6 h-fit ${className}`}>
            {/* Header with Issue Details title and Priority indicator */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-darker">Issue Details</h2>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-neutral">Priority:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 shadow-sm">
                        High
                    </span>
                </div>
            </div>

            {/* Main title and category tag */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-darker mb-3">
                    Testing
                </h3>
                <div className="bg-purple-100 border border-purple-200 rounded-lg p-2 inline-block shadow-sm">
                    <span className="text-purple-700 text-sm font-medium">Connection Issue</span>
                </div>
            </div>
        </div>
    );
};

export default IssueDetailsCard; 
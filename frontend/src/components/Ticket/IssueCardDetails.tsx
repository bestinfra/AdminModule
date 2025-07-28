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

interface IssueCardDetailsProps {
    ticket?: Ticket | null;
    className?: string;
}

const IssueCardDetails: React.FC<IssueCardDetailsProps> = ({ ticket, className = '' }) => {
    const getPriorityBadgeClasses = (priority: string): string => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'low':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryBadgeClasses = (category: string): string => {
        switch (category?.toLowerCase()) {
            case 'billing':
                return 'bg-purple-100 text-purple-700';
            case 'connection':
                return 'bg-blue-100 text-blue-700';
            case 'meter':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow p-4 h-fit ${className}`}>
            {/* Header with Issue Details title and Priority indicator */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-neutral-darker">Issue Details</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-neutral">Priority:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shadow-sm ${getPriorityBadgeClasses(ticket?.priority || '')}`}>
                        {ticket?.priority || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Main title and category tag */}
            <div className="mb-4">
                <h3 className="text-base font-bold text-neutral-darker mb-2">
                    {ticket?.title || 'N/A'}
                </h3>
                <div className={`border rounded-lg p-1.5 inline-block shadow-sm ${getCategoryBadgeClasses(ticket?.category || '')}`}>
                    <span className="text-xs font-medium">{ticket?.category || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default IssueCardDetails; 
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

interface UnitDetailsCardProps {
    ticket: Ticket | null;
    className?: string;
}

const UnitDetailsCard: React.FC<UnitDetailsCardProps> = ({ ticket, className = '' }) => {
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
        <div className={`bg-white rounded-lg shadow p-6 h-fit ${className}`}>
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

export default UnitDetailsCard; 
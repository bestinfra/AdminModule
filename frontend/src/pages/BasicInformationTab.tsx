import React from 'react';

interface User {
    name?: string;
    email?: string;
    phone?: string;
    role_title?: string;
    client_name?: string;
    last_active?: string;
    created_at?: string;
}

interface BasicInformationTabProps {
    user: User | null;
}

const formatDateSlash = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

const BasicInformationTab: React.FC<BasicInformationTabProps> = ({ user }) => {
    // Mock user data if no user is provided
    const mockUser: User = {
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        role_title: 'Senior Developer',
        client_name: 'Tech Corp',
        last_active: new Date().toISOString(),
        created_at: '2024-01-15T10:30:00Z'
    };

    const displayUser = user || mockUser;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <span className="text-sm color-text-secondary">Full Name</span>
                <span className="font-medium color-text-primary">{displayUser.name || '-'}</span>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm color-text-secondary">Email Address</span>
                <span className="font-medium color-text-primary">{displayUser.email || '-'}</span>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm color-text-secondary">Phone Number</span>
                <span className="font-medium color-text-primary">{displayUser.phone || '-'}</span>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm color-text-secondary">Role</span>
                <span className="font-medium color-text-primary">{displayUser.role_title || '-'}</span>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm color-text-secondary">Client</span>
                <span className="font-medium color-text-primary">{displayUser.client_name || '-'}</span>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm color-text-secondary">Last Active</span>
                <span className="font-medium color-text-primary">
                    {displayUser.last_active ? formatDateSlash(displayUser.last_active) : '-'}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm color-text-secondary">Created Date</span>
                <span className="font-medium color-text-primary">
                    {displayUser.created_at ? formatDateSlash(displayUser.created_at) : '-'}
                </span>
            </div>
        </div>
    );
};

export default BasicInformationTab;

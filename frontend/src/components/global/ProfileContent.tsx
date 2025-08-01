import React from 'react';

interface UserInfo {
    fullName?: string;
    phoneNumber?: string;
    client?: string;
    createdDate?: string;
    emailAddress?: string;
    role?: string;
    lastActive?: string;
}

interface ProfileContentProps {
    user: UserInfo;
    className?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    user,
    className = ''
}) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className={`bg-white rounded-lg p-6 ${className}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Full Name
                        </label>
                        <p className="text-sm text-gray-900">
                            {user.fullName || '-'}
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                        </label>
                        <p className="text-sm text-gray-900">
                            {user.phoneNumber || '-'}
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Client
                        </label>
                        <p className="text-sm text-gray-900">
                            {user.client || '-'}
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Created Date
                        </label>
                        <p className="text-sm text-gray-900">
                            {formatDate(user.createdDate)}
                        </p>
                    </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email Address
                        </label>
                        <p className="text-sm text-gray-900">
                            {user.emailAddress || '-'}
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Role
                        </label>
                        <p className="text-sm font-semibold text-gray-900">
                            {user.role || '-'}
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Last Active
                        </label>
                        <p className="text-sm text-gray-900">
                            {user.lastActive || '-'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent; 
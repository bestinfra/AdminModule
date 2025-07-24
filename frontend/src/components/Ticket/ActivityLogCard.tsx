import React from 'react';

// Interfaces
interface Activity {
    id: number;
    type: 'status' | 'assignment' | 'note' | 'attachment' | 'response' | 'escalation' | 'resolution' | 'comment';
    description: string;
    timestamp: string;
    author: string;
    status?: string;
    assignee?: string;
    note?: string;
    attachment?: string;
    priority?: string;
    department?: string;
}

interface ActivityLogCardProps {
    activities: Activity[];
    className?: string;
}

const ActivityLogCard: React.FC<ActivityLogCardProps> = ({ activities, className = '' }) => {
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
                return 'bg-yellow-100 text-yellow-700';
            case 'in progress':
                return 'bg-blue-100 text-blue-700';
            case 'resolved':
                return 'bg-green-100 text-green-700';
            case 'closed':
                return 'bg-gray-100 text-gray-700';
            case 'escalated':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow p-6 h-fit ${className}`}>
            <h2 className="text-xl font-semibold text-neutral-darker mb-6">Activity Log</h2>
            
            <div className="relative h-64 overflow-y-auto">
                {!activities || activities.length === 0 ? (
                    <div className="space-y-4">
                        {/* Sample Activity Entry 1 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-darker mb-2">
                                        Ticket created
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-neutral">Status:</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses('open')}`}>
                                            Open
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-xs text-neutral ml-4">
                                    07/14/2025, 05:24 PM
                                </div>
                            </div>
                        </div>

                        {/* Sample Activity Entry 2 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-darker">
                                        Ticket assigned to support team
                                    </p>
                                </div>
                                <div className="text-right text-xs text-neutral ml-4">
                                    07/14/2025, 05:24 PM
                                </div>
                            </div>
                        </div>

                        {/* Sample Activity Entry 3 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-darker mb-2">
                                        Initial description provided
                                    </p>
                                    <p className="text-xs text-neutral ml-4">
                                        test the ticket
                                    </p>
                                </div>
                                <div className="text-right text-xs text-neutral ml-4">
                                    07/14/2025, 05:24 PM
                                </div>
                            </div>
                        </div>

                        {/* Sample Activity Entry 4 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-darker mb-2">
                                        Status updated to In Progress
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-neutral">Status:</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses('in progress')}`}>
                                            In Progress
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-xs text-neutral ml-4">
                                    07/15/2025, 05:24 PM
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map((activity) => (
                                <div key={`activity-${activity.id}`} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-darker mb-2">
                                                {activity.description}
                                            </p>
                                            {activity.status && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-neutral">Status:</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(activity.status)}`}>
                                                        {activity.status}
                                                    </span>
                                                </div>
                                            )}
                                            {activity.note && (
                                                <p className="text-xs text-neutral ml-4 mt-1">
                                                    {activity.note}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-neutral ml-4">
                                            {formatDate(activity.timestamp)}
                                        </div>
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

export default ActivityLogCard; 
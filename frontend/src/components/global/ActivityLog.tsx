import React from 'react';

// Interfaces
interface ActivityLogEntry {
    id: string | number;
    description: string;
    timestamp: string;
    status?: string;
    subText?: string;
    author?: string;
}

interface ActivityLogProps {
    title?: string;
    entries: ActivityLogEntry[];
    className?: string;
    maxHeight?: string;
    showScrollbar?: boolean;
    loading?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({
    title = "Activity Log",
    entries,
    className = '',
    maxHeight = 'h-64',
    showScrollbar = true,
    loading = false
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

    const getStatusBadgeClasses = (status: string): string => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'in progress':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'resolved':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'closed':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'escalated':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <section className={`bg-white rounded-lg  border border-primary-border p-4  ${className}`}>
                <header>
                    <h2 className="text-md font-semibold text-gray-800 ">{title}</h2>
                </header>
                <div className={`${maxHeight} overflow-y-auto ${showScrollbar ? '' : 'scrollbar-hide'}`}>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <article key={i} className="animate-pulse">
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded w-24 ml-3"></div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
            <section className={`bg-white rounded-lg  border border-primary-border p-4 flex flex-col gap-4${className}`}>
            <header>
                <h2 className="text-md font-semibold text-gray-800">{title}</h2>
            </header>
            
            <div className={`${maxHeight} overflow-y-auto ${showScrollbar ? '' : 'scrollbar-hide'}`}>
                {!entries || entries.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No activity entries found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {entries
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map((entry) => (
                                <article key={entry.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-150">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                                                {entry.description}
                                            </p>
                                            
                                            {entry.status && (
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-xs text-gray-500">Status:</span>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClasses(entry.status)}`}>
                                                        {entry.status}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {entry.subText && (
                                                <p className="text-xs text-gray-600 ml-3 mt-1">
                                                    {entry.subText}
                                                </p>
                                            )}
                                            
                                            {entry.author && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    by {entry.author}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-gray-500 ml-3 flex-shrink-0">
                                            {formatDate(entry.timestamp)}
                                        </div>
                                    </div>
                                </article>
                            ))
                        }
                    </div>
                )}
            </div>
        </section>
    );
};

export default ActivityLog; 
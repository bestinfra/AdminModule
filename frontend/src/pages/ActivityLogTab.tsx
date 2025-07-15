import React, { useState, useEffect } from 'react';
import Button from '@components/global/Button';

interface User {
    USER_ID?: string;
    id?: number;
    email?: string;
}

interface ActivityLogTabProps {
    user: User | null;
}

interface Activity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
    statusType: 'success' | 'warning' | 'error' | 'info';
    label: string;
    assigned: string | null;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

const ActivityLogTab: React.FC<ActivityLogTabProps> = ({ user }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 5,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Mock activity data
    const mockActivities: Activity[] = [
        {
            id: '1',
            type: 'login',
            description: 'User logged in from new device',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
            status: 'completed',
            statusType: 'success',
            label: 'Status:',
            assigned: null
        },
        {
            id: '2',
            type: 'profile',
            description: 'Updated profile information',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
            status: 'completed',
            statusType: 'success',
            label: 'Status:',
            assigned: null
        },
        {
            id: '3',
            type: 'security',
            description: 'Changed password',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
            status: 'completed',
            statusType: 'success',
            label: 'Status:',
            assigned: null
        },
        {
            id: '4',
            type: 'settings',
            description: 'Updated notification preferences',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString(),
            status: 'completed',
            statusType: 'success',
            label: 'Status:',
            assigned: null
        },
        {
            id: '5',
            type: 'login',
            description: 'Failed login attempt',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleString(),
            status: 'failed',
            statusType: 'error',
            label: 'Status:',
            assigned: null
        }
    ];

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Use mock data
                const startIndex = (currentPage - 1) * rowsPerPage;
                const endIndex = startIndex + rowsPerPage;
                const paginatedActivities = mockActivities.slice(startIndex, endIndex);

                setActivities(paginatedActivities);

                // Calculate pagination
                setPagination({
                    currentPage,
                    totalPages: Math.ceil(mockActivities.length / rowsPerPage),
                    totalCount: mockActivities.length,
                    limit: rowsPerPage,
                    hasNextPage: endIndex < mockActivities.length,
                    hasPrevPage: currentPage > 1
                });

                setError(null);
            } catch (err: any) {
                console.error('Error fetching activities:', err);
                setError('Failed to fetch activities. Please try again later.');
                setActivities([]);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0,
                    limit: rowsPerPage,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [currentPage, rowsPerPage]);

    const handlePageChange = (newPage: number, newRowsPerPage: number = rowsPerPage) => {
        setCurrentPage(newPage);
        setRowsPerPage(newRowsPerPage);
    };

    const getStatusColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-blue-100 color-positive';
            case 'warning':
                return 'bg-yellow-100 color-warning';
            case 'error':
                return 'bg-red-100 color-danger';
            default:
                return 'bg-blue-50 color-primary';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg ">
                <div className="color-text-secondary">Loading activities...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg ">
                <div className="color-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg ">
            <div className="color-text-secondary mb-4">
                View your recent account activities and security events
            </div>
            <div className="flex flex-col gap-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-medium color-text-primary">{activity.description}</div>
                            <div className="color-text-secondary text-sm whitespace-nowrap ml-4">
                                {activity.timestamp}
                            </div>
                        </div>
                        {activity.label && (
                            <div className="flex items-center gap-2">
                                <span className="color-text-secondary font-medium">{activity.label}</span>
                                {activity.status && (
                                    <span className={`px-4 py-2 rounded-full text-xs font-medium ${getStatusColor(activity.statusType)}`}>
                                        {activity.status}
                                    </span>
                                )}
                                {activity.assigned && (
                                    <span className="color-text-secondary font-medium">{activity.assigned}</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                    <select
                        value={rowsPerPage}
                        onChange={(e) => handlePageChange(1, Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[5, 10, 20, 50, 100].map((option) => (
                            <option key={option} value={option}>
                                {option} per page
                            </option>
                        ))}
                    </select>
                    <span className="color-text-secondary">
                        Total: {pagination.totalCount}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        label="Previous"
                        variant="outline"
                        size="small"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                    />
                    <span className="color-text-secondary">
                        Page {currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                        label="Next"
                        variant="outline"
                        size="small"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                    />
                </div>
            </div>
            <div className="color-text-secondary mt-4 text-sm">
                <p>Note: Activity logs are kept for 90 days for security purposes.</p>
            </div>
        </div>
    );
};

export default ActivityLogTab;

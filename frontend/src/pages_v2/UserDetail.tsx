import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageC from '@/components/global/PageC';
import ProfileSidebar from '@/components/global/ProfileSidebar';
import ProfileContent from '@/components/global/ProfileContent';

const UserDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [_loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('basic-info');

    // Get user data from navigation state or fetch from API
    useEffect(() => {
        
        // First check if user data is passed through navigation state
        if (location.state?.user) {
            setUser(location.state.user);
            setLoading(false);
        } else if (id) {
            // If no state data, fetch user data by ID
            setLoading(true);
            // Simulate API call - replace with actual API call
            setTimeout(() => {
                // Mock user data based on ID
                const mockUser = {
                    sNo: parseInt(id),
                    name: `User ${id}`,
                    email: `user${id}@example.com`,
                    phone: `+1-555-0${id.padStart(3, '0')}`,
                    role: 'User',
                    client: 'Demo Corp',
                    createdDate: '2024-01-01',
                    status: 'Active',
                    lastLogin: '2025-01-20 10:30:00',
                    department: 'IT',
                    permissions: ['read', 'write']
                };
                setUser(mockUser);
                setLoading(false);
            }, 500);
        } else {
            setLoading(false);
        }
    }, [id, location.state]);

    const handleMenuItemClick = (itemId: string) => {
        switch (itemId) {
            case 'edit':
           
                navigate(`/edit-user/${user?.sNo || id}`, {
                    state: { user }
                });
                break;
            case 'delete':
                break;
            case 'suspend':
            
                break;
            default:
        }
    };

    const handleBackClick = () => {
        navigate('/users');
    };

    const handleRefreshClick = () => {
        setLoading(true);
        // Refresh user data
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const handleSidebarItemClick = (itemId: string) => {
        setActiveSection(itemId);
    };

    const menuItems = [
        {
            id: 'edit',
            label: 'Edit User',
        },
        {
            id: 'suspend',
            label: 'Suspend User',
        },
        {
            id: 'delete',
            label: 'Delete User',
            isDestructive: true,
        },
    ];

    const sidebarItems = [
        {
            id: 'basic-info',
            label: 'Basic Information',
            isActive: activeSection === 'basic-info',
        },
        {
            id: 'change-password',
            label: 'Change Password',
            isActive: activeSection === 'change-password',
        },
        {
            id: 'activities',
            label: 'Activities',
            isActive: activeSection === 'activities',
        },
        {
            id: 'notifications',
            label: 'Notifications',
            isActive: activeSection === 'notifications',
        },
        {
            id: 'two-step-verification',
            label: 'Two-step Verification',
            isActive: activeSection === 'two-step-verification',
        },
        {
            id: 'account-status',
            label: 'Account Status',
            isActive: activeSection === 'account-status',
        },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'basic-info':
                return (
                    <ProfileContent
                        user={{
                            fullName: user?.name,
                            phoneNumber: user?.phone,
                            client: user?.client,
                            createdDate: user?.createdDate,
                            emailAddress: user?.email,
                            role: user?.role,
                            lastActive: user?.lastLogin,
                        }}
                    />
                );
            case 'change-password':
                return (
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                        <p className="text-gray-600">Password change functionality will be implemented here.</p>
                    </div>
                );
            case 'activities':
                return (
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Activities</h2>
                        <p className="text-gray-600">User activity log will be displayed here.</p>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
                        <p className="text-gray-600">Notification settings will be managed here.</p>
                    </div>
                );
            case 'two-step-verification':
                return (
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Two-step Verification</h2>
                        <p className="text-gray-600">Two-step verification settings will be configured here.</p>
                    </div>
                );
            case 'account-status':
                return (
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Status</h2>
                        <p className="text-gray-600">Account status and settings will be displayed here.</p>
                    </div>
                );
            default:
                return (
                    <ProfileContent
                        user={{
                            fullName: user?.name,
                            phoneNumber: user?.phone,
                            client: user?.client,
                            createdDate: user?.createdDate,
                            emailAddress: user?.email,
                            role: user?.role,
                            lastActive: user?.lastLogin,
                        }}
                    />
                );
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="space-y-6">
                {/* Header Section */}
                <PageC
                    sections={[
                        {
                            layout: {
                                type: 'column',
                                gap: 'gap-4',
                            },
                            components: [
                                {
                                    name: 'PageHeader',
                                    props: {
                                        title: user?.name || 'User Details',
                                        subtitle: user ? `User ID: ${user.sNo || user.id}` : 'Loading user information...',
                                        menuItems: menuItems,
                                        onMenuItemClick: handleMenuItemClick,
                                        showMenu: true,
                                        showDropdown: true,
                                        buttonsLabel: 'Edit',
                                        variant: 'primary',
                                        onClick: () => handleMenuItemClick('edit'),
                                        onBackClick: handleBackClick,
                                        backButtonText: 'Back to Users',
                                        onRightImageClick: handleRefreshClick,
                                        status: user?.status || 'Loading',
                                    },
                                },
                            ],
                        },
                    ]}
                    sectionWrapperClassName=""
                />

                {/* Main Content with Sidebar */}
                <div className="flex gap-4">
                    {/* Left Sidebar */}
                    <ProfileSidebar
                        items={sidebarItems}
                        onItemClick={handleSidebarItemClick}
                    />
                    
                    {/* Right Content */}
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default UserDetail;
        
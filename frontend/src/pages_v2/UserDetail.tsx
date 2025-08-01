import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageC from '@/components/global/PageC';

const UserDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [_loading, setLoading] = useState(true);  

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

    return (
        <Suspense fallback={<div>Loading...</div>}>
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
                sectionWrapperClassName="mb-8"
            />
        </Suspense>
    );
};

export default UserDetail;
        
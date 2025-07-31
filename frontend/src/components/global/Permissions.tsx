import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BACKEND_URL from '../../config';
import Button from './Button';

interface PermissionItem {
    id: string;
    name: string;
    link?: string;
    subItems?: PermissionItem[];
}

interface PermissionCategory {
    category: string;
    items: PermissionItem[];
}

interface PermissionsProps {
    role?: any;
    onBackClick?: () => void;
    onSave?: (permissions: string[]) => void;
    loading?: boolean;
}

const Permissions: React.FC<PermissionsProps> = ({
    role,
    onBackClick,
    onSave,
    loading = false
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentRole = role || location.state?.role;
    const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
    const [internalLoading, setInternalLoading] = useState(false);


    // Define menu structure matching exactly with sidebar
    const menuStructure: PermissionCategory[] = [
        {
            category: 'General',
            items: [
                {
                    id: 'dashboard',
                    name: 'Dashboard',
                    link: '/admin/dashboard/main'
                },
                {
                    id: 'consumers',
                    name: 'Consumers',
                    link: '/admin/consumers'
                },
                {
                    id: 'bills',
                    name: 'Bills',
                    subItems: [
                        {
                            id: 'prepaid',
                            name: 'Prepaid Transactions',
                            link: '/admin/bills/prepaid'
                        },
                        {
                            id: 'postpaid',
                            name: 'Postpaid Bills',
                            link: '/admin/bills/postpaid'
                        }
                    ]
                },
                {
                    id: 'tickets',
                    name: 'Tickets',
                    link: '/admin/tickets'
                }
            ]
        },
        {
            category: 'Admin Settings',
            items: [
                {
                    id: 'asset_management',
                    name: 'Asset Management',
                    link: '/admin/asset-management'
                },
                {
                    id: 'meter_management',
                    name: 'Meter Management',
                    subItems: [
                        {
                            id: 'data_logger_master',
                            name: 'Data Logger Master',
                            link: '/admin/meter-management/data-logger'
                        },
                        {
                            id: 'meter_list',
                            name: 'Meter List',
                            link: '/admin/meter-management/meter-list'
                        }
                    ]
                },
                {
                    id: 'user_management',
                    name: 'User Management',
                    link: '/admin/users'
                },
                {
                    id: 'role_management',
                    name: 'Role Management',
                    link: '/admin/roles'
                },
            ]
        }
    ];

    useEffect(() => {
        if (!currentRole || !currentRole.id) {
            if (onBackClick) {
                onBackClick();
            } else {
                navigate('/admin/roles');
            }
            return;
        }
        
        const fetchExistingPermissions = async () => {
            try {
                setInternalLoading(true);
                const response = await fetch(`${BACKEND_URL}/roles/${currentRole.role_id || currentRole.id}/permissions`);
                const data = await response.json();
                
                if (data.success && Array.isArray(data.data)) {
                    const obj: Record<string, boolean> = {};
                    data.data.forEach((id: string) => { obj[id] = true; });
                    setSelectedPermissions(obj);
                } else if (data.success && typeof data.data === 'object') {
                    setSelectedPermissions(data.data || {});
                } else {
                    // Demo data fallback
                    setSelectedPermissions({
                        dashboard: true,
                        consumers: true,
                        tickets: false,
                        asset_management: false,
                        user_management: true,
                        role_management: true
                    });
                }
            } catch (err) {
                // Demo data fallback
                setSelectedPermissions({
                    dashboard: true,
                    consumers: true,
                    tickets: false,
                    asset_management: false,
                    user_management: true,
                    role_management: true
                });
            } finally {
                setInternalLoading(false);
            }
        };

        fetchExistingPermissions();
    }, [currentRole, navigate, onBackClick]);

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        setSelectedPermissions(prev => ({
            ...prev,
            [permissionId]: checked
        }));

        // Handle sub-items
        const findItemWithSubitems = (items: PermissionItem[]) => {
            for (const item of items) {
                if (item.id === permissionId && item.subItems) {
                    const subItemUpdates: Record<string, boolean> = {};
                    item.subItems.forEach(subItem => {
                        subItemUpdates[subItem.id] = checked;
                    });
                    setSelectedPermissions(prev => ({
                        ...prev,
                        ...subItemUpdates
                    }));
                    break;
                }
            }
        };

        menuStructure.forEach(category => {
            findItemWithSubitems(category.items);
        });
    };

    const handleSubmit = async () => {
        if (!currentRole || !currentRole.id) {
            return;
        }

        try {
            setInternalLoading(true);
            const permissionsArray = Object.keys(selectedPermissions).filter(key => selectedPermissions[key]);
            
            if (onSave) {
                onSave(permissionsArray);
            } else {
                // Default API call
                const response = await fetch(`${BACKEND_URL}/roles/${currentRole.role_id || currentRole.id}/permissions`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        permissions: permissionsArray
                    })
                });
                
                if (response.ok) {
                    if (onBackClick) {
                        onBackClick();
                    } else {
                        navigate('/admin/roles');
                    }
                } else {
                    throw new Error('Failed to save permissions');
                }
            }
        } catch (err) {
            console.error('Failed to save permissions:', err);
        } finally {
            setInternalLoading(false);
        }
    };

    const handleCancel = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate('/admin/roles');
        }
    };

    const renderMenuItem = (item: PermissionItem) => {
        return (
            <div key={item.id} className="mb-4 px-4">
                <div className="flex items-center space-x-3 p-4 bg-background-secondary rounded-lg cursor-pointer">
                    <input
                        type="checkbox"
                        id={item.id}
                        checked={selectedPermissions[item.id] || false}
                        onChange={(e) => handlePermissionChange(item.id, e.target.checked)}
                        className="w-5 h-5 text-white bg-background-secondary border-background-secondary rounded-lg focus:ring-background-secondary dark:focus:ring-background-secondary dark:ring-offset-gray-800 focus:ring-2 checked:bg-background-secondary checked:border-background-secondary"
                    />
                    <label htmlFor={item.id} className="font-semibold text-base font-black cursor-pointer">
                        {item.name}
                    </label>
                </div>
                {item.subItems && (
                    <div className="ml-6 mt-2 space-y-2">
                        {item.subItems.map(subItem => (
                            <div key={subItem.id} className="flex items-center space-x-3 p-4 bg-background-secondary rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    id={subItem.id}
                                    checked={selectedPermissions[subItem.id] || false}
                                    onChange={(e) => handlePermissionChange(subItem.id, e.target.checked)}
                                    className="w-5 h-5 text-white bg-background-secondary border-background-secondary rounded-lg focus:ring-background-secondary dark:focus:ring-background-secondary dark:ring-offset-gray-800 focus:ring-2 checked:bg-background-secondary checked:border-background-secondary"
                                />
                                <label htmlFor={subItem.id} className="font-normal text-base font-black cursor-pointer">
                                    {subItem.name}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (!currentRole || !currentRole.id) {
        return null;
    }

    const isLoading = loading || internalLoading;

    return (
        <div className="w-full mx-auto">

            <div className="space-y-6">
                {menuStructure.map((category, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                            {category.category}
                        </h3>
                        <div className="space-y-2">
                            {category.items.map(item => renderMenuItem(item))}
                        </div>
                    </div>
                ))}

                <div className="flex justify-end space-x-4">
                    <Button
                        label="Cancel"
                        onClick={handleCancel}
                        variant="secondary"
                    />
                    <Button
                        label={isLoading ? 'Saving...' : 'Save Permissions'}
                        onClick={handleSubmit}
                        variant="primary"
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Permissions; 
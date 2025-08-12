import React, { useState } from 'react';
import Icon from './Icon';

/**
 * Permissions Component - Role-based permissions management
 * 
 * Usage Example:
 * 
 * const roles = [
 *   { id: 'owner', name: 'Owner', color: 'bg-red-500', permissions: [] },
 *   { id: 'admin', name: 'Admin', color: 'bg-blue-500', permissions: [] }
 * ];
 * 
 * const permissionGroups = [
 *   {
 *     id: 'admin',
 *     name: 'Admin Permissions',
 *     isExpanded: true,
 *     permissions: [
 *       {
 *         id: 'view-dashboard',
 *         name: 'View Dashboard',
 *         description: 'Access to main dashboard',
 *         category: 'Admin',
 *         isGranted: { owner: true, admin: true }
 *       }
 *     ]
 *   }
 * ];
 * 
 * <Permissions
 *   roles={roles}
 *   permissionGroups={permissionGroups}
 *   onPermissionsChange={(roleId, permissionId, isGranted) => {
 *     // Handle permission change
 *   }}
 *   onGroupToggle={(groupId, isExpanded) => {
 *     // Handle group toggle
 *   }}
 *   onSelectAllForRole={(roleId, isSelected) => {
 *     // Handle select all for role
 *   }}
 * />
 */

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isGranted: { [roleId: string]: boolean };
  hasSubPermissions?: boolean;
  subPermissions?: Permission[];
}

interface Role {
  id: string;
  name: string;
  color: string;
  permissions: string[];
}

interface PermissionGroup {
  id: string;
  name: string;
  permissions: Permission[];
  isExpanded: boolean;
}

interface PermissionsProps {
  className?: string;
  roles?: Role[];
  permissionGroups?: PermissionGroup[];
  expandedGroups?: { [groupId: string]: boolean };
  onPermissionsChange?: (roleId: string, permissionId: string, isGranted: boolean) => void;
  onGroupToggle?: (groupId: string, isExpanded: boolean) => void;
  onSelectAllForRole?: (roleId: string, isSelected: boolean) => void;
}

const Permissions: React.FC<PermissionsProps> = ({
  className = '',
  roles = [],
  permissionGroups = [],
  expandedGroups = {},
  onPermissionsChange,
  onGroupToggle,
  onSelectAllForRole
}) => {
  const [localExpandedGroups, setLocalExpandedGroups] = useState<{ [groupId: string]: boolean }>(
    expandedGroups
  );
  const [expandedSubPermissions, setExpandedSubPermissions] = useState<{ [permissionId: string]: boolean }>({});

  // Default data if no props provided
  const defaultRoles: Role[] = [
    { id: 'read-only', name: 'Read Only', color: 'bg-blue-500', permissions: [] },
    { id: 'write-only', name: 'Write Only', color: 'bg-green-500', permissions: [] },
    { id: 'read-write', name: 'Read & Write', color: 'bg-purple-500', permissions: [] }
  ];

        const defaultPermissionGroups: PermissionGroup[] = [
     {
       id: 'admin',
       name: 'Admin Permissions',
       isExpanded: true,
       permissions: [
         {
           id: 'view-dashboard',
           name: 'View Dashboard',
           description: 'Access to main dashboard and analytics',
           category: 'Admin',
           isGranted: {
             'read-only': true,
             'write-only': false,
             'read-write': true
           }
         },
         {
           id: 'superadmin-dashboard',
           name: 'Super Admin Dashboard',
           description: 'Access to super admin dashboard',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           }
         },
         {
           id: 'dtr-dashboard',
           name: 'DTR Dashboard',
           description: 'Access to DTR dashboard',
           category: 'Admin',
           isGranted: {
             'read-only': true,
             'write-only': false,
             'read-write': true
           }
         },
         {
           id: 'consumer-dashboard',
           name: 'Consumer Dashboard',
           description: 'Access to consumer dashboard',
           category: 'Admin',
           isGranted: {
             'read-only': true,
             'write-only': false,
             'read-write': true
           }
         },
         {
           id: 'app-management',
           name: 'App Management',
           description: 'Manage applications and modules',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           }
         },
         {
           id: 'components-documentation',
           name: 'Components Documentation',
           description: 'Access to component documentation',
           category: 'Admin',
           isGranted: {
             'read-only': true,
             'write-only': false,
             'read-write': true
           }
         },
         {
           id: 'filter-style-controller',
           name: 'Filter Style Controller',
           description: 'Control filter styles and themes',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           }
         },
         {
           id: 'user-management-dropdown',
           name: 'User Management',
           description: 'User management and related modules',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-users',
               name: 'View Users',
               description: 'View user accounts and profiles',
               category: 'User Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'add-user',
               name: 'Add User',
               description: 'Create new user accounts',
               category: 'User Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'edit-user',
               name: 'Edit User',
               description: 'Modify existing user accounts',
               category: 'User Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'user-detail',
               name: 'User Detail',
               description: 'View detailed user information',
               category: 'User Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'user-management',
               name: 'User Management System',
               description: 'Access to user management system',
               category: 'User Management',
               isGranted: {
                 'read-only': false,
                 'write-only': false,
                 'read-write': true
               }
             }
           ]
         },
         {
           id: 'role-management-dropdown',
           name: 'Role Management',
           description: 'Role management and permissions',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-roles',
               name: 'View Roles',
               description: 'View role definitions and permissions',
               category: 'Role Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'add-role',
               name: 'Add Role',
               description: 'Create new roles',
               category: 'Role Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'edit-role',
               name: 'Edit Role',
               description: 'Modify existing roles',
               category: 'Role Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'role-management',
               name: 'Role Management System',
               description: 'Access to role management system',
               category: 'Role Management',
               isGranted: {
                 'read-only': false,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'roles-permissions',
               name: 'Roles Permissions',
               description: 'Manage role-based permissions',
               category: 'Role Management',
               isGranted: {
                 'read-only': false,
                 'write-only': false,
                 'read-write': true
               }
             }
           ]
         },
         {
           id: 'consumer-management-dropdown',
           name: 'Consumer Management',
           description: 'Consumer management and operations',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-consumers',
               name: 'View Consumers',
               description: 'View consumer accounts and profiles',
               category: 'Consumer Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'add-consumer',
               name: 'Add Consumer',
               description: 'Create new consumer accounts',
               category: 'Consumer Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'consumer-view',
               name: 'Consumer View',
               description: 'View detailed consumer information',
               category: 'Consumer Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'connect-consumer',
               name: 'Connect Consumer',
               description: 'Connect or disconnect consumer services',
               category: 'Consumer Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             }
           ]
         },
         {
           id: 'meter-management-dropdown',
           name: 'Meter Management',
           description: 'Meter and data logger management',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-meters',
               name: 'View Meters',
               description: 'View meter information and readings',
               category: 'Meter Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'add-meter',
               name: 'Add Meter',
               description: 'Add new meters to the system',
               category: 'Meter Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'meter-details',
               name: 'Meter Details',
               description: 'View detailed meter information',
               category: 'Meter Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'data-logger',
               name: 'Data Logger',
               description: 'Access to data logging system',
               category: 'Meter Management',
               isGranted: {
                 'read-only': false,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'add-data-logger',
               name: 'Add Data Logger',
               description: 'Add new data loggers',
               category: 'Meter Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             }
           ]
         },
         {
           id: 'asset-management-dropdown',
           name: 'Asset Management',
           description: 'Asset and equipment management',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'asset-management',
               name: 'Asset Management System',
               description: 'Manage system assets and equipment',
               category: 'Asset Management',
               isGranted: {
                 'read-only': false,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'view-dtr',
               name: 'View DTR',
               description: 'View DTR information and details',
               category: 'Asset Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'dtr-detail',
               name: 'DTR Detail',
               description: 'View detailed DTR information',
               category: 'Asset Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'view-feeders',
               name: 'View Feeders',
               description: 'View feeder information',
               category: 'Asset Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'individual-detail',
               name: 'Individual Detail',
               description: 'View individual asset details',
               category: 'Asset Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             }
           ]
         },
         {
           id: 'ticket-management-dropdown',
           name: 'Ticket Management',
           description: 'Support ticket management',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-tickets',
               name: 'View Tickets',
               description: 'View support tickets and requests',
               category: 'Ticket Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'add-ticket',
               name: 'Add Ticket',
               description: 'Create new support tickets',
               category: 'Ticket Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'ticket-view',
               name: 'Ticket View',
               description: 'View detailed ticket information',
               category: 'Ticket Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'all-tickets',
               name: 'All Tickets',
               description: 'Access to all tickets view',
               category: 'Ticket Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             }
           ]
         },
         {
           id: 'advanced-permissions-dropdown',
           name: 'Advanced Permissions',
           description: 'Advanced system permissions',
           category: 'Admin',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'add-contacts',
               name: 'Add Contacts',
               description: 'Create new contacts',
               category: 'Advanced',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'view-payments',
               name: 'View Payments',
               description: 'Access payment information',
               category: 'Advanced',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true
               }
             },
             {
               id: 'edit-payments',
               name: 'Edit Payments',
               description: 'Modify payment records',
               category: 'Advanced',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true
               }
             },
             {
               id: 'edit-permissions',
               name: 'Edit Permissions',
               description: 'Modify user permissions',
               category: 'Advanced',
               isGranted: {
                 'read-only': false,
                 'write-only': false,
                 'read-write': true
               }
             }
           ]
         }
       ]
     },
     {
       id: 'moderator',
       name: 'Moderator Permissions',
       isExpanded: false,
       permissions: [
         {
           id: 'view-dashboard',
           name: 'View Dashboard',
           description: 'Access to main dashboard and analytics',
           category: 'Moderator',
           isGranted: {
             'read-only': true,
             'write-only': false,
             'read-write': true,
             'moderator': true
           }
         },
         {
           id: 'consumer-dashboard',
           name: 'Consumer Dashboard',
           description: 'Access to consumer dashboard',
           category: 'Moderator',
           isGranted: {
             'read-only': true,
             'write-only': false,
             'read-write': true,
             'moderator': true
           }
         },
         {
           id: 'dtr-dashboard',
           name: 'DTR Dashboard',
           description: 'Access to DTR dashboard',
           category: 'Moderator',
           isGranted: {
             'read-only': true,
             'write-only': false,
             'read-write': true,
             'moderator': true
           }
         },
         {
           id: 'consumer-management-dropdown',
           name: 'Consumer Management',
           description: 'Consumer management and operations',
           category: 'Moderator',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true,
             'moderator': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-consumers',
               name: 'View Consumers',
               description: 'View consumer accounts and profiles',
               category: 'Consumer Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             },
             {
               id: 'consumer-view',
               name: 'Consumer View',
               description: 'View detailed consumer information',
               category: 'Consumer Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             }
           ]
         },
         {
           id: 'meter-management-dropdown',
           name: 'Meter Management',
           description: 'Meter and data logger management',
           category: 'Moderator',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true,
             'moderator': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-meters',
               name: 'View Meters',
               description: 'View meter information and readings',
               category: 'Meter Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             },
             {
               id: 'meter-details',
               name: 'Meter Details',
               description: 'View detailed meter information',
               category: 'Meter Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             }
           ]
         },
         {
           id: 'asset-management-dropdown',
           name: 'Asset Management',
           description: 'Asset and equipment management',
           category: 'Moderator',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true,
             'moderator': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-dtr',
               name: 'View DTR',
               description: 'View DTR information and details',
               category: 'Asset Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             },
             {
               id: 'dtr-detail',
               name: 'DTR Detail',
               description: 'View detailed DTR information',
               category: 'Asset Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             },
             {
               id: 'view-feeders',
               name: 'View Feeders',
               description: 'View feeder information',
               category: 'Asset Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             }
           ]
         },
         {
           id: 'ticket-management-dropdown',
           name: 'Ticket Management',
           description: 'Support ticket management',
           category: 'Moderator',
           isGranted: {
             'read-only': false,
             'write-only': false,
             'read-write': true,
             'moderator': true
           },
           hasSubPermissions: true,
           subPermissions: [
             {
               id: 'view-tickets',
               name: 'View Tickets',
               description: 'View support tickets and requests',
               category: 'Ticket Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             },
             {
               id: 'add-ticket',
               name: 'Add Ticket',
               description: 'Create new support tickets',
               category: 'Ticket Management',
               isGranted: {
                 'read-only': false,
                 'write-only': true,
                 'read-write': true,
                 'moderator': true
               }
             },
             {
               id: 'ticket-view',
               name: 'Ticket View',
               description: 'View detailed ticket information',
               category: 'Ticket Management',
               isGranted: {
                 'read-only': true,
                 'write-only': false,
                 'read-write': true,
                 'moderator': true
               }
             }
           ]
         }
       ]
     }
   ];

  // Use provided data or default data
  const displayRoles = roles.length > 0 ? roles : defaultRoles;
  const displayPermissionGroups = permissionGroups.length > 0 ? permissionGroups : defaultPermissionGroups;

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    onPermissionsChange?.(roleId, permissionId, true);
  };

  const toggleGroup = (groupId: string) => {
    const newExpandedState = !localExpandedGroups[groupId];
    setLocalExpandedGroups(prev => ({
      ...prev,
      [groupId]: newExpandedState
    }));
    onGroupToggle?.(groupId, newExpandedState);
  };

  const toggleSubPermissions = (permissionId: string) => {
    setExpandedSubPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

  const handleSelectAllForRole = (roleId: string, isSelected: boolean) => {
    onSelectAllForRole?.(roleId, isSelected);
  };

  return (
    <main className={`w-full h-full bg-white ${className}`}>

      {/* Permissions Container */}
      <section className="overflow-x-auto">
        {/* Header Row */}
        <header className="bg-gray-50 border-b border-gray-200">
          <div className="flex">
            <div className="w-80 px-6 py-4">
              <h2 className="text-sm font-medium text-gray-900">Permissions</h2>
            </div>
                         {displayRoles.map(role => (
               <div key={role.id} className="flex-1 px-4 py-4 text-center">
                 <div className="flex flex-col items-center space-y-2">
                   <span className="text-sm font-medium text-gray-900">{role.name}</span>
                   <input
                     type="checkbox"
                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                     onChange={(e) => handleSelectAllForRole(role.id, e.target.checked)}
                   />
                 </div>
               </div>
             ))}
          </div>
        </header>

                 {/* Permissions Content */}
         <div className="bg-white">
           {displayPermissionGroups.map(group => (
            <article key={group.id}>
              {/* Group Header */}
              <header className="bg-gray-50 border-b border-gray-200">
                <div className="px-6 py-3">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                                         <Icon 
                       src={localExpandedGroups[group.id] ? "/icons/arrow-down.svg" : "/icons/arrow-left.svg"} 
                       className="w-4 h-4"
                     />
                                         <Icon 
                       src={
                         group.id === 'admin' ? "/icons/dashboard.svg" :
                         group.id === 'moderator' ? "/icons/moderator.svg" :
                         group.id === 'role-management' ? "/icons/roles.svg" :
                         group.id === 'consumer-management' ? "/icons/user.svg" :
                         group.id === 'meter-management' ? "/icons/meter-bolt.svg" :
                         group.id === 'asset-management' ? "/icons/Asset_managment.svg" :
                         group.id === 'ticket-management' ? "/icons/support-tickets.svg" :
                         "/icons/settings.svg"
                       } 
                       className="w-4 h-4"
                     />
                    <span>{group.name}</span>
                  </button>
                </div>
              </header>

                             {/* Group Permissions */}
               {localExpandedGroups[group.id] && (
                <section>
                  {group.permissions.map(permission => (
                    <div key={permission.id}>
                      {/* Main Permission Row */}
                      <div className="flex border-b border-gray-200 hover:bg-gray-50">
                        <div className="w-80 px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {permission.hasSubPermissions && (
                              <button
                                onClick={() => toggleSubPermissions(permission.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Icon 
                                  src={expandedSubPermissions[permission.id] ? "/icons/arrow-down.svg" : "/icons/arrow-left.svg"} 
                                  className="w-4 h-4 text-gray-500"
                                />
                              </button>
                            )}
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{permission.name}</h3>
                              <p className="text-sm text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        </div>
                        {displayRoles.map(role => (
                          <div key={role.id} className="flex-1 px-4 py-4 flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={permission.isGranted[role.id] || false}
                              onChange={() => handlePermissionToggle(role.id, permission.id)}
                              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                          </div>
                        ))}
                      </div>
                      
                      {/* Sub Permissions */}
                      {permission.hasSubPermissions && permission.subPermissions && expandedSubPermissions[permission.id] && (
                        <div className="bg-gray-50">
                          {permission.subPermissions.map(subPermission => (
                            <div key={subPermission.id} className="flex border-b border-gray-200 hover:bg-gray-50 ml-8">
                              <div className="w-80 px-6 py-3">
                                <h4 className="text-sm font-medium text-gray-900">{subPermission.name}</h4>
                                <p className="text-sm text-gray-500">{subPermission.description}</p>
                              </div>
                              {displayRoles.map(role => (
                                <div key={role.id} className="flex-1 px-4 py-3 flex items-center justify-center">
                                  <input
                                    type="checkbox"
                                    checked={subPermission.isGranted[role.id] || false}
                                    onChange={() => handlePermissionToggle(role.id, subPermission.id)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Permissions;

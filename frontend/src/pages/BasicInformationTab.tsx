import React from 'react';
import Page from '@components/global/Page';
import { useNavigate } from 'react-router-dom';

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

const userSidebarMenu = [
  { title: 'Basic Information', path: '/users/basic-information' },
  { title: 'Change Password', path: '/users/change-password' },
  { title: 'Notifications', path: '/users/notifications' },
  { title: 'Two-step Verification', path: '/users/two-step-verification' },
  { title: 'Account Status', path: '/users/account-status' },
];

const SidebarMenu = ({ selected = 0 }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 p-4 bg-primary-lightest rounded-2xl min-h-[500px] w-full">
      {userSidebarMenu.map((item, idx) => (
        <button
          key={item.title}
          className={`text-left px-4 py-3 rounded-xl font-medium text-[16px] transition-all ${
            idx === selected
              ? 'bg-white shadow text-primary' // active
              : 'text-neutral-darker hover:bg-white hover:shadow'
          }`}
          style={{ outline: 'none', border: 'none' }}
          onClick={() => item.path && item.path !== '#' && navigate(item.path)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
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

    const content = (
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

    return (
        <Page
            layout="single-column"
            sections={[{ id: 'basic-information', component: content }]}
            sidebar={<SidebarMenu selected={0} />}
            sidebarPosition="left"
            sectionClassName="bg-transparent p-0 shadow-none"
            className="bg-white min-h-screen p-0"
        />
    );
};

export default BasicInformationTab;

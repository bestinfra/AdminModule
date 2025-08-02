import React from 'react';
import Page from '@components/global/Page';
import { useNavigate } from 'react-router-dom';

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

const UserDetails: React.FC = () => {
  // Dummy user data
  const user = {
    fullName: 'LECS',
    email: 'admin@gmail.com',
    phone: '6303457002',
    role: 'admin',
    client: 'GMR',
    createdDate: '2/7/2025',
    lastActive: '3/7/2025',
  };

  // Sidebar
  const sidebar = (
    <SidebarMenu selected={0} />
  );

  // Main content (user details only)
  const content = (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 items-start pt-2">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-neutral text-sm mb-1">Full Name</div>
          <div className="font-semibold text-lg">{user.fullName}</div>
        </div>
        <div>
          <div className="text-neutral text-sm mb-1">Phone Number</div>
          <div className="font-semibold text-lg">{user.phone}</div>
        </div>
        <div>
          <div className="text-neutral text-sm mb-1">Client</div>
          <div className="font-semibold text-lg">{user.client}</div>
        </div>
        <div>
          <div className="text-neutral text-sm mb-1">Created Date</div>
          <div className="font-semibold text-lg">{user.createdDate}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-neutral text-sm mb-1">Email Address</div>
          <div className="font-semibold text-lg">{user.email}</div>
        </div>
        <div>
          <div className="text-neutral text-sm mb-1">Role</div>
          <div className="font-semibold text-lg">{user.role}</div>
        </div>
        <div>
          <div className="text-neutral text-sm mb-1">Last Active</div>
          <div className="font-semibold text-lg">{user.lastActive}</div>
        </div>
      </div>
    </div>
  );

  return (
    <Page
      layout="single-column"
      sections={[{ id: 'user-details', component: content }]}
      sidebar={sidebar}
      sidebarPosition="left"
      sectionClassName="bg-transparent p-0 shadow-none"
      className="bg-white min-h-screen p-0"
    />
  );
};

export default UserDetails; 
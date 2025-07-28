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

const SidebarMenu = ({ selected = 3 }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 p-4 bg-primary-lightest rounded-2xl min-h-[500px] w-full">
      {userSidebarMenu.map((item, idx) => (
        <button
          key={item.title}
          className={`text-left px-4 py-3 rounded-xl font-medium text-[16px] transition-all ${
            idx === selected
              ? 'bg-white shadow text-primary'
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

const TwoStepVerification: React.FC = () => {
  const content = (
    <div className="w-full flex flex-col items-center justify-center min-h-[300px] gap-6">
      <div className="text-lg font-semibold text-neutral mb-6 mt-8">
        <span className="font-bold">Two-Factor Authentication Status:</span> <span className="text-neutral font-normal">Disabled</span>
      </div>
      <button className="bg-secondary hover:bg-secondary-light text-white font-bold py-4 px-10 rounded-full text-lg">
        Setup Two-Factor Authentication
      </button>
    </div>
  );

  return (
    <Page
      layout="single-column"
      sections={[{ id: 'two-step-verification', component: content }]}
      sidebar={<SidebarMenu selected={3} />}
      sidebarPosition="left"
      sectionClassName="bg-transparent p-0 shadow-none"
      className="bg-white min-h-screen p-0"
    />
  );
};

export default TwoStepVerification; 
import React, { useState } from 'react';
import Page from '@components/global/Page';
import { useNavigate } from 'react-router-dom';

const userSidebarMenu = [
  { title: 'Basic Information', path: '/users/basic-information' },
  { title: 'Change Password', path: '/users/change-password' },
  { title: 'Notifications', path: '/users/notifications' },
  { title: 'Two-step Verification', path: '/users/two-step-verification' },
  { title: 'Account Status', path: '/users/account-status' },
];

const SidebarMenu = ({ selected = 4 }) => {
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

const AccountStatus: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const content = (
    <div className="w-full max-w-4xl flex flex-col gap-4">
      <div className="font-bold text-lg">Permanently Delete Your Account</div>
      <div className="text-neutral">
        Deleting your account will revoke access to all Front services and permanently erase your personal data from our systems.<br />
        This action is irreversible after 14 days.
      </div>
      <div className="text-neutral">
        By proceeding, you acknowledge that:
        <ul className="list-disc pl-6 mt-2">
          <li>Your data will be permanently deleted after 14 days.</li>
          <li>You will no longer have access to any services or saved information.</li>
          <li>This action complies with our Terms & Conditions and Privacy Policy.</li>
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
          className="w-5 h-5 accent-primary rounded"
        />
        <label className="text-base text-neutral select-none">
          I understand and confirm that I want to permanently delete my account.
        </label>
      </div>
      <div className="flex gap-4">
        <button
          className={`bg-danger-light text-white font-bold py-3 px-10 rounded-full text-lg ${checked ? 'bg-danger hover:bg-danger-alt' : 'cursor-not-allowed'}`}
          disabled={!checked}
        >
          Delete My Account
        </button>
        <button className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-10 rounded-full text-lg">Cancel</button>
      </div>
    </div>
  );

  return (
    <Page
      layout="single-column"
      sections={[{ id: 'account-status', component: content }]}
      sidebar={<SidebarMenu selected={4} />}
      sidebarPosition="left"
      sectionClassName="bg-transparent p-0 shadow-none"
      className="bg-white min-h-screen p-0"
    />
  );
};

export default AccountStatus; 
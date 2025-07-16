import React, { useState } from 'react';
import Page from '@components/global/Page';
import { useNavigate } from 'react-router-dom';

const userSidebarMenu = [
  { title: 'Basic Information', path: '/user-management/users/USR-001' },
  { title: 'Change Password', path: '/user-management/change-password' },
  { title: 'Notifications', path: '/user-management/notifications' },
  { title: 'Two-step Verification', path: '/user-management/two-step-verification' },
  { title: 'Account Status', path: '/user-management/account-status' },
];

const SidebarMenu = ({ selected = 1 }) => {
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

const passwordRequirements = [
  { label: 'Minimum 8 characters long', test: (v: string) => v.length >= 8 },
  { label: 'At least one lowercase character', test: (v: string) => /[a-z]/.test(v) },
  { label: 'At least one uppercase character', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'At least one number', test: (v: string) => /[0-9]/.test(v) },
  { label: 'At least one special character', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const ChangePassword: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');



  const content = (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
      <div className="flex-1 flex flex-col gap-6">
        <input
          type="password"
          className="rounded-full border border-neutral-light px-6 py-3 text-base outline-none focus:border-primary"
          placeholder="Enter Current Password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
        />
        <input
          type="password"
          className="rounded-full border border-neutral-light px-6 py-3 text-base outline-none focus:border-primary"
          placeholder="Enter New Password"
          value={next}
          onChange={e => setNext(e.target.value)}
        />
        <input
          type="password"
          className="rounded-full border border-neutral-light px-6 py-3 text-base outline-none focus:border-primary"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        <div className="flex gap-4 mt-4">
          <button className="bg-secondary hover:bg-secondary-light text-white font-bold py-3 px-10 rounded-full text-lg">Save Changes</button>
          <button className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-10 rounded-full text-lg">Cancel</button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="font-semibold text-lg mb-1">Password requirements:</div>
        <div className="text-neutral mb-2">Ensure that these requirements are met:</div>
        <ul className="text-sm space-y-1">
          {passwordRequirements.map((req, idx) => (
            <li key={req.label} className="flex items-center gap-2">
              <span className="font-bold text-lg text-neutral">✗</span>
              <span className={idx === 0 ? 'font-semibold' : ''}>
                {req.label}
                {idx === 0 && <span className="font-normal text-xs ml-2">- the more, the better</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Page
      layout="single-column"
      sections={[{ id: 'change-password', component: content }]}
      sidebar={<SidebarMenu selected={1} />}
      sidebarPosition="left"
      sectionClassName="bg-transparent p-0 shadow-none"
      className="bg-white min-h-screen p-0"
    />
  );
};

export default ChangePassword; 
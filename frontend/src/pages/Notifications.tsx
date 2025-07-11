import React from 'react';
import Page from '../components/global/Page';
import { useNavigate } from 'react-router-dom';

const userSidebarMenu = [
  { title: 'Basic Information', path: '/user-management/users/USR-001' },
  { title: 'Change Password', path: '/user-management/change-password' },
  { title: 'Notifications', path: '/user-management/notifications' },
  { title: 'Two-step Verification', path: '/user-management/two-step-verification' },
  { title: 'Account Status', path: '/user-management/account-status' },
];

const SidebarMenu = ({ selected = 2 }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 p-4 bg-[#f7fafd] rounded-2xl min-h-[500px] w-full">
      {userSidebarMenu.map((item, idx) => (
        <button
          key={item.title}
          className={`text-left px-4 py-3 rounded-xl font-medium text-[16px] transition-all ${
            idx === selected
              ? 'bg-white shadow text-primary'
              : 'text-[#1a3353] hover:bg-white hover:shadow'
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

const tabs = [
  'Account Updates',
  'Billing Updates',
  'Meter Stats Alerts',
  'System Maintenance',
];

const notificationTypes = ['Email', 'SMS', 'App'];

const notificationData = [
  {
    label: 'Account Updates',
    items: [
      { label: 'Account status', types: [true, false, true] },
      { label: 'Ticket Status Updates', types: [false, true, false] },
    ],
  },
  // Add more tab data as needed
];

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [toggles, setToggles] = React.useState(notificationData[0].items.map(i => i.types));

  const content = (
    <div className="w-full max-w-6xl flex flex-col gap-6">
      <div className="border rounded-lg p-4 bg-white">
        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={`flex-1 text-lg font-semibold py-3 px-2 border-b-2 transition-colors duration-200 ${
                idx === activeTab
                  ? 'border-[#163977] text-[#163977] bg-white'
                  : 'border-transparent text-gray-400 bg-transparent'
              }`}
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab content */}
        <div className="p-6">
          <ul className="list-disc pl-6 mb-4 text-gray-500">
            <li>Account status</li>
            <li>Ticket Status Updates</li>
          </ul>
          <div className="font-semibold text-lg mb-2">Notification Type</div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="font-semibold">Account Updates</div>
            {notificationTypes.map(type => (
              <div key={type} className="font-semibold text-center">{type}</div>
            ))}
            {/* Row for Account Updates */}
            <div className="text-center">Account Updates</div>
            {notificationTypes.map((type, idx) => (
              <div key={type} className="flex justify-center">
                <input type="checkbox" checked={true} readOnly className="w-5 h-5 accent-[#163977] rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-full text-lg">Save Changes</button>
          <button className="bg-[#163977] hover:bg-blue-900 text-white font-bold py-3 px-10 rounded-full text-lg">Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <Page
      layout="single-column"
      sections={[{ id: 'notifications', component: content }]}
      sidebar={<SidebarMenu selected={2} />}
      sidebarPosition="left"
      sectionClassName="bg-transparent p-0 shadow-none"
      className="bg-white min-h-screen p-0"
    />
  );
};

export default Notifications; 
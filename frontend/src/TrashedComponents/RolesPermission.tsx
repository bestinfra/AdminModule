import React from 'react';
import { useNavigate } from 'react-router-dom';

const permissionsData = [
  {
    section: 'General',
    items: [
      { label: 'Dashboard' },
      { label: 'Consumers' },
      {
        label: 'Bills',
        children: [
          { label: 'Prepaid Transactions' },
          { label: 'Postpaid Bills' },
        ],
      },
      { label: 'Tickets' },
    ],
  },
  {
    section: 'Admin Settings',
    items: [
      { label: 'Asset Management' },
      {
        label: 'Meter Management',
        children: [
          { label: 'Data Logger Master' },
          { label: 'Meter List' },
        ],
      },
      { label: 'User Management' },
      { label: 'Role Management' },
      { label: 'Apps' },
    ],
  },
];

const RolesPermission: React.FC = () => {
  const navigate = useNavigate();


  return (
    <div className="w-full max-w-7xl flex flex-col gap-4 p-0">
      <div className="text-xl font-bold">Permissions for GMR</div>
      <button
                    className="flex items-center gap-2 text-neutral hover:text-primary"
        onClick={() => navigate(-1)}
      >
        <span className="text-lg">←</span>
        <span>Back to Permissions for GMR</span>
      </button>
      {permissionsData.map((section) => (
        <div key={section.section} className="flex flex-col gap-4">
          <div className="text-lg font-semibold mt-6">{section.section}</div>
          <div className="flex flex-col gap-4">
            {section.items.map((item) => (
              <div key={item.label} className="bg-primary-lightest rounded-xl px-6 py-3">
                <div className="flex items-center gap-3">
                                      <input type="checkbox" className="w-6 h-6 accent-primary rounded" />
                  <span className="font-semibold text-base">{item.label}</span>
                </div>
                {item.children && (
                  <div className="ml-10 flex flex-col gap-2">
                    {item.children.map((child) => (
                      <div key={child.label} className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 accent-primary rounded" />
                        <span className="text-base">{child.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end gap-4">
        <button type="button" className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-10 rounded-full text-lg">Cancel</button>
        <button type="submit" className="bg-secondary hover:bg-secondary-light text-white font-bold py-3 px-10 rounded-full text-lg">Save Permissions</button>
      </div>
    </div>
  );
};

export default RolesPermission; 
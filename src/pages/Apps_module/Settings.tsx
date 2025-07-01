import React, { useState } from 'react';
import Applications from './components/Applications';
// import Branding from './Branding';
import DomainHosting from './components/DomainHosting';
// import Modules from './Modules';

const navItems = [
  { key: 'applications', label: 'Applications' },
  // { key: 'branding', label: 'Branding' },
  { key: 'domain', label: 'Domain and Hosting' },
  // { key: 'modules', label: 'Modules' },
];

const contentMap: { [key: string]: React.ReactNode } = {
  applications: <Applications />,
  // branding: <Branding />,
  domain: <DomainHosting />,
  // modules: <Modules />,
};

const Settings = () => {
  const [active, setActive] = useState('applications');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f7fafd] p-6">
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`text-left px-4 py-3 rounded-xl font-medium ${
                active === item.key
                  ? 'bg-white text-blue-900 shadow font-bold'
                  : 'text-blue-900 hover:bg-white/70'
              }`}
              onClick={() => setActive(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Content */}
      <main className="flex-1 p-8">
        {contentMap[active]}
      </main>
    </div>
  );
};

export default Settings;

import React, { useState, useEffect } from 'react';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: number;
  onTabChange?: (index: number) => void;
  activeTabIndex?: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab = 0, onTabChange, activeTabIndex }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (typeof activeTabIndex === 'number' && activeTabIndex !== activeTab) {
      setActiveTab(activeTabIndex);
    }
  }, [activeTabIndex]);

  const handleTabClick = (index: number) => {
    if (typeof activeTabIndex === 'number') {
      onTabChange?.(index);
    } else {
      setActiveTab(index);
      onTabChange?.(index);
    }
  };

  const currentTab = typeof activeTabIndex === 'number' ? activeTabIndex : activeTab;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex border border-primary-border dark:border-dark-border rounded-full p-1 h-12 gap-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`px-6 text-base font-medium rounded-full transition-all duration-200 cursor-pointer
              ${currentTab === index
                ? 'text-background-color bg-primary text-white dark:bg-primary dark:text-white'
                : 'text-subinfo '}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full">
        {tabs[currentTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;

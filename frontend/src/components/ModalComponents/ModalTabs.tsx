import React, { useState, useEffect } from 'react';

interface TabItem {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ModalTabsProps {
  // Tab data
  tabs: TabItem[];
  defaultTab?: number;
  activeTabIndex?: number;
  
  // Event handlers
  onTabChange?: (index: number) => void;
  
  // Styling props
  className?: string;
  containerClassName?: string;
  tabListClassName?: string;
  tabButtonClassName?: string;
  activeTabButtonClassName?: string;
  inactiveTabButtonClassName?: string;
  contentClassName?: string;
  
  // Layout props
  orientation?: 'horizontal' | 'vertical';
  tabPosition?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  
  // Behavior props
  allowTabSwitch?: boolean;
  showTabIcons?: boolean;
  showTabLabels?: boolean;
  
  // Animation props
  enableAnimations?: boolean;
  animationDuration?: number;
  
  // Accessibility props
  ariaLabel?: string;
  tabAriaLabel?: string;
}

const ModalTabs: React.FC<ModalTabsProps> = ({
  tabs,
  defaultTab = 0,
  activeTabIndex,
  onTabChange,
  
  // Styling props
  className = '',
  containerClassName = '',
  tabListClassName = '',
  tabButtonClassName = '',
  activeTabButtonClassName = '',
  inactiveTabButtonClassName = '',
  contentClassName = '',
  
  // Layout props
  orientation = 'horizontal',
  tabPosition = 'top',
  size = 'md',
  
  // Behavior props
  allowTabSwitch = true,
  showTabIcons = true,
  showTabLabels = true,
  
  // Animation props
  enableAnimations = true,
  animationDuration = 200,
  
  // Accessibility props
  ariaLabel = 'Modal tabs',
  tabAriaLabel = 'tab'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (typeof activeTabIndex === 'number' && activeTabIndex !== activeTab) {
      setActiveTab(activeTabIndex);
    }
  }, [activeTabIndex, activeTab]);

  const handleTabClick = (index: number) => {
    if (!allowTabSwitch) return;
    
    const tab = tabs[index];
    if (tab?.disabled) return;
    
    if (typeof activeTabIndex === 'number') {
      onTabChange?.(index);
    } else {
      setActiveTab(index);
      onTabChange?.(index);
    }
  };

  const currentTab = typeof activeTabIndex === 'number' ? activeTabIndex : activeTab;

  // Default styling classes
  const defaultContainerClasses = 'w-full flex flex-col gap-4';
  const defaultTabListClasses = 'flex border border-PrimaryBorder dark:border-dark-border rounded-full p-1 h-12 gap-2';
  const defaultTabButtonClasses = 'px-6 text-base font-medium rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center gap-2';
  const defaultActiveTabButtonClasses = 'text-background-color bg-primary text-white dark:bg-primary dark:text-white';
  const defaultInactiveTabButtonClasses = 'text-subinfo hover:bg-gray-100 dark:hover:bg-gray-700';
  const defaultContentClasses = 'w-full';

  // Size classes
  const sizeClasses = {
    sm: {
      tabList: 'h-10 p-1 gap-1',
      tabButton: 'px-4 text-sm',
      content: 'text-sm'
    },
    md: {
      tabList: 'h-12 p-1 gap-2',
      tabButton: 'px-6 text-base',
      content: 'text-base'
    },
    lg: {
      tabList: 'h-14 p-2 gap-3',
      tabButton: 'px-8 text-lg',
      content: 'text-lg'
    }
  };

  // Orientation classes
  const orientationClasses = {
    horizontal: {
      container: 'flex-col',
      tabList: 'flex-row',
      content: ''
    },
    vertical: {
      container: 'flex-row',
      tabList: 'flex-col',
      content: 'ml-4'
    }
  };

  // Combine classes
  const finalContainerClasses = `
    ${defaultContainerClasses}
    ${orientationClasses[orientation].container}
    ${containerClassName}
    ${className}
  `.trim();

  const finalTabListClasses = `
    ${defaultTabListClasses}
    ${sizeClasses[size].tabList}
    ${orientationClasses[orientation].tabList}
    ${tabListClassName}
  `.trim();

  const finalTabButtonClasses = `
    ${defaultTabButtonClasses}
    ${sizeClasses[size].tabButton}
    ${tabButtonClassName}
  `.trim();

  const finalActiveTabButtonClasses = `
    ${defaultActiveTabButtonClasses}
    ${activeTabButtonClassName}
  `.trim();

  const finalInactiveTabButtonClasses = `
    ${defaultInactiveTabButtonClasses}
    ${inactiveTabButtonClassName}
  `.trim();

  const finalContentClasses = `
    ${defaultContentClasses}
    ${sizeClasses[size].content}
    ${orientationClasses[orientation].content}
    ${contentClassName}
  `.trim();

  return (
    <div 
      className={finalContainerClasses}
      role="tablist"
      aria-label={ariaLabel}
    >
      <div className={finalTabListClasses}>
        {tabs.map((tab, index) => {
          const isActive = currentTab === index;
          const isDisabled = tab.disabled || !allowTabSwitch;
          
          return (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              disabled={isDisabled}
              className={`
                ${finalTabButtonClasses}
                ${isActive ? finalActiveTabButtonClasses : finalInactiveTabButtonClasses}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${enableAnimations ? `transition-all duration-${animationDuration}` : ''}
              `.trim()}
              role="tab"
              aria-selected={isActive}
              aria-label={`${tabAriaLabel} ${index + 1}: ${tab.label}`}
              tabIndex={isActive ? 0 : -1}
            >
              {showTabIcons && tab.icon && (
                <span className="flex-shrink-0">
                  {tab.icon}
                </span>
              )}
              {showTabLabels && (
                <span className="truncate">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div 
        className={finalContentClasses}
        role="tabpanel"
        aria-labelledby={`tab-${currentTab}`}
      >
        {tabs[currentTab]?.content}
      </div>
    </div>
  );
};

export default ModalTabs;

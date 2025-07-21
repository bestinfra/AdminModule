import type { ReactNode } from 'react';
import { useApp } from '@context/AppContext';
import Input from '@components/Form/Input';
import '@/styles/custom.css';

interface HeaderAction {
    icon: string;
    onClick?: () => void;
    ariaLabel: string;
    className?: string;
    count?: number;
}

interface HeaderTestProps {
    title?: string;
    onSidebarToggle?: () => void;
    onSearch?: (query: string) => void;
    actions?: HeaderAction[];
    className?: string;
    searchPlaceholder?: string;
    searchEnabled?: boolean;
    sidebarToggleIcon?: string;
    leftContent?: ReactNode;
    centerContent?: ReactNode;
    rightContent?: ReactNode;
}

const defaultProps: Partial<HeaderTestProps> = {
    title: 'Dashboard',
    searchPlaceholder: 'Search...',
    searchEnabled: true,
    sidebarToggleIcon: '/icons/arrow-left-from-arc.svg',
    className: '',
};

const HeaderTest = ({
    title = defaultProps.title,
    onSidebarToggle,
    onSearch,
    actions,
    className = defaultProps.className,
    searchPlaceholder = defaultProps.searchPlaceholder,
    searchEnabled = defaultProps.searchEnabled,
    sidebarToggleIcon = defaultProps.sidebarToggleIcon,
    leftContent,
    centerContent,
    rightContent,
}: HeaderTestProps) => {
    const { isSidebarCollapsed } = useApp();
    
    console.log('HeaderTest - actions prop:', actions);

    return (
        <header className={`border-b border-primary-border flex items-center justify-between px-6 py-4 ${className}`}>
            {/* Left section */}
            {leftContent ? (
                <div className="flex items-center">
                    {leftContent}
                </div>
            ) : (
                <nav className="flex items-center gap-4">
                    <figure
                        className="p-2 bg-stat-icon-gradient w-8 h-8 rounded-full flex items-center justify-center hover:text-white cursor-pointer"
                        onClick={onSidebarToggle}
                        aria-label="Toggle sidebar">
                        <img
                            src={sidebarToggleIcon}
                            alt=""
                            className={`h-6 w-6 custom-filter ${
                                isSidebarCollapsed ? 'rotate-180' : ''
                            }`}
                        />
                    </figure>
                    <h1 className="text-base text-primary-dark dark:text-white">{title}</h1>
                </nav>
            )}
            
            {/* Center section */}
            {centerContent ? (
                <div className="flex-1 flex items-center justify-center">
                    {centerContent}
                </div>
            ) : (
                searchEnabled && (
                    <section
                        className="flex-1 max-w-2xl mx-8"
                        aria-label="Search section">
                        <Input onSearch={onSearch} placeholder={searchPlaceholder} />
                    </section>
                )
            )}

            {/* Right section */}
            {rightContent ? (
                <div className="flex items-center">
                    {rightContent}
                </div>
            ) : (
                <nav className="flex items-center gap-4" aria-label="User actions">
                    {actions && actions.map((action: HeaderAction, index: number) => (
                        <figure
                            key={index}
                            className={`relative p-2 w-8 h-8 bg-background-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                                action.className || ''
                            }`}
                            onClick={action.onClick}
                            aria-label={action.ariaLabel}>
                            <img
                                src={action.icon}
                                alt=""
                                className="h-6 w-6"
                            />
                            {/* Count badge */}
                            {action.count && action.count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
                                    {action.count > 99 ? '99+' : action.count}
                                </span>
                            )}
                        </figure>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default HeaderTest; 
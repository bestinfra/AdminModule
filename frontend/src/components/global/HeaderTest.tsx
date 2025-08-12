import { useState, type ReactNode } from 'react';
import { useApp } from '@context/AppContext';
import Input from '@components/Form/Input';
import '@/styles/custom.css';
import NotificationSidebar from "./NotificationSidebar";
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

const headerActions = [
    {
        icon: '/icons/user.svg',
        onClick: () => console.log('User Profile clicked'),
        ariaLabel: 'User Profile',
        className: 'hover:bg-blue-100 dark:hover:bg-blue-900'
    },
    {
        icon: '/icons/bell.svg',
        // onClick removed here, will override inside component
        ariaLabel: 'Notifications',
        className: 'hover:bg-yellow-100 dark:hover:bg-yellow-900',
        count: 2,
    },
    {
        icon: '/icons/settings.svg',
        onClick: () => console.log('Settings clicked'),
        ariaLabel: 'Settings',
        className: 'hover:bg-green-100 dark:hover:bg-green-900'
    },
    {
        icon: '/icons/logout.svg',
        onClick: () => {
            // Clear all cookies
            const allCookies = Cookies.get();
            Object.keys(allCookies).forEach((cookieName) => {
                Cookies.remove(cookieName);
            });

            // Clear all storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirect to login page
            window.location.href = '/login';
        },
        ariaLabel: 'Logout',
        className: 'hover:bg-red-100 dark:hover:bg-red-900'
    }
];


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
    onSearch,
    actions = headerActions,
    className = defaultProps.className,
    searchPlaceholder = defaultProps.searchPlaceholder,
    searchEnabled = defaultProps.searchEnabled,
    sidebarToggleIcon = defaultProps.sidebarToggleIcon,
    leftContent,
    centerContent,
    rightContent,

}: HeaderTestProps) => {
    const { isSidebarCollapsed, toggleSidebar } = useApp();
    const location = useLocation();

    console.log('HeaderTest - actions prop:', actions);

    const [isNotifOpen, setIsNotifOpen] = useState(false);

  const notifications = [

   {
    id: 1,
    title: "Welcome!",
    message: "Thanks for joining our platform.",
    type: "info",
   },
   {
    id: 2,
    title: "Update Available",
    message: "Version 2.0 is now live.",
    type: "success",
   },
 ];


    // Override notification action onClick to toggle sidebar
    const actionsWithHandlers = actions.map(action => {
        if (action.ariaLabel === 'Notifications') {
            return {
                ...action,
                onClick: () => setIsNotifOpen(prev => !prev),
            };
        }
        return action;
    });

    const getPageTitle = (): string => {
        switch (location.pathname) {
            case '/':
                return 'Dashboard';
            case '/super-admin':
                return 'Super Admin Dashboard';
            case '/apps':
                return 'Apps Management';
            case '/apps/pages':
                return 'Pages Module';
            case '/apps/media-library':
                return 'Media Library';
            case '/apps/applications':
                return 'Applications';
            case '/apps/branding':
                return 'Branding';
            case '/apps/domain-hosting':
                return 'Domain & Hosting';
            case '/apps/modules':
                return 'Modules';
            case '/all-tickets':
                return 'All Tickets';
            case '/tickets-filtered': {
                const urlParams = new URLSearchParams(window.location.search);
                const filter = urlParams.get('filter');
                switch (filter) {
                    case 'high-priority':
                        return 'High Priority Tickets';
                    case 'open':
                        return 'Open Tickets';
                    case 'in-progress':
                        return 'In Progress Tickets';
                    case 'closed':
                        return 'Closed Tickets';
                    default:
                        return 'All Tickets';
                }
            }
            case '/consumers':
                return 'Consumers';
            case '/users':
                return 'Users';
            case '/role-management':
                return 'Role Management';
            case '/bills/prepaid':
                return 'Prepaid Bills';
            case '/bills/postpaid':
                return 'Postpaid Bills';
            case '/profile':
                return 'Profile';
            default:
                return 'Dashboard';
        }
    };

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
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar">
                        <img
                            src={sidebarToggleIcon}
                            alt=""
                            className={`h-6 w-6 custom-filter ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                        />
                    </figure>
                    <h1 className="text-base text-primary-dark dark:text-white">{getPageTitle()}</h1>
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
                        className="flex-1 max-w-2xl mx-8 text-sm font-manrope font-normal"
                        aria-label="Search section">
                        <Input onSearch={onSearch} placeholder={searchPlaceholder} className="text-sm font-manrope font-normal" />
                    </section>
                )
            )}

            {/* Notification Sidebar */}
            <NotificationSidebar
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
            />

            {/* Right section */}
            {rightContent ? (
                <div className="flex items-center">
                    {rightContent}
                </div>
            ) : (
                <nav className="flex items-center gap-4" aria-label="User actions">
                    {actionsWithHandlers.map((action: HeaderAction, index: number) => (
                        <figure
                            key={index}
                            className={`relative p-2 w-8 h-8 bg-background-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${action.className || ''}`}
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

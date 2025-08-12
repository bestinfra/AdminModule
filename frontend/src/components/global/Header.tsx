import Input from '@components/Form/Input';
import { useApp } from '@context/AppContext';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

interface HeaderAction {
    icon: string;
    alt: string;
    onClick?: () => void;
    ariaLabel: string;
    className?: string;
}

interface HeaderProps {
    title: string;
    onSidebarToggle?: () => void;
    onSearch?: (query: string) => void;
    actions?: HeaderAction[];
    secondaryLogo?: string;
}

function Header({
    title,
    onSidebarToggle,
    onSearch,
    actions,
}: HeaderProps) {
    const { isSidebarCollapsed } = useApp();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [, forceUpdate] = useState({});

    // Listen for custom events from fallback context
    useEffect(() => {
        const handleSidebarToggle = () => {
            forceUpdate({});
        };

        window.addEventListener('sidebarToggled', handleSidebarToggle);

        return () => {
            window.removeEventListener('sidebarToggled', handleSidebarToggle);
        };
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
            console.log('Full screen',isFullScreen);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    const demoActions: HeaderAction[] = [
        {
            icon: '/icons/tax-alt.svg',
            alt: 'Notifications icon',
            onClick: () => console.log('Notifications clicked'),
            ariaLabel: 'Notifications',
        },
        {
            icon: '/icons/full-screen.svg',
            alt: 'Full screen icon',
            onClick: toggleFullScreen,
            ariaLabel: 'Toggle full screen',
        },
    ];

    return (
        <header className="border-b border-primary-border flex items-center justify-between px-6 py-4">
            <nav className="flex items-center gap-4">
                <figure
                    className="p-2 bg-stat-icon-gradient  w-8 h-8 rounded-full flex items-center justify-center hover:text-white"
                    onClick={onSidebarToggle}
                    aria-label="Toggle sidebar">
                    <img
                        src="/icons/arrow-left-from-arc.svg"
                        alt="Menu"
                        className={`h-6 w-6 custom-filter ${
                            isSidebarCollapsed ? 'rotate-180' : ''
                        }`}
                    />
                </figure>
                <h1 className="text-base text-primary-dark dark:text-white">{title}</h1>
            </nav>
            <section
                className="flex-1 max-w-2xl mx-8"
                aria-label="Search section">
                <Input onSearch={onSearch} />
            </section>
 {/* User actions */}
            <nav className="flex items-center gap-4" aria-label="User actions">  
                {(actions || demoActions).map((action, index) => (
                    <figure
                        key={index}
                        className={`p-2 w-8 h-8 bg-background-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center cursor-pointer ${
                            action.className || ''
                        }`}
                        onClick={action.onClick}
                        aria-label={action.ariaLabel}>
                        <img
                            src={action.icon}
                            alt={action.alt}
                            className="h-6 w-6"
                        />
                    </figure>
                ))}
                <NotificationBell />
                <UserProfile />
            </nav>
        </header>
    );
}

// Notification component
function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'tickets'>('all');
    const [error, setError] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'System Update',
            message: 'New system update available',
            time: '2 minutes ago',
            isRead: false,
            type: 'info',
        },
        {
            id: 2,
            title: 'Payment Received',
            message: 'Payment of ₹500 received from user',
            time: '5 minutes ago',
            isRead: false,
            type: 'success',
        },
        {
            id: 3,
            title: 'Alert',
            message: 'High power consumption detected',
            time: '10 minutes ago',
            isRead: true,
            type: 'warning',
        },
        {
            id: 4,
            title: 'Ticket Update',
            message: 'Your support ticket has been updated',
            time: '15 minutes ago',
            isRead: false,
            type: 'ticket',
        },
    ]);

    // Simulate error for demonstration
    // setError(true); // Uncomment to test error state

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const toggleNotifications = () => {
        setIsOpen(!isOpen);
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleRetry = () => {
        // Simulate retry logic
        setError(false);
    };

    // Tab filtering logic
    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return !n.isRead;
        if (activeTab === 'tickets') return n.type === 'ticket';
        return true;
    });

    return (
        <div className="relative">
            <figure
                onClick={toggleNotifications}
                className="p-2 bg-background-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer relative"
                aria-label="Notifications"
            >
                <img
                    src="/icons/bell.svg"
                    alt="Notifications"
                    className="h-4 w-4"
                />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </figure>

            {/* Notification side panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-opacity-50 z-40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Side panel */}
                    <div className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Notifications
                                    </h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                                        aria-label="Close notifications"
                                    >
                                        <img
                                            src="/icons/close.svg"
                                            alt="Close"
                                            className="h-5 w-5"
                                        />
                                    </button>
                                </div>
                                {/* Tabs */}
                                <div className="flex mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                    <button
                                        className={`flex-1 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 ${activeTab === 'unread' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('unread')}
                                    >
                                        Unread
                                    </button>
                                    <button
                                        className={`flex-1 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 ${activeTab === 'tickets' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('tickets')}
                                    >
                                        Tickets
                                    </button>
                                    <button
                                        className={`flex-1 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 ${activeTab === 'all' ? 'bg-white dark:bg-gray-800 text-blue-600' : 'text-gray-500'}`}
                                        onClick={() => setActiveTab('all')}
                                    >
                                        All
                                    </button>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            {/* Notifications list */}
                            <div className="flex-1 overflow-y-auto">
                                {error ? (
                                    <div className="m-4 border border-red-400 rounded-lg bg-red-50 p-4 flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-red-600">Notification Error</div>
                                            <div className="text-sm text-red-500">Failed to connect to notification server</div>
                                        </div>
                                        <button
                                            className="ml-4 text-gray-400 hover:text-gray-600"
                                            onClick={() => setError(false)}
                                            aria-label="Dismiss error"
                                        >
                                            <img src="/icons/close.svg" alt="Close" className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                            onClick={handleRetry}
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : filteredNotifications.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                        <img
                                            src="/icons/bell.svg"
                                            alt="No notifications"
                                            className="h-12 w-12 mx-auto mb-4 opacity-50"
                                        />
                                        <p>No notifications</p>
                                    </div>
                                ) : (
                                    filteredNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                                                !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                                                    notification.type === 'success' ? 'bg-green-500' :
                                                    notification.type === 'warning' ? 'bg-yellow-500' :
                                                    notification.type === 'ticket' ? 'bg-purple-500' :
                                                    'bg-blue-500'
                                                }`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {notification.title}
                                                        </h4>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {notification.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {/* Footer */}
                            {filteredNotifications.length > 0 && !error && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <button className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Logout button component
function UserProfile() {
    const handleLogout = () => {
        // Clear all cookies
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach((cookieName) => {
            Cookies.remove(cookieName);
        });

        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to logout page
        window.location.href = '/auth/logout';
    };

    return (
        <figure
            onClick={handleLogout}
            className="p-2 flex bg-background-secondary dark:bg-dark-secondary rounded-full flex items-center justify-center items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            aria-label="Logout"
        >
            <img
                src="/icons/logout.svg"
                alt="Logout"
                className="cursor-pointer"
            />
        </figure>
    );
}

export default Header;

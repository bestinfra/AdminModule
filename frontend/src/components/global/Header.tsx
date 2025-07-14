import Input from '../forms/Input';
import { useApp } from '../../context/AppContext';
import Cookies from 'js-cookie';
import { useState } from 'react';

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
                <UserProfile />
            </nav>
        </header>
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

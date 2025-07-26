import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@components/global/Sidebar';
import HeaderTest from '@components/global/HeaderTest';
import { useApp } from '@context/AppContext';
// import Cookies from 'js-cookie';
const headerActions = [
    {
        icon: '/icons/user.svg',
        onClick: () => console.log('User Profile clicked'),
        ariaLabel: 'User Profile',
        className: 'hover:bg-blue-100 dark:hover:bg-blue-900'
    },
    {
        icon: '/icons/bell.svg',
        onClick: () => console.log('Notifications clicked'),
        ariaLabel: 'Notifications',
        className: 'hover:bg-yellow-100 dark:hover:bg-yellow-900',
        count: 5 // Example notification count
    },
    {
        icon: '/icons/settings.svg',
        onClick: () => console.log('Settings clicked'),
        ariaLabel: 'Settings',
        className: 'hover:bg-green-100 dark:hover:bg-green-900'
    }
];


interface MainLayoutProps {
    children?: React.ReactNode;
    footer?: {
        companyName: string;
        showShareButton: boolean;
    };
    appDownload?: {
        enabled: boolean;
        title: string;
        subtitle: string;
        buttonText: string;
        backgroundImage: string;
        downloadUrl: string;
        logo: {
            src: string;
            alt: string;
        };
    };
    showThemeToggle?: boolean;
    showAppDownload?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
    appDownload,
    showThemeToggle = true,
    showAppDownload = true
}) => {
    const { toggleSidebar, toggleTheme } = useApp();
    const location = useLocation();
    const navigate = useNavigate();

    // Function to get page title based on current route
    const getPageTitle = () => {
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
            case '/tickets-filtered':
                // Get the filter from URL to show appropriate title
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

    // Navigation handler for sidebar
    const handleNavigate = (path: string) => {
        navigate(path);
    };

    // Share handler for sidebar
    const handleShareClick = () => {
        if (!appDownload) return;
        
        if (navigator.share) {
            navigator.share({
                title: 'Download our Mobile App',
                text: 'Check out our mobile app!',
                url: appDownload.downloadUrl,
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(appDownload.downloadUrl);
            alert('Download link copied to clipboard!');
        }
    };

    return (
        <div className="flex h-screen bg-white ">
            <Sidebar 
                onNavigate={handleNavigate} 
                footer={{ showShareButton: true }} 
                appDownload={appDownload} 
                showThemeToggle={showThemeToggle}
                onThemeToggle={toggleTheme} 
                onShareClick={handleShareClick} 
                showAppDownload={showAppDownload}
            />
            <div className="flex flex-col flex-1">
                <HeaderTest
                    title={getPageTitle()}
                    onSidebarToggle={toggleSidebar}
                    actions={headerActions}
                    searchEnabled={true}
                    searchPlaceholder="Search anything..."
                    onSearch={(query) => console.log('Search:', query)}
                    />
                <main className="flex-1 px-6  py-4  bg-white overflow-auto dark:bg-primary-dark hide-scrollbar-y">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

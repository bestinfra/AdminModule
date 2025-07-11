import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../global/Sidebar';
import Header from '../global/Header';
import { useApp } from '../../context/AppContext';

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    const { toggleSidebar } = useApp();
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
            case '/consumers':
                return 'Consumers';
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

    return (
        <div className="flex h-screen bg-white ">
            <Sidebar onNavigate={handleNavigate} />
            <div className="flex flex-col flex-1">
                <Header
                    title={getPageTitle()}
                    onSidebarToggle={toggleSidebar}
                />
                <main className="flex-1 p-6 bg-white overflow-auto dark:bg-primary-dark">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

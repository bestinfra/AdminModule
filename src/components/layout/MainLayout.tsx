import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../global/Sidebar';
import Header from '../global/Header';
import { useApp } from '../../context/AppContext';

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    const { isSidebarCollapsed, toggleSidebar } = useApp();
    const location = useLocation();

    // Function to get page title based on current route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'Dashboard';
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
            default:
                return 'Dashboard';
        }
    };

    return (
        <div className="flex h-screen bg-white ">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header
                    title={getPageTitle()}
                    onSidebarToggle={toggleSidebar}
                />
                <main className="flex-1 p-6 bg-white overflow-auto dark:bg-dark-primary">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

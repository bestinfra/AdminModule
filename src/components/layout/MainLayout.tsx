import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../global/Sidebar';
import Header from '../global/Header';
import { useApp } from '../../context/AppContext';

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    const { isSidebarCollapsed, toggleSidebar } = useApp();

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header
                    title="Dashboard"
                    onSidebarToggle={toggleSidebar}
                    isCollapsed={isSidebarCollapsed}
                />
                <main className="flex-1 p-6 bg-white overflow-auto dark:bg-dark-primary">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

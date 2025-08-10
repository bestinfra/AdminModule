import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@components/global/Sidebar';
import HeaderTest from '@components/global/HeaderTest';
import { useApp } from '@context/AppContext';
// import Cookies from 'js-cookie';

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
    const { toggleTheme } = useApp();
    const navigate = useNavigate();
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const handleThemeChange = () => {
            forceUpdate({});
        };

        const handleSidebarToggle = () => {
            forceUpdate({});
        };

        window.addEventListener('themeChanged', handleThemeChange);
        window.addEventListener('sidebarToggled', handleSidebarToggle);

        return () => {
            window.removeEventListener('themeChanged', handleThemeChange);
            window.removeEventListener('sidebarToggled', handleSidebarToggle);
        };
    }, []);

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const handleShareClick = () => {
        if (!appDownload) return;
        
        if (navigator.share) {
            navigator.share({
                title: 'Download our Mobile App',
                text: 'Check out our mobile app!',
                url: appDownload.downloadUrl,
            });
        } else {
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
                {/* Removed all props, just use HeaderTest */}
                <HeaderTest />
                <main className="flex-1 px-6 py-4  bg-white overflow-auto dark:bg-primary-dark hide-scrollbar-y">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

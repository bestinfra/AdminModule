import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/global/Button';
import BasicInformationTab from './BasicInformationTab';
import PasswordTab from './PasswordTab';
import ActivityLogTab from './ActivityLogTab';
import NotificationsTab from './NotificationTab';
import TwoStepVerificationTab from './TwoStepVerificationTab';
import AccountStatusTab from './AccountStatusTab';

interface TabItem {
    id: string;
    label: string;
    path: string;
    icon: string;
}

// Interface for profile tabs that expect user data
interface ProfileUser {
    USER_ID?: string;
    id?: number;
    email?: string;
    name?: string;
    phone?: string;
    role_title?: string;
    client_name?: string;
    last_active?: string;
    created_at?: string;
}

const Profile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState('basic-info');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Map AuthContext user to ProfileUser interface
    const mapUserToProfile = (authUser: any): ProfileUser => {
        if (!authUser) return {};
        
        return {
            USER_ID: authUser.id?.toString(),
            id: authUser.id,
            email: authUser.email,
            name: authUser.username,
            phone: undefined,
            role_title: authUser.role,
            client_name: undefined,
            last_active: undefined,
            created_at: undefined
        };
    };

    const profileUser = mapUserToProfile(authUser);

    const tabs: TabItem[] = [
        {
            id: 'basic-info',
            label: 'Basic Information',
            path: '/profile/basic-info',
            icon: '/icons/user-profile.svg'
        },
        {
            id: 'password',
            label: 'Change Password',
            path: '/profile/password',
            icon: '/icons/shield.svg'
        },
        {
            id: 'activity-log',
            label: 'Activities',
            path: '/profile/activity-log',
            icon: '/icons/transactions.svg'
        },
        {
            id: 'notifications',
            label: 'Notifications',
            path: '/profile/notifications',
            icon: '/icons/mailbox.svg'
        },
        {
            id: 'two-factor',
            label: 'Two-step Verification',
            path: '/profile/two-factor',
            icon: '/icons/shield.svg'
        },
        {
            id: 'account-status',
            label: 'Account Status',
            path: '/profile/account-status',
            icon: '/icons/user-gear.svg'
        }
    ];

    useEffect(() => {
        // Determine active tab based on current path
        const currentPath = location.pathname;
        const matchingTab = tabs.find(tab => tab.path === currentPath);
        
        if (matchingTab) {
            setActiveTab(matchingTab.id);
        } else if (currentPath === '/profile') {
            // Default to basic info if just /profile
            setActiveTab('basic-info');
            navigate('/profile/basic-info', { replace: true });
        }
    }, [location.pathname, navigate]);

    const handleTabChange = (tabId: string) => {
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            setActiveTab(tabId);
            navigate(tab.path);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic-info':
                return <BasicInformationTab user={profileUser} />;
            case 'password':
                return <PasswordTab user={profileUser} />;
            case 'activity-log':
                return <ActivityLogTab user={profileUser} />;
            case 'notifications':
                return <NotificationsTab />;
            case 'two-factor':
                return <TwoStepVerificationTab user={profileUser} />;
            case 'account-status':
                return <AccountStatusTab user={profileUser} />;
            default:
                return <BasicInformationTab user={profileUser} />;
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen dark:bg-primary-dark-light relative">
            {/* Sidebar Toggle Button */}
            <Button 
                label=""
                variant="outline"
                size="small"
                onClick={toggleSidebar}
                className="hidden md:hidden absolute top-0 left-0 z-10"
                icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    </svg>
                }
            />

            <div className="flex gap-10">
                {/* Sidebar */}
                <aside className={`w-70 flex-shrink-0 bg-primary-lightest border border-primary-border dark:bg-primary-dark rounded-lg dark:border-dark-border transition-transform duration-300 ease-in-out ${
                    !sidebarOpen ? 'transform -translate-x-full' : ''
                } md:translate-x-0`}>
                    <ul className="p-4 space-y-2">
                        {tabs.map((tab) => (
                            <li key={tab.id} className="text-sm">
                                <button
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`w-full text-left flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                                        activeTab === tab.id 
                                            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white font-semibold shadow-sm' 
                                            : 'text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:text-text-secondary dark:hover:text-white dark:hover:bg-primary-dark-light'
                                    }`}
                                >
                                    <img
                                        src={tab.icon}
                                        alt=""
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>
                {/* Main Content */}
                <main className="flex-1 ">
                    <div className="bg-white dark:bg-primary-dark rounded-lgbg-white dark:bg-primary-dark rounded-lg    dark:border-dark-border">
                        {renderTabContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile; 
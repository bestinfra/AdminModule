import Input from '../forms/Input';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
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
        onClick: () => console.log('Full screen clicked'),
        ariaLabel: 'Toggle full screen',
    },
];

function Header({
    title,
    onSidebarToggle,
    onSearch,
    actions = demoActions,
    secondaryLogo = '/images/gmr-logo.png',
}: HeaderProps) {
    const { isSidebarCollapsed } = useApp();

    return (
        <header className="border-b border-b-primary-border dark:border-dark-border dark:bg-primary-dark flex items-center justify-between px-6 py-4 h-24">
            <nav className="flex items-center gap-4">
                <button
                    className="p-2 bg-primary-lightest dark:bg-dark-secondary w-8 h-8 rounded-full flex items-center justify-center hover:text-white"
                    onClick={onSidebarToggle}
                    aria-label="Toggle sidebar">
                    <img
                        src="/icons/arrow-left-from-arc.svg"
                        alt="Menu"
                        className={`h-6 w-6 ${
                            isSidebarCollapsed ? 'rotate-180' : ''
                        }`}
                    />
                </button>
                <h1 className="text-base dark:text-white">{title}</h1>
            </nav>

            <section
                className="flex-1 max-w-2xl mx-8"
                aria-label="Search section">
                <Input onSearch={onSearch} />
            </section>

            <nav className="flex items-center gap-4" aria-label="User actions">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className={`p-2 w-8 h-8 bg-primary-lightest dark:bg-dark-secondary rounded-full flex items-center justify-center ${
                            action.className || ''
                        }`}
                        onClick={action.onClick}
                        aria-label={action.ariaLabel}>
                        <img
                            src={action.icon}
                            alt={action.alt}
                            className="h-6 w-6"
                        />
                    </button>
                ))}
                <UserProfile />
            </nav>
        </header>
    );
}

// User profile component - just image like before
function UserProfile() {
    return (
        <div className="p-2 flex items-center justify-center">
            <img
                src="/images/gmr-logo.png"
                alt="User profile"
                className="w-10"
            />
        </div>
    );
}

export default Header;

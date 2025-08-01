import React from 'react';

interface ProfileSidebarItem {
    id: string;
    label: string;
    icon?: string;
    isActive?: boolean;
    onClick?: () => void;
}

interface ProfileSidebarProps {
    items: ProfileSidebarItem[];
    onItemClick?: (itemId: string) => void;
    className?: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    items,
    onItemClick,
    className = ''
}) => {
    return (
        <div className={`bg-background-secondary rounded-lg p-4 w-64 ${className}`}>
            <nav className="space-y-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            item.onClick?.();
                            onItemClick?.(item.id);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                            item.isActive
                                ? 'bg-white text-primary font-medium'
                                : 'text-gray-600 hover:bg-background-secondary hover:text-primary'
                        }`}
                    >
                        <div className="flex items-center  space-x-3">
                            {item.icon && (
                                <img
                                    src={item.icon}
                                    alt=""
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                />
                            )}
                            <span className="text-sm">{item.label}</span>
                        </div>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default ProfileSidebar; 
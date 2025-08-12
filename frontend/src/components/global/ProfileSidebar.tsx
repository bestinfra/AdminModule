import React, { useRef, useEffect } from 'react';

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
    const isInitialRender = useRef(true);
    const previousActiveItem = useRef<string | null>(null);

    // Track the currently active item
    useEffect(() => {
        const activeItem = items.find(item => item.isActive);
        if (activeItem) {
            previousActiveItem.current = activeItem.id;
        }
    }, [items]);

    const handleItemClick = (item: ProfileSidebarItem) => {
        // Only log if it's not the initial render and we're switching to a different item
        if (!isInitialRender.current && previousActiveItem.current !== item.id) {
            // Removed console.log to prevent header interference
        }

        // Update the previous active item
        previousActiveItem.current = item.id;

        // Call the item's onClick if it exists
        item.onClick?.();
        
        // Call the parent's onItemClick
        onItemClick?.(item.id);
    };

    // Mark initial render as complete after first render
    useEffect(() => {
        isInitialRender.current = false;
    }, []);

    return (
        <div className={`bg-background-secondary rounded-lg p-4 h-full ${className}`}>
            <nav className="space-y-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
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
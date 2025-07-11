import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

interface MenuItem {
    id: string;
    label: string;
    isDestructive?: boolean;
}

interface HeaderProps {
    title: string;
    buttonsLabel?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'primarysmall' | 'success' | 'danger' | 'warning';
    size?: string;
    menuItems?: MenuItem[];
    onMenuItemClick?: (itemId: string) => void;
    showMenu?: boolean;
    onClick?: () => void;
    showDropdown?: boolean;
    onBackClick?: () => void;
    headerContent?: React.ReactNode;
    rightImageSrc?: string;
    onRightImageClick?: () => void;
    backButtonText?: string;
    profileInitials?: string;
    showProfileInitials?: boolean;
    unitName?: string;
    editMode?: boolean;
    editedUnitName?: string;
    onUnitNameChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    status?: string;
    verticalLayout?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    title,
    buttonsLabel,
    variant,
    size,
    menuItems = [],
    onMenuItemClick,
    showMenu,
    onClick,
    showDropdown = true,
    onBackClick,
    headerContent,
    rightImageSrc,
    onRightImageClick,
    backButtonText,
    profileInitials,
    showProfileInitials = false,
    unitName,
    editMode,
    editedUnitName,
    onUnitNameChange,
    status,
    verticalLayout = false,
}) => {
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [editMenuPosition, setEditMenuPosition] = useState({ x: 0, y: 0 });
    const editMenuRef = useRef<HTMLDivElement>(null);
    const dropdownIconRef = useRef<HTMLSpanElement>(null);

    const handleMenuClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const headerRightRect = e.currentTarget
            .closest('.header-right')
            ?.getBoundingClientRect();

        if (headerRightRect) {
            setEditMenuPosition({
                x: headerRightRect.right - headerRightRect.width - 60,
                y: headerRightRect.bottom + 5,
            });
            setShowEditMenu(true);
        }
    };

    const handleMenuItemClick = (itemId: string) => {
        if (onMenuItemClick) {
            onMenuItemClick(itemId);
        }
        setShowEditMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                editMenuRef.current &&
                !editMenuRef.current.contains(event.target as Node) &&
                dropdownIconRef.current &&
                !dropdownIconRef.current.contains(event.target as Node)
            ) {
                setShowEditMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getStatusBadgeClasses = (status: string | undefined) => {
        const baseClasses = "px-4 py-1.5 rounded-full text-sm font-medium";
        switch (status?.toLowerCase()) {
            case 'approved':
                return `${baseClasses} bg-green-50 text-green-600`;
            case 'pending':
                return `${baseClasses} bg-yellow-500 text-white`;
            case 'rejected':
                return `${baseClasses} bg-red-50 text-red-600`;
            case 'active':
                return `${baseClasses} bg-blue-50 text-blue-600`;
            case 'prepaid':
                return `${baseClasses} bg-blue-50 text-blue-600`;
            case 'postpaid':
                return `${baseClasses} bg-orange-50 text-orange-600`;
            default:
                return `${baseClasses} bg-gray-50 text-gray-600`;
        }
    };

    return (
        <div className="flex justify-between items-center w-full">
            <div className="flex flex-col-reverse items-start justify-center gap-2 text-base">
                {onBackClick && (
                    <div 
                        className="flex flex-row items-center gap-2 justify-center rounded-lg cursor-pointer"
                        onClick={onBackClick}
                    >
                        <span className="flex items-center justify-center w-8 h-5 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer transition-all">
                            <img 
                                src="icons/arrow-back.svg" 
                                alt="back" 
                                className="w-4 h-4 filter dark:invert"
                            />
                        </span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                            {backButtonText || `Back to ${title}`}
                        </span>
                    </div>
                )}
                {showProfileInitials && (
                    <div>
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                            {profileInitials || 'UN'}
                        </div>
                    </div>
                )}
                {unitName && (
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-black text-gray-900 dark:text-white m-0">
                            {editMode ? (
                                <input
                                    type="text"
                                    name="UnitName"
                                    value={editedUnitName || ''}
                                    onChange={onUnitNameChange}
                                    className="bg-transparent border-none outline-none text-xl font-black text-gray-900 dark:text-white"
                                />
                            ) : (
                                unitName
                            )}
                        </h1>
                        {status && (
                            <div className="flex items-center">
                                <span className={getStatusBadgeClasses(status)}>
                                    {status}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <h1 className="text-xl font-black text-gray-900 dark:text-white m-0">
                    {title}
                </h1>
            </div>

            <div className={`flex items-center gap-4 header-right ${
                editMode ? 'bg-gray-100 dark:bg-gray-800 p-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300' : ''
            } ${
                verticalLayout ? 'flex-col-reverse items-end gap-2' : ''
            }`}>
                {headerContent && (
                    <span className="text-sm text-gray-700 dark:text-gray-300 inline-flex items-center">
                        {headerContent}
                    </span>
                )}
                {rightImageSrc && (
                    <div 
                        className="flex items-center flex-row-reverse gap-2 cursor-pointer rounded-lg transition-all duration-300 px-4"
                        onClick={onRightImageClick}
                    >
                        <span className="relative bg-gray-100 dark:bg-gray-800 rounded-full p-2 h-10 w-10 flex items-center justify-center cursor-pointer transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-700">
                            <img 
                                src={rightImageSrc} 
                                alt="refresh" 
                                className="h-4 w-4 filter dark:invert transition-filter duration-300 hover:brightness-110"
                            />
                        </span>
                        <span className="text-base text-gray-700 dark:text-gray-300 font-bold">
                            Refresh
                        </span>
                    </div>
                )}
                {buttonsLabel && (  
                    <Button
                        label={buttonsLabel}
                        variant={variant}
                        onClick={onClick}
                    />
                )}

                {showMenu && showDropdown && (
                    <span
                        className="flex items-center justify-center w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 shadow-md cursor-pointer"
                        ref={dropdownIconRef}
                        onClick={handleMenuClick}
                    >
                        <img 
                            src="icons/menu.svg" 
                            alt="dropdown" 
                            className="w-4 h-4 filter dark:invert"
                        />
                    </span>
                )}
            </div>
            {showEditMenu && showMenu && showDropdown && (
                <div
                    className="fixed bg-gray-100 dark:bg-gray-800 shadow-lg rounded-2xl min-w-[150px] z-50 p-2 flex flex-col animate-fadeIn"
                    style={{
                        left: editMenuPosition.x,
                        top: editMenuPosition.y,
                    }}
                    ref={editMenuRef}
                >
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="px-5 py-3 text-sm cursor-pointer flex items-center gap-3 hover:bg-blue-600 hover:text-white rounded-lg active:bg-blue-600 active:text-white"
                            onClick={() => handleMenuItemClick(item.id)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    buttonsLabel: PropTypes.string,
    variant: PropTypes.string,
    size: PropTypes.string,
    showMenu: PropTypes.bool,
    showDropdown: PropTypes.bool,
    menuItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            isDestructive: PropTypes.bool,
        })
    ),
    onMenuItemClick: PropTypes.func,
    onClick: PropTypes.func,
    onBackClick: PropTypes.func,
    headerContent: PropTypes.node,
    rightImageSrc: PropTypes.string,
    onRightImageClick: PropTypes.func,
    backButtonText: PropTypes.string,
    profileInitials: PropTypes.string,
    showProfileInitials: PropTypes.bool,
    unitName: PropTypes.string,
    editMode: PropTypes.bool,
    editedUnitName: PropTypes.string,
    onUnitNameChange: PropTypes.func,
    status: PropTypes.string,
    verticalLayout: PropTypes.bool,
};

export default Header;

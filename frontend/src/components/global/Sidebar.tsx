import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useApp } from '../../context/AppContext';
import '../../styles/custom.css';

interface SubMenuItem {
    title: string;
    link?: string;
    icon?: string;
    count?: number;
    hasSubmenu?: boolean;
    submenu?: SubMenuItem[];
}

interface MenuItem {
    title: string;
    icon: string;
    link?: string;
    hasSubmenu?: boolean;
    submenu?: SubMenuItem[];
    count?: number;
}

interface MenuCategory {
    category: string;
    items: MenuItem[];
}

interface SidebarProps {
    isCollapsed: boolean;
    currentPath?: string;
    onNavigate?: (path: string) => void;
    menus?: MenuCategory[];
    logo?: {
        src: string;
        alt: string;
        collapsedSrc?: string;
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
    footer?: {
        copyright: string;
        showThemeToggle: boolean;
        showShareButton: boolean;
    };
    className?: string;
    onThemeToggle?: () => void;
    onShareClick?: () => void;
    onLogout?: () => void;
}

const defaultMenus: MenuCategory[] = [
    {
        category: 'DASHBOARD',
        items: [
            {
                title: 'Dashboard',
                icon: '/icons/dashboard.svg',
                link: '/',
            },
            {
                title: 'Super Admin Dashboard',
                icon: '/icons/admin.svg',
                link: '/super-admin',
            },
            {
                title: 'DTR Dashboard',
                icon: '/icons/dtr.svg',
                link: '/dtr-dashboard',
            },
        ],
    },
    {
        category: 'CONSUMER MANAGEMENT',
        items: [
            {
                title: 'Consumers',
                icon: '/icons/user.svg',
                link: '/consumers',
            },
            {
                title: 'Add Consumer',
                icon: '/icons/user-add.svg',
                link: '/consumers/add',
            },
            {
                title: 'Consumer View',
                icon: '/icons/user-profile.svg',
                link: '/consumers',
            },
        ],
    },
    {
        category: 'METER MANAGEMENT',
        items: [
            {
                title: 'Meters List',
                icon: '/icons/meter.svg',
                link: '/meter-management/meters-list',
            },
            {
                title: 'Add Meter',
                icon: '/icons/meter-bolt.svg',
                link: '/meter-management/meters-list/add',
            },
            {
                title: 'Meter Details',
                icon: '/icons/meter-make.svg',
                link: '/meter-details',
            },
            {
                title: 'Data Logger Master',
                icon: '/icons/database.svg',
                link: '/meter-management/data-logger-master',
            },
            {
                title: 'Add Data Logger',
                icon: '/icons/server.svg',
                link: '/meter-management/data-logger-master/add',
            },
        ],
    },
    {
        category: 'BILLING',
        items: [
            {
                title: 'Bills Postpaid',
                icon: '/icons/bills.svg',
                link: '/bills/postpaid',
            },
            {
                title: 'Bills Prepaid',
                icon: '/icons/bills2.svg',
                link: '/bills/prepaid',
            },
        ],
    },
    {
        category: 'DTR MANAGEMENT',
        items: [
            {
                title: 'DTR Overview',
                icon: '/icons/dtr.svg',
                link: '/dtr-dashboard',
                hasSubmenu: true,
                submenu: [
                    {
                        title: 'DTR Detail Page',
                        link: '/dtr',
                    },
                    {
                        title: 'Total DTRs',
                        link: '/dtr-statistics/total-dtrs',
                    },
                    {
                        title: 'Total Fuse Blown',
                        link: '/dtr-statistics/total-fuse-blown',
                    },
                    {
                        title: 'Total LT Feeders',
                        link: '/dtr-statistics/total-lt-feeders',
                    },
                ],
            },
            {
                title: 'DTR Issues',
                icon: '/icons/alert-triggered.svg',
                hasSubmenu: true,
                submenu: [
                    {
                        title: 'HT Side Fuse Blown',
                        link: '/dtr-statistics/ht-side-fuse-blown',
                    },
                    {
                        title: 'LT Side Fuse Blown',
                        link: '/dtr-statistics/lt-side-fuse-blown',
                    },
                    {
                        title: 'Overloaded Feeders',
                        link: '/dtr-statistics/overloaded-feeders',
                    },
                    {
                        title: 'Underloaded Feeders',
                        link: '/dtr-statistics/underloaded-feeders',
                    },
                    {
                        title: 'Unbalanced DTRs',
                        link: '/dtr-statistics/unbalanced-dtrs',
                    },
                    {
                        title: 'Power Failure Feeders',
                        link: '/dtr-statistics/power-failure-feeders',
                    },
                ],
            },
            {
                title: 'Feeders',
                icon: '/icons/feeder.svg',
                link: '/feeders',
            },
        ],
    },
    {
        category: 'ASSET MANAGEMENT',
        items: [
            {
                title: 'Asset Management',
                icon: '/icons/workflow-setting-alt.svg',
                link: '/asset-management',
            },
            {
                title: 'Connect/Disconnect',
                icon: '/icons/connect.svg',
                link: '/connect-disconnect',
            },
        ],
    },
    {
        category: 'TICKETS & SUPPORT',
        items: [
            {
                title: 'All Tickets',
                icon: '/icons/support-tickets.svg',
                link: '/all-tickets',
            },
            {
                title: 'Ticket View',
                icon: '/icons/ticket-view.svg',
                link: '/ticket-view/:ticketId',
            },
            {
                title: 'Add Message',
                icon: '/icons/ticket-view.svg',
                link: '/ticket-view/:ticketId/add-message',
            },
            {
                title: 'User Management',
                icon: '/icons/user-management.svg',
                link: '/user-management',
            },
            {
                title: 'Role Management',
                icon: '/icons/role-management.svg',
                link: '/role-management',
            },
        ],

    },
    {
        category: 'APPS & MODULES',
        items: [
            {
                title: 'App Management',
                icon: '/icons/apps-icon.svg',
                link: '/apps',
            },
            {
                title: 'Module Selection',
                icon: '/icons/collection.svg',
                link: '/module-selection',
            },
        ],
    },
    {
        category: 'PAGE BUILDER',
        items: [
            {
                title: 'Page Builder',
                icon: '/icons/workflow-setting-alt.svg',
                link: '/page-builder',
            },
            // {
            //     title: 'User Management',
            //     icon: '/icons/user-management.svg',
            //     hasSubmenu: true,
            //     submenu: [
            //         {
            //             title: 'Users',
            //             link: '/user-management/users',
            //         },
            //         {
            //             title: 'Roles',
            //             link: '/user-management/roles',
            //         },
            //     ],
            // },
        ],
    },
    {
        category: 'SETTINGS',
        items: [
            {
                title: 'Forms',
                icon: '/icons/clipboard-user.svg',
                link: '/forms',
            },
            {
                title: 'Profile',
                icon: '/icons/user-profile.svg',
                link: '/profile',
            },
        ],
    },
];

const defaultProps: Partial<
    Omit<SidebarProps, 'isCollapsed' | 'onThemeToggle'>
> = {
    logo: {
        src: '/images/bi-blue-logo.svg',
        alt: 'Company Logo',
        collapsedSrc: '/images/changed-logo.svg',
    },
    appDownload: {
        enabled: true,
        title: 'Download our Mobile App',
        subtitle: 'Get easy in another way',
        buttonText: 'Download App',
        backgroundImage: '/images/download-app.svg',
        downloadUrl: 'https://your-app-download-url.com',
        logo: {
            src: '/images/changed-logo.svg',
            alt: 'App Logo',
        },
    },
    footer: {
        copyright: '© 2025 Bestinfra Pvt. Ltd.',
        showThemeToggle: true,
        showShareButton: true,
    },
    onLogout: () => {
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach((cookieName) => {
            Cookies.remove(cookieName);
        });

        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/auth/logout';
    },
};

const Sidebar = ({
    currentPath,
    onNavigate,
    menus = defaultMenus,
    logo = defaultProps.logo,
    className = '',
    onLogout = defaultProps.onLogout,
}: Omit<SidebarProps, 'isCollapsed' | 'onThemeToggle'>) => {
    const { isDarkMode, isSidebarCollapsed } = useApp();
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
        {}
    );
    
    // Use currentPath prop if provided, otherwise fallback to useLocation for standalone usage
    let pathname = currentPath;
    try {
        const location = useLocation();
        if (!pathname) pathname = location.pathname;
    } catch (error) {
        // useLocation failed, use currentPath or default to '/'
        pathname = currentPath || '/';
    }

    const toggleSubmenu = (menuTitle: string) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuTitle]: !prev[menuTitle],
        }));
    };

    return (
        <div
            className={`transition-[width] duration-300 ease-in-out ${
                isSidebarCollapsed ? 'w-20' : 'w-72'
            }`}>
            <nav
                className={`h-screen flex flex-col justify-between items-center w-full bg-background-secondary dark:bg-primary-dark-light border-r border-r-primary-border relative dark:border-dark-border transition-[width] duration-300 ease-in-out ${
                    isSidebarCollapsed ? 'w-20' : 'w-72'
                } ${className}`}
                aria-label="Main navigation">
                <div className="flex flex-col w-full h-fit overflow-hidden overflow-y-auto scrollbar-hide">
                    <header
                        className={` dark:bg-primary-dark flex justify-center border-b border-b-primary-border dark:border-dark-border items-center ${
                            isSidebarCollapsed
                                ? 'bg-primary px-4'
                                : 'bg-white px-10'
                        } py-6`}>
                        <img
                            src={
                                isSidebarCollapsed
                                    ? (isDarkMode
                                        ? '/images/bi-white-logo.svg'
                                        : logo?.collapsedSrc || logo?.src)
                                    : (isDarkMode
                                        ? '/images/bi-white-logo.svg'
                                        : logo?.src)
                            }
                            alt={logo?.alt}
                            className={`md:block ${
                                isSidebarCollapsed ? 'w-8' : 'w-[170px]'
                            }`}
                        />
                    </header>
                    <main className="flex p-4 flex-col w-full md:block dark:bg-primary-dark-light">
                        {menus.map((category, categoryIndex) => (
                            <section
                                key={categoryIndex}
                                className="flex flex-col w-full"
                                aria-label={category.category}>
                                {!isSidebarCollapsed && (
                                    <h2 className="px-4 py-2 text-sm font-semibold uppercase text-neutral-dark  dark:text-white">
                                        {category.category}
                                    </h2>
                                )}
                                <ul className="list-none p-0 m-0 gap-2 flex flex-col">
                                    {category.items.map(
                                        (menuItem, itemIndex) => (
                                            <li key={itemIndex}>
                                                {menuItem.hasSubmenu ? (
                                                    <div className="relative w-full">
                                                        <button
                                                            onClick={() =>
                                                                toggleSubmenu(
                                                                    menuItem.title
                                                                )
                                                            }
                                                            className={`flex items-center gap-4 py-3 px-4 mb-1 text-sm cursor-pointer rounded-lg font-semibold w-full text-left ${
                                                                pathname ===
                                                                menuItem.link
                                                                    ? 'text-secondary bg-white dark:bg-brand-blue dark:text-white custom-shadow'
                                                                    : 'text-main hover:bg-white hover:text-secondary dark:text-white dark:hover:bg-primary-dark-light  dark:hover:text-white'
                                                            }`}
                                                            aria-expanded={
                                                                expandedMenus[
                                                                    menuItem
                                                                        .title
                                                                ]
                                                            }
                                                            aria-controls={`submenu-${menuItem.title}`}>
                                                            <span className="w-6 h-6 flex items-center justify-center">
                                                                <img
                                                                    src={
                                                                        menuItem.icon
                                                                    }
                                                                    alt=""
                                                                    className={`w-6 h-6 icon-dark-filter transition-all duration-200 ${
                                                                        pathname ===
                                                                        menuItem.link
                                                                            ? 'icon-filter'
                                                                            : 'group-hover:icon-filter'
                                                                    }`}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                            {!isSidebarCollapsed && (
                                                                <div className="flex items-center justify-between w-full gap-2">
                                                                    <span>
                                                                        {
                                                                            menuItem.title
                                                                        }
                                                                    </span>
                                                                    <span
                                                                        className={`transition-transform ${
                                                                            expandedMenus[
                                                                                menuItem
                                                                                    .title
                                                                            ]
                                                                                ? 'rotate-180'
                                                                                : ''
                                                                        }`}>
                                                                        <img
                                                                            src="/icons/arrow-down.svg"
                                                                            alt=""
                                                                            className="w-3 h-3"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </button>
                                                        {!isSidebarCollapsed && (
                                                            <ul
                                                                id={`submenu-${menuItem.title}`}
                                                                className={`relative flex flex-col overflow-hidden transition-all duration-300 ease-in-out pl-0 ${
                                                                    expandedMenus[
                                                                        menuItem.title
                                                                    ]
                                                                        ? 'max-h-[500px] opacity-100'
                                                                        : 'max-h-0 opacity-0'
                                                                }`}>
                                                                {/* Vertical line for submenu */}
                                                                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></span>
                                                                {menuItem.submenu?.map(
                                                                    (
                                                                        subItem,
                                                                        subIndex
                                                                    ) => (
                                                                        <li key={subIndex} className="relative">
                                                                            {/* Horizontal line for each submenu item */}
                                                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-gray-200"></span>
                                                                            <button
                                                                                onClick={() => subItem.link && onNavigate?.(subItem.link)}
                                                                                className={`block pl-8 pr-4 py-2 rounded-lg font-semibold transition-all duration-200 w-full text-left ${
                                                                                    pathname === subItem.link
                                                                                        ? 'bg-[linear-gradient(to_right,transparent_0_30%,white_30%_100%)] text-primary shadow'
                                                                                        : 'text-gray-400 hover:text-primary'
                                                                                }`}
                                                                            >
                                                                                {subItem.title}
                                                                            </button>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                menuItem.title ===
                                                                    'Logout' &&
                                                                onLogout
                                                            ) {
                                                                onLogout();
                                                            } else if (menuItem.link) {
                                                                onNavigate?.(menuItem.link);
                                                            }
                                                        }}
                                                        className={`flex items-center gap-4 py-3 px-4  text-sm cursor-pointer group rounded-lg w-full text-left ${
                                                            pathname ===
                                                            menuItem.link
                                                                ? 'text-primary bg-white dark:bg-primary dark:text-white custom-shadow'
                                                                : 'text-main hover:bg-white hover:text-primary dark:text-white dark:hover:bg-primary-dark-light dark:hover:text-white'
                                                        }`}>
                                                        <span className="w-6 h-6 flex items-center justify-center">
                                                            <img
                                                                src={
                                                                    menuItem.icon
                                                                }
                                                                alt=""
                                                                className={`w-6 h-6 icon-dark-filter transition-all duration-200 ${
                                                                    pathname ===
                                                                    menuItem.link
                                                                        ? 'icon-filter'
                                                                        : ''
                                                                }`}
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                        {!isSidebarCollapsed && (
                                                            <div className="flex items-center justify-between w-full gap-2 font-semibold">
                                                                <span>
                                                                    {
                                                                        menuItem.title
                                                                    }
                                                                </span>
                                                                {menuItem.count && (
                                                                    <span
                                                                        className={`w-7 h-7 rounded-full text-xs text-white font-bold flex justify-center group-hover:bg-brand items-center ${
                                                                            pathname ===
                                                                            menuItem.link
                                                                                ? 'bg-primary dark:bg-secondary'
                                                                                : 'bg-primary dark:bg-secondary'
                                                                        }`}>
                                                                        {
                                                                            menuItem.count
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </button>
                                                )}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </section>
                        ))}
                    </main>
                </div>
                {/* <footer className="flex flex-col w-full justify-between gap-5 h-fit p-4 dark:bg-primary-dark-light">
                    {!isSidebarCollapsed ? (
                        <>
                            {appDownload?.enabled && (
                                <section className="rounded-lg bg-[url('/images/download-app.svg')] bg-cover bg-center flex flex-col items-center justify-center p-6 gap-4">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="w-10 h-10 bg-primary rounded-full transition-all duration-300 flex justify-center items-center">
                                            <img
                                                src={appDownload.logo.src}
                                                alt={appDownload.logo.alt}
                                                className="w-5 h-5"
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <span className="bg-secondary text-white text-xs font-medium rounded-lg px-2 py-1">
                                            New
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-white text-2xl font-bold">
                                            {appDownload.title}
                                        </h3>
                                        <p className="text-white text-sm font-semibold">
                                            {""}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            label={appDownload.buttonText}
                                            variant="primary"
                                            onClick={() => {
                                                window.open(
                                                    appDownload.downloadUrl,
                                                    '_blank'
                                                );
                                            }}
                                        />
                                        {footer?.showShareButton && (
                                            <button
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-full p-2 cursor-pointer transition-colors duration-300 hover:bg-primary-lightest"
                                                aria-label="Share app"
                                                onClick={onShareClick}>
                                                <img
                                                    src="/icons/share.svg"
                                                    alt=""
                                                    className="w-5 h-5 filter"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        )}
                                    </div>
                                </section>
                            )}
                            <div className="flex items-center justify-between w-full">
                                <p className="text-xs text-light dark:text-subinfo">
                                    {footer?.copyright}
                                </p>

                                {footer?.showThemeToggle && (
                                    <button
                                        className="w-10 h-10 border border-primary-border dark:border-dark-border rounded-full flex justify-center items-center cursor-pointer"
                                        aria-label="Toggle dark mode"
                                        onClick={toggleTheme}>
                                        <img
                                            className="w-5 h-5"
                                            src={`${
                                                isDarkMode
                                                    ? '/icons/sun.svg'
                                                    : '/icons/moon.svg'
                                            }`}
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-4 gap-4 w-full">
                            <span className="w-10 h-10 bg-transparent p-2 rounded-full">
                                <img
                                    src="/icons/andriod-app.svg"
                                    alt=""
                                    className="filter"
                                    aria-hidden="true"
                                />
                            </span>
                            {footer?.showThemeToggle && (
                                <button
                                    className="w-10 h-10 border border-light-border dark:border-dark-border rounded-full flex justify-center items-center cursor-pointer"
                                    aria-label="Toggle dark mode"
                                    onClick={toggleTheme}>
                                    <img
                                        className="w-5 h-5"
                                        src={`${
                                            isDarkMode
                                                ? '/icons/sun.svg'
                                                : '/icons/moon.svg'
                                        }`}
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </button>
                            )}
                        </div>
                    )}
                </footer> */}
            </nav>
        </div>
    );
};

export default Sidebar;

import React from 'react';
import type { ReactNode } from 'react';

export type LayoutType = 'single-column' | 'two-column' | 'grid';

export interface Section {
    id: string;
    component: ReactNode;
}

export interface PageProps {
    layout: LayoutType;
    sections: Section[];
    className?: string;
    // Additional component props
    header?: ReactNode;
    footer?: ReactNode;
    sidebar?: ReactNode;
    sidebarPosition?: 'left' | 'right';
    navigation?: ReactNode;
    breadcrumbs?: ReactNode;
    actions?: ReactNode;
    loading?: boolean;
    error?: ReactNode;
    emptyState?: ReactNode;
    // Layout customization
    containerClassName?: string;
    sectionClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
    sidebarClassName?: string;
}

const Page: React.FC<PageProps> = ({ 
    layout, 
    sections, 
    className = '',
    header,
    footer,
    sidebar,
    sidebarPosition = 'left',
    navigation,
    breadcrumbs,
    actions,
    loading = false,
    error,
    emptyState,
    containerClassName = '',
    sectionClassName = '',
    headerClassName = 'mb-6',
    footerClassName = 'mt-6',
    sidebarClassName = ''
}) => {
    const getLayoutClasses = (): string => {
        switch (layout) {
            case 'single-column':
                return 'flex flex-col gap-2';
            case 'two-column':
                return 'grid grid-cols-1 md:grid-cols-2 gap-4';
            case 'grid':
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
            default:
                return 'flex flex-col gap-4';
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (error) {
            return error;
        }

        if (sections.length === 0 && emptyState) {
            return emptyState;
        }

        return (
            <div className={`${getLayoutClasses()} ${containerClassName}`}>
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={sectionClassName}
                    >
                        {section.component}
                    </div>
                ))}
            </div>
        );
    };

    const renderWithSidebar = () => {
        if (!sidebar) {
            return renderContent();
        }

        const sidebarElement = (
            <div className={`${sidebarClassName} flex-shrink-0`}>
                {sidebar}
            </div>
        );

        return (
            <div className="flex flex-row gap-4 w-full">
                {sidebarPosition === 'left' && sidebarElement}
                <div className="flex-1">
                    {renderContent()}
                </div>
                {sidebarPosition === 'right' && sidebarElement}
            </div>
        );
    };

    return (
        <div className={`${className}`}>
            {/* Navigation */}
            {navigation && (
                <div className="mb-4">
                    {navigation}
                </div>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs && (
                <div className="mb-4">
                    {breadcrumbs}
                </div>
            )}

            {/* Header */}
            {header && (
                <div className={headerClassName}>
                    {header}
                </div>
            )}

            {/* Actions */}
            {actions && (
                <div className="mb-4 flex justify-end">
                    {actions}
                </div>
            )}

            {/* Main Content */}
            {renderWithSidebar()}

            {/* Footer */}
            {footer && (
                <div className={footerClassName}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Page; 
import Button from './Button';
import Card from './Card';

// Reusable Header Component
export const createHeaderComponent = (title: string, subtitle: string, metadata?: string) => (
    <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        {metadata && (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{metadata}</span>
            </div>
        )}
    </div>
);

// Reusable Actions Component
export const createActionsComponent = (actions: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning';
}>) => (
    <div className="flex items-center gap-2">
        {actions.map((action, index) => (
            <Button
                key={index}
                label={action.label}
                onClick={action.onClick}
                variant={action.variant || 'outline'}
            />
        ))}
    </div>
);

// Reusable Sidebar Stats Component
export const createSidebarStatsComponent = (stats: Array<{
    title: string;
    value: string;
    subtitle1: string;
    subtitle2: string;
    comparisonValue: number;
}>) => (
    <div className="space-y-4">
        {stats.map((stat, index) => (
            <Card
                key={index}
                title={stat.title}
                value={stat.value}
                icon="icons/units.svg"
                showTrend={true}
                comparisonValue={stat.comparisonValue}
                subtitle1={stat.subtitle1}
                subtitle2={stat.subtitle2}
            />
        ))}
    </div>
);

// Reusable Footer Component
export const createFooterComponent = (metadata: {
    id?: string;
    version?: string;
    supportLink?: string;
}) => (
    <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
                {metadata.id && <span>{metadata.id}</span>}
                {metadata.id && metadata.version && <span>•</span>}
                {metadata.version && <span>Version: {metadata.version}</span>}
            </div>
            {metadata.supportLink && (
                <div className="flex items-center gap-2">
                    <span>Need help?</span>
                    <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
                </div>
            )}
        </div>
    </div>
);

// Reusable Overview Cards Component
export const createOverviewCardsComponent = (cards: Array<{
    title: string;
    value: string;
    subtitle1: string;
    subtitle2: string;
    comparisonValue: number;
}>) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon="icons/units.svg"
                    showTrend={true}
                    comparisonValue={card.comparisonValue}
                    subtitle1={card.subtitle1}
                    subtitle2={card.subtitle2}
                />
            ))}
        </div>
    </div>
);

// Predefined action sets for common use cases
export const commonActions = {
    profile: [
        { label: 'Export Profile', onClick: () => console.log('Exporting profile...'), variant: 'outline' as const },
        { label: 'Share', onClick: () => console.log('Sharing profile...'), variant: 'outline' as const },
        { label: 'Print', onClick: () => console.log('Printing profile...'), variant: 'outline' as const }
    ],
    tickets: [
        { label: 'Create New Ticket', onClick: () => console.log('Creating new ticket...'), variant: 'primary' as const },
        { label: 'Export Tickets', onClick: () => console.log('Exporting tickets...'), variant: 'outline' as const },
        { label: 'Bulk Actions', onClick: () => console.log('Bulk actions...'), variant: 'outline' as const }
    ],
    reports: [
        { label: 'Generate Report', onClick: () => console.log('Generating report...'), variant: 'primary' as const },
        { label: 'Export Data', onClick: () => console.log('Exporting data...'), variant: 'outline' as const },
        { label: 'Schedule Report', onClick: () => console.log('Scheduling report...'), variant: 'outline' as const }
    ]
};

// Predefined header sets for common use cases
export const commonHeaders = {
    profile: {
        title: 'Profile',
        subtitle: 'Manage your account settings and preferences',
        metadata: 'Last updated: 2 hours ago'
    },
    tickets: {
        title: 'All Tickets',
        subtitle: 'Manage and track all support tickets',
        metadata: 'Total: 24 tickets'
    },
    reports: {
        title: 'Reports',
        subtitle: 'Generate and view detailed reports',
        metadata: 'Last generated: 1 hour ago'
    }
}; 
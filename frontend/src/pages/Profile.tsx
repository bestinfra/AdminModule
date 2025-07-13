import React, { useState } from 'react';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import Button from '../components/global/Button';
import Card from '../components/global/Card';
import Table from '../components/global/Table';
import Holder from '../components/global/Holder';
import type { Column } from '../components/global/Table';
import { 
    createHeaderComponent, 
    createActionsComponent, 
    createSidebarStatsComponent,
    createFooterComponent,
    commonActions,
    commonHeaders
} from '../components/global/PageComponents';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    role: string;
    department: string;
    avatar: string;
    bio: string;
}

interface ActivityData {
    id: number;
    action: string;
    time: string;
    type: string;
    status: string;
    [key: string]: string | number | boolean | null | undefined;
}

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState('Daily');
    
    const profile: UserProfile = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        role: 'Senior Developer',
        department: 'Engineering',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Experienced software developer with expertise in React, TypeScript, and modern web technologies.'
    };

    // Activity data for table
    const activityData: ActivityData[] = [
        { id: 1, action: 'Updated profile information', time: '2 hours ago', type: 'profile', status: 'Completed' },
        { id: 2, action: 'Changed password', time: '1 day ago', type: 'security', status: 'Completed' },
        { id: 3, action: 'Logged in from new device', time: '3 days ago', type: 'login', status: 'Completed' },
        { id: 4, action: 'Updated notification preferences', time: '1 week ago', type: 'settings', status: 'Completed' }
    ];

    const activityColumns: Column[] = [
        { key: 'action', label: 'Action' },
        { key: 'time', label: 'Time' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' }
    ];

    // Using reusable components
    const headerComponent = createHeaderComponent(
        commonHeaders.profile.title,
        commonHeaders.profile.subtitle,
        commonHeaders.profile.metadata
    );

    const actionsComponent = createActionsComponent(commonActions.profile);

    const sidebarComponent = createSidebarStatsComponent([
        {
            title: 'Profile Stats',
            value: '24',
            subtitle1: 'Tickets Created',
            subtitle2: '+12% from last month',
            comparisonValue: 12
        },
        {
            title: 'Response Time',
            value: '2.3h',
            subtitle1: 'Average',
            subtitle2: '-0.5h from last week',
            comparisonValue: -0.5
        },
        {
            title: 'Resolution Rate',
            value: '85%',
            subtitle1: 'This month',
            subtitle2: '+5% from last month',
            comparisonValue: 5
        }
    ]);

    const footerComponent = createFooterComponent({
        id: `Profile ID: PRO-${profile.firstName.toUpperCase()}-001`,
        version: '2.1.0',
        supportLink: '#'
    });

    // Personal Info Section using existing components
    const personalInfoSection: Section = {
        id: 'personal-info',
        component: (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                    <Button
                        label={isEditing ? "Save" : "Edit"}
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "success" : "primary"}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                        title="Full Name"
                        value={`${profile.firstName} ${profile.lastName}`}
                        icon="icons/units.svg"
                        subtitle1="Display Name"
                        subtitle2="As shown to others"
                    />
                    <Card
                        title="Email"
                        value={profile.email}
                        icon="icons/units.svg"
                        subtitle1="Primary Email"
                        subtitle2="Used for notifications"
                    />
                    <Card
                        title="Phone"
                        value={profile.phone}
                        icon="icons/units.svg"
                        subtitle1="Contact Number"
                        subtitle2="For urgent communications"
                    />
                    <Card
                        title="Location"
                        value={profile.location}
                        icon="icons/units.svg"
                        subtitle1="Current Location"
                        subtitle2="For timezone settings"
                    />
                </div>
            </div>
        )
    };

    // Activity Section using existing Table component
    const activitySection: Section = {
        id: 'activity',
        component: (
            <Holder
                title="Recent Activity"
                DateRange="(Last 30 days)"
                availableTimeRanges={['Daily', 'Weekly', 'Monthly']}
                selectedTimeRange={selectedTimeRange}
                handleTimeRangeChange={setSelectedTimeRange}
                handleDownload={() => console.log('Downloading activity...')}
                loading={loading}
            >
                <Table
                    data={activityData}
                    columns={activityColumns}
                    loading={loading}
                    searchable={true}
                    pagination={true}
                    showActions={true}
                    onEdit={(row) => console.log('Edit activity:', row)}
                    onDelete={(row) => console.log('Delete activity:', row)}
                    onView={(row) => console.log('View activity:', row)}
                />
            </Holder>
        )
    };

    // Settings Section using existing Card components
    const settingsSection: Section = {
        id: 'settings',
        component: (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card
                        title="Email Notifications"
                        value="Enabled"
                        icon="icons/units.svg"
                        subtitle1="Receive updates"
                        subtitle2="About your account"
                    />
                    <Card
                        title="Two-Factor Auth"
                        value="Disabled"
                        icon="icons/units.svg"
                        subtitle1="Security feature"
                        subtitle2="Add extra protection"
                    />
                    <Card
                        title="Privacy Settings"
                        value="Public"
                        icon="icons/units.svg"
                        subtitle1="Profile visibility"
                        subtitle2="Who can see your profile"
                    />
                </div>
            </div>
        )
    };

    const sections: Section[] = [
        personalInfoSection,
        activitySection,
        settingsSection
    ];

    return (
        <Page 
            layout="single-column" 
            sections={sections}
            header={headerComponent}
            actions={actionsComponent}
            sidebar={sidebarComponent}
            sidebarPosition="right"
            footer={footerComponent}
            loading={loading}
            className="max-w-7xl mx-auto"
            containerClassName="space-y-6"
            sectionClassName="border rounded-lg bg-white shadow-sm"
        />
    );
};

export default Profile; 
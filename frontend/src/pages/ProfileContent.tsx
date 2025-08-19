import React, { useState } from 'react';
import BasicInformationTab from '@pages/BasicInformationTab';
import ChangePassword from '@pages/ChangePassword';
import ActivityLogTab from '@pages/ActivityLogTab';
import NotificationsTab from '@pages/NotificationTab';
import TwoStepVerificationTab from '@pages/TwoStepVerificationTab';
import AccountStatusTab from '@pages/AccountStatusTab';

interface User {
    name?: string;
    email?: string;
    phone?: string;
    role_title?: string;
    client_name?: string;
    last_active?: string;
    created_at?: string;
    USER_ID?: string;
    id?: number;
}

interface ProfileContentProps {
    section: 'basic-info' | 'change-password' | 'activities' | 'notifications' | 'two-step-verification' | 'account-status';
    data: {
        basicInfo?: User;
        activityLog?: any;
    };
    // className?: string;
}

function ProfileContent({ section, data }: ProfileContentProps) {
    // State for Basic Information tab
    const [basicInfoData, setBasicInfoData] = useState<User | null>(data.basicInfo || null);
    
    // Update basicInfoData when data.basicInfo changes
    React.useEffect(() => {
        if (data.basicInfo) {
            setBasicInfoData(data.basicInfo);
        }
    }, [data.basicInfo]);
    
    switch (section) {
        case "basic-info":
            return <BasicInformationTab user={basicInfoData} />;
        case "change-password":
            return <ChangePassword />;
        case "activities":
            return <ActivityLogTab user={basicInfoData} />;
        case "notifications":
            return <NotificationsTab />;
        case "two-step-verification":
            return <TwoStepVerificationTab user={basicInfoData} />;
        case "account-status":
            return <AccountStatusTab user={basicInfoData} />;
        default:
            return <div>Select a section</div>;
    }
}

export default ProfileContent; 
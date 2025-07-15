import { useState, useEffect, useRef } from 'react';
import Button from '../components/global/Button';

interface NotificationSetting {
    id: string;
    type: string;
    points: string[];
    email: boolean;
    browser: boolean;
    app: boolean;
}

const NotificationsTab = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [settings, setSettings] = useState<NotificationSetting[]>([]);
    const [dropdown, setDropdown] = useState('');
    const [hasOverflow, setHasOverflow] = useState(false);
    const notificationPointsRef = useRef<HTMLDivElement>(null);

    // Mock notification settings data
    const mockSettings: NotificationSetting[] = [
        {
            id: '1',
            type: 'Security Alerts',
            points: [
                'Login attempts from new devices',
                'Password changes',
                'Two-factor authentication setup',
                'Suspicious activity detection'
            ],
            email: true,
            browser: true,
            app: true
        },
        {
            id: '2',
            type: 'Account Updates',
            points: [
                'Profile information changes',
                'Email address updates',
                'Phone number changes',
                'Account settings modifications'
            ],
            email: true,
            browser: false,
            app: true
        },
        {
            id: '3',
            type: 'System Notifications',
            points: [
                'Maintenance schedules',
                'System updates',
                'Service announcements',
                'Feature releases'
            ],
            email: false,
            browser: true,
            app: true
        }
    ];

    const checkOverflow = () => {
        if (notificationPointsRef.current) {
            const element = notificationPointsRef.current;
            const hasOverflowContent = element.scrollHeight > element.clientHeight;
            setHasOverflow(hasOverflowContent);
        }
    };

    const fetchNotificationSettings = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setSettings(mockSettings);
        } catch (err: any) {
            console.error('Error fetching notification settings:', err);
            setError(
                'Failed to load notification settings. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    const saveNotificationSettings = async () => {
        try {
            setLoading(true);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Settings saved successfully');
            // You could add a success message here
        } catch (err: any) {
            console.error('Error saving notification settings:', err);
            setError('Failed to save settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotificationSettings();
    }, []);

    useEffect(() => {
        checkOverflow();
        // Check overflow when settings change
        const timer = setTimeout(checkOverflow, 100);
        return () => clearTimeout(timer);
    }, [settings, activeTab]);

    const handleCheckbox = (rowIdx: number, key: keyof NotificationSetting) => {
        setSettings((prev) =>
            prev.map((row, idx) =>
                idx === rowIdx ? { ...row, [key]: !row[key] } : row
            )
        );
    };

    const handleSave = () => {
        saveNotificationSettings();
    };

    if (loading && settings.length === 0) {
        return (
            <div className="bg-white rounded-lg ">
                <div className="color-text-secondary">
                    Loading notification settings...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg ">
                <div className="color-danger mb-4">
                    {error}
                </div>
                <Button
                    label="Retry"
                    variant="primary"
                    onClick={fetchNotificationSettings}
                />
            </div>
        );
    }

    if (!settings || settings.length === 0) {
        return (
            <div className="bg-white rounded-lg ">
                <div className="color-text-secondary">
                    No notification settings available.
                </div>
            </div>
        );
    }

    if (activeTab >= settings.length) {
        setActiveTab(0);
        return null;
    }

    return (
        <div className="bg-white rounded-lg ">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex bg-white border-b border-gray-200 overflow-x-auto">
                    {settings.map((setting, idx) => (
                        <div
                            key={setting.type}
                            className={`px-6 py-4 cursor-pointer font-medium whitespace-nowrap transition-all duration-300 ${
                                activeTab === idx 
                                    ? 'color-primary border-b-2 border-blue-500' 
                                    : 'color-text-secondary hover:color-primary'
                            }`}
                            onClick={() => setActiveTab(idx)}>
                            {setting.type}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-b-2xl">
                    <div 
                        ref={notificationPointsRef}
                        className={`list-disc pl-12 pr-4 py-5 flex flex-col gap-3 max-h-48 overflow-y-auto scrollbar-hide relative ${
                            hasOverflow ? 'has-overflow' : ''
                        }`}>
                        {hasOverflow && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded opacity-0 animate-pulse has-overflow:opacity-100"></div>
                        )}
                        {settings[activeTab]?.points?.map((point, idx) => (
                            <div key={idx} className="color-text-secondary text-sm leading-relaxed flex items-center gap-3">
                                <span className="color-primary font-bold">•</span>
                                {point}
                            </div>
                        ))}
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-left font-semibold color-text-primary border-b border-gray-200">Notification Type</th>
                                <th className="p-4 text-left font-semibold color-text-primary border-b border-gray-200">Email</th>
                                <th className="p-4 text-left font-semibold color-text-primary border-b border-gray-200">SMS</th>
                                <th className="p-4 text-left font-semibold color-text-primary border-b border-gray-200">App</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4 border-b border-gray-200">{settings[activeTab]?.type}</td>
                                <td className="p-4 border-b border-gray-200">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 cursor-pointer"
                                        checked={settings[activeTab]?.email || false}
                                        onChange={() => handleCheckbox(activeTab, 'email')}
                                    />
                                </td>
                                <td className="p-4 border-b border-gray-200">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 cursor-pointer"
                                        checked={settings[activeTab]?.browser || false}
                                        onChange={() => handleCheckbox(activeTab, 'browser')}
                                    />
                                </td>
                                <td className="p-4 border-b border-gray-200">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 cursor-pointer"
                                        checked={settings[activeTab]?.app || false}
                                        onChange={() => handleCheckbox(activeTab, 'app')}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <Button
                    label={loading ? 'Saving...' : 'Save Changes'}
                    variant="primary"
                    onClick={handleSave}
                    disabled={loading}
                />
                <Button
                    label="Cancel"
                    variant="outline"
                    onClick={() => {
                        // Reset to original settings
                        fetchNotificationSettings();
                    }}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default NotificationsTab;

import React, { useState, useEffect } from 'react';
import Button from '@components/global/Button';

interface User {
    USER_ID?: string;
    id?: number;
    email?: string;
}

interface PasswordTabProps {
    user: User | null;
}

interface PasswordChecks {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
    match: boolean;
}

const PasswordTab: React.FC<PasswordTabProps> = ({ user: _user }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordChecks, setPasswordChecks] = useState<PasswordChecks>({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
        match: false
    });

    useEffect(() => {
        // Update password validation checks
        setPasswordChecks({
            length: newPassword.length >= 8,
            lowercase: /[a-z]/.test(newPassword),
            uppercase: /[A-Z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
            match: newPassword === confirmPassword && newPassword !== ''
        });
    }, [newPassword, confirmPassword]);

    // const getStrength = () => {
    //     let score = 0;
    //     if (passwordChecks.length) score++;
    //     if (passwordChecks.lowercase) score++;
    //     if (passwordChecks.uppercase) score++;
    //     if (passwordChecks.number || passwordChecks.special) score++;
    //     return (score / 4) * 100;
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (!passwordChecks.match) {
                setError('Passwords do not match');
                setIsLoading(false);
                return;
            }

            // Check if all password requirements are met
            if (!Object.values(passwordChecks).every(check => check)) {
                setError('Please meet all password requirements');
                setIsLoading(false);
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccess('Password changed successfully!');
            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError('Failed to update password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderRequirementIcon = (isValid: boolean) => (
        <span className="font-bold">
            {isValid ? '✓' : '✗'}
        </span>
    );

    return (
        <div className="bg-white rounded-lg ">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="flex flex-col gap-2">
                            <input
                                type="password"
                                placeholder="Enter Current Password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                type="password"
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            {confirmPassword && (
                                <div className={`text-sm ${passwordChecks.match ? 'color-positive' : 'color-danger'}`}>
                                    {passwordChecks.match ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </div>
                            )}
                        </div>
                        {error && (
                            <div className="color-danger p-3 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}
                        {success && <div className="color-positive p-3 bg-green-50 rounded-lg">{success}</div>}
                        <div className="flex gap-4">
                            <Button 
                                label={isLoading ? "Updating..." : "Save Changes"}
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                type="submit"
                            />
                            <Button 
                                label="Cancel"
                                variant="outline"
                                onClick={() => {
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                    setError('');
                                    setSuccess('');
                                }}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="font-semibold color-text-primary mb-2">
                                Password requirements:
                            </div>
                            <div className="color-text-secondary text-sm mb-4">
                                Ensure that these requirements are met:
                            </div>
                            <ul className="space-y-2">
                                <li className={`flex items-center gap-2 ${passwordChecks.length ? 'color-positive' : 'color-danger'}`}>
                                    {renderRequirementIcon(passwordChecks.length)}
                                    <span className="font-semibold">Minimum 8 characters long</span> - the more, the better
                                </li>
                                <li className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'color-positive' : 'color-danger'}`}>
                                    {renderRequirementIcon(passwordChecks.lowercase)}
                                    At least one lowercase character
                                </li>
                                <li className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'color-positive' : 'color-danger'}`}>
                                    {renderRequirementIcon(passwordChecks.uppercase)}
                                    At least one uppercase character
                                </li>
                                <li className={`flex items-center gap-2 ${passwordChecks.number ? 'color-positive' : 'color-danger'}`}>
                                    {renderRequirementIcon(passwordChecks.number)}
                                    At least one number
                                </li>
                                <li className={`flex items-center gap-2 ${passwordChecks.special ? 'color-positive' : 'color-danger'}`}>
                                    {renderRequirementIcon(passwordChecks.special)}
                                    At least one special character
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PasswordTab;

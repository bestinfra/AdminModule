    import React, { useState } from 'react';
    import Button from '@components/global/Button';

    interface User {
        USER_ID?: string;
        id?: number;
        email?: string;
    }

    interface AccountStatusTabProps {
        user: User | null;
    }

    const AccountStatusTab: React.FC<AccountStatusTabProps> = ({ user: _user }) => {
        const [checked, setChecked] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [success, setSuccess] = useState<string | null>(null);

        const handleStatusUpdate = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setSuccess(null);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                setSuccess('Account Deleted successfully');
                setChecked(false);
            } catch (err: any) {
                setError('Failed to update account status. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="bg-white rounded-lg  border border-primary-border dark:border-dark-border p-6">
                <div className="flex flex-col gap-4">
                    <div className="text-lg font-semibold color-text-primary">Permanently Delete Your Account</div>
                    <div className="color-text-secondary leading-relaxed">
                        Deleting your account will revoke access to all Front services and permanently erase your personal data from our systems.<br />
                        This action is irreversible after 14 days.<br /><br />
                        By proceeding, you acknowledge that:<br />
                        • Your data will be permanently deleted after 14 days.<br />
                        • You will no longer have access to any services or saved information.<br />
                        • This action complies with our Terms & Conditions and Privacy Policy.
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={e => setChecked(e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <span className="color-text-primary">I understand and confirm that I want to permanently delete my account.</span>
                        </label>
                    </div>
                    {error && (
                        <div className="color-danger p-3 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && <div className="color-positive p-3 bg-green-50 rounded-lg">{success}</div>}
                    <div className="flex gap-4">
                        <Button 
                            label={isLoading ? "Updating..." : "Delete My Account"}
                            variant="danger"
                            onClick={handleStatusUpdate}
                            disabled={!checked || isLoading}
                        />
                        <Button 
                            label="Cancel"
                            variant="outline"
                            onClick={() => {
                                setChecked(false);
                                setError(null);
                                setSuccess(null);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    export default AccountStatusTab;

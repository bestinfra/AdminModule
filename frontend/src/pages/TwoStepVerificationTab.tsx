import React, { useState, useEffect } from 'react';
import Button from '@components/global/Button';

interface User {
    email?: string;
    USER_ID?: string;
    id?: number;
}

interface TwoStepVerificationTabProps {
    user: User | null;
}

const TwoStepVerificationTab: React.FC<TwoStepVerificationTabProps> = ({ user }) => {
    // const [phone, setPhone] = useState('');
    // const [code, setCode] = useState(['', '', '', '', '', '']);
    // const [step, setStep] = useState(1); // 1: enter phone, 2: enter code, 3: 2FA setup
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [show2FADisable, setShow2FADisable] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [totp, setTotp] = useState('');
    const [emailOTP, setEmailOTP] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState('');
    // const [emailVerified, setEmailVerified] = useState(false);

    // Mock user data if no user is provided
    const mockUser: User = {
        email: 'john.doe@company.com',
        USER_ID: '12345',
        id: 1
    };

    const displayUser = user || mockUser;

    // Check 2FA status when component mounts
    useEffect(() => {
        check2FAStatus();
    }, [displayUser?.email, displayUser?.USER_ID]);

    const check2FAStatus = async () => {
        try {
            setIsCheckingStatus(true);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mock 2FA status - disabled by default
            setIs2FAEnabled(false);
        } catch (error) {
            console.error('Error checking 2FA status:', error);
            setErrors({ status: 'Failed to check 2FA status' });
        } finally {
            setIsCheckingStatus(false);
        }
    };

    // const handleCodeChange = (idx: number, value: string) => {
    //     if (!/^[0-9]?$/.test(value)) return;
    //     const newCode = [...code];
    //     newCode[idx] = value;
    //     setCode(newCode);
    //     // Auto-focus next
    //     if (value && idx < 5) {
    //         const next = document.getElementById(`twoStepCode${idx + 1}`);
    //         if (next) next.focus();
    //     }
    // };

    const handleEmailOTPChange = (idx: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOTP = [...emailOTP];
        newOTP[idx] = value;
        setEmailOTP(newOTP);
        // Auto-focus next
        if (value && idx < 5) {
            const next = document.getElementById(`emailOTP${idx + 1}`);
            if (next) next.focus();
        }
    };

    const handleTOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setTotp(value);
        
        if (errors.totp) {
            setErrors((prev) => ({ ...prev, totp: '' }));
        }
    };

    const handle2FASetup = async () => {
        try {
            setIsLoading(true);
            setErrors({});
            setSuccess('');
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Show email verification UI
            setShowEmailVerification(true);
            
        } catch (error) {
            console.error('Error in handle2FASetup:', error);
            setErrors({ submit: 'Failed to send email verification. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailVerificationSubmit = async () => {
        try {
            setIsLoading(true);
            setErrors({});
            setSuccess('');

            const otpString = emailOTP.join('');
            if (!otpString || otpString.length !== 6) {
                setErrors({ submit: 'Please enter a valid 6-digit verification code' });
                setIsLoading(false);
                return;
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Email verified successfully, proceed to 2FA setup
            // setEmailVerified(true);
            setShowEmailVerification(false);
            setEmailOTP(['', '', '', '', '', '']);
            
            // Now proceed with 2FA setup
            await proceedWith2FASetup();
            
        } catch (error) {
            console.error('Error in email verification:', error);
            setErrors({ submit: 'Email verification failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const proceedWith2FASetup = async () => {
        try {
            setIsLoading(true);
            setErrors({});
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock QR code and secret
            setQrCodeUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1vY2sgUVIgQ29kZTwvdGV4dD48L3N2Zz4=');
            setSecretKey('JBSWY3DPEHPK3PXP');
            setShow2FASetup(true);
            
        } catch (error) {
            console.error('Error in proceedWith2FASetup:', error);
            setErrors({ submit: 'Failed to setup 2FA. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handle2FASubmit = async () => {
        setIsLoading(true);
        setErrors({});
        setSuccess('');

        if (!totp || totp.length !== 6) {
            setErrors({ submit: 'Please enter a valid 6-digit code from Google Authenticator' });
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 2FA setup successful
            setShow2FASetup(false);
            setTotp('');
            setQrCodeUrl('');
            setSecretKey('');
            // setEmailVerified(false);
            setSuccess('Two-Factor Authentication has been successfully enabled!');
            setIs2FAEnabled(true);
            
            // Refresh 2FA status
            await check2FAStatus();
        } catch (error) {
            setErrors({ submit: 'Verification failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handle2FADisable = async () => {
        setShow2FADisable(true);
        setErrors({});
        setSuccess('');
    };

    const handle2FADisableSubmit = async () => {
        setIsLoading(true);
        setErrors({});
        setSuccess('');

        if (!totp || totp.length !== 6) {
            setErrors({ submit: 'Please enter a valid 6-digit code from Google Authenticator' });
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 2FA disable successful
            setShow2FADisable(false);
            setTotp('');
            setSuccess('Two-Factor Authentication has been successfully disabled!');
            setIs2FAEnabled(false);
            
            // Refresh 2FA status
            await check2FAStatus();
        } catch (error) {
            setErrors({ submit: 'Disable failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Show Email Verification UI
    if (showEmailVerification) {
        return (
            <div className="bg-white rounded-lg ">
                <div className="flex flex-col gap-4">
                    {Object.entries(errors).map(
                        ([field, message]) =>
                            message && (
                                <div key={field} className="color-danger">
                                    {message}
                                </div>
                            )
                    )}
                    <div className="color-text-secondary">
                        <h3 className="text-lg font-semibold color-text-primary mb-2">Email Verification Required</h3>
                        <p>A verification code has been sent to your email address: <strong>{displayUser?.email}</strong></p>
                        <p>Please enter the 6-digit code to verify your email before setting up Two-Factor Authentication.</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                        {emailOTP.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`emailOTP${idx}`}
                                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleEmailOTPChange(idx, e.target.value)}
                                type="text"
                                inputMode="numeric"
                            />
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <Button
                            label={isLoading ? "Verifying..." : "Verify Email"}
                            variant="primary"
                            onClick={handleEmailVerificationSubmit}
                            disabled={isLoading}
                        />
                        <Button
                            label="Back"
                            variant="outline"
                            onClick={() => {
                                setShowEmailVerification(false);
                                setEmailOTP(['', '', '', '', '', '']);
                                setErrors({});
                            }}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Show 2FA Setup UI
    if (show2FASetup) {
        return (
            <div className="bg-white rounded-lg ">
                <div className="flex flex-col gap-4">
                    {Object.entries(errors).map(
                        ([field, message]) =>
                            message && (
                                <div key={field} className="color-danger">
                                    {message}
                                </div>
                            )
                    )}
                    <div className="color-text-secondary">
                        <h3 className="text-lg font-semibold color-text-primary mb-2">Setup Google Authenticator</h3>
                        <p>Email verified successfully! Now scan the QR code below with your Google Authenticator app</p>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <span className="font-semibold color-text-primary">QR Code Image Area:</span>
                        <img
                            src={qrCodeUrl}
                            alt="QR Code for Google Authenticator"
                            className="max-w-xs h-auto rounded-lg border border-gray-200"
                        />
                    </div>
                    {secretKey && (
                        <div className="flex flex-col gap-2 items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="font-semibold color-text-primary">Manual Entry Key:</span>
                            <span className="font-mono">{secretKey}</span>
                        </div>
                    )}
                    <div className="flex flex-col gap-4">
                        <ol className="text-left leading-relaxed pl-5 space-y-2">
                            <li>Download Google Authenticator from your app store</li>
                            <li>Open the app and tap the + button</li>
                            <li>Scan the QR code above or manually enter the key</li>
                            <li>Enter the 6-digit code from the app below</li>
                        </ol>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={totp}
                                onChange={handleTOTPChange}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className="text-center text-lg tracking-wider p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs mx-auto"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button
                                label={isLoading ? "Verifying..." : "Verify & Complete Setup"}
                                variant="primary"
                                onClick={handle2FASubmit}
                                disabled={isLoading}
                            />
                            <Button
                                label="Back"
                                variant="outline"
                                onClick={() => {
                                    setShow2FASetup(false);
                                    // setEmailVerified(false);
                                    setErrors({});
                                }}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show 2FA Disable UI
    if (show2FADisable) {
        return (
            <div className="bg-white rounded-lg ">
                <div className="flex flex-col gap-4">       
                    {Object.entries(errors).map(
                        ([field, message]) =>
                            message && (
                                <div key={field} className="color-danger">
                                    {message}
                                </div>
                            )
                    )}
                    <div className="color-text-secondary">
                        <h3 className="text-lg font-semibold color-text-primary mb-2">Disable Two-Factor Authentication</h3>
                        <p>Enter the 6-digit code from your Google Authenticator app to disable 2FA</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={totp}
                                onChange={handleTOTPChange}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className="text-center text-lg tracking-wider p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs mx-auto"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button
                                label={isLoading ? "Disabling..." : "Disable 2FA"}
                                variant="primary"
                                onClick={handle2FADisableSubmit}
                                disabled={isLoading}
                            />
                            <Button
                                label="Cancel"
                                variant="outline"
                                onClick={() => setShow2FADisable(false)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg ">
            <div className="flex flex-col gap-4">
                {Object.entries(errors).map(
                    ([field, message]) =>
                        message && (
                            <div key={field} className="color-danger">
                                {message}
                            </div>
                        )
                )}
                {success && (
                    <div className="color-positive">
                        {success}
                    </div>
                )}
                
                {/* 2FA Status and Action Button */}
                <div className="flex flex-col gap-8 items-center">
                    {isCheckingStatus ? (
                        <div className="color-text-secondary">
                            Checking 2FA status...
                        </div>
                    ) : (
                        <>
                            <div className="color-text-secondary text-center">
                                <strong className="color-text-primary">Two-Factor Authentication Status:</strong> {is2FAEnabled ? 'Enabled' : 'Disabled'}
                            </div>
                            <Button
                                label={isLoading 
                                    ? (is2FAEnabled ? "Disabling..." : "Setting up 2FA...") 
                                    : (is2FAEnabled ? "Disable Two-Factor Authentication" : "Setup Two-Factor Authentication")
                                }
                                variant={is2FAEnabled ? "outline" : "primary"}
                                onClick={is2FAEnabled ? handle2FADisable : handle2FASetup}
                                disabled={isLoading}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoStepVerificationTab;

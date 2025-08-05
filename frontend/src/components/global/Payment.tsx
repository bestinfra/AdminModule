import React from 'react';
import Button from './Button';
import Icon from './Icon';

interface PaymentDetails {
    amount: string;
    paymentMethod: string;
    paymentMethodIcon?: string;
}

interface PaymentProps {
    amount: string;
    billId?: string;
    billDate?: string;
    paymentDetails?: PaymentDetails;
    onPayNow?: () => void;
    onMarkAsPaid?: () => void;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    showPaymentDetails?: boolean;
    customPaymentDetails?: PaymentDetails;
}

const Payment: React.FC<PaymentProps> = ({
    amount,
    billId,
    billDate,
    paymentDetails,
    onPayNow,
    onMarkAsPaid,
    loading = false,
    disabled = false,
    className = '',
    showPaymentDetails = true,
    customPaymentDetails,
}) => {
    // Default payment details if not provided
    const defaultPaymentDetails: PaymentDetails = {
        amount,
        paymentMethod: 'Cash',
        paymentMethodIcon: '/icons/coins.svg',
    };

    const finalPaymentDetails = customPaymentDetails || paymentDetails || defaultPaymentDetails;

    // Format date if provided
    const formattedDate = billDate ? new Date(billDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) : '';

    return (
        <div className={`max-w-md mx-auto bg-white rounded-3xl shadow-lg p-6 flex flex-col gap-4 ${className}`}>
            {/* Header Section */}
            <div className="text-center flex flex-col gap-4">
                {/* Bill Icon */}
                <div className="flex justify-center">
                    <Icon 
                        src="/icons/document.svg" 
                        alt="Bill Icon" 
                        className="w-20 h-20 text-gray-800"
                    />
                </div>
                
                {/* Payable Amount */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900 font-manrope">Payable</h1>
                    <p className="text-sm text-gray-500 font-manrope">Amount</p>
                </div>
                
                {/* Main Amount */}
                <div className="flex flex-col gap-2">
                    <p className="text-4xl font-bold text-gray-900 font-manrope">₹{amount}</p>
                    <p className="text-sm text-gray-500 font-manrope">
                        {formattedDate && <span>{formattedDate}</span>}
                        {formattedDate && billId && <span className="mx-2">•</span>}
                        {billId && <span>Bill ID: #{billId}</span>}
                        August 5, 2025 • Bill ID: #BILL00123

                    </p>
                </div>
            </div>

            {/* Payment Details Card */}
            {showPaymentDetails && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 font-manrope pb-2">Payment Details</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 font-manrope">Amount to be paid</span>
                            <span
                                className="text-2xl font-bold text-primary font-manrope"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                ₹{finalPaymentDetails.amount}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 font-manrope">Payment method</span>
                            <div className="flex items-center gap-2">
                                {finalPaymentDetails.paymentMethodIcon && (
                                    <Icon 
                                        src={finalPaymentDetails.paymentMethodIcon} 
                                        alt="Payment Method Icon" 
                                        className="w-4 h-4"
                                    />
                                )}
                                <span className="text-sm font-semibold text-gray-900 font-manrope">
                                    {finalPaymentDetails.paymentMethod}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    label={loading ? 'Processing...' : 'Pay Now'}
                    variant="secondary"
                    onClick={onPayNow}
                    loading={loading}
                    disabled={disabled}
                    className="flex-1 hover:bg-transparent hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)] hover:border-2 transition-all duration-200"
                    style={{ 
                        backgroundColor: 'var(--color-secondary)', 
                        borderColor: 'var(--color-secondary)',
                    }}
                />
                <Button
                    label={loading ? 'Processing...' : 'Mark as paid'}
                    variant="secondary"
                    onClick={onMarkAsPaid}
                    loading={loading}
                    disabled={disabled}
                    className="flex-1 hover:bg-transparent hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)] hover:border-2 transition-all duration-200"
                    style={{ 
                        backgroundColor: 'var(--color-secondary)', 
                        borderColor: 'var(--color-secondary)',
                    }}
                />
            </div>
        </div>
    );
};

export default Payment;

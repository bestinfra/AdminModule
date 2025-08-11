import { useState } from 'react';
import Button from '../global/Button';
import Icon from '../global/Icon';

interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
}

interface PaymentProps {
  // onBack?: () => void;
  amount?: string;
  billId?: string;
  billDate?: string;
  onPaymentComplete?: (method: string) => void;
  onStepChange?: (step: number) => void;
  // loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Payment = ({
  // onBack,
  amount = '90.43',
  billId = 'BILL00123',
  billDate = 'August 6, 2025',
  onPaymentComplete,
  onStepChange,
  // loading = false,
  disabled = false,
  className = '',
}: PaymentProps) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'cash',
            name: 'Cash',
            icon: '/icons/coins.svg',
        },
        {
            id: 'razorpay',
            name: 'Razorpay',
            icon: '/icons/rupee.svg',
        },
    ];

    const handlePayNow = async () => {
        setIsProcessing(true);
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (onPaymentComplete) {
                onPaymentComplete(selectedPaymentMethod);
            } else if (onStepChange) {
                // Use step navigation if available
                onStepChange(4); // Navigate to FreezeStatus step
            }
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMarkAsPaid = async () => {
        setIsProcessing(true);
        try {
            // Simulate marking as paid
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (onPaymentComplete) {
                onPaymentComplete(selectedPaymentMethod);
            } else if (onStepChange) {
                // Use step navigation if available
                onStepChange(4); // Navigate to FreezeStatus step
            }
        } catch (error) {
            console.error('Mark as paid failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={`max-w-lg mx-auto bg-white rounded-3xl shadow-lg p-6 flex flex-col gap-6 ${className}`}>
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
                
                {/* Title */}
                <div className="flex flex-col gap-2 justify-center text-center">
                    <h1 className="text-2xl font-bold text-gray-900 font-manrope text-center">Final Bill Generated</h1>
                    <p className="text-gray-600 font-manrope text-center">Review payment details and process the final settlement</p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Amount Section */}
            <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 font-manrope text-center">Amount</p>
                <p className="text-4xl font-bold text-blue-600 font-manrope text-center">₹{amount}</p>
                <div className="flex justify-center gap-2 text-sm text-gray-500 font-manrope text-center">
                    <Icon src="/icons/calendar.svg" alt="Calendar" className="w-4 h-4" />
                    <span>{billDate}</span>
                    <span>•</span>
                    <span>Bill ID: #{billId}</span>
                </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <Icon src="/icons/document.svg" alt="Document" className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-bold text-gray-900 font-manrope">Payment Details</h3>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-manrope">Amount to be paid</span>
                        <span className="text-2xl font-bold text-blue-600 font-manrope">₹{amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-manrope">Payment method</span>
                        <div className="flex items-center gap-2">
                            <Icon 
                                src={paymentMethods.find(m => m.id === selectedPaymentMethod)?.icon || '/icons/coins.svg'} 
                                alt="Payment Method Icon" 
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-semibold text-gray-900 font-manrope">
                                {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'Cash'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Select Payment Method */}
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-900 font-manrope">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`p-4 rounded-2xl border-2 transition-all ${
                                selectedPaymentMethod === method.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Icon 
                                    src={method.icon} 
                                    alt={method.name} 
                                    className={`w-6 h-6 ${
                                        selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                                    }`}
                                />
                                <span className={`text-sm font-medium ${
                                    selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-700'
                                }`}>
                                    {method.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    label={isProcessing ? 'Processing...' : 'Pay Now'}
                    variant="primary"
                    onClick={handlePayNow}
                    loading={isProcessing}
                    disabled={disabled}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                />
                <Button
                    label={isProcessing ? 'Processing...' : 'Mark as Paid'}
                    variant="outline"
                    onClick={handleMarkAsPaid}
                    loading={isProcessing}
                    disabled={disabled}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                />
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center">
                Once payment is processed, the account will be marked as vacant and meter readings will be frozen.
            </p>
        </div>
    );
};

export default Payment;

import React from 'react';
import Button from '../global/Button';
import Icon from '../global/Icon';

interface FreezeStatusProps {
  // onBack?: () => void;
  title?: string;
  subtitle?: string;
  statusCards?: Array<{
    label: string;
    value: string;
    icon: string;
    valueColor?: string;
  }>;
  transactionSteps?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  onDone?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  showButtons?: boolean;
  customButtons?: React.ReactNode;
  completionDate?: string;
  whatHappensNext?: string[];
  downloadButtonLabel?: string;
  doneButtonLabel?: string;
  showTransactionSummary?: boolean;
  showWhatHappensNext?: boolean;
  electricity_usage?: string;
  final_reading?: string;
  final_amount?: string;
  // payment_method?: string;
}

const FreezeStatus = ({
  // onBack,
  title = 'Account Successfully Frozen',
  subtitle = 'The property has been marked as vacant and all billing has been finalized.',
  statusCards = [
    {
      label: 'Electricity Usage',
      value: '11.62 kWh',
      icon: '/icons/bolt.svg',
    },
    {
      label: 'Final Reading',
      value: '206.83 kWh',
      icon: '/icons/document.svg',
    },
    {
      label: 'Billing Status',
      value: 'Final Bill - Paid',
      icon: '/icons/check-circle.svg',
      valueColor: '#10B981',
    },
    {
      label: 'Final Amount',
      value: '₹90.43',
      icon: '/icons/coins.svg',
      valueColor: '#10B981',
    },
  ],
  transactionSteps = [
    {
      title: 'Meter readings frozen successfully',
      description: 'Final usage recorded and locked',
      icon: '/icons/check-circle.svg',
    },
    {
      title: 'Final bill generated and settled',
      description: 'Amount: ₹90.43',
      icon: '/icons/document.svg',
    },
    {
      title: 'Future billing disabled',
      description: 'No further charges will be generated',
      icon: '/icons/calendar.svg',
    },
  ],
  onDone,
  loading = false,
  disabled = false,
  className = '',
  showButtons = true,
  customButtons,
  completionDate = 'August 6, 2025 at 2:30 PM',
  whatHappensNext = [
    'Property is now marked as vacant in the system',
    'Meter readings are permanently frozen',
    'Receipt has been generated for your records',
    'You can reactivate this property when a new tenant moves in'
  ],
  downloadButtonLabel = 'Download Receipt',
  doneButtonLabel = 'Done',
  showTransactionSummary = true,
  showWhatHappensNext = true,
  electricity_usage,
  final_reading,
  final_amount,
  // payment_method,
}: FreezeStatusProps) => {
    // Use props data if available, otherwise use defaults
    const finalStatusCards = statusCards.map(card => {
        if (card.label === 'Electricity Usage' && electricity_usage) {
            return { ...card, value: `${electricity_usage} kWh` };
        }
        if (card.label === 'Final Reading' && final_reading) {
            return { ...card, value: `${final_reading} kWh` };
        }
        if (card.label === 'Final Amount' && final_amount) {
            return { ...card, value: `₹${final_amount}` };
        }
        return card;
    });

    const finalTransactionSteps = transactionSteps.map(step => {
        if (step.title === 'Final bill generated and settled' && final_amount) {
            return { ...step, description: `Amount: ₹${final_amount}` };
        }
        return step;
    });

    const handleDownloadReceipt = () => {
        // Handle download receipt functionality
        console.log('Downloading receipt...');
    };

    const handleDone = () => {
        if (onDone) {
            onDone();
        } else {
            // Default behavior - navigate to dashboard or home
            console.log('Occupancy process completed');
            // You can add navigation logic here
            // window.location.href = '/dashboard';
        }
    };

    return (
        <main className={`max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-8 ${className}`}>
            {/* Header Section with Success Checkmark */}
            <header className='flex flex-col justify-center items-center gap-4'>
                {/* Success Checkmark Circle */}
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 font-manrope mb-2">{title}</h1>
                    <p className="text-gray-600 font-manrope text-lg">{subtitle}</p>
                </div>

                {/* Completion Timestamp */}
                {completionDate && (
                    <div className="bg-green-50 px-4 py-2 rounded-full">
                        <span className="text-green-700 font-medium">Completed on {completionDate}</span>
                    </div>
                )}
            </header>

            {/* Status Cards Grid */}
            {finalStatusCards.length > 0 && (
                <section aria-label="Account status information">
                    <div className="grid grid-cols-2 gap-4">
                        {finalStatusCards.map((card, index) => (
                            <article
                                key={index}
                                className="bg-blue-50 rounded-2xl p-4 flex flex-col gap-3"
                            >
                                <header className="flex items-center gap-2">
                                    {card.icon && (
                                        <Icon 
                                            src={card.icon} 
                                            alt={`${card.label} Icon`} 
                                            className="w-5 h-5 text-gray-600"
                                        />
                                    )}
                                    <span className="text-sm text-gray-600 font-manrope">{card.label}</span>
                                </header>
                                <p 
                                    className="text-2xl font-bold text-gray-900 font-manrope"
                                    style={{ color: card.valueColor || 'var(--color-text-primary)' }}
                                >
                                    {card.value}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* Transaction Summary */}
            {showTransactionSummary && finalTransactionSteps.length > 0 && (
                <section aria-label="Transaction summary">
                    <h2 className="text-xl font-semibold text-gray-900 font-manrope mb-4">Transaction Summary</h2>
                    <div className="space-y-4">
                        {finalTransactionSteps.map((step, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 font-manrope">{step.title}</p>
                                    <p className="text-sm text-gray-600 font-manrope">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Action Buttons */}
            {showButtons && (
                <footer className="flex gap-3">
                    {customButtons ? (
                        customButtons
                    ) : (
                        <>
                            <Button
                                label={loading ? 'Processing...' : downloadButtonLabel}
                                variant="primary"
                                onClick={handleDownloadReceipt}
                                loading={loading}
                                disabled={disabled}
                                className='w-full'
                            />
                            <Button
                                label={doneButtonLabel}
                                variant="secondary"
                                onClick={handleDone}
                                loading={loading}
                                disabled={disabled}
                                className='w-full'
                            />
                        </>
                    )}
                </footer>
            )}

            {/* What happens next section */}
            {showWhatHappensNext && whatHappensNext.length > 0 && (
                <section aria-label="What happens next">
                    <h2 className="text-xl font-semibold text-gray-900 font-manrope mb-4">What happens next?</h2>
                    <ul className="space-y-2">
                        {whatHappensNext.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-gray-700 font-manrope">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
};

export default FreezeStatus;

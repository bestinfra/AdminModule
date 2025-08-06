import React from 'react';
import Button from './Button';
import Icon from './Icon';

interface StatusCard {
    label: string;
    value: string;
    icon?: string;
    valueColor?: string;
    valueStyle?: React.CSSProperties;
}

interface FreezeStatusProps {
    title?: string;
    statusCards?: StatusCard[];
    onDownloadReceipt?: () => void;
    onDone?: () => void;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    showButtons?: boolean;
    customButtons?: React.ReactNode;
}

const FreezeStatus: React.FC<FreezeStatusProps> = ({
    title = 'Account Freeze Status',
    statusCards,
    onDownloadReceipt,
    onDone,
    loading = false,
    disabled = false,
    className = '',
    showButtons = true,
    customButtons,
}) => {
    // Default status cards if not provided
    const defaultStatusCards: StatusCard[] = [
        {
            label: 'Electricity Usage',
            value: '9.34 kWh',
            icon: '/icons/energy.svg',
        },
        {
            label: 'Final Reading',
            value: '204.55 kWh',
            icon: '/icons/meter.svg',
        },
        {
            label: 'Billing Status',
            value: 'Final Bill – Paid',
            icon: '/icons/check-circle.svg',
            valueColor: 'var(--color-warning)',
        },
        {
            label: 'Final Amount',
            value: '₹72.68',
            icon: '/icons/coins.svg',
            valueColor: 'var(--color-primary)',
        },
    ];

    const finalStatusCards = statusCards || defaultStatusCards;

    return (
        <main className={`max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-6 flex flex-col gap-6 ${className}`}>
            {/* Header Section */}
            <header className='flex flex-col justify-center items-center gap-2'>
                <h1 className="text-2xl font-semibold text-primary font-manrope">{title}</h1>
                <p className="text-gray-600 font-manrope mt-2">Your electricity account has been successfully processed and frozen</p>
            </header>

            {/* Status Cards Grid */}
            <section aria-label="Account status information">
                <div className="grid grid-cols-2 gap-4">
                    {finalStatusCards.map((card, index) => (
                        <article
                            key={index}
                            className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2"
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
                                className="text-xl font-bold text-gray-900 font-manrope"
                                style={card.valueStyle || { color: card.valueColor || 'var(--color-text-primary)' }}
                            >
                                {card.value}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Action Buttons */}
            {showButtons && (
                <footer className="flex flex-row gap-3">
                    {customButtons ? (
                        customButtons
                    ) : (
                        <>
                            <Button
                                label={loading ? 'Processing...' : 'Download Receipt'}
                                variant="primary"
                                onClick={onDownloadReceipt}
                                loading={loading}
                                disabled={disabled}
                                className='w-full'
                            />
                            <Button
                                label="Done"
                                variant="secondary"
                                onClick={onDone}
                                loading={loading}
                                disabled={disabled}
                                 className='w-full'
                              
                            />
                        </>
                    )}
                </footer>
            )}
        </main>
    );
};

export default FreezeStatus;

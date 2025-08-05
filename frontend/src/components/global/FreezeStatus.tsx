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
        <div className={`max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-6 flex flex-col gap-6 ${className}`}>
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-semibold text-primary font-manrope">{title}</h1>
            </div>

            {/* Status Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
                {finalStatusCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2"
                    >
                        <div className="flex items-center gap-2">
                            {card.icon && (
                                <Icon 
                                    src={card.icon} 
                                    alt={`${card.label} Icon`} 
                                    className="w-5 h-5 text-gray-600"
                                />
                            )}
                            <span className="text-sm text-gray-600 font-manrope">{card.label}</span>
                        </div>
                        <span 
                            className="text-xl font-bold text-gray-900 font-manrope"
                            style={card.valueStyle || { color: card.valueColor || 'var(--color-text-primary)' }}
                        >
                            {card.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            {showButtons && (
                <div className="flex flex-col gap-3">
                    {customButtons ? (
                        customButtons
                    ) : (
                        <>
                            <Button
                                label={loading ? 'Processing...' : 'Download Receipt'}
                                variant="success"
                                onClick={onDownloadReceipt}
                                loading={loading}
                                disabled={disabled}
                                className="w-full hover:bg-transparent hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)] hover:border-2 transition-all duration-200"
                                style={{ 
                                    backgroundColor: 'var(--color-secondary)', 
                                    borderColor: 'var(--color-secondary)',
                                    color: 'white',
                                }}
                            />
                            <Button
                                label="Done"
                                variant="success"
                                onClick={onDone}
                                loading={loading}
                                disabled={disabled}
                                className="w-full hover:bg-transparent hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)] hover:border-2 transition-all duration-200"
                                style={{ 
                                    backgroundColor: 'var(--color-secondary)', 
                                    borderColor: 'var(--color-secondary)',
                                    color: 'white',
                                }}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FreezeStatus;

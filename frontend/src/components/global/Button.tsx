import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'primarysmall' | 'success' | 'danger' | 'warning' | 'test' | 'asset';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    children?: React.ReactNode;
    icon?: React.ReactNode;
}

// Memoize the component for better performance
const Button = React.memo<ButtonProps>(({
    label,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'primary',
    size = 'medium',
    loading = false,
    className = '',
    children,
    icon,
    ...props
}) => {
    // Base button classes
    const baseClasses = [
        'font-manrope',
        'whitespace-nowrap',
        'text-base',
        'font-bold',
        'px-8',
        'rounded-[2.5rem]',
        'cursor-pointer',
        'transition-all',
        'duration-300',
        'ease-in-out',
        'flex',
        'justify-center',
        'items-center',
        'gap-[0.6rem]',
        'h-[2.917rem]',
        'border-2',
        'w-fit',
        'border-[var(--brand-green)]',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
    ];

    // Size classes
    const sizeClasses = {
        small: [
            'h-8',
            'px-4',
            'text-sm',
            'font-semibold',
            'rounded-[1.5rem]',
        ],
        medium: [],
        large: [],
    };

    // Variant classes
    const variantClasses = {
        primary: [
            'bg-[var(--color-secondary)]',
            'text-white',
            'border-[var(--color-secondary)]',
            'hover:bg-white',
            'hover:text-[var(--color-secondary)]',
            'hover:border-[var(--color-secondary)]',
        ],
        secondary: [
            'bg-[var(--color-primary)]',
            'text-white',
            'border-[var(--color-primary)]',
            'hover:bg-white',
            'hover:text-[var(--color-primary)]',
            'hover:border-[var(--color-primary)]',
        ],
        outline: [
            'bg-[var(--brand-blue)]',
            'text-[var(--white)]',
            'border-[var(--brand-blue)]',
            'hover:bg-[var(--brand-blue)]',
            'hover:text-[var(--white)]',
            'hover:border-[var(--brand-blue)]',
        ],
        primarysmall: [
            'bg-[var(--blue-bright)]',
            'text-[var(--white)]',
            'h-8',
            'border-[var(--blue-bright)]',
        ],
        success: [
            'bg-[var(--new-positive)]',
            'text-[var(--white)]',
        ],
        danger: [
            'bg-[var(--color-danger)]',
            'text-[var(--white)]',
            'px-4',
            'rounded-[2.5rem]',
            'border-[var(--color-danger)]',
            'hover:bg-[var(--color-danger-alt)]',
            'hover:border-[var(--color-danger-alt)]',
            'hover:text-[var(--white)]',
            'active:bg-[var(--color-danger)]',
            'active:border-[var(--color-danger)]',
            'focus:ring-2',
            'focus:ring-[var(--color-danger-light)]',
        ],
        warning: [
            'bg-[var(--new-warning)]',
            'text-[var(--black)]',
        ],
        test: [
            'bg-[var(--white)]',
            'text-[var(--brand-green)]',
            'border-[var(--white)]',
            'hover:bg-[var(--brand-green)]',
            'hover:text-[var(--white)]',
            'hover:border-[var(--brand-green)]',
        ],
        asset: [
            'bg-[var(--asset-color)]',
            'text-[var(--brand-green)]',
            'border-[var(--asset-color)]',
            'hover:bg-[var(--white)]',
            'hover:text-[var(--brand-green)]',
            'hover:border-[var(--asset-color)]',
        ],
    };

    // Loading state classes
    const loadingClasses = loading ? [
        'relative',
        'text-transparent',
        'after:content-[""]',
        'after:absolute',
        'after:w-4',
        'after:h-4',
        'after:border-2',
        'after:border-transparent',
        'after:border-t-current',
        'after:rounded-full',
        'after:animate-spin',
    ] : [];

    // Combine all classes
    const allClasses = [
        ...baseClasses,
        ...sizeClasses[size],
        ...variantClasses[variant],
        ...loadingClasses,
        className,
    ].filter(Boolean).join(' ');

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            className={allClasses}
            onClick={onClick}
            disabled={isDisabled}
            {...props}
        >
            {icon && (
                <div className="flex justify-center items-center min-w-6">
                    <div className="flex items-center justify-center">
                        {icon}
                    </div>
                </div>
            )}
            {children || label}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;

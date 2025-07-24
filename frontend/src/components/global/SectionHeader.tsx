import React from 'react';
import TimeRangeSelector from './TimeRangeSelector';
// Import other components you want to support as rightComponent

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
    TimeRangeSelector,
    // Add more components here if needed
};

interface SectionHeaderProps {
    title: string;
    titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    titleSize?:
        | 'xs'
        | 'sm'
        | 'base'
        | 'lg'
        | 'xl'
        | '2xl'
        | '3xl'
        | '4xl'
        | '5xl'
        | '6xl';
    titleVariant?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'muted'
        | 'success'
        | 'warning'
        | 'danger';
    titleWeight?:
        | 'light'
        | 'normal'
        | 'medium'
        | 'semibold'
        | 'bold'
        | 'extrabold';
    titleAlign?: 'left' | 'center' | 'right' | 'justify';
    titleClassName?: string;
    defaultTitleHeight?: string;
    showTimeRange?: boolean;
    availableTimeRanges?: string[];
    selectedTimeRange?: string;
    onTimeRangeChange?: (range: string) => void;
    timeRangeLabels?: Record<string, string>;
    // Custom right component: ReactNode or PageC-style { name, props }
    rightComponent?:
        | React.ReactNode
        | { name: keyof typeof componentMap; props?: Record<string, unknown> };
    // Layout props
    layout?: 'horizontal' | 'vertical';
    className?: string;
    gap?: string;
    lastCommLabel?: string;
    lastCommValue?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    titleLevel = 2,
    titleSize = 'md',
    titleVariant = 'primary',
    titleWeight = 'bold',
    titleAlign = 'left',
    titleClassName,
    defaultTitleHeight = 'h-12',
    showTimeRange = false,
    availableTimeRanges,
    selectedTimeRange,
    onTimeRangeChange,
    timeRangeLabels = {},
    rightComponent,
    layout = 'horizontal',
    className = '',
    gap = 'gap-4',
    lastCommLabel,
    lastCommValue,
}) => {
    const containerClasses =
        layout === 'horizontal'
            ? `flex items-center justify-between ${gap} ${className}`
            : `flex flex-col items-start ${gap} ${className}`;

    // Helper to render PageC-style rightComponent
    const renderRightComponent = (comp: unknown): React.ReactNode => {
        if (React.isValidElement(comp)) return comp;
        if (comp && typeof comp === 'object' && 'name' in comp) {
            // Type assertion for comp as { name: string; props?: Record<string, unknown> }
            const { name, props } = comp as {
                name: string;
                props?: Record<string, unknown>;
            };
            const Comp = componentMap[name];
            if (Comp) return <Comp {...(props || {})} />;
            return null;
        }
        // Only return if comp is a valid ReactNode
        if (
            typeof comp === 'string' ||
            typeof comp === 'number' ||
            comp === null
        )
            return comp;
        return null;
    };

    // Default height for title if not provided
    const effectiveTitleClassName = titleClassName
        ? titleClassName
        : defaultTitleHeight
        ? `${defaultTitleHeight} flex items-center`
        : 'h-12 flex items-center';

    // Dynamically select the heading tag based on titleLevel
    const safeTitleLevel = Math.min(Math.max(Number(titleLevel) || 2, 1), 6); // Ensure 1-6
    const Tag = `h${safeTitleLevel}`;

    const titleElement = React.createElement(
        Tag,
        {
            className: `
                ${titleSize === 'xs' ? 'text-xs' : ''}
                ${titleSize === 'sm' ? 'text-sm' : ''}
                ${titleSize === 'base' ? 'text-base' : ''}
                ${titleSize === 'lg' ? 'text-lg' : ''}
                ${titleSize === 'xl' ? 'text-xl' : ''}
                ${titleSize === '2xl' ? 'text-2xl' : ''}
                ${titleSize === '3xl' ? 'text-3xl' : ''}
                ${titleSize === '4xl' ? 'text-4xl' : ''}
                ${titleSize === '5xl' ? 'text-5xl' : ''}
                ${titleSize === '6xl' ? 'text-6xl' : ''}
                ${titleWeight === 'light' ? 'font-light' : ''}
                ${titleWeight === 'normal' ? 'font-normal' : ''}
                ${titleWeight === 'medium' ? 'font-medium' : ''}
                ${titleWeight === 'semibold' ? 'font-semibold' : ''}
                ${titleWeight === 'bold' ? 'font-bold' : ''}
                ${titleWeight === 'extrabold' ? 'font-extrabold' : ''}
                ${
                    titleVariant === 'default'
                        ? 'text-gray-900 dark:text-white'
                        : ''
                }
                ${
                    titleVariant === 'primary'
                        ? 'text-primary dark:text-primary-light'
                        : ''
                }
                ${
                    titleVariant === 'secondary'
                        ? 'text-gray-700 dark:text-gray-300'
                        : ''
                }
                ${
                    titleVariant === 'muted'
                        ? 'text-gray-500 dark:text-gray-400'
                        : ''
                }
                ${
                    titleVariant === 'success'
                        ? 'text-green-600 dark:text-green-400'
                        : ''
                }
                ${
                    titleVariant === 'warning'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : ''
                }
                ${
                    titleVariant === 'danger'
                        ? 'text-red-600 dark:text-red-400'
                        : ''
                }
                ${titleAlign === 'left' ? 'text-left' : ''}
                ${titleAlign === 'center' ? 'text-center' : ''}
                ${titleAlign === 'right' ? 'text-right' : ''}
                ${titleAlign === 'justify' ? 'text-justify' : ''}
                ${effectiveTitleClassName}
            `
                .replace(/\s+/g, ' ')
                .trim(),
        },
        title
    );

    // Determine what to render on the right
    let rightContent = null;
    if (rightComponent) {
        rightContent = renderRightComponent(rightComponent);
    } else if (lastCommLabel && lastCommValue) {
        rightContent = (
            <span className="text-sm text-gray-500">
                {lastCommLabel}: {lastCommValue}
            </span>
        );
    } else if (showTimeRange) {
        rightContent = (
            <TimeRangeSelector
                availableTimeRanges={
                    availableTimeRanges || ['Daily', 'Monthly']
                }
                selectedTimeRange={selectedTimeRange || 'Daily'}
                handleTimeRangeChange={onTimeRangeChange || (() => {})}
                timeRangeLabels={timeRangeLabels}
            />
        );
    }

    return (
        <div className={containerClasses}>
            <div className="flex-1">{titleElement}</div>
            {rightContent && (
                <div className="flex-shrink-0">{rightContent}</div>
            )}
        </div>
    );
};

export default SectionHeader;

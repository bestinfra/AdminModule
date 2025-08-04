interface CardProps {
    title: string;
    value: string | number;
    icon: string;
    showTrend?: boolean;
    comparisonValue?: number;
    previousValue?: string; // new prop
    subtitle1?: string;
    subtitle2?: string;
    loading?: boolean;
    onValueClick?: () => void; // new prop
    iconStyle?: keyof typeof FILTER_STYLES | typeof FILTER_STYLES[keyof typeof FILTER_STYLES]; // new prop for custom icon styling
    bg?: string; // new prop for dynamic background
    iconClassName?: string; // new prop for icon className
    width?: string; // new prop for icon container width
    height?: string; // new prop for icon container height
    titleFontSize?: string; // new prop for title font size
    valueFontSize?: string; // new prop for value font size
}

import CardSkeleton from '@components/skeletons/CardSkeleton';
import '@/styles/custom.css';
import Icon from './Icon';
import { FILTER_STYLES } from '@/contexts/FilterStyleContext';

const Card = ({
    title,
    value,
    icon,
    showTrend,
    comparisonValue,
    previousValue, // new prop
    subtitle1,
    subtitle2,
    loading = false,
    onValueClick, // new prop
    iconStyle, // new prop - if provided, overrides global style
    bg,
    iconClassName = 'w-7 h-7 lg:w-6 lg:h-6 md:w-5 md:h-5 sm:w-4 sm:h-4', // responsive icon sizing - decreases with smaller width
    width = 'w-14 h-14 lg:w-12 lg:h-12 md:w-10 md:h-10 sm:w-8 sm:h-8', // responsive container sizing - decreases with smaller width
    height = 'w-14 h-14 lg:w-12 lg:h-12 md:w-10 md:h-10 sm:w-8 sm:h-8', // responsive container sizing - decreases with smaller width
    titleFontSize = 'text-lg md:text-base sm:text-sm', // default responsive title font size
    valueFontSize = 'text-3xl lg:text-2xl md:text-xl sm:text-lg', // default responsive value font size
}: CardProps) => {
    if (loading) {
        return <CardSkeleton />;
    }

    return (
        <article className="rounded-3xl custom-shadow w-full h-full min-h-[140px] md:min-h-[130px] sm:min-h-[120px] bg-background-secondary">
            <section className={`flex justify-between items-start p-7 md:p-5.5 sm:p-4 border border-primary-border rounded-3xl dark:border dark:border-dark-border bg-white dark:bg-primary-dark`}>
                <div className="flex flex-col gap-4 md:gap-3 sm:gap-2">
                    <h3 className={`${titleFontSize} text-main dark:text-white`}>
                        {title}
                    </h3>
                    <p
                        className={`${valueFontSize} font-bold flex items-center gap-2 md:gap-2 sm:gap-1 ${onValueClick ? 'cursor-pointer hover:text-blue-600 transition-colors duration-200' : ''}`}
                        style={{ color: 'var(--color-primary)' }}
                        onClick={onValueClick}
                    >
                        {value}
                        {showTrend && (
                            <span
                                role="img"
                                aria-label={
                                    comparisonValue && comparisonValue > 0
                                        ? 'Trending Up'
                                        : 'Trending Down'
                                }
                                className={`bg-secondary rounded-full p-1.5 md:p-1 sm:p-0.5 ${
                                    comparisonValue && comparisonValue > 0
                                        ? 'bg-secondary'
                                        : 'bg-error'
                                }`}>
                                <img
                                    src={
                                        comparisonValue && comparisonValue > 0
                                            ? 'icons/arrow-trend-up.svg'
                                            : 'icons/arrow-trend-down.svg'
                                    }
                                    alt=""
                                    className="w-4 h-4 md:w-3 md:h-3 sm:w-2 sm:h-2"
                                />
                            </span>
                        )}
                    </p>
                    {previousValue && (
                        <p className="text-sm md:text-sm sm:text-xs text-gray-400 font-normal -mt-1 mb-1">{previousValue}</p>
                    )}
                </div>
                {icon && (
                    <figure className={`p-2.5 md:p-2 sm:p-1.5 ${bg || 'bg-stat-icon-gradient'} rounded-full ${width} ${height} flex items-center justify-center`}>
                        <Icon 
                            src={icon} 
                            alt={`${title} Icon`} 
                            className={iconClassName}
                            iconStyle={iconStyle}
                        />
                    </figure>
                )}
            </section>
            <footer className="flex justify-between px-5 md:px-5 sm:px-3 py-3 md:py-2.5 sm:py-2 space-y-1">
                {subtitle1 && (
                    <p className="text-base md:text-sm sm:text-xs text-text-secondary font-normal">
                        {subtitle1}
                    </p>
                )}
                {subtitle2 && (
                    <p className="text-base md:text-sm sm:text-xs text-text-secondary font-normal">
                        {subtitle2}
                    </p>
                )}
            </footer>
        </article>
    );
};

export default Card;

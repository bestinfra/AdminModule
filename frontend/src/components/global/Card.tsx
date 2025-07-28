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
    iconStyle?: React.CSSProperties; // new prop for custom icon styling
    bg?: string; // new prop for dynamic background
    iconClassName?: string; // new prop for icon className
}

import CardSkeleton from '@components/skeletons/CardSkeleton';
import '@/styles/custom.css';

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
    iconStyle, // new prop
    bg,
    iconClassName = 'w-6 h-6', // new prop with default value
}: CardProps) => {
    if (loading) {
        return <CardSkeleton />;
    }

    return (
        <article className="rounded-3xl custom-shadow w-full h-full min-h-[140px] bg-background-secondary">
            <section className="flex justify-between items-start p-5 border border-primary-border bg-white dark:bg-primary-dark rounded-3xl dark:border dark:border-dark-border">
                <div className="flex flex-col gap-4">
                    <h3 className="text-base text-main dark:text-white">
                        {title}
                    </h3>
                    <p
                        className={`text-2xl font-bold flex items-center gap-2 ${onValueClick ? 'cursor-pointer hover:text-blue-600 transition-colors duration-200' : ''}`}
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
                                className={
                                    comparisonValue && comparisonValue > 0
                                        ? 'bg-secondary rounded-full p-1'
                                        : 'bg-error rounded-full p-1'
                                }>
                                <img
                                    src={
                                        comparisonValue && comparisonValue > 0
                                            ? 'icons/arrow-trend-up.svg'
                                            : 'icons/arrow-trend-down.svg'
                                    }
                                    alt=""
                                    className="w-3 h-3"
                                />
                            </span>
                        )}
                    </p>
                    {previousValue && (
                        <p className="text-xs text-gray-400 font-normal -mt-1 mb-1">{previousValue}</p>
                    )}
                </div>
                {icon && (
                    <figure className={`p-2 ${bg || 'bg-stat-icon-gradient'} rounded-full w-12 h-12 flex items-center justify-center`}>
                        <img src={icon} alt={`${title} Icon`} className={iconClassName} style={iconStyle} />
                    </figure>
                )}
            </section>
            <footer className="flex justify-between px-5 py-3 space-y-1">
                {subtitle1 && (
                    <p className="text-text-secondary font-normal text-sm">
                        {subtitle1}
                    </p>
                )}
                {subtitle2 && (
                    <p className="text-text-secondary font-normal text-sm">
                        {subtitle2}
                    </p>
                )}
            </footer>
        </article>
    );
};

export default Card;

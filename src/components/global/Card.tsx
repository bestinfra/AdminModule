interface CardProps {
    title: string;
    value: string | number;
    icon: string;
    showTrend?: boolean;
    comparisonValue?: number;
    subtitle1?: string;
    subtitle2?: string;
    loading?: boolean;
}

import CardSkeleton from '../skeletons/CardSkeleton';

const Card = ({
    title,
    value,
    icon,
    showTrend,
    comparisonValue,
    subtitle1,
    subtitle2,
    loading = false,
}: CardProps) => {
    if (loading) {
        return <CardSkeleton />;
    }

    return (
        <article className="rounded-3xl bg-primary-lightest shadow-md/20 shadow-black dark:bg-primary-dark-light dark:shadow-md/60 dark:shadow-black  dark:border dark:border-dark-border  ">
            <section className="flex justify-between items-start p-6   border border-primary-border bg-white dark:bg-primary-dark  rounded-3xl dark:border dark:border-dark-border">
                <div className="space-y-2">
                    <h3 className="text-base text-main dark:text-white">
                        {title}
                    </h3>
                    <p className="text-2xl font-bold text-secondary flex items-center gap-2 dark:text-secondary">
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
                </div>
                {icon && (
                    <figure className="p-2 bg-gradient-primary  dark:bg-dark-secondary rounded-full w-12 h-12 flex items-center justify-center ">
                        <img src={icon} alt={`${title} Icon`} className="w-5 h-5" />
                    </figure>
                )}
            </section>
            <footer className="flex justify-between px-6 py-3 space-y-1">
                {subtitle1 && (
                    <p className="text-base m-0 font-light text-main dark:text-subinfo text-sm">
                        {subtitle1}
                    </p>
                )}
                {subtitle2 && (
                        <p className="text-base m-0 font-extralight text-main dark:text-subinfo text-sm">
                        {subtitle2}
                    </p>
                )}
            </footer>
        </article>
    );
};

export default Card;

const CardSkeleton = () => {
    return (
        <article className="rounded-3xl custom-shadow w-full h-full min-h-[140px] md:min-h-[130px] sm:min-h-[120px] bg-background-secondary flex flex-col">
            <section className="flex justify-between items-start p-7 md:p-5.5 sm:p-4 border border-primary-border rounded-3xl dark:border dark:border-dark-border bg-white dark:bg-primary-dark flex-1">
                <div className="flex flex-col gap-4 md:gap-3 sm:gap-2 flex-1">
                    <div
                        className="skeleton-pulse w-24 h-6 md:w-20 md:h-5 sm:w-16 sm:h-4 rounded-lg"
                        aria-hidden="true"
                    />
                    <div className="flex items-center gap-2 md:gap-2 sm:gap-1">
                        <div
                            className="skeleton-pulse w-16 h-8 md:w-14 md:h-7 sm:w-12 sm:h-6 rounded-lg"
                            aria-hidden="true"
                        />
                        <div
                            className="skeleton-pulse w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4 rounded-full"
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <div
                    className="bg-primary rounded-full skeleton-pulse w-14 h-14 lg:w-12 lg:h-12 md:w-10 md:h-10 sm:w-8 sm:h-8 flex-shrink-0"
                    aria-hidden="true"
                />
            </section>
            <footer className="flex justify-between px-5 md:px-5 sm:px-3 py-3 md:py-2.5 sm:py-2 space-y-1 flex-shrink-0">
                <div
                    className="skeleton-pulse w-20 h-4 md:w-16 md:h-3 sm:w-12 sm:h-3 rounded-lg"
                    aria-hidden="true"
                />
                <div
                    className="skeleton-pulse w-24 h-4 md:w-20 md:h-3 sm:w-16 sm:h-3 rounded-lg"
                    aria-hidden="true"
                />
            </footer>
        </article>
    );
};

export default CardSkeleton;

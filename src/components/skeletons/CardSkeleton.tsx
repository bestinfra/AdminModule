const CardSkeleton = () => {
    return (
        <article className="bg-primary-lightest dark:bg-primary-dark-light rounded-3xl shadow-md/20 shadow-black dark:shadow-md/60 dark:shadow-black">
            <section className="flex justify-between items-start p-6 border border-primary-border bg-white dark:bg-primary-dark rounded-3xl dark:border dark:border-dark-border">
                <div className="space-y-2">
                    <div
                        className="skeleton-pulse w-30 h-4 rounded-lg"
                        aria-hidden="true"
                    />
                    <div className="flex items-center gap-2">
                        <div
                            className="skeleton-pulse w-20 h-8 rounded-lg"
                            aria-hidden="true"
                        />
                        <div
                            className="skeleton-pulse w-4 h-4 rounded"
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <div
                    className="bg-primary rounded-full skeleton-pulse w-12 h-12"
                    aria-hidden="true"></div>
            </section>
            <footer
                className="flex justify-between py-5 space-y-1"
                aria-hidden="true"></footer>
        </article>
    );
};

export default CardSkeleton;

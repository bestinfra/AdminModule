import React from 'react';
import TimeRangeSelector from '@components/global/TimeRangeSelector';
import LoadingSpinner from '@components/global/LoadingSpinner';

interface HolderProps {
    className?: string;
    height?: string | number;
    title: string;
    loading?: boolean;
    hasDownload?: boolean;
    handleDownload?: () => void;
    children?: React.ReactNode;
    contentPadding?: string;
    // Legacy props for backward compatibility
    DateRange?: string;
    availableTimeRanges?: string[];
    selectedTimeRange?: string;
    handleTimeRangeChange?: (range: string) => void;
}

const Holder: React.FC<HolderProps> = ({
    className,
    height,
    title,
    loading = false,
    hasDownload = false,
    handleDownload,
    children,
    contentPadding = 'p-4',
    // Legacy props
    DateRange,
    availableTimeRanges = [],
    selectedTimeRange,
    handleTimeRangeChange,
}) => {
    return (
        <div
            className={`w-full transition-[height,opacity,transform] duration-300 ease-in-out flex flex-col border border-primary-border dark:border-dark-border rounded-3xl overflow-hidden ${
                className || ''
            }`}
            style={{ height }}>
            <div className="flex justify-between items-center dark:bg-primary-dark-light bg-primary-lightest p-5 ">
                <h3 className="m-0 text-base font-normal text-main dark:text-white flex items-center gap-1">
                    {title}
                    {DateRange && (
                        <span className="text-subinfo font-normal text-sm dark:text-subinfo">
                            {DateRange}
                        </span>
                    )}
                </h3>

                <div className="flex items-center gap-2 flex-row">
                    {availableTimeRanges.length > 0 && selectedTimeRange && handleTimeRangeChange && (
                        <TimeRangeSelector
                            availableTimeRanges={availableTimeRanges}
                            selectedTimeRange={selectedTimeRange}
                            handleTimeRangeChange={handleTimeRangeChange}
                        />
                    )}
                    {hasDownload && handleDownload && (
                        <span
                            className="cursor-pointer rounded-full bg-white dark:bg-primary-dark w-10 h-10 p-3 hover:bg-gray-50 dark:hover:bg-primary-dark-light transition-colors"
                            onClick={handleDownload}
                            role="button"
                            aria-label="Download data">
                            <img
                                src="icons/download-icon.svg"
                                alt="Download data"
                                className="w-full h-full"
                            />
                        </span>
                    )}
                </div>
            </div>

            <div className={`${contentPadding} h-full`}>
                {loading ? <LoadingSpinner /> : children}
            </div>
        </div>
    );
};

export default Holder;

import React from 'react';
import TimeRangeSelector from './TimeRangeSelector';
import LoadingSpinner from './LoadingSpinner';

interface HolderProps {
    className?: string;
    height?: string | number;
    title: string;
    DateRange: string;
    availableTimeRanges: string[];
    selectedTimeRange: string;
    handleTimeRangeChange: (range: string) => void;
    handleDownload: () => void;
    loading: boolean;
    children?: React.ReactNode;
}

const Holder: React.FC<HolderProps> = ({
    className,
    height,
    title,
    DateRange,
    availableTimeRanges,
    selectedTimeRange,
    handleTimeRangeChange,
    handleDownload,
    loading,
    children,
}) => {
    return (
        <div
            className={`w-full transition-[height,opacity,transform] duration-300 ease-in-out flex flex-col border border-secondary-2 dark:border-dark-border rounded-3xl overflow-hidden ${
                className || ''
            }`}
            style={{ height }}>
            <div className="flex justify-between items-center dark:bg-dark-secondary bg-secondary p-5 ">
                <h3 className="m-0 text-base font-normal text-primary dark:text-white flex items-center gap-1">
                    {title}
                    <span className="text-light font-normal text-sm">
                        {DateRange}
                    </span>
                </h3>

                <div className="flex items-center gap-2 flex-row">
                    <TimeRangeSelector
                        availableTimeRanges={availableTimeRanges}
                        selectedTimeRange={selectedTimeRange}
                        handleTimeRangeChange={handleTimeRangeChange}
                    />
                    <span
                        className="cursor-pointer rounded-full bg-white dark:bg-dark-primary w-10 h-10 p-3"
                        onClick={handleDownload}>
                        <img
                            src="icons/download-icon.svg"
                            alt="Download chart"
                            className=""
                        />
                    </span>
                </div>
            </div>

            <div className="p-4 h-full">
                {loading ? <LoadingSpinner /> : children}
            </div>
        </div>
    );
};

export default Holder;

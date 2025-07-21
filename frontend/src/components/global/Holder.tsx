import React from 'react';
import TimeRangeSelector from '@components/global/TimeRangeSelector';
import LoadingSpinner from '@components/global/LoadingSpinner';

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
    contentPadding?: string; // Add contentPadding prop
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
    contentPadding = 'p-4', // Add contentPadding prop with default
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
                    <span className="text-subinfo font-normal text-sm dark:text-subinfo">
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
                        className="cursor-pointer rounded-full bg-white dark:bg-primary-dark w-10 h-10 p-3"
                        onClick={handleDownload}>
                        <img
                            src="icons/download-icon.svg"
                            alt="Download chart"
                            className=""
                        />
                    </span>
                </div>
            </div>

            <div className={`${contentPadding} h-full`}>
                {loading ? <LoadingSpinner /> : children}
            </div>
        </div>
    );
};

export default Holder;

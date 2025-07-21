import React, { useRef, useEffect, useState } from 'react';

interface TimeRangeSelectorProps {
    availableTimeRanges: string[];
    selectedTimeRange: string;
    handleTimeRangeChange: (range: string) => void;
    timeRangeLabels?: Record<string, string>; 
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
    availableTimeRanges,
    selectedTimeRange,
    handleTimeRangeChange,
    timeRangeLabels = {}, 
}) => {
    const [dimensions, setDimensions] = useState<{
        width: number;
        left: number;
    }>({ width: 0, left: 0 });
    const selectedRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateDimensions = () => {
        if (selectedRef.current && containerRef.current) {
            const selectedElement = selectedRef.current;

            setDimensions({
                width: selectedElement.offsetWidth,
                left: selectedElement.offsetLeft,
            });
        }
    };

    useEffect(() => {
        updateDimensions();

        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [selectedTimeRange]);

    // Safety check for undefined or null availableTimeRanges
    if (!availableTimeRanges || availableTimeRanges.length === 0) return null;

    const getDisplayLabel = (range: string): string => {
        return timeRangeLabels[range] || range;
    };

    return (
        <div
            ref={containerRef}
            className="inline-flex bg-white dark:bg-primary-dark rounded-3xl p-1 relative overflow-hidden border border-primary-border">
            <div
                className="absolute bg-background-secondary dark:bg-primary-dark-light rounded-3xl"
                style={{
                    width: `${dimensions.width}px`,
                    height: 'calc(100% - 8px)',
                    transform: `translateX(${dimensions.left - 4}px)`,
                    margin: '4px',
                    opacity: dimensions.width > 0 ? 1 : 0,
                    top: 0,
                    left: 0,
                    transition:
                        'transform 300ms ease-in-out, width 300ms ease-in-out',
                }}
            />
            {availableTimeRanges.map((range) => (
                <span
                    ref={selectedTimeRange === range ? selectedRef : null}
                    key={range}
                    className={`relative z-10 border-none px-3 py-2 rounded-3xl font-medium text-sm cursor-pointer ${
                        selectedTimeRange === range
                            ? 'text-primary font-semibold'
                            : 'text-text-secondary'
                    }`}
                    onClick={() => handleTimeRangeChange(range)}>
                    {getDisplayLabel(range)}
                </span>
            ))}
        </div>
    );
};

export default TimeRangeSelector;

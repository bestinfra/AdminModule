import React, { useState, useRef, useEffect } from 'react';

interface CalendarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string | null;
    name?: string;
    label?: string;
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    placeholder = 'Select Period',
    className = '',
    disabled = false,
    required = false,
    error = null,
    name = 'calendar',
    label
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [errorState] = useState<string | null>(error);

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Handle date selection
    const handleDateSelect = (day: number) => {
        const selectedDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(selectedDateObj);
        
        // Format date as YYYY-MM-DD for the input
        const formattedDate = selectedDateObj.toISOString().split('T')[0];
        
        // Create a synthetic event
        const syntheticEvent = {
            target: {
                name,
                value: formattedDate
            }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange(syntheticEvent);
        setIsOpen(false);
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = selectedDate && 
                selectedDate.getDate() === day && 
                selectedDate.getMonth() === currentDate.getMonth() && 
                selectedDate.getFullYear() === currentDate.getFullYear();
            
            const isToday = new Date().getDate() === day && 
                new Date().getMonth() === currentDate.getMonth() && 
                new Date().getFullYear() === currentDate.getFullYear();

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`p-2 text-sm rounded hover:bg-blue-100 transition-colors ${
                        isSelected 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : isToday 
                                ? 'bg-gray-200 text-gray-800' 
                                : 'text-gray-700 hover:text-gray-900'
                    }`}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Format display value
    const formatDisplayValue = () => {
        if (selectedDate) {
            return selectedDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }
        return '';
    };

    const toggleCalendar = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-neutral dark:text-neutral-light mb-2">
                    {label}
                </label>
            )}
            <div className="relative" ref={calendarRef}>
                <div className="relative">
                    <input
                        type="text"
                        name={name}
                        value={formatDisplayValue()}
                        placeholder={placeholder}
                        readOnly
                        className={`w-full py-3 px-4 border border-primary-border dark:border-gray-600 rounded-full text-base dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800 ${errorState ? 'border-red-300 dark:border-red-400' : ''} ${disabled ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500' : ''} pr-10 cursor-pointer`}
                        disabled={disabled}
                        required={required}
                        onClick={toggleCalendar}
                    />
                    <div 
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={toggleCalendar}
                    >
                        <svg 
                            className="w-5 h-5 text-gray-400 hover:text-gray-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                            />
                        </svg>
                    </div>
                </div>

                {/* Calendar Popup */}
                {isOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px]">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button
                                onClick={goToNextMonth}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="p-4">
                            {/* Days of Week Header */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-1">
                                {generateCalendarDays()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Error message */}
            {errorState && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errorState}
                </div>
            )}
        </div>
    );
};

export default Calendar; 
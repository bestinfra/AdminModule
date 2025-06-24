import React, { useRef, useEffect } from 'react';

interface SearchInputProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;
    showShortcut?: boolean;
}

const Input = ({
    onSearch,
    placeholder = 'Search...',
    className = '',
    showShortcut = true,
}: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={`relative ${className}`}>
            <input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-[2.5rem] border border-border dark:border-dark-border dark:bg-dark-secondary dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-white"
                aria-label="Search"
                onChange={(e) => onSearch?.(e.target.value)}
            />
            {showShortcut && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-white ">
                    <kbd className="px-2 py-1 text-accent text-sm font-light bg-secondary dark:bg-dark-primary rounded">
                        Ctrl
                    </kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 text-accent text-sm font-light bg-secondary dark:bg-dark-primary rounded">
                        K
                    </kbd>
                </div>
            )}
            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary dark:bg-dark-primary rounded-full w-8 h-8 flex items-center justify-center">
                <img
                    src="/icons/search-icon.svg"
                    alt="Search"
                    className="h-4.5 w-4.5"
                />
            </span>
        </div>
    );
};

export default Input;

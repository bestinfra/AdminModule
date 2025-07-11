import { useRef, useEffect } from 'react';

interface SearchInputProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;
    showShortcut?: boolean;
    label?: string;
}

const Input = ({
    onSearch,
    placeholder = 'Search...',
    className = '',
    showShortcut = true,
    label = '',
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
            {label && <label className="block text-sm font-medium text-main dark:text-white mb-1">{label}</label>}
            <input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-full border border-primary-border text-main text-sm font-light bg-white dark:bg-primary-dark dark:border-dark-border dark:bg-dark-secondary dark:text-white focus:outline-none placeholder:text-primary-dark dark:placeholder:text-main"
                aria-label="Search"
                onChange={(e) => onSearch?.(e.target.value)}
            />
            {showShortcut && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-white ">
                    <kbd className="px-2  text-primary-dark-light text-sm font-light bg-primary-lightest dark:bg-primary-dark-light rounded dark:text-subinfo">
                        Ctrl
                    </kbd>
                    <span className="text-primary-dark  dark:bg-primary-dark dark:text-subinfo">+</span>
                    <kbd className="px-2  text-primary-dark text-sm font-light bg-primary-lightest dark:bg-primary-dark-light rounded dark:text-subinfo">
                        K
                    </kbd>
                </div>
            )}
            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-lightest dark:bg-primary-dark rounded-full w-8 h-8 flex items-center justify-center">
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

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
            <div className="relative">
                <input
                    ref={inputRef}
                    type="search"
                    placeholder={placeholder}
                    className="w-full text-primary-dark px-4 py-3 pr-32 rounded-full border border-primary-border text-main text-sm font-light bg-white dark:bg-primary-dark dark:border-dark-border dark:bg-dark-secondary dark:text-white focus:outline-none placeholder-black placeholder:font-normal dark:placeholder:text-main dark:placeholder:font-light"
                    aria-label="Search"
                    onChange={(e) => onSearch?.(e.target.value)}
                />
                
                <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                    {showShortcut && (
                        <div className="flex items-center gap-1 text-sm">
                            <kbd className="px-2 text-primary-dark-light text-sm font-light bg-background-secondary dark:bg-primary-dark-light rounded dark:text-subinfo">
                                Ctrl
                            </kbd>
                            <span className="text-primary-dark dark:text-subinfo">+</span>
                            <kbd className="px-2 text-primary-dark text-sm font-light bg-background-secondary dark:bg-primary-dark-light rounded dark:text-subinfo">
                                K
                            </kbd>
                        </div>
                    )}
                    <span className="bg-background-secondary dark:bg-primary-dark rounded-full w-8 h-8 flex items-center justify-center">
                        <img
                            src="/icons/search-icon.svg"
                            alt="Search"
                            className="h-4.5 w-4.5"
                        />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Input;

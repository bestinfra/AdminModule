

import React, { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import Input from '@components/Form/Input';

interface Option {
  value: string;
  label: string;
  [key: string]: any;
}

interface DropdownProps {
  name: string;
  value: string | string[];
  onChange: (e: { target: { name: string; value: string | string[] } }) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  isMultiSelect?: boolean;
  searchable?: boolean;
  maxHeight?: string;
  groupBy?: string | null;
  leftIcon?: string | null;
}



const Dropdown: React.FC<DropdownProps> = ({

  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  error = '',
  isMultiSelect = false,
  searchable = true,
  maxHeight = '300px',
  groupBy = null,
  leftIcon = null,
}) => {
  
  // STATE VARIABLES
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    isMultiSelect ? (Array.isArray(value) ? value : []) : []
  );
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // REF VARIABLES
  const dropdownRef = useRef<HTMLDivElement>(null);

  // EFFECTS
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable) {
    }
  }, [isOpen, searchable]);

  // FUNCTION VARIABLES
  const handleSelect = (option: Option) => {
    if (isMultiSelect) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      setSelectedValues(newValues);
      onChange({ target: { name, value: newValues } });
    } else {
      onChange({ target: { name, value: option.value } });
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const filteredOptions = getFilteredOptions();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const getFilteredOptions = () => {
    if (!searchable) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getGroupedOptions = () => {
    if (!groupBy) return getFilteredOptions();
    return getFilteredOptions().reduce((groups: Record<string, Option[]>, option) => {
      const group = option[groupBy] || '';
      if (!groups[group]) groups[group] = [];
      groups[group].push(option);
      return groups;
    }, {});
  };

  const renderOptions = () => {
    const grouped = getGroupedOptions();
    if (groupBy) {
      return Object.entries(grouped).map(([group, groupOptions]) => (
        <div key={group}>
          <div className="text-xs font-medium px-4 uppercase tracking-wider hover:bg-primary-dark hover:text-white">{group}</div>
          {groupOptions.map((option: Option, index: number) => renderOption(option, index))}
        </div>
      ));
    }
    return getFilteredOptions().map((option, index) => renderOption(option, index));
  };

  const renderOption = (option: Option, index: number) => {
    const isSelected = isMultiSelect
      ? selectedValues.includes(option.value)
      : value === option.value;

    return (
      <div
        key={option.value}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition duration-200 text-base font-medium mb-1 mx-2 hover:dark:bg-primary hover:dark:text-white hover:bg-primary hover:text-white
          ${isSelected ? 'dark:bg-primary-dark dark:text-white text-base' : ''}
          ${focusedIndex === index ? 'dark:bg-primary-dark dark:text-white' : 'hover:bg-primary-dark hover:text-white'}`}
        onClick={() => handleSelect(option)}
        onMouseEnter={() => setFocusedIndex(index)}
      >
        {isMultiSelect && (
          <input
            type="checkbox"
            readOnly
            checked={isSelected}
            className="peer sr-only"
          />
        )}
        {isMultiSelect && (
          <span className={`w-4 h-4 rounded-lg border-2 flex items-center justify-center mr-2 transition ${
            isSelected 
              ? 'bg-blue-900 border-blue-900' 
              : 'border-gray-300 bg-transparent'
          }`}>
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
        )}
        {option.label}
      </div>
    );
  };

  const getDisplayValue = () => {
    if (isMultiSelect) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        return option?.label || placeholder;
      }
      return `${selectedValues.length} items selected`;
    }
    const option = options.find(opt => opt.value === value);
    return option?.label || placeholder;
  };

  const isOptionSelected = () => {
    if (isMultiSelect) {
      return selectedValues.length > 0;
    }
    return value && value !== '';
  };

  // RENDER
  return (
    <div
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      className={`relative w-full ${className}`}
    >
      <div className="relative">
        {error && (
          <span
            className="absolute top-0 left-6 -translate-y-1/2 px-1 z-20 bg-white dark:bg-primary-dark text-red-500 text-sm font-medium"
            role="alert"
            aria-live="polite"
          >
            {error}
          </span>
        )}
        
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          tabIndex={0}
          className={`w-full flex items-center justify-between border px-4 py-3 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium
            ${disabled ? '' : 'text-current'}
            ${error ? 'border-red-500' : 'border-gray-300'}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {leftIcon && (
            <img src={leftIcon} alt="icon" className="w-5 h-5 mr-2" />
          )}
          <span className={`truncate flex-1 text-left ${isOptionSelected() ? 'text-base dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {getDisplayValue()}
          </span>
          <svg
            className={`ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div
            className="absolute z-10 w-full mt-2 dark:bg-primary-dark bg-white dark:text-white border border-primary-border dark:border-dark-border rounded-2xl overflow-auto scrollbar-hide"
            style={{ maxHeight }}
            role="listbox"
          >
            {searchable && (
              <div className="p-2  dark:border-dark-border">
                <Input
                  onSearch={(query) => setSearchTerm(query)}
                  placeholder="Search..."
                  showShortcut={false}
                  className="mb-2"
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto scrollbar-hide mt-2 mb-1">
              {renderOptions()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown; 

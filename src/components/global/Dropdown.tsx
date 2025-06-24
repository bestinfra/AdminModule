// import React, { useState, useRef, useEffect, type KeyboardEvent } from 'react';

// interface Option {
//   value: string;
//   label: string;
//   [key: string]: any;
// }

// interface DropdownProps {
//   id: string;
//   name: string;
//   value: string | string[];
//   onChange: (e: { target: { name: string; value: string | string[] } }) => void;
//   options: Option[];
//   placeholder?: string;
//   className?: string;
//   disabled?: boolean;
//   required?: boolean;
//   error?: string;
//   onFocus?: () => void;
//   onBlur?: () => void;
//   isMultiSelect?: boolean;
//   searchable?: boolean;
//   maxHeight?: string;
//   groupBy?: string | null;
//   leftIcon?: string | null;
// }

// const Dropdown: React.FC<DropdownProps> = ({
//   id,
//   name,
//   value,
//   onChange,
//   options,
//   placeholder = 'Select an option',
//   className = '',
//   disabled = false,
//   required = false,
//   error = '',
//   onFocus,
//   onBlur,
//   isMultiSelect = false,
//   searchable = true,
//   maxHeight = '300px',
//   groupBy = null,
//   leftIcon = null,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedValues, setSelectedValues] = useState<string[]>(
//     isMultiSelect ? (Array.isArray(value) ? value : []) : []
//   );
//   const [focusedIndex, setFocusedIndex] = useState(-1);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (isOpen && searchable && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isOpen, searchable]);

//   const handleSelect = (option: Option) => {
//     if (isMultiSelect) {
//       const newValues = selectedValues.includes(option.value)
//         ? selectedValues.filter(v => v !== option.value)
//         : [...selectedValues, option.value];
//       setSelectedValues(newValues);
//       onChange({ target: { name, value: newValues } });
//     } else {
//       onChange({ target: { name, value: option.value } });
//       setIsOpen(false);
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
//     const filteredOptions = getFilteredOptions();
//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault();
//         setFocusedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
//         break;
//       case 'ArrowUp':
//         e.preventDefault();
//         setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
//         break;
//       case 'Enter':
//         e.preventDefault();
//         if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
//           handleSelect(filteredOptions[focusedIndex]);
//         }
//         break;
//       case 'Escape':
//         setIsOpen(false);
//         break;
//     }
//   };

//   const getFilteredOptions = () => {
//     if (!searchable) return options;
//     return options.filter(option =>
//       option.label.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const getGroupedOptions = () => {
//     if (!groupBy) return getFilteredOptions();
//     return getFilteredOptions().reduce((groups: Record<string, Option[]>, option) => {
//     //   const group = option[groupBy] || 'Other';
//       const group = option[groupBy] || '';
//       if (!groups[group]) groups[group] = [];
//       groups[group].push(option);
//       return groups;
//     }, {});
//   };

//   const renderOptions = () => {
//     const grouped = getGroupedOptions();
//     if (groupBy) {
//       return Object.entries(grouped).map(([group, groupOptions]) => (
//         <div key={group}>
//           <div className="text-xs text-gray-500 font-medium px-2 pt-2">{group}</div>
//           {groupOptions.map((option: Option, index: number) => renderOption(option, index))}
//         </div>
//       ));
//     }
//     return getFilteredOptions().map((option, index) => renderOption(option, index));
//   };

//   const renderOption = (option: Option, index: number) => {
//     const isSelected = isMultiSelect
//       ? selectedValues.includes(option.value)
//       : value === option.value;

//     return (
//       <div
//         key={option.value}
//         // className={`cursor-pointer px-4 py-2 hover:bg-blue-50 ${
//         //   isSelected ? 'bg-blue-100 font-semibold text-blue-800' : ''
//         // } ${focusedIndex === index ? 'bg-blue-200' : ''}`}
//         className={`cursor-pointer px-4 py-2 transition-colors duration-200 ${
//             isSelected ? 'bg-primary text-white font-semibold' : ''
//           } ${focusedIndex === index ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}`}
          
//         onClick={() => handleSelect(option)}
//         onMouseEnter={() => setFocusedIndex(index)}
//       >
//         {isMultiSelect && (
//           <input
//             type="checkbox"
//             readOnly
//             checked={isSelected}
//             className="mr-2 accent-blue-600"
//           />
//         )}
//         {option.label}
//       </div>
//     );
//   };

//   const getDisplayValue = () => {
//     if (isMultiSelect) {
//       if (selectedValues.length === 0) return placeholder;
//       if (selectedValues.length === 1) {
//         const option = options.find(opt => opt.value === selectedValues[0]);
//         return option?.label || placeholder;
//       }
//       return `${selectedValues.length} items selected`;
//     }
//     const option = options.find(opt => opt.value === value);
//     return option?.label || placeholder;
//   };

//   return (
//     <div
//       ref={dropdownRef}
//       onKeyDown={handleKeyDown}
//       className={`relative w-full ${className}`}
//     >
//       {/* Trigger */}
//       <div
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//         tabIndex={0}
//         className={`flex items-center justify-between border px-4 py-2 rounded-3xl shadow-sm cursor-pointer bg-white ${
//           disabled ? 'bg-gray-100 text-gray-400' : ''
//         } ${error ? 'border-red-500' : 'border-gray-300'}`}
//         role="combobox"
//         aria-expanded={isOpen}
//         aria-haspopup="listbox"
//         aria-controls={`${id}-listbox`}
//       >
//         {leftIcon && (
//           <img src={leftIcon} alt="icon" className="w-5 h-5 mr-2" />
//         )}
//         <span className="truncate">{getDisplayValue()}</span>
//         <svg
//           className={`ml-2 w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </div>

//       {/* Dropdown List */}
//       {isOpen && (
//         <div
//           className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-lg overflow-auto"
//           style={{ maxHeight }}
//           role="listbox"
//           id={`${id}-listbox`}
//         >
//           {searchable && (
//             <div className="p-2">
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
//               />
//             </div>
//           )}
//           {renderOptions()}
//         </div>
//       )}

//       {/* Error message */}
//       {error && (
//         <div className="text-sm text-red-600 mt-1">{error}</div>
//       )}
//     </div>
//   );
// };

// export default Dropdown;
import React, { useState, useRef, useEffect, type KeyboardEvent } from 'react';

interface Option {
  value: string;
  label: string;
  [key: string]: any;
}

interface DropdownProps {
  id: string;
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
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  required = false,
  error = '',
  onFocus,
  onBlur,
  isMultiSelect = false,
  searchable = true,
  maxHeight = '300px',
  groupBy = null,
  leftIcon = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    isMultiSelect ? (Array.isArray(value) ? value : []) : []
  );
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

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
          <div className="text-xs text-gray-500 font-medium px-4 pt-2 uppercase tracking-wider ">{group}</div>
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
        className={`flex items-center gap-3 px-4 py-3 rounded-[1.5rem] cursor-pointer transition duration-200 text-sm font-medium
          ${isSelected ? 'bg-primary text-white' : ''}
          ${focusedIndex === index ? 'bg-primary text-white' : 'hover:bg-primary-blue hover:text-white'}`}
        onClick={() => handleSelect(option)}
        onMouseEnter={() => setFocusedIndex(index)}
      >
        {isMultiSelect && (
          <input
            type="checkbox"
            readOnly
            checked={isSelected}
            className="accent-light w-4 h-4"
          />
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

  return (
    <div
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      className={`relative w-full ${className}`}
    >
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={0}
        className={`flex items-center justify-between border px-4 py-3 rounded-full shadow-sm cursor-pointer bg-white text-sm font-medium
          ${disabled ? 'bg-gray-100 text-gray-400' : ''}
          ${error ? 'border-red-500' : 'border-gray-300'}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
      >
        {leftIcon && (
          <img src={leftIcon} alt="icon" className="w-5 h-5 mr-2" />
        )}
        <span className="truncate flex-1 text-left">{getDisplayValue()}</span>
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
          className="absolute z-10 w-full bg-white mt-2 border border-gray-200 rounded-2xl shadow-lg overflow-auto"
          style={{ maxHeight }}
          role="listbox"
          id={`${id}-listbox`}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-light text-sm my-6 py-5"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1 space-y-2">
            {renderOptions()}
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 mt-1">{error}</div>
      )}
    </div>
  );
};

export default Dropdown;

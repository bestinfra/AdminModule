import React, { useRef, type ChangeEvent, useEffect, useState } from 'react'

interface SearchResult {
    UID?:string;
    id?:string;
    UnitName?:string;
    name?:string;
    [key:string]:any;
}
interface SearchProps {
    value:string;
    onChange:(e:ChangeEvent<HTMLInputElement>) => void;
    placeholder?:string;
    onResultClick?:(result:SearchResult)=>void;
    results?: SearchResult[];
    isLoading?:boolean;
    showShortcut?:boolean;
    className?:string;
    type?:string;
    disabled?:boolean;
    required?:boolean;
    error?:string | null;
    name?:string;
}

const Search:React.FC<SearchProps>=({value,onChange,placeholder='Search',onResultClick,results=[],isLoading=false,showShortcut=true,className='',type='text',disabled=false,required=false,error=null,name='search'})=>{
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [isSearching,setIsSearching] = useState(isLoading);
    const[errorState,setErrorState]=useState<string | null>(error);

    useEffect(()=> {
        setIsSearching(isLoading);
    },[isLoading]);

    const handleSearchChange = (e:ChangeEvent<HTMLInputElement>) =>{
        onChange?.(e);
    };

    return(
        <div className={`relative w-full ${className}`}>
            <input
            ref={searchInputRef}
            type={type}
            name={name}
            value={value}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className={`w-full py-3 pl-10 pr-4 border rounded-full shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorState ? 'border-red-300':'border-gray-300'} ${disabled ?'bg-gray-100 text-gray-400':''}`}
            disabled={disabled}
            required={required}
            />

            {/* Search Icon / spinner*/}
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {isSearching ? (
                    <div className="w-4 h-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                ):(
                    <img src="/icons/search.svg" alt="search" className="w-4 h-7 ml-2 mr-2"/>                )}
            </span>

            {/*Keyboard shortcut*/}
            {showShortcut && (
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-xs text-gray-400 hidden sm:flex gap-1 items-center">
                    <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Ctrl</kbd>
                </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {results.map((result)=>(
                        <div 
                        key={result.UID || result.id}
                        className="px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                        onClick={()=>onResultClick?.(result)}
                        >
                            <div className="font-medium text-gray-800">{result.UID || result.id}</div>
                            <div className="text-gray-600">{result.UnitName || result.name}</div>
                        </div>
                    ))}
                </div>
            )}

            {/*Error message*/}
            {errorState && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">
                    {errorState}
                </div>
            )}
        </div>
    );

};

export default Search;
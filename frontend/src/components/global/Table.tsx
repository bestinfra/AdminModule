import PropTypes from 'prop-types';
import Button from '@components/global/Button';
import Dropdown from '@components/global/Dropdown';
import debounce from 'lodash/debounce';
import { useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import TableSkeleton from '@components/skeletons/TableSkeleton';
import { useNavigate } from 'react-router-dom';
import TimeRangeSelector from '@components/global/TimeRangeSelector';


export interface TableData {
    [key: string]: string | number | boolean | null | undefined;
}

export interface Column {
    key: string;
    label: string;
    render?: (
        value: string | number | boolean | null | undefined,
        row: TableData
    ) => ReactNode;
}

interface Action {
    label: string;
    onClick: (row: TableData) => void;
    icon: string;
}

interface ServerPagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface TableProps {
    data: TableData[];
    columns?: Column[];
    actions?: Action[];
    sortable?: boolean;
    searchable?: boolean;
    pagination?: boolean;
    rowsPerPageOptions?: number[];
    initialRowsPerPage?: number;
    onRowClick?: (row: TableData) => void;
    onEdit?: (row: TableData) => void;
    onDelete?: (row: TableData) => void;
    onView?: (row: TableData) => void;
    onPayment?: (row: TableData) => void;
    loading?: boolean;
    emptyMessage?: string;
    serverPagination?: ServerPagination;
    onPageChange?: (page: number, limit: number) => void;
    showSkeletonActionButtons?: boolean;
    onSearch?: (value: string) => void;
    text?: string;
    showActions?: boolean;
    selectable?: boolean;
    selectedRows?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
    rowWrapper?: React.ComponentType<{
        row: TableData;
        index: number;
        children: ReactNode;
    }>;
    // Title functionality props
    showHeader?: boolean;
    headerTitle?: string;
    dateRange?: string;
    // Time range selector props
    availableTimeRanges?: string[];
    selectedTimeRange?: string;
    onTimeRangeChange?: (range: string) => void;
    timeRangeLabels?: Record<string, string>; // New prop for customizable time range labels
    className?: string; // Add className prop
}

interface DefaultRowWrapperProps {
    children: ReactNode;
}

const DefaultRowWrapper: React.FC<DefaultRowWrapperProps> = ({ children }) =>
    children;

const Table: React.FC<TableProps> = ({
    data,
    columns = [
        { key: 'sNo', label: 'S.No' },
        { key: 'unitId', label: 'Unit ID' },
        { key: 'unitName', label: 'Unit Name' },
        { key: 'unitType', label: 'Type' },
        { key: 'sez', label: 'SEZ' },
        { key: 'status', label: 'Status' },
        { key: 'meterNumber', label: 'Meter Number' },
        { key: 'initialReading', label: 'Initial Reading' },
        { key: 'balance', label: 'Balance' },
        { key: 'possessionDate', label: 'Possession Date' },
        { key: 'mobileNumber', label: 'Mobile Number' },
        { key: 'emailAddress', label: 'Email Address' },
    ],
    actions,
    sortable = true,
    searchable = true,
    pagination = true,
    rowsPerPageOptions = [10, 15, 50],
    initialRowsPerPage,
    onRowClick,
    onEdit,
    onDelete,
    onView,
    onPayment,
    loading = false,
    emptyMessage = 'No data available',
    serverPagination,
    onPageChange,
    showSkeletonActionButtons = true,
    onSearch,
    text,
    showActions = true,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    rowWrapper = null,
    // Title functionality props with defaults
    showHeader = false,
    headerTitle = 'Data Table',
    dateRange = '',
    // Time range selector props with defaults
    availableTimeRanges = ['Daily', 'Monthly', 'Yearly'],
    selectedTimeRange = 'Daily',
    onTimeRangeChange = () => {},
    timeRangeLabels = {}, // New prop for customizable time range labels
    className, // Add className prop
}) => {
    const [sortConfig, setSortConfig] = useState<{
        key: string | null;
        direction: 'asc' | 'desc';
    }>({
        key: null,
        direction: 'asc',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<TableData | null>(null);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customRowsPerPage, setCustomRowsPerPage] = useState('');

    const RowWrapper = rowWrapper || DefaultRowWrapper;

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc'
                ? aValue - bValue
                : bValue - aValue;
        }

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
            return sortConfig.direction === 'asc'
                ? aValue === bValue
                    ? 0
                    : aValue
                    ? -1
                    : 1
                : aValue === bValue
                ? 0
                : aValue
                ? 1
                : -1;
        }

        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();

        const aDate = new Date(aString);
        const bDate = new Date(bString);

        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
            return sortConfig.direction === 'asc'
                ? aDate.getTime() - bDate.getTime()
                : bDate.getTime() - aDate.getTime();
        }

        return sortConfig.direction === 'asc'
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
    });

    const filteredData = sortedData.filter((item) => {
        if (!searchTerm) return true;

        if (columns) {
            return columns.some((column) => {
                const value = item[column.key];
                return (
                    value != null &&
                    value
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
            });
        }

        return Object.values(item).some((value) =>
            value?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = serverPagination
        ? serverPagination.totalPages
        : Math.ceil(filteredData.length / rowsPerPage);

    const paginatedData = serverPagination
        ? filteredData
        : filteredData.slice(
              (currentPage - 1) * rowsPerPage,
              currentPage * rowsPerPage
          );

    const handleSort = (key: string) => {
        if (!sortable) return;

        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    const handleActionClick = (
        e: React.MouseEvent,
        action: (row: TableData) => void,
        row: TableData
    ) => {
        e.stopPropagation();
        if (action === onDelete) {
            setSelectedRow(row);
            setShowDeleteModal(true);
        } else {
            action(row);
        }
    };

    const handleConfirmDelete = () => {
        if (selectedRow && onDelete) {
            onDelete(selectedRow);
            setShowDeleteModal(false);
            setSelectedRow(null);
        }
    };

    const navigate = useNavigate();

    // Default view handler if none provided
    const defaultViewHandler = (row: TableData) => {
        console.log('View row:', row);
        
        // Try to get a unique identifier from the row
        const uid = row.uid || row.unitId || row.id || row.meterNumber;
        
        if (uid) {
            // Navigate to ConsumerView page with the UID
            navigate(`/consumer-view/${uid}`);
        } else {
            // Fallback to alert if no UID found
            alert(`Viewing: ${JSON.stringify(row, null, 2)}`);
        }
    };

    const renderActionButtons = (row: TableData) => {
        if (actions && showActions) {
            return (
                <div className="flex items-center gap-4">
                    {actions.map((action, index) => (
                        <span
                            key={index}
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                            }}
                            title={action.label}>
                            <img
                                src={action.icon}
                                alt={action.label}
                                className="w-4 h-4"
                            />
                        </span>
                    ))}
                </div>
            );
        }

        // Always show view icon if showActions is true
        if (showActions) {
            return (
                <div className="flex items-center gap-4">
                    <span
                        className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            (onView || defaultViewHandler)(row);
                        }}
                        title="View">
                        <img
                            src="/icons/eye.svg"
                            alt="View"
                            className="w-4 h-4 text-colorPrimaryDark"
                        />
                    </span>
                    {onPayment && (
                        <span
                            className="cursor-pointer hover:bg-green-50 p-1 rounded"
                            onClick={(e) =>
                                handleActionClick(e, onPayment, row)
                            }
                            title="Payment">
                            <img
                                src="/icons/payment.svg"
                                alt="Payment"
                                className="w-4 h-4"
                            />
                        </span>
                    )}
                    {onEdit && (
                        <span
                            className="cursor-pointer hover:bg-yellow-50 p-1 rounded"
                            onClick={(e) => handleActionClick(e, onEdit, row)}
                            title="Edit">
                            <img
                                src="/icons/user-pen.svg"
                                alt="Edit"
                                className="w-4 h-4"
                            />
                        </span>
                    )}
                    {onDelete && (
                        <span
                            className="cursor-pointer hover:bg-red-50 p-1 rounded"
                            onClick={(e) => handleActionClick(e, onDelete, row)}
                            title="Delete">
                            <img
                                src="/icons/delete.svg"
                                alt="Delete"
                                className="w-4 h-4"
                            />
                        </span>
                    )}
                </div>
            );
        }

        return null;
    };

    const handlePageChangeInternal = (
        newPage: number,
        newRowsPerPage: number = serverPagination
            ? serverPagination.limit
            : rowsPerPage
    ) => {
        if (serverPagination) {
            onPageChange?.(newPage, newRowsPerPage);
        } else {
            setCurrentPage(newPage);
            setRowsPerPage(newRowsPerPage);
        }
    };

    const debouncedSearch = useMemo(
        () =>
            debounce((value) => {
                if (serverPagination && onSearch) {
                    onSearch(value);
                } else {
                    setCurrentPage(1);
                }
            }, 300),
        [serverPagination, onSearch]
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const getActionCount = () => {
        if (actions && showActions) {
            return actions.length;
        }
        return [onView, onPayment, onEdit, onDelete].filter(Boolean).length;
    };

    // const handleRowsPerPageChange = (
    //     e: React.ChangeEvent<HTMLSelectElement>
    // ) => {
    //     const value = e.target.value;
    //     if (value === 'Custom') {
    //         setShowCustomInput(true);
    //     } else {
    //         setShowCustomInput(false);
    //         const newLimit = Number(value);
    //         handlePageChangeInternal(1, newLimit);
    //     }
    // };

    const handleCustomRowsPerPageSubmit = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === 'Enter' && customRowsPerPage) {
            const newLimit = Number(customRowsPerPage);
            if (newLimit > 0) {
                setShowCustomInput(false);
                handlePageChangeInternal(1, newLimit);
            }
        }
    };

    // Selection handlers
    const handleRowSelection = (rowId: string, isSelected: boolean) => {
        if (!onSelectionChange) return;
        
        const newSelectedRows = isSelected
            ? [...selectedRows, rowId]
            : selectedRows.filter(id => id !== rowId);
        
        onSelectionChange(newSelectedRows);
    };

    const handleSelectAll = (isSelected: boolean) => {
        if (!onSelectionChange) return;
        
        const newSelectedRows = isSelected
            ? paginatedData.map(row => String(row.id || row.meterNo || row.unitId || row.ticketNumber || ''))
            : [];
        
        onSelectionChange(newSelectedRows);
    };

    const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => 
        selectedRows.includes(String(row.id || row.meterNo || row.unitId || row.ticketNumber || ''))
    );

    const isIndeterminate = paginatedData.some(row => 
        selectedRows.includes(String(row.id || row.meterNo || row.unitId || row.ticketNumber || ''))
    ) && !isAllSelected;

    // Table content component
    const tableContent = (
        <div className={`w-full ${className || ''}`}>
            {searchable && (
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full h-12 px-4 py-4 bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border placeholder-dark-border dark:text-white dark:placeholder-white rounded-full font-manrope text-base outline-none mb-4"
                    />
                    <span className="absolute right-2 top-2 bg-primary-lightest dark:bg-primary-dark rounded-full w-8 h-8 flex justify-center items-center">
                        <img src="/icons/search-icon.svg" alt="search" />
                    </span>
                </div>
            )}

            <div className="w-full overflow-x-auto">
                <table
                    className="w-full rounded-2xl border bg-white border-primary-border dark:bg-primary-dark rounded-3xl dark:border dark:border-dark-border  border-spacing-0 border-separate overflow-hidden"
                    role="grid"
                    aria-label={text || 'Data Table'}>
                    <thead className="dark:bg-primary-dark-light bg-background-secondary overflow-hidden">
                        <tr className="font-manrope text-base font-normal w-full dark:text-white">
                            {selectable && (
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left font-normal w-12 relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = isIndeterminate;
                                        }}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => handleSort(column.key)}
                                    scope="col"
                                    className={`px-4 py-3 text-left font-base font-normal cursor-pointer w-auto relative ${
                                        sortable ? 'cursor-pointer' : ''
                                    }`}
                                    aria-sort={
                                        sortConfig.key === column.key
                                            ? sortConfig.direction === 'asc'
                                                ? 'ascending'
                                                : 'descending'
                                            : undefined
                                    }>
                                    {column.label}
                                    {sortable &&
                                        sortConfig.key === column.key && (
                                            <span
                                                className="ml-2 inline-flex items-center"
                                                aria-hidden="true">
                                                {sortConfig.direction ===
                                                'asc' ? (   
                                                    <img
                                                        src="icons/arrow-up.svg"
                                                        alt="ascending"
                                                        className="w-3 h-3"
                                                    />
                                                ) : (
                                                    <img
                                                        src="icons/arrow-down.svg"
                                                        alt="descending"
                                                        className="w-3 h-3"
                                                    />
                                                )}
                                            </span>
                                        )}
                                </th>
                            ))}
                            {(showActions ||
                                onEdit ||
                                onDelete ||
                                onView ||
                                onPayment) && (
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left font-normal w-auto relative">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    {loading ? (
                        <TableSkeleton
                            columns={columns}
                            rowCount={rowsPerPage}
                            showSkeletonActionButtons={
                                showSkeletonActionButtons
                            }
                            actionCount={getActionCount()}
                        />
                    ) : (
                        <tbody className="font-manrope text-sm font-normal">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, index) => {
                                    const rowContent = (
                                        <tr
                                            key={`row-${index}`}
                                            onClick={() =>
                                                onRowClick && onRowClick(row)
                                            }
                                            className={`${
                                                onRowClick
                                                    ? 'cursor-pointer hover:bg-primary-50'
                                                    : ''
                                            }`}
                                            role={
                                                onRowClick
                                                    ? 'button'
                                                    : undefined
                                            }
                                            tabIndex={
                                                onRowClick ? 0 : undefined
                                            }>
                                            {selectable && (
                                                <td
                                                    className="px-4 py-3 text-sm font-normal border-b border-primary-border dark:border-dark-border"
                                                    onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(String(row.id || row.meterNo || row.unitId || row.ticketNumber || ''))}
                                                        onChange={(e) => handleRowSelection(String(row.id || row.meterNo || row.unitId || row.ticketNumber || ''), e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                </td>
                                            )}
                                            {columns.map((column) => (
                                                <td
                                                    key={column.key}
                                                    className="px-4 py-3 text-sm font-normal dark:text-white border-b border-primary-border dark:border-dark-border"
                                                    data-label={column.label}>
                                                    {column.key === 'sNo'
                                                        ? (currentPage - 1) *
                                                              rowsPerPage +
                                                          index +
                                                          1
                                                        : column.render
                                                        ? column.render(
                                                              row[column.key],
                                                              row
                                                          )
                                                        : !row[column.key] &&
                                                          row[column.key] !==
                                                              0 &&
                                                          row[column.key] !==
                                                              '0'
                                                        ? 'NA'
                                                        : row[column.key]}
                                                </td>
                                            ))}
                                            {(showActions ||
                                                onEdit ||
                                                onDelete ||
                                                onView ||
                                                onPayment) && (
                                                <td
                                                    className="px-4 py-3 text-sm font-normal  border-b border-primary-border dark:border-dark-border"
                                                    data-label="Actions">
                                                    {renderActionButtons(row)}
                                                </td>
                                            )}
                                        </tr>
                                    );

                                    return (
                                        <RowWrapper
                                            key={`wrapper-${index}`}
                                            row={row}
                                            index={index}
                                            children={rowContent}
                                        />
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={
                                            columns.length +
                                            (showActions ||
                                            onEdit ||
                                            onDelete ||
                                            onView ||
                                            onPayment
                                                ? 1
                                                : 0)
                                        }
                                        className="text-center">
                                        <div
                                            className="py-12 text-secondary rounded-2xl text-sm h-8 flex justify-center items-center capitalize dark:text-white"
                                            role="status">
                                            {emptyMessage}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    )}
                </table>
            </div>

            {pagination &&
                (loading ? (
                    <div className="pt-4 font-manrope">
                        <div>
                            <div className="w-20 h-8 rounded-lg skeleton-pulse" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full skeleton-pulse" />
                            {[1].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-lg skeleton-pulse"
                                />
                            ))}
                            <div className="w-8 h-8 rounded-full skeleton-pulse" />
                        </div>
                    </div>
                ) : (
                    (serverPagination
                        ? serverPagination.totalCount > serverPagination.limit
                        : data.length > rowsPerPage) && (
                        <div className="pt-4 font-manrope flex justify-between items-center">
                            <div className="flex items-center gap-5">
                                <div className="w-32">
                                    <Dropdown
                                        name="rowsPerPage"
                                        value={String(serverPagination ? serverPagination.limit : rowsPerPage)}
                                        onChange={(e) => {
                                            const newLimit = Number(e.target.value);
                                            handlePageChangeInternal(1, newLimit);
                                        }}
                                        options={rowsPerPageOptions.map(option => ({
                                            value: String(option),
                                            label: `${option} Per Page`
                                        }))}
                                        placeholder="Select rows"
                                        searchable={false}
                                        className="text-sm whitespace-nowrap"
                                    />
                                </div>
                                {showCustomInput && (
                                    <input
                                        type="number"
                                        value={customRowsPerPage}
                                        onChange={(e) =>
                                            setCustomRowsPerPage(e.target.value)
                                        }
                                        onKeyDown={
                                            handleCustomRowsPerPageSubmit
                                        }
                                        placeholder="Enter number"
                                        min="1"
                                        className="bg-white dark:bg-gray-800 border border-primary-border dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 px-3 py-2 rounded-full h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-manrope"
                                    />
                                )}
                                <span className="whitespace-nowrap text-sm font-normal text-[var(--color-secondary-300)] font-manrope">
                                    Total:{' '}
                                    {serverPagination
                                        ? serverPagination.totalCount
                                        : data.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    label="Previous"
                                    variant="outlineSecondary"
                                    size="small"
                                    onClick={() =>
                                        handlePageChangeInternal(
                                            serverPagination
                                                ? serverPagination.currentPage -
                                                      1
                                                : currentPage - 1
                                        )
                                    }
                                    disabled={
                                        serverPagination
                                            ? !serverPagination.hasPrevPage
                                            : currentPage === 1
                                    }
                                />
                                <span className="text-sm font-manrope text-[var(--color-secondary-300)]">
                                    Page{' '}
                                    {serverPagination
                                        ? serverPagination.currentPage
                                        : currentPage}{' '}
                                    of {totalPages}
                                </span>
                                <Button
                                    label="Next"
                                    variant="outlineSecondary"
                                    size="small"
                                    onClick={() =>
                                        handlePageChangeInternal(
                                            serverPagination
                                                ? serverPagination.currentPage +
                                                      1
                                                : currentPage + 1
                                        )
                                    }
                                    disabled={
                                        serverPagination
                                            ? !serverPagination.hasNextPage
                                            : currentPage === totalPages
                                    }
                                />
                            </div>
                        </div>
                    )
                ))}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-primary-lightest-900/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl w-[22%] flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">
                                Delete Confirmation
                            </div>
                            <span
                                className="cursor-pointer"
                                onClick={() => setShowDeleteModal(false)}>
                                <img src="icons/close.svg" alt="close" />
                            </span>
                        </div>
                        <p>
                            Are you sure you want to delete the selected {text}?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <Button
                                label="Delete"
                                onClick={handleConfirmDelete}
                                variant="danger"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // If no header, return simple table
    if (!showHeader) {
        return tableContent;
    }

    // Return table with header
    return (
        <div className={`bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl font-manrope ${className || ''}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
            {/* Header Section */}
            <div className="flex justify-between items-center gap-4 bg-background-secondary dark:bg-primary-dark-light rounded-t-3xl p-4">
                <div className="font-medium text-neutral-darker dark:text-surface font-manrope" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {headerTitle}
                    {dateRange && (
                        <span className="text-xs font-normal text-neutral-dark dark:text-surface ml-1 font-manrope" style={{ fontFamily: 'Manrope, sans-serif' }}>
                            ({dateRange})
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                  <TimeRangeSelector
                    availableTimeRanges={availableTimeRanges}
                    selectedTimeRange={selectedTimeRange}
                    handleTimeRangeChange={onTimeRangeChange}
                    timeRangeLabels={timeRangeLabels}
                  />
                </div>
            </div>
            
            {/* Content Section */}
            <div className="px-4 py-4">
                {tableContent}
            </div>
        </div>
    );
};

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ),
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            icon: PropTypes.string.isRequired,
        })
    ),
    sortable: PropTypes.bool,
    searchable: PropTypes.bool,
    pagination: PropTypes.bool,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    initialRowsPerPage: PropTypes.number,
    onRowClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onView: PropTypes.func,
    onPayment: PropTypes.func,
    loading: PropTypes.bool,
    emptyMessage: PropTypes.string,
    serverPagination: PropTypes.shape({
        currentPage: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        totalCount: PropTypes.number.isRequired,
        limit: PropTypes.number.isRequired,
        hasNextPage: PropTypes.bool.isRequired,
        hasPrevPage: PropTypes.bool.isRequired,
    }),
    onPageChange: PropTypes.func,
    showActions: PropTypes.bool,
    rowWrapper: PropTypes.func,
    text: PropTypes.string,
    // Title functionality props
    showHeader: PropTypes.bool,
    headerTitle: PropTypes.string,
    dateRange: PropTypes.string,
    // Time range selector props
    availableTimeRanges: PropTypes.arrayOf(PropTypes.string),
    selectedTimeRange: PropTypes.string,
    onTimeRangeChange: PropTypes.func,
    timeRangeLabels: PropTypes.object, // New prop for customizable time range labels
};

export default Table;

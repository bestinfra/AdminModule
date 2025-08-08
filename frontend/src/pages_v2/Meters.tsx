import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import Form from '@/components/Form/Form';
import type { TableData } from '@/components/global/Table';
import type { FormInputConfig, FormInputValue } from '@/components/Form/types';
import BACKEND_URL from '../config';

export default function Meters() {
    const navigate = useNavigate();
    const [meterData, setMeterData] = useState<
        {
            id: number;
            title: string;
            value: string | number;
            icon: string;
            subtitle1: string;
            subtitle2: string;
            iconStyle?: any;
        }[]
    >([]);

    const [tableData, setTableData] = useState<TableData[]>([]);
    const [serverPagination, setServerPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 8,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [filters, setFilters] = useState({
        status: 'all',
        meterType: 'all',
        meterMake: 'all',
        location: 'all',
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState<TableData | null>(null);

    // Form configuration for editing meter
    const editMeterFormFields: FormInputConfig[] = [
        {
            name: 'meterSerialNumber',
            label: 'Meter Serial Number',
            type: 'text',
            placeholder: 'Enter meter serial number',
            required: true,
            row: 1,
            col: 1,
        },
        {
            name: 'modemSerialNumber',
            label: 'Modem Serial Number',
            type: 'text',
            placeholder: 'Enter modem serial number',
            required: true,
            row: 1,
            col: 2,
        },
        {
            name: 'meterType',
            label: 'Meter Type',
            type: 'dropdown',
            placeholder: 'Select meter type',
            required: true,
            row: 2,
            col: 1,
            options: [
                { value: 'Smart', label: 'Smart' },
                { value: 'Digital', label: 'Digital' },
                { value: 'Analog', label: 'Analog' },
            ],
        },
        {
            name: 'meterMake',
            label: 'Meter Make',
            type: 'text',
            placeholder: 'Enter meter make',
            required: true,
            row: 2,
            col: 2,
        },
        {
            name: 'consumerName',
            label: 'Consumer Name',
            type: 'text',
            placeholder: 'Enter consumer name',
            required: true,
            row: 3,
            col: 1,
        },
        {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'Enter location',
            required: true,
            row: 3,
            col: 2,
        },
        {
            name: 'installationDate',
            label: 'Installation Date',
            type: 'date',
            placeholder: 'Select installation date',
            required: true,
            row: 4,
            col: 1,
        },
        {
            name: 'status',
            label: 'Status',
            type: 'dropdown',
            placeholder: 'Select status',
            required: true,
            row: 4,
            col: 2,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'maintenance', label: 'Maintenance' },
            ],
        },
    ];



    // Demo data for fallback - Using BRAND_GREEN (default) for all cards
    const [demoMeterData] = useState([
        {
            id: 1,
            title: 'Total Meters',
            value: 1200,
            subtitle1: '1100 Active',
            subtitle2: '100 In-Active',
            icon: 'icons/meter.svg',
        },
        {
            id: 2,
            title: 'Meter Makes',
            value: 5,
            subtitle1: '1 Used Meter Makes',
            subtitle2: '',
            icon: 'icons/meter-bolt.svg',
        },
        {
            id: 3,
            title: 'Mapped Meters',
            value: 3,
            subtitle1: '86 Unmapped',
            subtitle2: '0 Replaced',
            icon: 'icons/mapped-meter.svg',
        },
        {
            id: 4,
            title: 'Connection Type',
            value: 'Prepaid',
            subtitle1: '3 Prepaid',
            subtitle2: '0 Postpaid',
            icon: 'icons/connection-type.svg',
        },
    ]);
    const [demoTableData] = useState([
        {
            sNo: 1,
            meterSerialNumber: 'MTR-1001',
            modemSerialNumber: 'MDM-2001',
            meterType: 'Smart',
            meterMake: 'MakeA',
            consumerName: 'John Doe',
            location: 'Building 1',
            installationDate: '2024-01-01',
            meterNumber: 'MTR-1001',
        },
        {
            sNo: 2,
            meterSerialNumber: 'MTR-1002',
            modemSerialNumber: 'MDM-2002',
            meterType: 'Digital',
            meterMake: 'MakeB',
            consumerName: 'Jane Smith',
            location: 'Building 2',
            installationDate: '2024-02-15',
            meterNumber: 'MTR-1002',
        },
        {
            sNo: 3,
            meterSerialNumber: 'MTR-1003',
            modemSerialNumber: 'MDM-2003',
            meterType: 'Smart',
            meterMake: 'MakeA',
            consumerName: 'Alice Brown',
            location: 'Building 3',
            installationDate: '2024-03-10',
            meterNumber: 'MTR-1003',
        },
    ]);
    // const [demoAllMeters] = useState([
    //     {
    //         meterType: 'Smart',
    //         meterMake: 'MakeA',
    //         location: 'Building 1',
    //     },
    //     {
    //         meterType: 'Digital',
    //         meterMake: 'MakeB',
    //         location: 'Building 2',
    //     },
    //     {
    //         meterType: 'Smart',
    //         meterMake: 'MakeA',
    //         location: 'Building 3',
    //     },
    // ]);

    const fetchMeters = (page = 1, limit = 8, filtersOverride = filters) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        if (filtersOverride.status && filtersOverride.status !== 'all')
            params.append('status', filtersOverride.status);
        if (filtersOverride.meterType && filtersOverride.meterType !== 'all')
            params.append('type', filtersOverride.meterType);
        if (filtersOverride.meterMake && filtersOverride.meterMake !== 'all')
            params.append('manufacturer', filtersOverride.meterMake);
        if (filtersOverride.location && filtersOverride.location !== 'all')
            params.append('location', filtersOverride.location);
        fetch(`${BACKEND_URL}/meters?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setTableData(
                        data.data.map((row: any) => ({
                            ...row,
                            meterMake: row.meterMake || row.manufacturer || '',
                        }))
                    );
                    setServerPagination(data.pagination);
                } else {
                    throw new Error(
                        data.message || 'Failed to fetch meter table'
                    );
                }
            })
            .catch((err) => {
                console.error(err.message || 'Failed to fetch meter table');
                setTableData(demoTableData);
                setServerPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: demoTableData.length,
                    limit: demoTableData.length,
                    hasNextPage: false,
                    hasPrevPage: false,
                });
            });
    };

    useEffect(() => {
        fetch(`${BACKEND_URL}/meters/stats`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const stats = data.data;
                    const cards = [
                        {
                            id: 1,
                            title: 'Total Meters',
                            value: stats.totalMeters,
                            subtitle1: '1100 Active',
                            subtitle2: '',
                            icon: 'icons/meter.svg',
                        },
                        {
                            id: 2,
                            title: 'Meter Makes',
                            value: stats.makes?.length ?? 0,
                            subtitle1: 'Unique Makes',
                            subtitle2: '',
                            icon: 'icons/meter-make.svg',
                        },
                        {
                            id: 3,
                            title: 'Meter Types',
                            value: stats.types?.length ?? 0,
                            subtitle1: 'Unique Types',
                            subtitle2: '',
                            icon: 'icons/mapped-meter.svg',
                        },
                        {
                            id: 4,
                            title: 'Connection Types',
                            value: Object.keys(stats.connectionTypes || {})
                                .length,
                            subtitle1: 'Unique Connection Types',
                            subtitle2: '',
                            icon: 'icons/connection-type.svg',
                        },
                    ];
                    setMeterData(cards);
                } else {
                    throw new Error(
                        data.message || 'Failed to fetch meter stats'
                    );
                }
            })
            .catch((err) => {
                console.error(err.message || 'Failed to fetch meter stats');
                setMeterData(demoMeterData);
            });
        fetchMeters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const handleFilterChange = (e: {
        target: { name: string; value: string };
    }) => {
        setFilters((f) => {
            const newFilters = { ...f, [e.target.name]: e.target.value };
            fetchMeters(1, 8, newFilters);
            return newFilters;
        });
    };

    const handlePageChange = (page: number, limit: number) => {
        fetchMeters(page, limit);
    };

    // Handle edit meter
    const handleEditMeter = (row: TableData) => {
        setSelectedMeter(row);
        setIsEditModalOpen(true);
    };

    // Handle save meter changes
    const handleSaveMeter = async (formData: Record<string, FormInputValue>) => {
        setIsLoading(true);
        try {
            // Here you would typically make an API call to update the meter
            console.log('Saving meter data:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update the table data with the new values
            setTableData(prevData => 
                prevData.map(meter => 
                    meter.meterNumber === selectedMeter?.meterNumber 
                        ? { 
                            ...meter, 
                            meterSerialNumber: String(formData.meterSerialNumber || ''),
                            modemSerialNumber: String(formData.modemSerialNumber || ''),
                            meterType: String(formData.meterType || ''),
                            meterMake: String(formData.meterMake || ''),
                            consumerName: String(formData.consumerName || ''),
                            location: String(formData.location || ''),
                            installationDate: String(formData.installationDate || ''),
                            status: String(formData.status || ''),
                        }
                        : meter
                )
            );
            
            setIsEditModalOpen(false);
            setSelectedMeter(null);
        } catch (error) {
            console.error('Error saving meter:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle close modal
    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedMeter(null);
    };

    const [tableColumns] = useState([
        { key: 'sNo', label: 'Sl No' },
        { key: 'meterSerialNumber', label: 'Meter SI No' },
        { key: 'modemSerialNumber', label: 'Modem SI No' },
        { key: 'meterType', label: 'Meter Type' },
        { key: 'meterMake', label: 'Meter Make' },
        { key: 'consumerName', label: 'Consumer Name' },
        { key: 'location', label: 'Location' },
        { key: 'installationDate', label: 'Installation Date' },
        { key: 'status', label: 'Status' },
    ]);

    // Generate filter options from allMeters
    const meterTypeOptions = [
        // { value: 'all', label: 'Filter By Status' },
        // ...Array.from(new Set(allMeters.map((row) => row.meterType)))
        //     .filter(Boolean)
        //     .map((type) => ({ value: type, label: type })),
        { value: 'active', label: 'Active' },
        { value: 'replaced', label: 'Replaced' },
        { value: 'inactive', label: 'Inactive' },
    ];
    const meterMakeOptions = [
        // { value: 'all', label: 'Filter By Meter Types' },
        // ...Array.from(new Set(allMeters.map((row) => row.meterMake)))
        //     .filter(Boolean)
        //     .map((make) => ({ value: make, label: make })),
        { value: 'prepaid', label: 'Prepaid' },
        { value: 'postpaid', label: 'Postpaid' },
    ];
    const locationOptions = [
        // { value: 'all', label: 'Filter By Mapping' },
        // ...Array.from(new Set(allMeters.map((row) => row.location)))
        //     .filter(Boolean)
        //     .map((loc) => ({ value: loc, label: loc })),
        { value: 'mapped', label: 'Mapped' },
        { value: 'unmapped', label: 'Unmapped' },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    {
                        layout: {
                            type: 'row',
                            className: '',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'Meters List',
                                    onBackClick: () => window.history.back(),
                                    backButtonText: 'Back to Dashboard',
                                    // buttonsLabel: 'Add Meter',
                                    variant: 'primary',
                                    onClick: () =>
                                        console.log('Adding new meter...'),
                                    showMenu: true,
                                    showDropdown: false,
                                    menuItems: [
                                        { id: 'all', label: 'All Meters' },
                                        {
                                            id: 'active',
                                            label: 'Active Meters',
                                        },
                                        {
                                            id: 'inactive',
                                            label: 'Inactive Meters',
                                        },
                                        {
                                            id: 'maintenance',
                                            label: 'Maintenance',
                                        },
                                        { id: 'smart', label: 'Smart Meters' },
                                        {
                                            id: 'digital',
                                            label: 'Digital Meters',
                                        },
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        console.log(`Filter by: ${itemId}`);
                                    },
                                },
                            },
                        ],
                    },
                    {
                        layout: {
                            type: 'column',
                            rows: [
                                {
                                    layout: 'row',
                                    columns: meterData.map((meter) => ({
                                         name: 'Card',
                                         props: {
                                             title: meter.title,
                                             value: meter.value,
                                             icon: meter.icon,
                                             subtitle1: meter.subtitle1,
                                             subtitle2: meter.subtitle2,
                                             bg: "bg-stat-icon-gradient",
                                         },
                                     })),
                                },
                            ],
                        },
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 3,
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Dropdown',
                                            props: {
                                                name: 'meterType',
                                                options: meterTypeOptions,
                                                placeholder: 'Filter By Status',
                                                value: filters.meterType,
                                                onChange: handleFilterChange,
                                                className: 'w-48',
                                            },
                                        },
                                        {
                                            name: 'Dropdown',
                                            props: {
                                                name: 'meterMake',
                                                options: meterMakeOptions,
                                                placeholder: 'Filter By Meter Types',
                                                value: filters.meterMake,
                                                onChange: handleFilterChange,
                                                className: 'w-48',
                                            },
                                        },
                                        {
                                            name: 'Dropdown',
                                            props: {
                                                name: 'location',
                                                options: locationOptions,
                                                placeholder:
                                                    'Filter By Mapping',
                                                value: filters.location,
                                                onChange: handleFilterChange,
                                                className: 'w-48',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        layout: {
                            type: 'row',
                            gap: 'gap-4',
                            className: 'w-full',
                            rows: [
                                {
                                    layout: 'row',
                                    className: 'w-full',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: tableData,
                                                columns: tableColumns,
                                                showHeader: false,
                                                headerTitle: 'Meter Management',
                                                dateRange: 'Real-time data',
                                                searchable: true,
                                                sortable: true,
                                                pagination: true,
                                                showActions: true,
                                                text: 'Meter Management Table',
                                                serverPagination:
                                                    serverPagination,
                                                onPageChange: handlePageChange,
                                                onEdit: handleEditMeter,
                                                onView: (row: TableData) =>
                                                    navigate(
                                                        `/meter-details/${row.meterNumber}`
                                                    ),
                                                className: 'w-full',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                                         },
                     // Edit Meter Modal Section
                     {
                         layout: {
                             type: 'row',
                             className: '',
                         },
                         components: [
                             {
                                 name: 'Modal',
                                 props: {
                                     isOpen: isEditModalOpen,
                                     onClose: handleCloseModal,
                                     title: `Edit Meter - ${selectedMeter?.meterSerialNumber || selectedMeter?.meterNumber || ''}`,
                                     size: 'lg',
                                     showCloseIcon: true,
                                     backdropClosable: !isLoading,
                                     showForm: true,
                                     formFields: editMeterFormFields,
                                     onSave: handleSaveMeter,
                                     saveButtonLabel: isLoading ? "Saving..." : "Save Changes",
                                     cancelButtonLabel: "Cancel",
                                     formInitialData: selectedMeter ? {
                                         meterSerialNumber: selectedMeter.meterSerialNumber || '',
                                         modemSerialNumber: selectedMeter.modemSerialNumber || '',
                                         meterType: selectedMeter.meterType || '',
                                         meterMake: selectedMeter.meterMake || '',
                                         consumerName: selectedMeter.consumerName || '',
                                         location: selectedMeter.location || '',
                                         installationDate: selectedMeter.installationDate || '',
                                         status: selectedMeter.status || '',
                                     } : {},
                                     gridLayout: {
                                         gridRows: 4,
                                         gridColumns: 2,
                                         gap: 'gap-4',
                                         className: 'w-full',
                                     },
                                 },
                             },
                         ],
                     },
                 ]}
             />
        </Suspense>
    );
}

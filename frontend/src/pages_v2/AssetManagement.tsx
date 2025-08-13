import { Suspense, useState, useEffect } from 'react';
import { lazy } from 'react';
import BACKEND_URL from '../config';
const Page = lazy(() => import('@/components/global/PageC'));

// --- Types ---
interface HierarchyNode {
    hierarchy_id: string | number;
    hierarchy_name: string;
    hierarchy_type_title: string;
    children?: HierarchyNode[];
}

const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const ListIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default function AssetManagment() {
    const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [hierarchicalData, setHierarchicalData] = useState<HierarchyNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch hierarchical assets from API
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BACKEND_URL}/assets`);
                const data = await response.json();
                
                if (data.success) {
                    // Check if data is N/A, null, undefined, or empty
                    if (!data.data || data.data === 'N/A' || data.data === null || data.data === undefined || 
                        (Array.isArray(data.data) && data.data.length === 0)) {
                        setError('No nodes data available');
                        setHierarchicalData([]);
                    } else {
                        setHierarchicalData(data.data);
                    }
                } else {
                    setError(data.message || 'Failed to fetch assets');
                }
            } catch (err) {
                setError('We were unable to load your Assets. try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssets().catch(console.error);
    }, []);
    const [isSubNodeChecked, setIsSubNodeChecked] = useState(false);

    const handleTabChange = (newTabIndex: number) => {
        setActiveTab(newTabIndex);
        setIsSubNodeChecked(false); // Reset checkbox state when switching tabs
        console.log('Switched to tab:', newTabIndex);
    };

    const handleCheckboxChange = (checked: boolean) => {
        setIsSubNodeChecked(checked);
    };

    const tabs = [
        {
            label: 'Add Asset Name',
            content: null,
            icon: <PlusIcon />
        },
        {
            label: 'Upload List',
            content: null,
            icon: <ListIcon />
        },
        {
            label: 'Template',
            content: null,
            icon: <DownloadIcon />
        }
    ];

    // --- Generate form fields for each tab ---
    const generateFormFieldsForTab = (tabIndex: number) => {
        switch (tabIndex) {
            case 0: // Add Asset Name - Search and Input fields
                const baseFields = [
                    {
                        name: 'assetTitle',
                        type: 'text',
                        label: 'Asset Title',
                        placeholder: 'Asset Title (Ex. Locations)',
                        required: true,
                        validation: {
                            required: 'Asset title is required'
                        },
                        rightIcon: '/icons/search.svg'
                    },
                    {
                        name: 'assetName',
                        type: 'text',
                        label: 'Asset Name',
                        placeholder: 'Search and select asset name',
                        required: true,
                        validation: {
                            required: 'Asset name is required'
                        },
                    },
                    {
                        name: 'isSubNode',
                        type: 'checkbox',
                        label: 'Choose an asset below to assign this as a Sub Node.',
                        labelClassName: 'text-sm text-TextSecondary dark:text-gray-400',
                        checkboxLabelClassName: 'text-TextSecondary font-normal',
                        onChange: handleCheckboxChange
                    }
                ];

                // Add conditional field when checkbox is checked
                if (isSubNodeChecked) {
                    baseFields.push({
                        name: 'parentAssetSearch',
                        type: 'text',
                        label: '',
                        placeholder: 'Search for parent Node',
                        required: true,
                        validation: {
                            required: 'Parent asset is required when creating a sub node'
                        },
                        rightIcon: '/icons/search.svg'
                    });
                }

                return baseFields;
            
            case 1: // Upload List - Drag and Drop
                return [
                    {
                        name: 'uploadFile',
                        type: 'chosenfile',
                        label: 'Upload File',
                        rightIcon: '/icons/search.svg',
                        placeholder: 'Drag and drop files here or click to browse',
                        required: true,
                        validation: {
                            required: 'File is required'
                        },
                        accept: '.csv,.xlsx,.xls',
                        multiple: true,
                        dragAndDrop: true
                    },
                ];
            
            case 2: // Template - Search only
                return [
                    {
                        name: 'templateSearch',
                        type: 'text',
                        label: 'Search Templates',
                        placeholder: 'Asset Title (Ex. Locations)',
                        required: false,
                        rightIcon: '/icons/search.svg'
                    },
                ];
            
            default:
                return [];
        }
    };

    // --- Get current form fields based on active tab ---
    const currentFormFields = generateFormFieldsForTab(activeTab);

    // --- Get current save button label ---
    const getSaveButtonLabel = () => {
        switch (activeTab) {
            case 0: return 'Create Asset';
            case 1: return 'Create List';
            case 2: return 'Download';
            default: return 'Save';
        }
    };

    // Recursive function to map all hierarchy levels
    const mapHierarchyRecursively = (nodes: HierarchyNode[]): any[] => {
        return nodes.map(node => ({
            id: node.hierarchy_id,
            name: node.hierarchy_name,
            hierarchy_type_title: node.hierarchy_type_title,
            children: node.children ? mapHierarchyRecursively(node.children) : []
        }));
    };

    // Recursive function to map hierarchy for NodeChart
    const mapHierarchyForNodeChart = (nodes: HierarchyNode[]): any[] => {
        return nodes.map(node => ({
            name: node.hierarchy_name,
            backgroundColor: "#e3f2fd",
            borderColor: "",
            textColor: "#424242",
            Areas: node.children ? mapHierarchyForNodeChart(node.children) : []
        }));
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading assets...</p>
                </div>
            </div>
        );
    }

    // Define sections with Error component always present
    const sections = [
        {
            layout: {
                type: 'column' as const,
                gap: 'gap-4',
                rows: [
                    {
                        layout: 'column' as const,
                        columns: [
                            // Only show Error component when there's an actual error
                            {
                                name: 'Error',
                                props: {
                                    message: error, 
                                    onRetry: () => window.location.reload(),
                                    showRetry: true,
                                },
                                span: { col: 1, row: 1 },
                            },

                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'Asset Management',
                                    onBackClick: () => window.history.back(),
                                    backButtonText: 'Back to Dashboard',
                                    buttonsLabel: 'Add Asset',
                                    variant: 'primary',
                                    onClick: () => {
                                        console.log('Add Asset');
                                        setIsAddAssetModalOpen(true);
                                    },  
                                    span: { col: 1, row: 1 },
                                },
                            },
                        ],
                    },
                ],
            },
        },
        {
            layout: {
                type: 'grid' as const,
                columns: 4,
                className: 'h-full',
                rows: [
                    {
                        layout: 'row' as const,
                        className:
                            'border border-primary-border dark:border-dark-border rounded-3xl overflow-hidden',
                        columns: [
                            {
                                name: 'TopLevelHierarchy',
                                props: {
                                    nodes: mapHierarchyRecursively(hierarchicalData),
                                    title: 'Asset Hierarchy',
                                },
                            },
                        ],
                    },
                   
                    {
                        layout: 'row' as const,
                        span: { col: 3, row: 1 },
                        className: 'h-full border border-primary-border dark:border-dark-border rounded-3xl overflow-hidden',
                        columns: [
                            {
                                name: 'NodeChart',
                                props: {
                                    data: {
                                        Location: mapHierarchyForNodeChart(hierarchicalData)
                                    },
                                    width: '100%',
                                    height: '100%',
                                    enableZoom: true,
                                    minZoom: 0.3,
                                    maxZoom: 2,
                                    initialZoom: 0.8,
                                    layout: 'horizontal', // Change to 'vertical' for vertical layout
                                    EdgeStyleLayout: 'polyline', // Try different styles: 'straight', 'elbow', 'curved', 'spline', 'arc', 'step', 'bezier', 'polyline'

                                },
                            },
                        ],
                    },
                ],
            },
        },
        {
            layout: {
                type: 'column' as const,
                gap: 'gap-0',
                rows: [
                    {
                        layout: 'row' as const,
                        columns: [
                            {
                                name: 'Modal',
                                props: {
                                    isOpen: isAddAssetModalOpen,
                                    onClose: () => {
                                        setIsAddAssetModalOpen(false);
                                        setActiveTab(0); // Reset to first tab when closing
                                        setIsSubNodeChecked(false); // Reset checkbox state
                                    },
                                    title: 'Add New Asset',
                                    size: 'xl',
                                    showCloseIcon: true,
                                    showTabs: true,
                                    tabs: tabs,
                                    activeTabIndex: activeTab,
                                    onTabChange: handleTabChange,
                                    showForm: true,
                                    formFields: currentFormFields,
                                    onSave: (formData: Record<string, any>) => {
                                        console.log('Asset form data:', formData);
                                        console.log('Active tab:', activeTab);
                                        // TODO: Implement asset creation logic based on active tab
                                        setIsAddAssetModalOpen(false);
                                    },
                                    saveButtonLabel: getSaveButtonLabel(),
                                    cancelButtonLabel: 'Cancel',
                                    cancelButtonVariant: 'secondary',
                                    confirmButtonVariant: 'primary',
                                    formId: 'add-asset-form',
                                    gridLayout: {
                                        gridRows: currentFormFields.length,
                                        gridColumns: 1,
                                        gap: 'gap-4'
                                    },
                                    tabsSize: 'md',
                                    tabsShowTabIcons: true,
                                    tabsShowTabLabels: true,
                                    tabsTabListClassName: 'bg-gray-50 border-gray-200',
                                    tabsActiveTabButtonClassName: 'bg-blue-600 text-white',
                                    tabsInactiveTabButtonClassName: 'text-gray-600 hover:bg-gray-100',
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page sections={sections} />
        </Suspense>
    );
}

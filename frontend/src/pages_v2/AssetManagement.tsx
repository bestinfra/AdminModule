import { Suspense, useState } from 'react';
import { lazy } from 'react';
const Page = lazy(() => import('@/components/global/PageC'));

// interface HierarchyNode {
//     hierarchy_id: string | number;
//     hierarchy_name: string;
//     hierarchy_type_title: string;
//     children?: HierarchyNode[];
// }

// interface AreaNode {
//     name: string;
// }

// interface LocationNode {
//     name: string;
//     Areas: AreaNode[];
// }

// interface LocationData {
//     Location: LocationNode[];
// }

interface SubAreaNode {
    name: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    icon?: string;
}

interface AreaWithSubAreasNode {
    name: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    icon?: string;
    SubAreas: SubAreaNode[];
}

interface LocationWithSubAreasNode {
    name: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    icon?: string;
    Areas: AreaWithSubAreasNode[];
}

interface Location2Data {
    Location: LocationWithSubAreasNode[];
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

    const handleTabChange = (newTabIndex: number) => {
        setActiveTab(newTabIndex);
        console.log('Switched to tab:', newTabIndex);
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

   
    const dummyLocation2Data: Location2Data = {
        "Location": [
            {
                "name": "Hyderabad",
                "backgroundColor": "#e3f2fd",
                "borderColor": "",
                'textColor':'#424242',
                "Areas": [
                    {
                        "name": "Banjara Hills",
                        "SubAreas": [
                            { 
                                "name": "Road No 1"
                            },
                            { 
                                "name": "Road No 12"
                            },
                            { 
                                "name": "Journalist Colony"
                            }
                        ]
                    },
                    {
                        "name": "Gachibowli",
                        "SubAreas": [
                            { 
                                "name": "Wipro Circle"
                            },
                            { 
                                "name": "Nallagandla"
                            },
                            { 
                                "name": "Tata Nagar"
                            }
                        ]
                    },
                    {
                        "name": "Hitech City",
                        "SubAreas": [
                            { 
                                "name": "Cyber Towers"
                            },
                            { 
                                "name": "Mindspace"
                            },
                            { 
                                "name": "Raidurg"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Warangal",
                "backgroundColor": "#e3f2fd",
                "borderColor": "",
                'textColor':'#424242',
                "Areas": [
                    {
                        "name": "Hanamkonda",
                        "SubAreas": [
                            { "name": "Subedari" },
                            { "name": "Kishanpura" },
                            { "name": "Balasamudram" }
                        ]
                    },
                    {
                        "name": "Kazipet",
                        "SubAreas": [
                            { "name": "Fatimanagar" },
                            { "name": "Teachers Colony" },
                            { "name": "Fathenagar" }
                        ]
                    },
                    {
                        "name": "Fort Road",
                        "SubAreas": [
                            { "name": "Saraswati Nagar" },
                            { "name": "Krishna Nagar" },
                            { "name": "Fort Park" }
                        ]
                    }
                ]
            },
            // {
            //     "name": "Nizamabad",
            //     "Areas": [
            //         {
            //             "name": "Kamareddy",
            //             "SubAreas": [
            //                 { "name": "Housing Board" },
            //                 { "name": "Rajampet" },
            //                 { "name": "Shivaji Chowk" }
            //             ]
            //         },
            //         {
            //             "name": "Bodhan",
            //             "SubAreas": [
            //                 { "name": "Shakkar Nagar" },
            //                 { "name": "Aziz Nagar" },
            //                 { "name": "Dargha Road" }
            //             ]
            //         },
            //         {
            //             "name": "Armoor",
            //             "SubAreas": [
            //                 { "name": "Mahatma Nagar" },
            //                 { "name": "Ramalakshmi Nagar" },
            //                 { "name": "Market Area" }
            //             ]
            //         }
            //     ]
            // },
            // {   
            //     "name": "Khammam",
            //     "Areas": [
            //         {
            //             "name": "Wyra",
            //             "SubAreas": [
            //                 { "name": "Lakshmipuram" },
            //                 { "name": "Gokul Nagar" },
            //                 { "name": "Wyra Road" }
            //             ]
            //         },
            //         {
            //             "name": "Madhira",
            //             "SubAreas": [
            //                 { "name": "Old Bus Stand" },
            //                 { "name": "Chowrastha" },
            //                 { "name": "Station Area" }
            //             ]
            //         },
            //         {
            //             "name": "Manchikanti Nagar",
            //             "SubAreas": [
            //                 { "name": "Green Park" },
            //                 { "name": "Manchikanti Colony" },
            //                 { "name": "New Layout" }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     "name": "Karimnagar",
            //     "Areas": [
            //         {
            //             "name": "Mancherial",
            //             "SubAreas": [
            //                 { "name": "Coal Mine Colony" },
            //                 { "name": "Shivaji Nagar" },
            //                 { "name": "Ram Nagar" }
            //             ]
            //         },
            //         {
            //             "name": "Sircilla",
            //             "SubAreas": [
            //                 { "name": "Textile Market" },
            //                 { "name": "Sircilla Colony" },
            //                 { "name": "Main Road" }
            //             ]
            //         },
            //         {
            //             "name": "Vemulawada",
            //             "SubAreas": [
            //                 { "name": "Temple Street" },
            //                 { "name": "Vemulawada Colony" },
            //                 { "name": "New Bus Stand" }
            //             ]
            //         }
            //     ]
            // }
        ]
    };


    // --- Generate form fields for each tab ---
    const generateFormFieldsForTab = (tabIndex: number) => {
        switch (tabIndex) {
            case 0: // Add Asset Name - Search and Input fields
                return [
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
                        checkboxLabelClassName: 'text-TextSecondary font-normal'
                    }
                ];
            
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

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page  
                sections={[
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row',
                                    columns: [
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
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        layout: {
                            type: 'grid',
                            columns: 4,
                            className: 'h-full',
                            rows: [
                                {
                                    layout: 'row',
                                    className:
                                        'border border-primary-border dark:border-dark-border rounded-3xl overflow-hidden',
                                    columns: [
                                        {
                                            name: 'TopLevelHierarchy',
                                            props: {
                                                nodes: dummyLocation2Data.Location.map((location, locationIndex) => ({
                                                    id: `location-${locationIndex}`,
                                                    name: location.name,
                                                    hierarchy_type_title: 'Location',
                                                    children: location.Areas.map((area, areaIndex) => ({
                                                        id: `area-${locationIndex}-${areaIndex}`,
                                                        name: area.name,
                                                        hierarchy_type_title: 'Area',
                                                        children: area.SubAreas.map((subArea, subAreaIndex) => ({
                                                            id: `subarea-${locationIndex}-${areaIndex}-${subAreaIndex}`,
                                                            name: subArea.name,
                                                            hierarchy_type_title: 'SubArea'
                                                        }))
                                                    }))
                                                })),
                                                title: 'Location Hierarchy (3-Level)',
                                            },
                                        },
                                    ],
                                },
                       
                                {
                                    layout: 'row',
                                    span: { col: 3, row: 1 },
                                    className: 'h-full border border-primary-border dark:border-dark-border rounded-3xl overflow-hidden',
                                    columns: [
                                        {
                                            name: 'NodeChart',
                                            props: {
                                                data: dummyLocation2Data,
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
                            type: 'column',
                            gap: 'gap-0',
                            rows: [
                                {
                                    layout: 'row',
                                    columns: [
                                        {
                                            name: 'Modal',
                                            props: {
                                                isOpen: isAddAssetModalOpen,
                                                onClose: () => {
                                                    setIsAddAssetModalOpen(false);
                                                    setActiveTab(0); // Reset to first tab when closing
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
                ]}
            />
        </Suspense>
    );
}

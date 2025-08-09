import { Suspense, useState } from 'react';
import { lazy } from 'react';
const Page = lazy(() => import('@/components/global/PageC'));

interface HierarchyNode {
    hierarchy_id: string | number;
    hierarchy_name: string;
    hierarchy_type_title: string;
    children?: HierarchyNode[];
}

interface AreaNode {
    name: string;
}

interface LocationNode {
    name: string;
    Areas: AreaNode[];
}

interface LocationData {
    Location: LocationNode[];
}

interface SubAreaNode {
    name: string;
}

interface AreaWithSubAreasNode {
    name: string;
    SubAreas: SubAreaNode[];
}

interface LocationWithSubAreasNode {
    name: string;
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

    const dummyLocationData: LocationData = {
        "Location": [
            {
                "name": "Hyderabad",
                "Areas": [
                    { "name": "Banjara Hills" },
                    { "name": "Gachibowli" },
                    { "name": "Hitech City" }
                ]
            },
            {
                "name": "Chennai",
                "Areas": [
                    { "name": "Anna Nagar" },
                    { "name": "Marina Beach" },
                    { "name": "Besant Nagar" }
                ]
            },
            {
                "name": "Mumbai",
                "Areas": [
                    { "name": "Andheri" },
                    { "name": "Bandra" },
                    { "name": "Juhu" }
                ]
            },
            {
                "name": "Delhi",
                "Areas": [
                    { "name": "Connaught Place" },
                    { "name": "Saket" },
                    { "name": "Dwarka" }
                ]
            },
            {
                "name": "Kolkata",
                "Areas": [
                    { "name": "Salt Lake" },
                    { "name": "Park Street" },
                    { "name": "Alipore" }
                ]   
            },
            {
                "name": "Bangalore",
                "Areas": [
                    { "name": "MG Road" },
                    { "name": "Indiranagar" },
                    { "name": "Whitefield" }
                ]
            },
            {
                "name": "Pune",
                "Areas": [
                    { "name": "Koregaon Park" },
                    { "name": "Baner" },
                    { "name": "Hinjewadi" }
                ]
            },
            {
                "name": "Ahmedabad",
                "Areas": [
                    { "name": "Satellite" },
                    { "name": "SG Highway" },
                    { "name": "Navrangpura" }
                ]
            },
            {
                "name": "Jaipur",
                "Areas": [
                    { "name": "Malviya Nagar" },
                    { "name": "C Scheme" },
                    { "name": "Vaishali Nagar" }
                ]
            },
            {
                "name": "Surat",
                "Areas": [
                    { "name": "Adajan" },
                    { "name": "Vesu" },
                    { "name": "Piplod" }
                ]
            },
            {
                "name": "Lucknow",
                "Areas": [
                    { "name": "Gomti Nagar" },
                    { "name": "Hazratganj" },
                    { "name": "Indira Nagar" }
                ]
            },
            {
                "name": "Coimbatore",
                "Areas": [
                    { "name": "Peelamedu" },
                    { "name": "Gandhipuram" },
                    { "name": "RS Puram" }
                ]
            },
            {
                "name": "Chandigarh",
                "Areas": [
                    { "name": "Sector 17" },
                    { "name": "Manimajra" },
                    { "name": "Sector 22" }
                ]
            },
            {
                "name": "Bhopal",
                "Areas": [
                    { "name": "MP Nagar" },
                    { "name": "Arera Colony" },
                    { "name": "New Market" }
                ]
            },
            {
                "name": "Visakhapatnam",
                "Areas": [
                    { "name": "MVP Colony" },
                    { "name": "Dwaraka Nagar" },
                    { "name": "Beach Road" }
                ]
            },
            {
                "name": "Nagpur",
                "Areas": [
                    { "name": "Ramdas Peth" },
                    { "name": "Dharampeth" },
                    { "name": "Civil Lines" }
                ]
            },
            {
                "name": "Thiruvananthapuram",
                "Areas": [
                    { "name": "Kowdiar" },
                    { "name": "Pattom" },
                    { "name": "Technopark" }
                ]
            },
            {
                "name": "Patna",
                "Areas": [
                    { "name": "Kankarbagh" },
                    { "name": "Bailey Road" },
                    { "name": "Rajendranagar" }
                ]
            },
            {
                "name": "Indore",
                "Areas": [
                    { "name": "Vijay Nagar" },
                    { "name": "Sarafa Bazaar" },
                    { "name": "Palasia" }
                ]
            },
            {
                "name": "Goa",
                "Areas": [
                    { "name": "Panaji" },
                    { "name": "Calangute" },
                    { "name": "Candolim" }
                ]
            }
        ]
    };

    const dummyLocation2Data: Location2Data = {
        "Location": [
            {
                "name": "Hyderabad",
                "Areas": [
                    {
                        "name": "Banjara Hills",
                        "SubAreas": [
                            { "name": "Road No 1" },
                            { "name": "Road No 12" },
                            { "name": "Journalist Colony" }
                        ]
                    },
                    {
                        "name": "Gachibowli",
                        "SubAreas": [
                            { "name": "Wipro Circle" },
                            { "name": "Nallagandla" },
                            { "name": "Tata Nagar" }
                        ]
                    },
                    {
                        "name": "Hitech City",
                        "SubAreas": [
                            { "name": "Cyber Towers" },
                            { "name": "Mindspace" },
                            { "name": "Raidurg" }
                        ]
                    }
                ]
            },
            {
                "name": "Warangal",
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
            {
                "name": "Nizamabad",
                "Areas": [
                    {
                        "name": "Kamareddy",
                        "SubAreas": [
                            { "name": "Housing Board" },
                            { "name": "Rajampet" },
                            { "name": "Shivaji Chowk" }
                        ]
                    },
                    {
                        "name": "Bodhan",
                        "SubAreas": [
                            { "name": "Shakkar Nagar" },
                            { "name": "Aziz Nagar" },
                            { "name": "Dargha Road" }
                        ]
                    },
                    {
                        "name": "Armoor",
                        "SubAreas": [
                            { "name": "Mahatma Nagar" },
                            { "name": "Ramalakshmi Nagar" },
                            { "name": "Market Area" }
                        ]
                    }
                ]
            },
            {
                "name": "Khammam",
                "Areas": [
                    {
                        "name": "Wyra",
                        "SubAreas": [
                            { "name": "Lakshmipuram" },
                            { "name": "Gokul Nagar" },
                            { "name": "Wyra Road" }
                        ]
                    },
                    {
                        "name": "Madhira",
                        "SubAreas": [
                            { "name": "Old Bus Stand" },
                            { "name": "Chowrastha" },
                            { "name": "Station Area" }
                        ]
                    },
                    {
                        "name": "Manchikanti Nagar",
                        "SubAreas": [
                            { "name": "Green Park" },
                            { "name": "Manchikanti Colony" },
                            { "name": "New Layout" }
                        ]
                    }
                ]
            },
            {
                "name": "Karimnagar",
                "Areas": [
                    {
                        "name": "Mancherial",
                        "SubAreas": [
                            { "name": "Coal Mine Colony" },
                            { "name": "Shivaji Nagar" },
                            { "name": "Ram Nagar" }
                        ]
                    },
                    {
                        "name": "Sircilla",
                        "SubAreas": [
                            { "name": "Textile Market" },
                            { "name": "Sircilla Colony" },
                            { "name": "Main Road" }
                        ]
                    },
                    {
                        "name": "Vemulawada",
                        "SubAreas": [
                            { "name": "Temple Street" },
                            { "name": "Vemulawada Colony" },
                            { "name": "New Bus Stand" }
                        ]
                    }
                ]
            }
        ]
    };

    // --- Convert location data to TopLevelHierarchy format ---
    function convertToTopLevelHierarchyFormat(locationData: LocationData) {
        const nodes: { id: string | number; name: string; hierarchy_type_title: string; children?: any[] }[] = [];
        
        locationData.Location.forEach((location, index) => {
            const locationNode = {
                id: `location-${index}`,
                name: location.name,
                hierarchy_type_title: 'Location',
                children: location.Areas.map((area, areaIndex) => ({
                    id: `area-${index}-${areaIndex}`,
                    name: area.name,
                    hierarchy_type_title: 'Areas'
                }))
            };
            nodes.push(locationNode);
        });
        
        return nodes;
    }

    // --- Convert Location2 data to TopLevelHierarchy format (with SubAreas) ---
    function convertLocation2ToTopLevelHierarchyFormat(location2Data: Location2Data) {
        const nodes: { id: string | number; name: string; hierarchy_type_title: string; children?: any[] }[] = [];
        
        location2Data.Location.forEach((location, locationIndex) => {
            const locationNode = {
                id: `location2-${locationIndex}`,
                name: location.name,
                hierarchy_type_title: 'Location',
                children: location.Areas.map((area, areaIndex) => ({
                    id: `area2-${locationIndex}-${areaIndex}`,
                    name: area.name,
                    hierarchy_type_title: 'Areas',
                    children: area.SubAreas.map((subArea, subAreaIndex) => ({
                        id: `subarea2-${locationIndex}-${areaIndex}-${subAreaIndex}`,
                        name: subArea.name,
                        hierarchy_type_title: 'SubAreas'
                    }))
                }))
            };
            nodes.push(locationNode);
        });
        
        return nodes;
    }

    // --- Convert to OrgChart format ---
    function convertToOrgChartFormat(locationData: LocationData): HierarchyNode[] {
        return locationData.Location.map((location, index) => ({
            hierarchy_id: `location-${index}`,
            hierarchy_name: location.name,
            hierarchy_type_title: 'Location',
            children: location.Areas.map((area, areaIndex) => ({
                hierarchy_id: `area-${index}-${areaIndex}`,
                hierarchy_name: area.name,
                hierarchy_type_title: 'Areas'
            }))
        }));
    }

    // --- Convert Location2 to OrgChart format (with SubAreas) ---
    function convertLocation2ToOrgChartFormat(location2Data: Location2Data): HierarchyNode[] {
        return location2Data.Location.map((location, locationIndex) => ({
            hierarchy_id: `location2-${locationIndex}`,
            hierarchy_name: location.name,
            hierarchy_type_title: 'Location',
            children: location.Areas.map((area, areaIndex) => ({
                hierarchy_id: `area2-${locationIndex}-${areaIndex}`,
                hierarchy_name: area.name,
                hierarchy_type_title: 'Areas',
                children: area.SubAreas.map((subArea, subAreaIndex) => ({
                    hierarchy_id: `subarea2-${locationIndex}-${areaIndex}-${subAreaIndex}`,
                    hierarchy_name: subArea.name,
                    hierarchy_type_title: 'SubAreas'
                }))
            }))
        }));
    }

    // --- Generate data for components ---
    // You can switch between Location and Location2 data here
    const useLocation2Data = true; // Set to false to use original Location data
    
    const topLevelNodes = useLocation2Data 
        ? convertLocation2ToTopLevelHierarchyFormat(dummyLocation2Data)
        : convertToTopLevelHierarchyFormat(dummyLocationData);
    
    const orgChartData = useLocation2Data 
        ? convertLocation2ToOrgChartFormat(dummyLocation2Data)
        : convertToOrgChartFormat(dummyLocationData);

    // --- Generate form fields for each tab (moved after useLocation2Data is defined) ---
    const generateFormFieldsForTab = (tabIndex: number) => {
        // const locationData = useLocation2Data ? dummyLocation2Data : dummyLocationData;
        
        // Extract all location names
        // const locationNames = locationData.Location.map(location => location.name);
        
        // Extract all area names
        // const areaNames = locationData.Location.flatMap(location => 
        //     location.Areas.map(area => area.name)
        // );
        
        // Extract all subarea names (if using Location2Data)
        // const subAreaNames = useLocation2Data 
        //     ? (locationData as Location2Data).Location.flatMap(location => 
        //         location.Areas.flatMap(area => 
        //             area.SubAreas.map((subArea: SubAreaNode) => subArea.name)
        //         )
        //     )
        //     : [];

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
                        placeholder: 'Drag and drop files here or click to browse',
                        required: true,
                        validation: {
                            required: 'File is required'
                        },
                        accept: '.csv,.xlsx,.xls',
                        multiple: true,
                        dragAndDrop: true
                    },
                    // {
                    //     name: 'fileType',
                    //     type: 'dropdown',
                    //     label: 'File Type',
                    //     placeholder: 'Select file type',
                    //     required: true,
                    //     validation: {
                    //         required: 'File type is required'
                    //     },
                    //     options: [
                    //         { value: 'csv', label: 'CSV File' },
                    //         { value: 'excel', label: 'Excel File' }
                    //     ]
                    // },
                    // {
                    //     name: 'overwriteExisting',
                    //     type: 'checkbox',
                    //     label: 'Overwrite existing assets',
                    //     required: false
                    // }
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

    // --- OrgChart expects a single root node ---
    const orgChartRoot: HierarchyNode = {
        hierarchy_id: 'root',
        hierarchy_name: useLocation2Data ? 'All Locations (3-Level)' : 'All Locations',
        hierarchy_type_title: 'Root',
        children: orgChartData,
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
                                                nodes: topLevelNodes,
                                                title: useLocation2Data ? 'Location Hierarchy (3-Level)' : 'Location Hierarchy', // Dynamic title
                                            },
                                        },
                                    ],
                                },
                                // {
                                //     layout: 'row',
                                //     span: { col: 3, row: 1 },
                                //     className: 'h-full',
                                //     columns: [
                                //         {
                                //             name: 'OrgChartAlt',
                                //             props: {
                                //                 data: [orgChartRoot],
                                //                 // height: '400px',
                                //             },
                                //         },
                                //     ],
                                // },
                                {
                                    layout: 'row',
                                    span: { col: 3, row: 1 },
                                    className: 'h-full',
                                    columns: [
                                        {
                                            name: 'OrgChartAlt',
                                            props: {
                                                data: [orgChartRoot],
                                                // height: '400px',
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

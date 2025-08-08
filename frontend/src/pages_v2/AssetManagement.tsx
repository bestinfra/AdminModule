import { Suspense, useState } from 'react';
import { lazy } from 'react';
const Page = lazy(() => import('@/components/global/PageC'));

// --- Types ---
interface HierarchyNode {
    hierarchy_id: string | number;
    hierarchy_name: string;
    hierarchy_type_title: string;
    children?: HierarchyNode[];
}

// --- New data structure types ---
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

// --- Location2 data structure types (with SubAreas) ---
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

export default function AssetManagment() {
    // --- State management for modal ---
    const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);

    // --- Dummy data from backend (replace with actual API call) ---
    // TODO: Replace with actual API call
    // const [locationData, setLocationData] = useState<LocationData | null>(null);
    // useEffect(() => {
    //     // API call to fetch location data
    //     fetchLocationData().then(setLocationData);
    // }, []);

    // --- Original demo data (commented for reference) ---
    // const demoTree: HierarchyNode[] = [
    //     {
    //         hierarchy_id: 'gmr',
    //         hierarchy_name: 'GMR',
    //         hierarchy_type_title: 'Company',
    //         children: [
    //             {
    //                 hierarchy_id: 1,
    //                 hierarchy_name: 'Airborne General Store',
    //                 hierarchy_type_title: 'Site',
    //             },
    //             {
    //                 hierarchy_id: 2,
    //                 hierarchy_name: 'Neo Travels',
    //                 hierarchy_type_title: 'Site',
    //             },
    //             {
    //                 hierarchy_id: 3,
    //                 hierarchy_name: 'Mobikins',
    //                 hierarchy_type_title: 'Site',
    //             },
    //             {
    //                 hierarchy_id: 4,
    //                 hierarchy_name: 'Dormitary',
    //                 hierarchy_type_title: 'Site',
    //             },
    //             {
    //                 hierarchy_id: 5,
    //                 hierarchy_name: '10 MGW - Solar Plant',
    //                 hierarchy_type_title: 'Site',
    //             },
    //         ],
    //     },
    //     {
    //         hierarchy_id: 'chennai',
    //         hierarchy_name: 'Chennai',
    //         hierarchy_type_title: 'City',
    //         children: [
    //             {
    //                 hierarchy_id: 'hyd',
    //                 hierarchy_name: 'Hyderabad',
    //                 hierarchy_type_title: 'Zone',
    //                 children: [
    //                     {
    //                         hierarchy_id: 9,
    //                         hierarchy_name: 'Hitech City',
    //                         hierarchy_type_title: 'Area',
    //                     },
    //                     {
    //                         hierarchy_id: 10,
    //                         hierarchy_name: 'Gachibowli',
    //                         hierarchy_type_title: 'Area',
    //                         children: [
    //                             {
    //                                 hierarchy_id: 11,
    //                                 hierarchy_name: 'Hyderabad Subarea',
    //                                 hierarchy_type_title: 'Subarea',
    //                             },
    //                         ],
    //                     },
    //                 ],
    //             },
    //             {
    //                 hierarchy_id: 7,
    //                 hierarchy_name: 'Egmore',
    //                 hierarchy_type_title: 'Zone',
    //             },
    //             {
    //                 hierarchy_id: 8,
    //                 hierarchy_name: 'Vizag',
    //                 hierarchy_type_title: 'Zone',
    //                 children: [
    //                     {
    //                         hierarchy_id: 12,
    //                         hierarchy_name: 'RK Beach',
    //                         hierarchy_type_title: 'Area',
    //                     },
    //                     {
    //                         hierarchy_id: 13,
    //                         hierarchy_name: 'Warangal',
    //                         hierarchy_type_title: 'Area',
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    //     {
    //         hierarchy_id: 14,
    //         hierarchy_name: 'Ameerpet',
    //         hierarchy_type_title: 'Standalone',
    //     },
    //     {
    //         hierarchy_id: 15,
    //         hierarchy_name: 'Kukatpally',
    //         hierarchy_type_title: 'Standalone',
    //     },
    //     {
    //         hierarchy_id: 16,
    //         hierarchy_name: 'Hyderabad2',
    //         hierarchy_type_title: 'Standalone',
    //     },
    //     {
    //         hierarchy_id: 17,
    //         hierarchy_name: 'Hyderabad5',
    //         hierarchy_type_title: 'Standalone',
    //     },
    // ];

    // --- Original flattenTree function (commented for reference) ---
    // function flattenTree(
    //     nodes: HierarchyNode[]
    // ): { id: string | number; name: string; hierarchy_type_title: string }[] {
    //     let flat: {
    //         id: string | number;
    //         name: string;
    //         hierarchy_type_title: string;
    //     }[] = [];
    //     for (const node of nodes) {
    //         const {
    //             children,
    //             hierarchy_id,
    //             hierarchy_name,
    //             hierarchy_type_title,
    //         } = node;
    //         flat.push({
    //             id: hierarchy_id,
    //             name: hierarchy_name,
    //             hierarchy_type_title,
    //         });
    //         if (children && children.length > 0) {
    //             flat = flat.concat(flattenTree(children));
    //         }
    //     }
    //     return flat;
    // }
    // const demoNodes = flattenTree(demoTree);

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

    // --- Location2 data with SubAreas (three-level hierarchy) ---
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
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row',
                                    columns: [
                                        {
                                            name: 'Modal',
                                            props: {
                                                isOpen: isAddAssetModalOpen,
                                                onClose: () => setIsAddAssetModalOpen(false),
                                                title: 'Add New Asset',
                                                size: 'lg',
                                                showCloseIcon: true,
                                                // children: (
                                                //     <div className="flex flex-col gap-6 p-4">
                                                //         {/* Asset Form Content */}
                                                //         <div className="space-y-4">
                                                //             <div>
                                                //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                //                     Asset Name
                                                //                 </label>
                                                //                 <input
                                                //                     type="text"
                                                //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                //                     placeholder="Enter asset name"
                                                //                 />
                                                //             </div>
                                                //             <div>
                                                //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                //                     Asset Type
                                                //                 </label>
                                                //                 <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                                                //                     <option value="">Select asset type</option>
                                                //                     <option value="equipment">Equipment</option>
                                                //                     <option value="vehicle">Vehicle</option>
                                                //                     <option value="building">Building</option>
                                                //                     <option value="land">Land</option>
                                                //                     <option value="software">Software</option>
                                                //                 </select>
                                                //             </div>
                                                //             <div>
                                                //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                //                     Location
                                                //                 </label>
                                                //                 <input
                                                //                     type="text"
                                                //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                //                     placeholder="Enter asset location"
                                                //                 />
                                                //             </div>
                                                //             <div>
                                                //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                //                     Description
                                                //                 </label>
                                                //                 <textarea
                                                //                     rows={3}
                                                //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                //                     placeholder="Enter asset description"
                                                //                 />
                                                //             </div>
                                                //         </div>
                                                        
                                                //         {/* Action Buttons */}
                                                //         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                //             <button
                                                //                 onClick={() => setIsAddAssetModalOpen(false)}
                                                //                 className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                                                //             >
                                                //                 Cancel
                                                //             </button>
                                                //             <button
                                                //                 onClick={() => {
                                                //                     console.log('Asset saved');
                                                //                     setIsAddAssetModalOpen(false);
                                                //                 }}
                                                //                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                                //             >
                                                //                 Add Asset
                                                //             </button>
                                                //         </div>
                                                //     </div>
                                                // )
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

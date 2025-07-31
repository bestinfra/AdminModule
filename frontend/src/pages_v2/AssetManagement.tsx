import { Suspense } from 'react';
import { lazy } from 'react';
const PageC = lazy(() => import('@/components/global/PageC'));

// --- Types ---
interface HierarchyNode {
    hierarchy_id: string | number;
    hierarchy_name: string;
    hierarchy_type_title: string;
    children?: HierarchyNode[];
}

export default function AssetManagment() {
    // --- Nested Data for OrgChartAlt ---
    const demoTree: HierarchyNode[] = [
        {
            hierarchy_id: 'gmr',
            hierarchy_name: 'GMR',
            hierarchy_type_title: 'Company',
            children: [
                {
                    hierarchy_id: 1,
                    hierarchy_name: 'Airborne General Store',
                    hierarchy_type_title: 'Site',
                },
                {
                    hierarchy_id: 2,
                    hierarchy_name: 'Neo Travels',
                    hierarchy_type_title: 'Site',
                },
                {
                    hierarchy_id: 3,
                    hierarchy_name: 'Mobikins',
                    hierarchy_type_title: 'Site',
                },
                {
                    hierarchy_id: 4,
                    hierarchy_name: 'Dormitary',
                    hierarchy_type_title: 'Site',
                },
                {
                    hierarchy_id: 5,
                    hierarchy_name: '10 MGW - Solar Plant',
                    hierarchy_type_title: 'Site',
                },
            ],
        },
        {
            hierarchy_id: 'chennai',
            hierarchy_name: 'Chennai',
            hierarchy_type_title: 'City',
            children: [
                {
                    hierarchy_id: 'hyd',
                    hierarchy_name: 'Hyderabad',
                    hierarchy_type_title: 'Zone',
                    children: [
                        {
                            hierarchy_id: 9,
                            hierarchy_name: 'Hitech City',
                            hierarchy_type_title: 'Area',
                        },
                        {
                            hierarchy_id: 10,
                            hierarchy_name: 'Gachibowli',
                            hierarchy_type_title: 'Area',
                            children: [
                                {
                                    hierarchy_id: 11,
                                    hierarchy_name: 'Hyderabad Subarea',
                                    hierarchy_type_title: 'Subarea',
                                },
                            ],
                        },
                    ],
                },
                {
                    hierarchy_id: 7,
                    hierarchy_name: 'Egmore',
                    hierarchy_type_title: 'Zone',
                },
                {
                    hierarchy_id: 8,
                    hierarchy_name: 'Vizag',
                    hierarchy_type_title: 'Zone',
                    children: [
                        {
                            hierarchy_id: 12,
                            hierarchy_name: 'RK Beach',
                            hierarchy_type_title: 'Area',
                        },
                        {
                            hierarchy_id: 13,
                            hierarchy_name: 'Warangal',
                            hierarchy_type_title: 'Area',
                        },
                    ],
                },
            ],
        },
        {
            hierarchy_id: 14,
            hierarchy_name: 'Ameerpet',
            hierarchy_type_title: 'Standalone',
        },
        {
            hierarchy_id: 15,
            hierarchy_name: 'Kukatpally',
            hierarchy_type_title: 'Standalone',
        },
        {
            hierarchy_id: 16,
            hierarchy_name: 'Hyderabad2',
            hierarchy_type_title: 'Standalone',
        },
        {
            hierarchy_id: 17,
            hierarchy_name: 'Hyderabad5',
            hierarchy_type_title: 'Standalone',
        },
    ];

    // --- OrgChartAlt expects a single root node ---
    const orgChartRoot: HierarchyNode = {
        hierarchy_id: 'root',
        hierarchy_name: 'All Assets',
        hierarchy_type_title: 'Root',
        children: demoTree,
    };

    // --- TopLevelHierarchy expects a flat array with id, name, hierarchy_type_title ---
    function flattenTree(
        nodes: HierarchyNode[]
    ): { id: string | number; name: string; hierarchy_type_title: string }[] {
        let flat: {
            id: string | number;
            name: string;
            hierarchy_type_title: string;
        }[] = [];
        for (const node of nodes) {
            const {
                children,
                hierarchy_id,
                hierarchy_name,
                hierarchy_type_title,
            } = node;
            flat.push({
                id: hierarchy_id,
                name: hierarchy_name,
                hierarchy_type_title,
            });
            if (children && children.length > 0) {
                flat = flat.concat(flattenTree(children));
            }
        }
        return flat;
    }
    const demoNodes = flattenTree(demoTree);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageC  
                sections={[
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-6',
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
                                        'bg-primary-lightest p-4 border border-primary-border dark:border-dark-border rounded-3xl',
                                    columns: [
                                        {
                                            name: 'TopLevelHierarchy',
                                            props: {
                                                nodes: demoNodes,
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
                ]}
            />
        </Suspense>
    );
}

import Page from '@components/global/PageC';

const mockHierarchyData = [
    {
        hierarchy_id: 1,
        hierarchy_name: 'GMR',
        hierarchy_type_title: 'Root',
        children: [
            {
                hierarchy_id: 2,
                hierarchy_name: 'Airborne General Store',
                hierarchy_type_title: 'Node',
            },
            {
                hierarchy_id: 3,
                hierarchy_name: 'Neo Travels',
                hierarchy_type_title: 'Node',
            },
            {
                hierarchy_id: 4,
                hierarchy_name: 'Mobikins',
                hierarchy_type_title: 'Node',
            },
            {
                hierarchy_id: 5,
                hierarchy_name: 'Dormitary',
                hierarchy_type_title: 'Node',
            },
            {
                hierarchy_id: 6,
                hierarchy_name: '10 MGW - Solar Plant',
                hierarchy_type_title: 'Node',
            },
        ],
    },
    {
        hierarchy_id: 7,
        hierarchy_name: 'Chennai',
        hierarchy_type_title: 'Root',
        children: [
            {
                hierarchy_id: 8,
                hierarchy_name: 'Hyderabad',
                hierarchy_type_title: 'City',
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
                    },
                ],
            },
            {
                hierarchy_id: 11,
                hierarchy_name: 'Egmore',
                hierarchy_type_title: 'City',
            },
            {
                hierarchy_id: 12,
                hierarchy_name: 'Vizag',
                hierarchy_type_title: 'City',
                children: [
                    {
                        hierarchy_id: 13,
                        hierarchy_name: 'RK Beach',
                        hierarchy_type_title: 'Area',
                    },
                    {
                        hierarchy_id: 14,
                        hierarchy_name: 'Warangal',
                        hierarchy_type_title: 'Area',
                    },
                ],
            },
        ],
    },
    {
        hierarchy_id: 15,
        hierarchy_name: 'Ameerpet',
        hierarchy_type_title: 'Area',
    },
];

interface FlatHierarchyNode {
    hierarchy_id: string | number;
    hierarchy_name: string;
    hierarchy_type_title: string;
    children?: FlatHierarchyNode[];
}

function flattenHierarchy(
    nodes: FlatHierarchyNode[]
): Array<{ id: string | number; name: string; hierarchy_type_title: string }> {
    const flat: Array<{
        id: string | number;
        name: string;
        hierarchy_type_title: string;
    }> = [];
    function recurse(node: FlatHierarchyNode) {
        flat.push({
            id: node.hierarchy_id,
            name: node.hierarchy_name,
            hierarchy_type_title: node.hierarchy_type_title,
        });
        if (node.children) {
            node.children.forEach(recurse);
        }
    }
    nodes.forEach(recurse);
    return flat;
}

export default function AssetManagment() {
    return (
        <Page
            sections={[
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
                                            nodes: flattenHierarchy(
                                                mockHierarchyData
                                            ),
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
                                        name: 'OrgChart',
                                        props: {
                                            data: mockHierarchyData,
                                            height: '100%',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ]}
        />
    );
}

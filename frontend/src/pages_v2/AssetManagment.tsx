import { useEffect, useState, Suspense } from 'react';
import Page from '@/components/global/PageC';
import BACKEND_URL from '../config';

interface AssetNode {
    id: number | string;
    name: string;
    code: string;
    type: string;
    parentId: number | string | null;
    createdAt: string;
    updatedAt?: string;
    children?: AssetNode[];
}

function buildHierarchy(flat: AssetNode[]): AssetNode[] {
    const idMap: Record<string, AssetNode> = {};
    const roots: AssetNode[] = [];
    flat.forEach((node) => {
        idMap[node.id] = { ...node, children: [] };
    });
    flat.forEach((node) => {
        if (node.parentId && idMap[node.parentId]) {
            idMap[node.parentId].children!.push(idMap[node.id]);
        } else {
            roots.push(idMap[node.id]);
        }
    });
    return roots;
}

export default function AssetManagment() {
    const [assets, setAssets] = useState<AssetNode[]>([]);
    useEffect(() => {
        fetch(`${BACKEND_URL}/assets`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setAssets(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch assets');
                }
            })
            .catch((err) =>
                console.error(err.message || 'Failed to fetch assets')
            );
    }, []);

    const hierarchy = buildHierarchy(assets);

    return (
        <Suspense fallback={<div>Loading...</div>}>
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
                                                nodes: assets,
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
                                                data: hierarchy,
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
        </Suspense>
    );
}

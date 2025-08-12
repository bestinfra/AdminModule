import React from 'react';
import type { Column } from '@components/global/Table';

interface TableSkeletonProps {
    columns: Column[];
    rowCount: number;
    showSkeletonActionButtons: boolean;
    actionCount: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
    columns,
    rowCount,
    showSkeletonActionButtons,
    actionCount,
}) => {
    return (
        <tbody>
            {Array.from({ length: rowCount }).map((_, index) => (
                <tr key={index}>
                    {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                    ))}
                    {showSkeletonActionButtons && (
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-4">
                                {Array.from({ length: actionCount }).map(
                                    (_, i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 bg-gray-200 rounded animate-pulse"
                                        />
                                    )
                                )}
                            </div>
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    );
};

export default TableSkeleton;

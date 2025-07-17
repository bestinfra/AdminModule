import React from 'react';
import type { ComponentType } from '../types';
import Table from '@components/global/Table';

interface TableBlockProps {
    component: ComponentType;
}

const TableBlock: React.FC<TableBlockProps> = ({ component }) => {
    return (
        <div className="hover:bg-white/50 rounded-md transition-all duration-200 border border-gray-200 hover:border-blue-300 group m-3">
            <Table
                data={component.props?.data || []}
                columns={component.props?.columns || []}
                actions={component.props?.actions}
                sortable={component.props?.sortable}
                searchable={component.props?.searchable}
                pagination={component.props?.pagination}
                rowsPerPageOptions={component.props?.rowsPerPageOptions}
                initialRowsPerPage={component.props?.initialRowsPerPage}
                onRowClick={component.props?.onRowClick}
                onEdit={component.props?.onEdit}
                onDelete={component.props?.onDelete}
                onView={component.props?.onView}
                onPayment={component.props?.onPayment}
                loading={component.props?.loading}
                emptyMessage={component.props?.emptyMessage}
                serverPagination={component.props?.serverPagination}
                onPageChange={component.props?.onPageChange}
                showSkeletonActionButtons={
                    component.props?.showSkeletonActionButtons
                }
                onSearch={component.props?.onSearch}
                text={component.props?.text}
                showActions={component.props?.showActions}
            />
        </div>
    );
};

export default TableBlock;

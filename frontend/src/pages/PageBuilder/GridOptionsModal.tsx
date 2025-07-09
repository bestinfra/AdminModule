import React, { useState } from 'react';
import { Modal, InputNumber, Button } from 'antd';

interface GridOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (columns: number) => void;
}

const GridOptionsModal: React.FC<GridOptionsModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [columns, setColumns] = useState(2);

    const handleConfirm = () => {
        onConfirm(columns);
        onClose();
    };

    return (
        <Modal
            title="Configure Grid"
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button
                    key="cancel"
                    onClick={onClose}
                    className="hover:bg-gray-100">
                    Cancel
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    onClick={handleConfirm}
                    className="bg-blue-500 hover:bg-blue-600">
                    Create Grid
                </Button>,
            ]}>
            <div className="space-y-4">
                <div className="flex items-center">
                    <label className="text-gray-700 mr-2">
                        Number of Columns:
                    </label>
                    <InputNumber
                        min={1}
                        max={12}
                        value={columns}
                        onChange={(value) => setColumns(value || 1)}
                        className="w-24"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default GridOptionsModal;

import { Modal, Result } from 'antd'
import React from 'react'

interface ConfirmationModalProps {
    isModalVisible: boolean,
    handleOk: () => void,
    handleCancel: () => void, 
    isLoading?: boolean
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({isModalVisible, handleCancel, handleOk, isLoading= false}) => {
    return (
        <Modal
            open={isModalVisible}
            onOk={handleOk}
            confirmLoading={isLoading}
            onCancel={handleCancel}
        >
            <Result
                status="warning"
                title="Are you sure you want to proceed?"
            />
        </Modal>
    )
}

export default ConfirmationModal
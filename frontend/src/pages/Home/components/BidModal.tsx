import { Alert, Modal, Space } from 'antd'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { NumberInput, TextInput } from '../../../components';
import makeBidSchema from '../../../common/validation/bid.validation';
import BidServices from '../../../services/bid.service';
import { MakeBidPayload } from '../../../common/interface/bid.interface';
import { ErrorData } from '../../../common/interface/error.interface';
import HandleError from '../../../utils/errorHandler.utils';
import DepositServices from '../../../services/deposit.service';

interface BidModalProps {
    isVisible: boolean;
    bid_id: string;
    item_name: string;
    last_price: number;
    handleCancel: () => void;
}
const BidModal: React.FC<BidModalProps> = ({ isVisible, bid_id, item_name, handleCancel, last_price }) => {
    const [hasError, setHasError] = useState<ErrorData | null>(null)
    const onSubmit = async (payload: MakeBidPayload) => {
        try {
            await BidServices.makeBid(payload)
            await DepositServices.getMyDeposit()
            handleCancel()
        } catch (error) {
            setHasError(HandleError(error))
        }
    }
    const formik = useFormik({
        initialValues: {
            bid_id,
            bid_amount: last_price
        },
        validationSchema: makeBidSchema(last_price),
        onSubmit
    })
    return (
        <Modal
            open={isVisible}
            onCancel={handleCancel}
            onOk={() => formik.handleSubmit()}
            title={'Make a Higer Bid'}
        >
            <Space direction='vertical' style={{ width: '100%' }}>
                {
                    hasError ? <Alert type='error' message={hasError.message} showIcon /> : null
                }
                <TextInput label='Item Name' value={item_name} onChange={() => null} disabled={true} />
                <NumberInput label='New Bid' value={formik.values.bid_amount} errorMessage={formik.errors.bid_amount} onChange={(value) => formik.setValues({ ...formik.values, bid_amount: value })} />
            </Space>

        </Modal>
    )
}

export default BidModal
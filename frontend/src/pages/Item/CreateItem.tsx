import { Button, Card, Col, Row, Space, Typography, notification } from 'antd'
import { useFormik } from 'formik'
import { useState } from 'react'
import { ConfirmationModal, NumberInput, TextInput } from '../../components'
import HandleError from '../../utils/errorHandler.utils'
import SelectInput from '../../components/Input/SelectInput'
import createItemSchema from '../../common/validation/item.validation'
import { useNavigate } from 'react-router-dom'
import { CreateBidItemPayload } from '../../common/interface/bid.interface'
import BidServices from '../../services/bid.service'

const TimeWindowSelection = [{ value: 1, label: '1h' }, { value: 2, label: '2h' }, { value: 3, label: '3h' }]

const CreateItem = () => {
    const navigate = useNavigate()
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [api, contextHolder] = notification.useNotification();

    const SuccessNotification = () => {
        api.info({
            message: `Success`,
            description: 'Item has been listed',
            placement: 'topRight',
            duration: 2,
            onClose: () => navigate('/my-item')
        });
    };
    const ErrorNotification = () => {
        api.error({
            message: `Failed`,
            description: 'Failed to list item',
            placement: 'topRight',
            duration: 2
        });
    };


    const handleSubmit = async (payload: CreateBidItemPayload) => {
        setIsLoading(true)
        try {
            await BidServices.createBidItem(payload)
            SuccessNotification()

        } catch (error) {
            console.error(error);

            HandleError(error)
            ErrorNotification()

        } finally {
            setIsLoading(false)
            setIsConfirmModalVisible(false)
        }
    }

    const confirmSubmit = async (e: any) => {
        e.preventDefault()
        const hasError = Object.keys(formik.errors).length > 0
        if(!hasError){
            setIsConfirmModalVisible(true)
        }
    }
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            start_price: 1,
            time_window: 1,
        },
        validationSchema: createItemSchema(TimeWindowSelection),
        validateOnBlur: true,
        onSubmit: handleSubmit,
        
    })
    return (
        <Row justify={'center'} align={'middle'}>
            {contextHolder}
            <Col md={18} xs={24}>
                <Typography.Title level={3}>Create Item</Typography.Title>
                <Card style={{ minHeight: '50vh' }}>
                    <Space direction='vertical' style={{ width: '100%' }}>
                        <form onSubmit={confirmSubmit}>
                            <Space direction='vertical' style={{ width: '100%' }} size={'large'}>
                                <TextInput label='Item Name' value={formik.values.name} errorMessage={formik.errors.name} onChange={formik.handleChange('name')} />
                                <TextInput label='Item Description' value={formik.values.description} errorMessage={formik.errors.description} onChange={formik.handleChange('description')} />
                                <NumberInput label='Item Price' value={formik.values.start_price} errorMessage={formik.errors.start_price} onChange={(value) => formik.setValues({ ...formik.values, start_price: value })} />
                                <SelectInput errorMessage={formik.errors.time_window} options={TimeWindowSelection} label='Time Window' value={formik.values.time_window} onChange={(values) => formik.setValues({ ...formik.values, time_window: Number(values) })} />
                                <Button block htmlType='submit' type='primary' loading={isLoading} disabled={isLoading}>Submit</Button>
                            </Space>
                        </form>
                    </Space>
                </Card>
            </Col>
            <ConfirmationModal handleOk={formik.handleSubmit} handleCancel={() => setIsConfirmModalVisible(false)} isModalVisible={isConfirmModalVisible} isLoading={isLoading} />
        </Row>
    )
}

export default CreateItem
import { Button, Card, Col, Row, Space, Typography, notification } from 'antd'
import { useFormik } from 'formik'
import { useState } from 'react'
import { ConfirmationModal, NumberInput } from '../../components'
import { StoreDepositPayload } from '../../common/interface/deposit.interface'
import DepositServices from '../../services/deposit.service'
import HandleError from '../../utils/errorHandler.utils'
import storeDepositSchema from '../../common/validation/deposit.validation'

const StoreDeposit = () => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [api, contextHolder] = notification.useNotification();

  const SuccessNotification = () => {
    api.info({
      message: `Success`,
      description: 'Deposit has been stored',
      placement: 'topRight',
      duration:2,
    });
  };
  const ErrorNotification = () => {
    api.error({
      message: `Failed`,
      description: 'Failed to store deposit',
      placement: 'topRight',
      duration:2
    });
  };


  const handleSubmit = async (payload: StoreDepositPayload) => {
    setIsLoading(true)
    try {
      await DepositServices.storeDeposit(payload)
      SuccessNotification()

    } catch (error) {
      HandleError(error)
      ErrorNotification()

    } finally {
      setIsLoading(false)
      setIsConfirmModalVisible(false)
    }
  }
  const formik = useFormik({
    initialValues: {
      store_amount: 1
    },
    validationSchema: storeDepositSchema,
    validateOnChange: true,
    onSubmit: handleSubmit
  })
  return (
    <Row justify={'center'} align={'middle'}>
      {contextHolder}
      <Col md={18} xs={24}>
        <Typography.Title level={3}>Deposit</Typography.Title>
        <Card style={{ minHeight: '50vh' }}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <form onSubmit={(e) => {
              e.preventDefault()
              setIsConfirmModalVisible(true)
            }}>
              <Space direction='vertical' style={{ width: '100%' }} size={'large'}>
                <NumberInput label='Amount' value={formik.values.store_amount} errorMessage={formik.errors.store_amount} onChange={(value) => formik.setValues({ store_amount: value })} />
                <Button block htmlType='submit' type='primary' disabled={formik.errors.store_amount ? true : false}>Deposit</Button>
              </Space>
            </form>
          </Space>
        </Card>
      </Col>
      <ConfirmationModal handleOk={formik.handleSubmit} handleCancel={() => setIsConfirmModalVisible(false)} isModalVisible={isConfirmModalVisible} isLoading={isLoading} />
    </Row>
  )
}

export default StoreDeposit
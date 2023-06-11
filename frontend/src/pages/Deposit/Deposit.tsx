import { Button, Card, Col, Row, Space, Typography, notification, Table, Tag } from 'antd';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ConfirmationModal, NumberInput } from '../../components';
import { DepositHistory, StoreDepositPayload } from '../../common/interface/deposit.interface';
import DepositServices from '../../services/deposit.service';
import HandleError from '../../utils/errorHandler.utils';
import storeDepositSchema from '../../common/validation/deposit.validation';
import moment from 'moment';
import { toCurrency } from '../../utils/currency.utils';

const Deposit = (): JSX.Element => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const [depositHistory, setDepositHistory] = useState<DepositHistory[]>([]);

  const SuccessNotification = (): void => {
    api.info({
      message: 'Success',
      description: 'Deposit has been stored',
      placement: 'topRight',
      duration: 2,
    });
  };

  const ErrorNotification = (): void => {
    api.error({
      message: 'Failed',
      description: 'Failed to store deposit',
      placement: 'topRight',
      duration: 2,
    });
  };

  const handleSubmit = async (payload: StoreDepositPayload): Promise<void> => {
    setIsLoading(true);
    try {
      await DepositServices.storeDeposit(payload);
      await getMyDepositHistory();
      SuccessNotification();
    } catch (error) {
      HandleError(error);
      ErrorNotification();
    } finally {
      setIsLoading(false);
      setIsConfirmModalVisible(false);
    }
  };

  const getMyDepositHistory = async () => {
    try {
      const res = await DepositServices.getMyDepositHistory()
      setDepositHistory(res.data)
    } catch (error) {
      HandleError(error)
    }
  }

  const formik = useFormik({
    initialValues: {
      store_amount: 1,
    },
    validationSchema: storeDepositSchema,
    validateOnChange: true,
    onSubmit: handleSubmit,
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsConfirmModalVisible(true);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      render: (data: string) => moment(data).format(`DD/MM/YY - hh:mm`)
    },
    {
      title: 'Type',
      dataIndex: 'isRefund',
      key: 'type',
      render: (data: boolean) => data ? <Tag color='blue'>Refund</Tag> : <Tag color='green'>Deposit</Tag>
    },
    {
      title: 'Deposit Value',
      dataIndex: 'amount',
      key: 'deposit_value',
      render: (data: number) => <Typography.Text style={{color:'green'}}>{`+ $${toCurrency(data)}`}</Typography.Text>
    },
  ];

  useEffect(()=>{
    getMyDepositHistory()
  },[])

  return (
    <Row justify="center" align="middle">
      {contextHolder}
      <Col md={18} xs={24}>
        <Typography.Title level={3}>Deposit</Typography.Title>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Typography.Title level={4}>Store a New Deposit</Typography.Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <form onSubmit={handleFormSubmit}>
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <NumberInput
                      label="Amount"
                      value={formik.values.store_amount}
                      errorMessage={formik.errors.store_amount}
                      onChange={(value) => formik.setValues({ store_amount: value })}
                    />
                    <Button block htmlType="submit" type="primary" disabled={!!formik.errors.store_amount && !isLoading}>
                      Deposit
                    </Button>
                  </Space>
                </form>
              </Space>
            </Card>
          </Col>
          <Col span={16}>
            <Card>
              <Typography.Title level={4}>Deposit History</Typography.Title>
              <Table dataSource={depositHistory} columns={columns} />
            </Card>
          </Col>
        </Row>
      </Col>
      <ConfirmationModal
        handleOk={formik.handleSubmit}
        handleCancel={() => setIsConfirmModalVisible(false)}
        isModalVisible={isConfirmModalVisible}
        isLoading={isLoading}
      />
    </Row>
  );
};

export default Deposit;

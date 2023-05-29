import { useState } from 'react'
import { Button, Col, Row, Space, Typography } from 'antd'
import { TextInput } from '../../../components'
import { useFormik } from 'formik'
import AuthServices from '../../../services/auth.service'
import { NewUserPayload } from '../../../common/interface/auth.interface'
import HandleError from '../../../utils/errorHandler.utils'
import { useNavigate } from 'react-router-dom'
const { Title } = Typography

const Register = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (values: NewUserPayload) => {
    setIsLoading(true)
    try {
      await AuthServices.register(values)
      navigate('/login')
    } catch (error) {
      HandleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      full_name:'',
      email: '',
      password: '',
    },
    onSubmit: handleSubmit
  })

  return (
    <Row justify={'center'} align={'middle'} style={{ minHeight: '100vh' }}>
      <Col span={8}>
        <Title level={3}>Register</Title>
        <Space direction='vertical' style={{ width: '100%' }}>
          <form onSubmit={formik.handleSubmit}>
            <Space direction='vertical' size={'middle'} style={{ width: '100%' }}>
              <TextInput label='Name' value={formik.values.full_name} onChange={formik.handleChange('full_name')} errorMessage={formik.errors.full_name} />
              <TextInput label='Email' value={formik.values.email} onChange={formik.handleChange('email')} errorMessage={formik.errors.email} />
              <TextInput secure label='Password' value={formik.values.password} onChange={formik.handleChange('password')} errorMessage={formik.errors.password} />
              <Button loading={isLoading} htmlType='submit' type='primary' block>Register</Button>
            </Space>
          </form>
          <Row justify={'center'} align={'middle'} style={{ margin: 10 }}>
            <a target='_blank' onClick={()=> navigate('/login')}>SignIn</a>
          </Row>
        </Space>
      </Col>
    </Row>
  )
}

export default Register
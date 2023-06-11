import { useState, useEffect } from 'react'
import { Alert, Button, Checkbox, Col, Row, Space, Typography } from 'antd'
import { TextInput } from '../../../components'
import { useFormik } from 'formik'
import AuthServices from '../../../services/auth.service'
import { AuthPayload } from '../../../common/interface/auth.interface'
import HandleError from '../../../utils/errorHandler.utils'
import loginSchema from '../../../common/validation/auth.validation'
import { useNavigate } from 'react-router-dom'
import { ErrorData } from '../../../common/interface/error.interface'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
const { Title } = Typography

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<ErrorData | null>(null)
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const storedEmail = localStorage.getItem('email') || ''

  useEffect(() => {
    const storedRememberMe = localStorage.getItem('rememberMe') || 'false'
    setRememberMe(storedRememberMe === 'true')
  }, [])

  const handleSubmit = async (values: AuthPayload) => {
    setIsLoading(true)
    try {
      await AuthServices.signIn(values)
      navigate('/home')
      if (rememberMe) {
        localStorage.setItem('email', values.email)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('email')
        localStorage.removeItem('rememberMe')
      }
    } catch (error) {
      setHasError(HandleError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: storedEmail && storedEmail !== '' ? storedEmail : '', 
      password: '',
    },
    validationSchema: loginSchema,
    validateOnChange: false,
    onSubmit: handleSubmit
  })

  const handleRememberMeChange = (e: CheckboxChangeEvent) => {
    setRememberMe(e.target.checked)
  }

  return (
    <Row justify={'center'} align={'middle'} style={{ minHeight: '100vh' }}>
      <Col span={8}>
        <Title level={3}>Login</Title>
        <Space direction='vertical' style={{ width: '100%' }}>
          {
            hasError ? <Alert type='error' message={hasError.message} showIcon/> : null
          }
          <form onSubmit={formik.handleSubmit}>
            <Space direction='vertical' size={'middle'} style={{ width: '100%' }}>
              <TextInput label='Email' value={formik.values.email} onChange={formik.handleChange('email')} errorMessage={formik.errors.email} />
              <TextInput secure label='Password' value={formik.values.password} onChange={formik.handleChange('password')} errorMessage={formik.errors.password} />
              <Checkbox checked={rememberMe} onChange={handleRememberMeChange}>Remember Me</Checkbox>
              <Button loading={isLoading} htmlType='submit' type='primary' block>Login</Button>
            </Space>
          </form>
          <Row justify={'center'} align={'middle'} style={{ margin: 10 }}>
            <a target='_blank' onClick={() => navigate('/register')}>Register</a>
          </Row>
        </Space>
      </Col>
    </Row>
  )
}

export default Login

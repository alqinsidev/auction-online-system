import React from 'react'
import { InputNumber, Space, Typography } from 'antd'

interface NumberInputProps {
    onChange: (value: number) => void,
    label: string,
    value: number,
    placeholder?: string
    errorMessage?: string
}
const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, label, placeholder = label, errorMessage, ...rest }) => {
    return (
        <Space style={{ width: '100%' }} direction='vertical'>
            <Typography.Text type={errorMessage && errorMessage !== '' ? 'danger' : undefined} style={{ margin: 0 }}>{label}</Typography.Text>
            <InputNumber addonBefore={'USD'} formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} min="0" step={1} stringMode value={value.toString()} onChange={(value: string | null) => onChange(Number(value))} status={errorMessage && errorMessage !== '' ? 'error' : undefined} placeholder={placeholder}  {...rest} style={{ width: '100%' }} />
            {
                errorMessage && errorMessage !== '' &&
                <Typography.Text type='danger'>{errorMessage}</Typography.Text>
            }
        </Space>
    )
}

export default NumberInput
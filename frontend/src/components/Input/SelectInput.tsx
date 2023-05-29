import React from 'react'
import { Select, Space, Typography } from 'antd'

interface SelectionOptions {
    label: string,
    value: string | number
}

interface SelectInputProps {
    label: string,
    value: number,
    options: SelectionOptions[],
    placeholder?: string,
    errorMessage?: string,
    onChange: (value: string | number) => void
}
const SelectInput: React.FC<SelectInputProps> = ({ value, options,onChange, label, placeholder = label, errorMessage, ...rest }) => {
    return (
        <Space style={{ width: '100%' }} direction='vertical'>
            <Typography.Text data-testid='label' type={errorMessage && errorMessage !== '' ? 'danger' : undefined} style={{ margin: 0 }}>{label}</Typography.Text>
            <Select data-testid='select' value={value} onChange={onChange} options={options} {...rest} defaultActiveFirstOption style={{width:'100%'}} placeholder={placeholder}/>
            {
                errorMessage && errorMessage !== '' &&
                <Typography.Text data-testid='error' type='danger'>{errorMessage}</Typography.Text>
            }
        </Space>
    )
}

export default SelectInput
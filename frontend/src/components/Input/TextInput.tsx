import React from 'react'
import { Input, Typography } from 'antd'

interface TextInputProps {
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    label: string,
    value: string,
    placeholder?: string
    errorMessage?: string
    secure?: boolean
    disabled?: boolean
}
const TextInput: React.FC<TextInputProps> = ({ value, onChange, label, placeholder = label, errorMessage, secure = false, disabled = false, ...rest }) => {
    return (
        <div>
            <Typography.Text data-testid='label' type={errorMessage && errorMessage !== '' ? 'danger' : undefined} style={{ margin: 0 }}>{label}</Typography.Text>
            {
                secure ?
                    <Input.Password data-testid='input-password' value={value} onChange={onChange} status={errorMessage && errorMessage !== '' ? 'error' : undefined} disabled={disabled} placeholder={placeholder} {...rest} />
                    :
                    <Input data-testid='input-text' value={value} onChange={onChange} status={errorMessage && errorMessage !== '' ? 'error' : undefined} placeholder={placeholder} disabled={disabled} {...rest} />
            }
            {
                errorMessage && errorMessage !== '' &&
                <Typography.Text data-testid='error' type='danger'>{errorMessage}</Typography.Text>
            }
        </div>
    )
}

export default TextInput
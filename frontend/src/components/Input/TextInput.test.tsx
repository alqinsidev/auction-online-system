import { render } from '@testing-library/react';
import TextInput from './TextInput';
import '@testing-library/jest-dom'


describe('TextInput', () => {
  test('renders label and input element correctly', () => {
    const label = 'Username';
    const { getByTestId } = render(
      <TextInput label={label} value="" onChange={() => {}} />
    );

    const labelElement = getByTestId('label');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('SPAN');

    const inputElement = getByTestId('input-text');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe('INPUT');
  });
  test('displays error message correctly', () => {
    const errorMessage = 'Invalid input';
    const { getByTestId } = render(
      <TextInput label="Username" value="" onChange={() => {}} errorMessage={errorMessage} />
    );

    const errorMessageElement = getByTestId('error');
    expect(errorMessageElement).toBeInTheDocument();
    expect(errorMessageElement.tagName).toBe('SPAN');
    expect(errorMessageElement).toHaveClass('ant-typography-danger');
    expect(errorMessageElement).toHaveTextContent(errorMessage);
  });
});

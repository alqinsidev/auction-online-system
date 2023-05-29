import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NumberInput from './NumberInput';

describe('NumberInput', () => {
  test('should call onChange callback with the correct value when input changes', () => {
    const onChangeMock = vi.fn();
    const label = 'Test Input';
    const { getByTestId } = render(
      <NumberInput label={label} value={0} onChange={onChangeMock} />
    );

    const input = getByTestId('input');
    fireEvent.change(input, { target: { value: '42' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(42);
  });

  test('should display the label correctly', () => {
    const label = 'Test Input';
    const { getByTestId } = render(
      <NumberInput label={label} value={0} onChange={() => {}} />
    );

    const labelText = getByTestId('label');

    expect(labelText).toBeInTheDocument();
    expect(labelText).toHaveTextContent(label);
  });

  test('should display the error message correctly', () => {
    const errorMessage = 'Invalid value';
    const { getByTestId } = render(
      <NumberInput label="Test Input" value={0} onChange={() => {}} errorMessage={errorMessage} />
    );

    const errorText = getByTestId('error');

    expect(errorText).toBeInTheDocument();
    expect(errorText).toHaveTextContent(errorMessage);
  });
});

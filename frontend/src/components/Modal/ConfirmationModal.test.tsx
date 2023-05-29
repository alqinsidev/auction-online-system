import { render, fireEvent } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal', () => {
  test('renders modal with correct props', () => {
    const handleOk = vi.fn();
    const handleCancel = vi.fn();
    const isModalVisible = true;
    const isLoading = true;

    const { getByText } = render(
      <ConfirmationModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isLoading={isLoading}
      />
    );

    const modalTitle = getByText('Are you sure you want to proceed?');
    const okButton = getByText('OK');
    const cancelButton = getByText('Cancel');

    expect(modalTitle).toBeInTheDocument();
    expect(okButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  test('calls handleOk when OK button is clicked', () => {
    const handleOk = vi.fn();
    const handleCancel = vi.fn();
    const isModalVisible = true;
    const isLoading = false;

    const { getByRole } = render(
      <ConfirmationModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isLoading={isLoading}
      />
    );

    const okButton = getByRole('button', { name: 'OK' });

    fireEvent.click(okButton);

    expect(handleOk).toHaveBeenCalledTimes(1);
  });

  test('calls handleCancel when Cancel button is clicked', () => {
    const handleOk = vi.fn();
    const handleCancel = vi.fn();
    const isModalVisible = true;
    const isLoading = false;

    const { getByRole } = render(
      <ConfirmationModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isLoading={isLoading}
      />
    );

    const cancelButton = getByRole('button', { name: 'Cancel' });

    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});

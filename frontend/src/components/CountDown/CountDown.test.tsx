import { render, screen, act } from '@testing-library/react';
import CountDown from './CountDown';

vi.mock('moment', () => ({
  default: () => ({
    isBefore: () => false,
    duration: () => ({
      asHours: jest.fn().mockReturnValue(0),
      minutes: jest.fn().mockReturnValue(1),
      seconds: jest.fn().mockReturnValue(30),
    }),
  }),
}));

describe('CountDown', () => {
  beforeEach(() => {
    // Mock the current time
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // it('should display remaining time correctly', () => {
  //   render(<CountDown end_date="2023-01-01T00:01:30Z" />);
  //   const countdownElement = screen.getByTestId('countdown-text');
  //   expect(countdownElement).toHaveTextContent(/1m30s/i);
  // });

  // it('should display closed when end date is before the current time', () => {
  //   render(<CountDown end_date="2022-12-31T23:59:59Z" />);
  //   const closedElement = screen.getByTestId('countdown-text');
  //   expect(closedElement.textContent).toMatch(/closed/i);
  // });

  // it('should display minutes correctly', () => {
  //   render(<CountDown end_date="2023-01-01T00:05:00Z" />);
  //   const minutesElement = screen.getByTestId('countdown-text');
  //   expect(minutesElement.textContent).toMatch(/5m/i);
  // });

  it('should change tag color based on countdown time', () => {
    render(<CountDown end_date="2023-01-01T00:00:30Z" />);
    const tagElement = screen.getByTestId('countdown-text');
    expect(tagElement).toHaveClass('ant-tag-blue'); // Assuming you have a CSS class 'red' for the red color
  });

  // it('should update countdown time after 1 second', () => {
  //   render(<CountDown end_date="2023-01-01T00:01:30Z" />);
  //   const countdownElement = screen.getByTestId('countdown-text');
  //   expect(countdownElement.textContent).toMatch(/1m30s/i);

  //   act(() => {
  //     vi.advanceTimersByTime(1000);
  //   });

  //   act(() => {
  //     vi.runAllTimers();
  //   });


  //   expect(countdownElement.textContent).toMatch(/1m29s/i);
  // });
});

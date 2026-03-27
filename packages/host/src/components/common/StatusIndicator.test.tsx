import { render, screen } from '@testing-library/react';
import StatusIndicator from './StatusIndicator';

describe('StatusIndicator', () => {
  it('renders the correct label for success status', () => {
    render(<StatusIndicator status="success" />);
    expect(screen.getByText('Success')).toBeTruthy();
  });

  it('renders the correct label for failed status', () => {
    render(<StatusIndicator status="failed" />);
    expect(screen.getByText('Failed')).toBeTruthy();
  });

  it('renders the correct label for in_progress status', () => {
    render(<StatusIndicator status="in_progress" />);
    expect(screen.getByText('In Progress')).toBeTruthy();
  });

  it('renders raw status when label not mapped', () => {
    render(<StatusIndicator status="unknown" />);
    expect(screen.getByText('unknown')).toBeTruthy();
  });
});

import { render, screen } from '@testing-library/react';
import MetricsWidget from '../components/MetricsWidget';

jest.mock('../hooks/useMetrics', () => ({
  useMetricsOverview: jest.fn(),
}));

import { useMetricsOverview } from '../hooks/useMetrics';
const mockUseMetrics = useMetricsOverview as jest.Mock;

describe('MetricsWidget', () => {
  it('shows loading state', () => {
    mockUseMetrics.mockReturnValue({ data: null, loading: true, error: null });
    render(<MetricsWidget />);
    expect(screen.getByText('Loading metrics...')).toBeTruthy();
  });

  it('shows error state', () => {
    mockUseMetrics.mockReturnValue({ data: null, loading: false, error: 'API down' });
    render(<MetricsWidget />);
    expect(screen.getByText('Error: API down')).toBeTruthy();
  });

  it('renders metrics when data loads', () => {
    mockUseMetrics.mockReturnValue({
      data: {
        data: {
          totalDeploys: 100,
          successRate: 85.5,
          avgBuildTime: 32.1,
          deploysToday: 5,
          byStatus: { success: 85, failed: 15 },
          byEnvironment: { production: 60, staging: 40 },
        },
      },
      loading: false,
      error: null,
    });
    render(<MetricsWidget />);
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('85.5%')).toBeTruthy();
    expect(screen.getByText('32.1s')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });
});

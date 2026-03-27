import { render, screen } from '@testing-library/react';
import MetricCard from '../components/MetricCard';

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Total Deploys" value={42} />);
    expect(screen.getByText('Total Deploys')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(<MetricCard label="Rate" value="95.5%" sub="last 30 days" />);
    expect(screen.getByText('last 30 days')).toBeTruthy();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(<MetricCard label="Rate" value="95.5%" />);
    const sub = container.querySelector('p:last-child');
    expect(sub?.textContent).toBe('95.5%');
  });
});

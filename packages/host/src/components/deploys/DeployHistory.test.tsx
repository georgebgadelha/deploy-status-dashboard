import { render, screen } from '@testing-library/react';
import DeployHistory from './DeployHistory';

const mockDeploys = [
  { _id: '1', environment: 'production', status: 'success', branch: 'main', commitHash: 'abc1234', duration: 45, createdAt: '2024-01-15T10:00:00Z' },
  { _id: '2', environment: 'staging', status: 'failed', branch: 'develop', commitHash: 'def5678', duration: null, createdAt: '2024-01-14T09:00:00Z' },
];

describe('DeployHistory', () => {
  it('renders deploy entries', () => {
    render(<DeployHistory deploys={mockDeploys} />);
    expect(screen.getByText('main')).toBeTruthy();
    expect(screen.getByText('develop')).toBeTruthy();
  });

  it('shows commit hashes', () => {
    render(<DeployHistory deploys={mockDeploys} />);
    expect(screen.getByText('abc1234')).toBeTruthy();
    expect(screen.getByText('def5678')).toBeTruthy();
  });

  it('shows empty state', () => {
    render(<DeployHistory deploys={[]} />);
    expect(screen.getByText('No deploys yet')).toBeTruthy();
  });
});

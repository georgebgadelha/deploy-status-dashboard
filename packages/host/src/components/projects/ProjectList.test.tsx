import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectList from './ProjectList';

const mockProjects = [
  { _id: '1', name: 'Project A', description: 'Desc A', repository: '', status: 'success', lastDeployAt: '2024-01-15' },
  { _id: '2', name: 'Project B', description: 'Desc B', repository: '', status: 'failed', lastDeployAt: null },
];

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ProjectList', () => {
  it('renders project cards', () => {
    renderWithRouter(<ProjectList projects={mockProjects} />);
    expect(screen.getByText('Project A')).toBeTruthy();
    expect(screen.getByText('Project B')).toBeTruthy();
  });

  it('shows empty state when no projects', () => {
    renderWithRouter(<ProjectList projects={[]} />);
    expect(screen.getByText('No projects found')).toBeTruthy();
  });
});

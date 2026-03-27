const mockMetricRepo = {
  getOverview: jest.fn(),
  getByProject: jest.fn(),
};
const mockProjectRepo = {
  findById: jest.fn(),
};

jest.mock('../src/repositories/metric.repository', () => ({
  metricRepository: mockMetricRepo,
}));
jest.mock('../src/repositories/project.repository', () => ({
  projectRepository: mockProjectRepo,
}));

import { metricService } from '../src/services/metric.service';

afterEach(() => jest.clearAllMocks());

describe('metricService.getOverview', () => {
  it('calls repository with default period', async () => {
    mockMetricRepo.getOverview.mockResolvedValue({ totalDeploys: 50 });
    const result = await metricService.getOverview();
    expect(mockMetricRepo.getOverview).toHaveBeenCalledWith('30d');
    expect(result).toEqual({ totalDeploys: 50 });
  });

  it('passes custom period', async () => {
    mockMetricRepo.getOverview.mockResolvedValue({});
    await metricService.getOverview('7d');
    expect(mockMetricRepo.getOverview).toHaveBeenCalledWith('7d');
  });
});

describe('metricService.getByProject', () => {
  it('returns metrics when project exists', async () => {
    mockProjectRepo.findById.mockResolvedValue({ _id: 'p1' });
    mockMetricRepo.getByProject.mockResolvedValue({ totalDeploys: 10 });
    const result = await metricService.getByProject('p1');
    expect(result).toEqual({ totalDeploys: 10 });
  });

  it('returns null when project not found', async () => {
    mockProjectRepo.findById.mockResolvedValue(null);
    const result = await metricService.getByProject('bad');
    expect(result).toBeNull();
    expect(mockMetricRepo.getByProject).not.toHaveBeenCalled();
  });
});

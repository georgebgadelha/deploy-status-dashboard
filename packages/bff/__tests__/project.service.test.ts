const mockProjectRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

jest.mock('../src/repositories/project.repository', () => ({
  projectRepository: mockProjectRepo,
}));

import { projectService } from '../src/services/project.service';

afterEach(() => jest.clearAllMocks());

describe('projectService.list', () => {
  it('delegates to repository', async () => {
    mockProjectRepo.findAll.mockResolvedValue({ data: [], total: 0 });
    await projectService.list({ page: 1, limit: 10 });
    expect(mockProjectRepo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });
});

describe('projectService.getById', () => {
  it('returns project when found', async () => {
    const project = { _id: '1', name: 'test' };
    mockProjectRepo.findById.mockResolvedValue(project);
    const result = await projectService.getById('1');
    expect(result).toEqual(project);
  });

  it('returns null when not found', async () => {
    mockProjectRepo.findById.mockResolvedValue(null);
    const result = await projectService.getById('bad');
    expect(result).toBeNull();
  });
});

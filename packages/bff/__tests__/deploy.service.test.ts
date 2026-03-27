const mockDeployRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
};
const mockProjectRepo = {
  findById: jest.fn(),
};

jest.mock('../src/repositories/deploy.repository', () => ({
  deployRepository: mockDeployRepo,
}));
jest.mock('../src/repositories/project.repository', () => ({
  projectRepository: mockProjectRepo,
}));

import { deployService } from '../src/services/deploy.service';

afterEach(() => jest.clearAllMocks());

describe('deployService.list', () => {
  it('delegates to repository with options', async () => {
    const opts = { page: 1, limit: 10 };
    mockDeployRepo.findAll.mockResolvedValue({ data: [], total: 0 });
    await deployService.list(opts);
    expect(mockDeployRepo.findAll).toHaveBeenCalledWith(opts);
  });
});

describe('deployService.getById', () => {
  it('returns deploy from repository', async () => {
    const deploy = { _id: '1', status: 'success' };
    mockDeployRepo.findById.mockResolvedValue(deploy);
    const result = await deployService.getById('1');
    expect(result).toEqual(deploy);
  });
});

describe('deployService.create', () => {
  it('creates deploy when project exists', async () => {
    mockProjectRepo.findById.mockResolvedValue({ _id: 'p1', name: 'test' });
    const created = { _id: 'd1', status: 'in_progress' };
    mockDeployRepo.create.mockResolvedValue(created);

    const result = await deployService.create({
      projectId: 'p1', environment: 'production', branch: 'main',
    });
    expect(result).toEqual({ data: created });
    expect(mockDeployRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: 'p1', status: 'in_progress' }),
    );
  });

  it('returns error when project does not exist', async () => {
    mockProjectRepo.findById.mockResolvedValue(null);
    const result = await deployService.create({
      projectId: 'bad', environment: 'production', branch: 'main',
    });
    expect(result).toEqual({ error: 'PROJECT_NOT_FOUND' });
  });
});

describe('deployService.updateStatus', () => {
  it('allows valid transition in_progress -> success', async () => {
    mockDeployRepo.findById.mockResolvedValue({ _id: '1', status: 'in_progress' });
    mockDeployRepo.updateStatus.mockResolvedValue({ _id: '1', status: 'success' });
    const result = await deployService.updateStatus('1', 'success');
    expect(result).toEqual({ data: { _id: '1', status: 'success' } });
  });

  it('allows valid transition failed -> in_progress', async () => {
    mockDeployRepo.findById.mockResolvedValue({ _id: '1', status: 'failed' });
    mockDeployRepo.updateStatus.mockResolvedValue({ _id: '1', status: 'in_progress' });
    const result = await deployService.updateStatus('1', 'in_progress');
    expect(result).toEqual({ data: { _id: '1', status: 'in_progress' } });
  });

  it('returns error for invalid transition success -> failed', async () => {
    mockDeployRepo.findById.mockResolvedValue({ _id: '1', status: 'success' });
    const result = await deployService.updateStatus('1', 'failed');
    expect(result).toEqual({ error: 'INVALID_TRANSITION' });
  });

  it('returns error when deploy does not exist', async () => {
    mockDeployRepo.findById.mockResolvedValue(null);
    const result = await deployService.updateStatus('bad', 'success');
    expect(result).toEqual({ error: 'DEPLOY_NOT_FOUND' });
  });
});

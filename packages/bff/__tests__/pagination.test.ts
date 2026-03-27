import { parsePagination, buildPaginationMeta } from '../src/utils/pagination';

describe('parsePagination', () => {
  it('returns defaults when no query params', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 20 });
  });

  it('parses valid page and limit', () => {
    expect(parsePagination({ page: '3', limit: '10' })).toEqual({ page: 3, limit: 10 });
  });

  it('clamps page to minimum 1', () => {
    expect(parsePagination({ page: '0' })).toEqual({ page: 1, limit: 20 });
    expect(parsePagination({ page: '-5' })).toEqual({ page: 1, limit: 20 });
  });

  it('clamps limit to maximum 100', () => {
    expect(parsePagination({ limit: '500' })).toEqual({ page: 1, limit: 100 });
  });

  it('clamps limit to minimum 1', () => {
    expect(parsePagination({ limit: '0' })).toEqual({ page: 1, limit: 20 });
  });

  it('handles non-numeric strings as defaults', () => {
    expect(parsePagination({ page: 'abc', limit: 'xyz' })).toEqual({ page: 1, limit: 20 });
  });
});

describe('buildPaginationMeta', () => {
  it('calculates totalPages correctly', () => {
    expect(buildPaginationMeta(1, 10, 25)).toEqual({
      page: 1, limit: 10, total: 25, totalPages: 3,
    });
  });

  it('returns totalPages 0 for empty results', () => {
    expect(buildPaginationMeta(1, 10, 0)).toEqual({
      page: 1, limit: 10, total: 0, totalPages: 0,
    });
  });

  it('returns totalPages 1 when items fit single page', () => {
    expect(buildPaginationMeta(1, 20, 5)).toEqual({
      page: 1, limit: 20, total: 5, totalPages: 1,
    });
  });
});

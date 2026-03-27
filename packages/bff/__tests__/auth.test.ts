import { auth } from '../src/middlewares/auth';
import type { Request, Response, NextFunction } from 'express';

jest.mock('../src/config', () => ({
  env: { apiKey: 'test-api-key' },
}));

function mockReqResNext(headers: Record<string, string> = {}) {
  const req = { headers } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}

describe('auth middleware', () => {
  it('calls next() with valid API key', () => {
    const { req, res, next } = mockReqResNext({ 'x-api-key': 'test-api-key' });
    auth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 when x-api-key header is missing', () => {
    const { req, res, next } = mockReqResNext();
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 with invalid API key', () => {
    const { req, res, next } = mockReqResNext({ 'x-api-key': 'wrong-key' });
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

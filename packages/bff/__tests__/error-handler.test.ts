import { errorHandler } from '../src/middlewares/error-handler';
import type { Request, Response, NextFunction } from 'express';

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
}

const req = {} as Request;
const next = jest.fn() as NextFunction;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('errorHandler', () => {
  it('returns 400 for CastError', () => {
    const err = new Error('Cast failed');
    err.name = 'CastError';
    const res = mockRes();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'INVALID_ID' }),
      }),
    );
  });

  it('returns 400 for ValidationError', () => {
    const err = new Error('Validation failed');
    err.name = 'ValidationError';
    const res = mockRes();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'VALIDATION_ERROR' }),
      }),
    );
  });

  it('returns 500 for unexpected errors', () => {
    const err = new Error('Something broke');
    const res = mockRes();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'INTERNAL_ERROR' }),
      }),
    );
  });
});

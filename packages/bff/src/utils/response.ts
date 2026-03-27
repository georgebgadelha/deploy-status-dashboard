import type { Response } from 'express';

export function sendSuccess(res: Response, data: unknown, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function sendPaginated(
  res: Response,
  data: unknown,
  pagination: { page: number; limit: number; total: number; totalPages: number },
) {
  return res.status(200).json({ success: true, data, pagination });
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
) {
  return res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}

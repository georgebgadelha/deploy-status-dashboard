import type { Request, Response, NextFunction } from 'express';
import { env } from '../config';

export function auth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing x-api-key header' },
    });
    return;
  }

  if (apiKey !== env.apiKey) {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Invalid API key' },
    });
    return;
  }

  next();
}

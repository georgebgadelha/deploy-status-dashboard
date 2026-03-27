import { query, body, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { DEPLOY_STATUS, ENVIRONMENTS } from '@zephyr-deploy/shared';

function handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.array().map((e) => e.msg).join(', '),
      },
    });
    return;
  }
  next();
}

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  handleValidationErrors,
];

export const validateDeployFilters = [
  ...validatePagination,
  query('env').optional().isIn(Object.values(ENVIRONMENTS)).withMessage('Invalid environment'),
  query('status').optional().isIn(Object.values(DEPLOY_STATUS)).withMessage('Invalid status'),
  handleValidationErrors,
];

export const validateProjectFilters = [
  ...validatePagination,
  query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  handleValidationErrors,
];

export const validateCreateDeploy = [
  body('projectId').notEmpty().withMessage('projectId is required'),
  body('environment').isIn(Object.values(ENVIRONMENTS)).withMessage('Invalid environment'),
  body('branch').notEmpty().trim().withMessage('branch is required'),
  handleValidationErrors,
];

export const validateUpdateStatus = [
  body('status').isIn(Object.values(DEPLOY_STATUS)).withMessage('Invalid status'),
  handleValidationErrors,
];

export const validatePeriod = [
  query('period').optional().isIn(['7d', '30d']).withMessage('Period must be 7d or 30d'),
  handleValidationErrors,
];

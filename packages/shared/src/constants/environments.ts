export const ENVIRONMENTS = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  PREVIEW: 'preview',
} as const;

export type Environment = typeof ENVIRONMENTS[keyof typeof ENVIRONMENTS];

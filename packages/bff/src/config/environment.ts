import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3001', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/zephyr-deploy-dashboard',
  apiKey: process.env.API_KEY || 'zephyr-dev-api-key-2024',
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;

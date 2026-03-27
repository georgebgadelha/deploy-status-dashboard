import express from 'express';
import cors from 'cors';
import { connectDatabase, env } from './config';
import routes from './routes';
import { requestLogger } from './middlewares/request-logger';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(routes);
app.use(errorHandler);

async function start() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`BFF running on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;

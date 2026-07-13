import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { getDatabaseStatus } from './config/database.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';
import { adminRouter, authRouter } from './routes/auth.routes.js';
import { sendSuccess } from './utils/response.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use(cookieParser());
app.use(globalLimiter);

app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

app.get('/api/health', (_req, res) => {
  sendSuccess(res, 'NexaCode Labs API is healthy.', {
    service: 'nexacode-labs-server',
    environment: env.NODE_ENV,
    database: getDatabaseStatus(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

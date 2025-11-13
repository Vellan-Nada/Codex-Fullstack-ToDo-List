import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { config } from './config.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  const status = err.status || (err.name === 'ZodError' ? 400 : 500);
  const message = err.name === 'ZodError' ? err.errors?.[0]?.message || 'Invalid payload' : err.message || 'Unexpected error';
  if (config.env !== 'production') {
    console.error(err);
  }
  res.status(status).json({ message });
});

export default app;

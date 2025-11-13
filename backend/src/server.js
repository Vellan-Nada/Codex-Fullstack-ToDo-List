import app from './app.js';
import { config } from './config.js';

const server = app.listen(config.port, () => {
  console.log(`TaskForge API listening on port ${config.port}`);
});

const shutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

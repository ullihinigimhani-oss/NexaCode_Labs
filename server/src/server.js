import app from './app.js';
import { env } from './config/env.js';
import { testDatabaseConnection } from './config/database.js';

async function startServer() {
  await testDatabaseConnection();
  console.info('✅ MySQL connected successfully.');

  app.listen(env.PORT, () => {
    console.info(`NexaCode Labs API running on port ${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error('MySQL connection failed:', error);
  process.exit(1);
});

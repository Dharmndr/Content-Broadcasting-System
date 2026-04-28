import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import './models/index.js'; // Ensure models are registered

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`🚀 Server is running on port ${config.port} in ${config.env} mode`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    console.error('Unexpected error:', error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

startServer();

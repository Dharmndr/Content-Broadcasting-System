import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorConverter, errorHandler } from './middlewares/error.middleware.js';
import ApiError from './utils/ApiError.js';

const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

if (config.env !== 'test') {
  const morganFormat = config.env === 'production' ? 'combined' : 'dev';
  app.use(morgan(morganFormat));
}

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Enable cors
app.use(cors());
app.options('*', cors());

// API routes
app.use('/api/v1', routes);

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

export default app;
